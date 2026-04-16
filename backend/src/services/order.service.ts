import { OrderRepository } from '../repositories/order.repository';
import { ProductRepository } from '../repositories/product.repository';
import { AppError } from '../utils/AppError';
import prisma from '../config/prisma';

export class OrderService {
  private orderRepo: OrderRepository;
  private productRepo: ProductRepository;

  constructor() {
    this.orderRepo = new OrderRepository();
    this.productRepo = new ProductRepository();
  }

  async createOrder(buyerId: string, productId: string) {
    const product = await this.productRepo.findById(productId);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (product.status !== 'AVAILABLE') {
      throw new AppError('Product is no longer available', 400);
    }

    if (product.sellerId === buyerId) {
      throw new AppError('You cannot buy your own product', 400);
    }

    return this.orderRepo.create({
      buyerId,
      productId,
      status: 'REQUESTED',
    });
  }

  async getMyOrders(userId: string) {
    return this.orderRepo.findManyWithRelations({
      where: { buyerId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMySalesRequests(userId: string) {
    return this.orderRepo.findManyWithRelations({
      where: {
        product: { sellerId: userId },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateOrderStatus(orderId: string, userId: string, newStatus: string) {
    const order = await this.orderRepo.findByIdWithRelations(orderId);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    const sellerId = order.product.sellerId;
    const buyerId = order.buyerId;

    // Only seller can APPROVE or cancel (though buyer might cancel requests too, keeping it simple for now)
    if (sellerId !== userId && buyerId !== userId) {
      throw new AppError('Unauthorized to update this order', 403);
    }

    // Implementing the Transaction Requirement
    // Use Prisma Transactions to atomically update Order and Product statuses
    return prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: newStatus as any },
      });

      // If approved, mark the product as SOLD so no one else can buy it
      if (newStatus === 'APPROVED') {
        await tx.product.update({
          where: { id: order.productId },
          data: { status: 'SOLD' },
        });
        
        // Also automatically cancel other pending requests for the same product
        await tx.order.updateMany({
          where: {
            productId: order.productId,
            id: { not: orderId },
            status: 'REQUESTED',
          },
          data: { status: 'CANCELLED' },
        });
      } else if (newStatus === 'CANCELLED' && order.status === 'APPROVED') {
        // Revert product back to available if an approved order was cancelled
        await tx.product.update({
          where: { id: order.productId },
          data: { status: 'AVAILABLE' },
        });
      }

      return updatedOrder;
    });
  }
}
