import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const orderService = new OrderService();

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.createOrder(req.user.id, req.body.productId);
    res.status(201).json({ status: 'success', data: { order } });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orders = await orderService.getMyOrders(req.user.id);
    res.status(200).json({ status: 'success', data: { orders } });
  } catch (error) {
    next(error);
  }
};

export const getMySalesRequests = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orders = await orderService.getMySalesRequests(req.user.id);
    res.status(200).json({ status: 'success', data: { orders } });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.id,
      req.user.id,
      req.body.status
    );
    res.status(200).json({ status: 'success', data: { order } });
  } catch (error) {
    next(error);
  }
};
