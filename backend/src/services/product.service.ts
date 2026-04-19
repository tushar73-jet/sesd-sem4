import { ProductRepository } from '../repositories/product.repository';
import { AppError } from '../utils/AppError';
import { Prisma } from '@prisma/client';

export class ProductService {
  private productRepo: ProductRepository;

  constructor() {
    this.productRepo = new ProductRepository();
  }

  async createProduct(sellerId: string, data: any) {
    return this.productRepo.create({
      ...data,
      sellerId,
    });
  }

  async getProducts(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
    sellerId?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (params.status) {
      where.status = params.status as any;
    } else {
      where.status = { not: 'REMOVED' };
    }

    if (params.sellerId) {
      where.sellerId = params.sellerId;
    }

    if (params.category) {
      where.category = { equals: params.category, mode: 'insensitive' };
    }

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const { products, total } = await this.productRepo.findManyWithFilters({
      skip,
      take: limit,
      where,
      orderBy: { createdAt: 'desc' },
    });

    return {
      products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(id: string) {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }

  async updateProduct(id: string, userId: string, userRole: string, data: any) {
    const product = await this.getProductById(id);

    // Only the seller or an admin can update the product
    if (product.sellerId !== userId && userRole !== 'ADMIN') {
      throw new AppError('You do not have permission to update this product', 403);
    }

    return this.productRepo.update(id, data);
  }

  async deleteProduct(id: string, userId: string, userRole: string) {
    const product = await this.getProductById(id);

    if (product.sellerId !== userId && userRole !== 'ADMIN') {
      throw new AppError('You do not have permission to delete this product', 403);
    }
    
    return this.productRepo.update(id, { status: 'REMOVED' });
  }
}
