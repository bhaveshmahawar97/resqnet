import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';

vi.mock('../services/rescueService.js', () => ({
  listRescues: vi.fn().mockResolvedValue({ data: [], pagination: {} }),
  getRescueById: vi.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439011', location: 'Test', animal: 'Dog' }),
  parsePagination: vi.fn().mockReturnValue({ page: 1, limit: 10, skip: 0 }),
  buildRoleQueryForAll: vi.fn().mockReturnValue({}),
  RESCUE_STATUSES: ['pending'],
  SEVERITY_LEVELS: ['critical'],
}));

vi.mock('../config/database.js', () => ({
  connectCoreDB: vi.fn(),
  connectAiDB: vi.fn(),
  CORE_DB_NAME: 'test-core',
  AI_DB_NAME: 'test-ai',
  isCoreConnected: () => true,
  isAiConnected: () => true
}));

// We must mock the auth middleware so we can access protected routes
vi.mock('../middleware/authMiddleware.js', () => ({
  default: (req, res, next) => {
    req.user = { _id: 'admin123', role: 'admin' };
    next();
  },
  roleMiddleware: (...roles) => (req, res, next) => next(),
}));

describe('Rescue API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/rescue/all', () => {
    it('should return a list of rescues', async () => {
      const res = await request(app).get('/api/rescue/all');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/rescue/:id', () => {
    it('should return a specific rescue by ID', async () => {
      const res = await request(app).get('/api/rescue/507f1f77bcf86cd799439011');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.animal).toBe('Dog');
    });
  });
});
