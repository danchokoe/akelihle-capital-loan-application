import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Basic health check
router.get('/', async (req, res) => {
  try {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: 'Health check failed'
    });
  }
});

// Database health check
router.get('/database', async (req, res) => {
  try {
    // Simple database query to test connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: 'Database connection failed'
    });
  }
});

// Detailed system health
router.get('/detailed', async (req, res) => {
  try {
    const dbHealthy = await prisma.$queryRaw`SELECT 1`.then(() => true).catch(() => false);
    
    res.json({
      status: dbHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: dbHealthy ? 'healthy' : 'unhealthy',
        email: process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS ? 'configured' : 'not configured',
        sms: process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN ? 'configured' : 'not configured'
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: 'Detailed health check failed'
    });
  }
});

export default router;