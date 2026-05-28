import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';

vi.mock('../services/dashboardService.js', () => ({
  fetchDashboardData: vi.fn().mockResolvedValue({ role: 'admin', stats: {} })
}));

vi.mock('../config/database.js', () => ({
  connectCoreDB: vi.fn(),
  connectAiDB: vi.fn(),
  CORE_DB_NAME: 'test-core',
  AI_DB_NAME: 'test-ai',
  isCoreConnected: () => true,
  isAiConnected: () => true
}));

// Mock auth middleware
vi.mock('../middleware/authMiddleware.js', () => ({
  default: (req, res, next) => {
    req.user = { _id: 'admin123', role: 'admin' };
    next();
  },
  roleMiddleware: (...roles) => (req, res, next) => next(),
}));

describe('Dashboard API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/dashboard/', () => {
    it('should return admin dashboard configuration', async () => {
      const res = await request(app).get('/api/dashboard/');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.role).toBe('admin');
      expect(res.body.data.stats).toBeDefined();
    });
  });
});
