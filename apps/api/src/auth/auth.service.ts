import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service.js';

import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { RegisterDto } from './dto/register.dto.js';
interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException('Unable to create account');
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: passwordHash,
        name: dto.name, // Assuming dto has a name property
        role: 'FIELD_OFFICER', // Assign a default role if not provided
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    const tokens = await this.generateTokens(user);

    return {
      user,
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    async refresh(dto: RefreshTokenDto) {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(dto.refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true, role: true, isActive: true },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const safeUser = { id: user.id, email: user.email, role: user.role };
      const tokens = await this.generateTokens(safeUser);

      return { user: safeUser, ...tokens };
    }

    const passwordValid = await argon2.verify(
      user.passwordHash,
      dto.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const tokens = await this.generateTokens(safeUser);

    return {
      user: safeUser,
      ...tokens,
    };
  }

  private async generateTokens(user: {
    id: string;
    email: string;
    role: string;
  }) {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}