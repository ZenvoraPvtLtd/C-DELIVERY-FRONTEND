import User, { IUser } from '../models/User.model';

export class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    // Normalizing email to lowercase as defined in model
    return await User.findOne({ email: email.toLowerCase(), isDeleted: false });
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findOne({ _id: id, isDeleted: false });
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  async updateLastLogin(id: string): Promise<void> {
    await User.updateOne({ _id: id }, { lastLoginAt: new Date() });
  }
}

export const userRepository = new UserRepository();
