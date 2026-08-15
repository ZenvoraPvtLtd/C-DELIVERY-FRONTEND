import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository';
import { UnauthorizedError, ValidationError, NotFoundError } from '../utils/errors';
import { IUser } from '../models/User.model';

export interface TokenPayload {
  userId: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

export class AuthService {
  private generateTokens(user: IUser): AuthTokens {
    const payload: TokenPayload = {
      userId: user._id?.toString() || '',
      role: user.role
    };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET || 'secret',
      { expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as any }
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET || 'refresh_secret',
      { expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any }
    );

    return { accessToken, refreshToken };
  }

  public getSafeUser(user: IUser): SafeUser {
    return {
      id: user._id?.toString() || '',
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    };
  }

  async login(email: string, password: string): Promise<{ user: SafeUser; tokens: AuthTokens }> {
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Your account has been deactivated. Please contact support.');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    await userRepository.updateLastLogin(user._id?.toString() || '');

    const tokens = this.generateTokens(user);

    return {
      user: this.getSafeUser(user),
      tokens
    };
  }

  async refresh(refreshToken: string): Promise<{ tokens: AuthTokens }> {
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token is required');
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret') as TokenPayload;
      
      const user = await userRepository.findById(decoded.userId);
      if (!user || !user.isActive || user.isDeleted) {
        throw new UnauthorizedError('Invalid session or user not found');
      }

      const tokens = this.generateTokens(user);

      return { tokens };
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  async getMe(userId: string): Promise<SafeUser> {
    const user = await userRepository.findById(userId);
    if (!user || !user.isActive || user.isDeleted) {
      throw new NotFoundError('User not found');
    }
    return this.getSafeUser(user);
  }
}

export const authService = new AuthService();
