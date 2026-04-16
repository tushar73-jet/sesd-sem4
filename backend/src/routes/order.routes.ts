import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getMySalesRequests,
  updateOrderStatus,
} from '../controllers/order.controller';
import { validate } from '../middlewares/validate.middleware';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/order.validator';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All order routes require authentication
router.use(authenticate);

// Buyer fetching their own orders
router.get('/my-orders', getMyOrders);

// Seller fetching requests made on their products
router.get('/my-sales', getMySalesRequests);

// Buyer requesting a product
router.post('/', validate(createOrderSchema), createOrder);

// Seller approving/completing an order, or buyer/seller cancelling
router.put('/:id/status', validate(updateOrderStatusSchema), updateOrderStatus);

export default router;
