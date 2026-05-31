# ResQNet AI Architecture

## Overview

The AI scan system uses a three-tier architecture for animal detection and analysis:

1. **Primary Detection**: Hugging Face (Llama 3.2 Vision)
2. **Optional Explanation**: Claude (via Freemodel)
3. **Fallback**: Rule Engine (heuristic-based)

## Architecture Flow

```
Image Upload
    ↓
┌─────────────────────────────────────┐
│  Step 1: Animal Detection           │
│  Provider: Hugging Face              │
│  Model: Llama-3.2-11B-Vision         │
│  Output: { animal, confidence }      │
└─────────────────────────────────────┘
    ↓ Success                ↓ Failure
    ↓                        ↓
┌─────────────────────┐   ┌──────────────────┐
│ Step 2: Explanation │   │ Fallback: Rules  │
│ Provider: Claude    │   │ Keyword-based    │
│ (Optional)          │   │ severity         │
│ Output: condition,  │   │ assessment       │
│ severity, actions   │   └──────────────────┘
└─────────────────────┘
    ↓ Success  ↓ Failure
    ↓          ↓
┌─────────────────────────┐
│ Step 3: Combine Results │
│ HF + Claude = Full      │
│ HF + Rules = Partial    │
│ Rules only = Fallback   │
└─────────────────────────┘
```

## Services

### 1. Hugging Face Service
**File**: `server/services/huggingFaceService.js`

- Uses Hugging Face Router API (OpenAI-compatible)
- Model: `meta-llama/Llama-3.2-11B-Vision-Instruct`
- Returns: animal type, confidence, reasoning
- Handles model loading states with retries

**Configuration**:
```env
HUGGINGFACE_API_KEY=hf_your_token_here
HF_VISION_MODEL=meta-llama/Llama-3.2-11B-Vision-Instruct
```

### 2. Claude Service
**File**: `server/services/claudeService.js`

- Provides detailed condition analysis
- Only called if HF detection succeeds
- Returns: severity, condition, recommendations, veterinary advice
- Non-critical - system continues without it

**Configuration**:
```env
FREEMODEL_API_KEY=your_freemodel_key
FREEMODEL_BASE_URL=https://cc.freemodel.dev
FREEMODEL_MODEL=claude-opus-4-7
```

### 3. Rule Engine Service
**File**: `server/services/ruleEngineService.js`

- Keyword-based severity assessment
- Predefined recommendations per animal type
- No API required - always available
- Lower confidence (max 75%)

**Severity Keywords**:
- **Critical**: bleeding, unconscious, severe injury, broken bone
- **High**: injured, limping, wound, bite, attack
- **Medium**: stray, lost, malnourished, weak
- **Low**: healthy, active, playful, calm

### 4. AI Service (Orchestrator)
**File**: `server/services/aiService.js`

Coordinates the three-tier pipeline:
1. Try HF detection
2. If success, try Claude explanation (optional)
3. Use rule engine for missing data or as complete fallback

## Response Format

```json
{
  "success": true,
  "message": "Animal scan analysis completed successfully",
  "data": {
    "scanId": "...",
    "animal": "dog",
    "severity": "high",
    "confidence": 92,
    "condition": "Visible injury on left front leg, limping",
    "priority": "high",
    "recommendation": "Contact veterinarian or animal rescue immediately",
    "recommendations": [
      "Contact veterinarian or animal rescue",
      "Approach carefully - injured animals may bite",
      "Provide water if conscious",
      "Keep away from other animals"
    ],
    "imageUrl": "https://...",
    "fullAnalysis": {
      "provider": "huggingface+claude",
      "providerModel": "meta-llama/Llama-3.2-11B-Vision-Instruct + claude-opus-4-7",
      "usedFallback": false
    }
  }
}
```

## Provider Combinations

| Detection | Explanation | Result Provider | Fallback Used |
|-----------|-------------|-----------------|---------------|
| HF ✓      | Claude ✓    | `huggingface+claude` | No |
| HF ✓      | Claude ✗    | `huggingface+rules` | Yes |
| HF ✗      | -           | `rule-engine` | Yes |

## Error Handling

- **HF fails**: Immediately fallback to rule engine
- **Claude fails**: Continue with HF + rule engine
- **Both fail**: Rule engine provides basic analysis
- **All fail**: Return error to user

## Testing

### Test the API directly:
```bash
curl -X POST http://localhost:5000/api/ai/scan \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@path/to/animal.jpg"
```

### Test from frontend:
1. Navigate to `/rescue` page
2. Upload an animal image
3. AI scan runs automatically
4. Form auto-fills with detected data

## Monitoring

Check logs for provider usage:
```
[AI SERVICE] Step 1: Detecting animal with Hugging Face...
[HuggingFaceService][abc123] Detection completed in 2341ms
[AI SERVICE] Detection successful: dog (95% confidence)
[AI SERVICE] Step 2: Getting detailed analysis from Claude...
[ClaudeService][def456] Claude explanation succeeded in 1823ms
```

## Cost Optimization

- **HF**: Free tier available, pay-per-use after
- **Claude**: Optional, only called on HF success
- **Rules**: Free, always available

To reduce costs, Claude can be disabled by removing `FREEMODEL_API_KEY` from `.env`.

## Future Improvements

1. Add more vision models (GPT-4V, Gemini Vision)
2. Implement confidence thresholds for fallback
3. Cache common animal detections
4. Add breed identification
5. Support video analysis
