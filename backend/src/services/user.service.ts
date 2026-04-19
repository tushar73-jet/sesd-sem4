import { UserRepository } from '../repositories/user.repository';
import { AppError } from '../utils/AppError';

export class UserService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async getProfile(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(userId: string, data: { name?: string; email?: string }) {
    // Check if email is being updated and if it's already taken
    if (data.email) {
      const existingUser = await this.userRepo.findByEmail(data.email);
      if (existingUser && existingUser.id !== userId) {
        throw new AppError('Email already in use', 400);
      }
    }

    const updatedUser = await this.userRepo.update(userId, data);
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}
