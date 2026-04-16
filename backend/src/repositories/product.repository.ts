import { BaseRepository } from './base.repository';
import prisma from '../config/prisma';

export class ProductRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.product);
  }

  async findManyWithFilters(params: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }) {
    const { skip, take, where, orderBy } = params;
    
    const [products, total] = await Promise.all([
      this._model.findMany({ skip, take, where, orderBy }),
      this._model.count({ where }),
    ]);

    return { products, total };
  }
}
