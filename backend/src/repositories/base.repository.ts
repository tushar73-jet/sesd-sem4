export interface IRead<T> {
  findById(id: string): Promise<T | null>;
  findAll(params?: any): Promise<T[]>;
}

export interface IWrite<T> {
  create(item: any): Promise<T>;
  update(id: string, item: any): Promise<T>;
  delete(id: string): Promise<T>;
}

export abstract class BaseRepository<T> implements IRead<T>, IWrite<T> {
  protected readonly _model: any;

  constructor(model: any) {
    this._model = model;
  }

  async create(item: any): Promise<T> {
    return this._model.create({ data: item });
  }

  async findById(id: string): Promise<T | null> {
    return this._model.findUnique({ where: { id } });
  }

  async findAll(params: any = {}): Promise<T[]> {
    return this._model.findMany(params);
  }

  async update(id: string, item: any): Promise<T> {
    return this._model.update({
      where: { id },
      data: item,
    });
  }

  async delete(id: string): Promise<T> {
    return this._model.delete({ where: { id } });
  }
}
