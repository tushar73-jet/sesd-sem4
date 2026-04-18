import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';

const router = Router();
const prisma = new PrismaClient();

// Get general dashboard statistics
router.get('/stats', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();
    const soldProducts = await prisma.product.count({ where: { status: 'SOLD' } });
    
    res.json({
      stats: { totalUsers, totalProducts, totalOrders, soldProducts }
    });
  } catch (error) {
    next(error);
  }
});

// Get all users for moderation
router.get('/users', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, isSuspended: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ users });
  } catch (error) {
    next(error);
  }
});

// Suspend or Unsuspend a user
router.put('/users/:id/suspend', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isSuspended } = req.body;
    
    if (typeof isSuspended !== 'boolean') {
      return next(new AppError('isSuspended flag must be boolean', 400));
    }
    
    // Safety check not to suspend yourself if you're the only admin
    // For MVP we just allow flipping it 
    
    const user = await prisma.user.update({
      where: { id },
      data: { isSuspended },
      select: { id: true, name: true, isSuspended: true }
    });
    
    res.json({ message: 'User suspension status updated', user });
  } catch (error) {
    next(error);
  }
});

export default router;
