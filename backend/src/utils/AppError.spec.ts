import { AppError } from './AppError';

describe('AppError', () => {
  it('should create an error with correct properties', () => {
    const error = new AppError('Test error message', 404);

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Test error message');
    expect(error.statusCode).toBe(404);
    expect(error.isOperational).toBe(true);
    expect(error.stack).toBeDefined();
  });
});
