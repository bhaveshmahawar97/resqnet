import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
vi.mock('../models/index.js', () => ({
  User: {
    findOne: vi.fn(),
    create: vi.fn(),
  }
}));
vi.mock('../config/database.js', () => ({
  connectCoreDB: vi.fn(),
  connectAiDB: vi.fn(),
  CORE_DB_NAME: 'test-core',
  AI_DB_NAME: 'test-ai',
  isCoreConnected: () => true,
  isAiConnected: () => true
}));

// Mock Email Service
vi.mock('../services/emailService.js', () => ({
  sendWelcomeEmail: vi.fn(),
}));

describe('Auth API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          // Missing required fields like email, password, etc.
          fullName: 'Test User'
        });
        
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should check if user already exists', async () => {
      // Import the mocked User
      const { User } = await import('../models/index.js');
      // Mock user.findOne to return an existing user
      User.findOne.mockResolvedValue({ _id: '123', email: 'test@example.com' });
      
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'user'
        });
        
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/already exists/i);
    });
  });
});
