import { BaseRepository } from './base.repository';
import prisma from '../config/prisma';

export class UserRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.user);
  }

  async findByEmail(email: string) {
    return this._model.findUnique({ where: { email } });
  }
}
