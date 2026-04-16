import { BaseRepository } from './base.repository';
import prisma from '../config/prisma';

export class OrderRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.order);
  }

  async findManyWithRelations(params: {
    where?: any;
    orderBy?: any;
  }) {
    return this._model.findMany({
      ...params,
      include: {
        product: true,
        buyer: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findByIdWithRelations(id: string) {
    return this._model.findUnique({
      where: { id },
      include: {
        product: true,
        buyer: { select: { id: true, name: true, email: true } },
      },
    });
  }
}
