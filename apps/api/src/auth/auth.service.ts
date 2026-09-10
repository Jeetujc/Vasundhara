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
  mobileNo: string;
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
    const mobileNo = dto.mobileNo.trim();
    const aadharId = dto.aadharId.trim();

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { mobileNo },
          { aadharId },
        ],
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      throw new ConflictException('Unable to create account');
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        aadharId,
        mobileNo,
        dob: new Date(dto.dob),

        passwordHash,

        // Public registration always creates a public user.
        role: 'PUBLIC_USER',

        stateId: dto.stateId,
        districtId: dto.districtId,
        tehsilId: dto.tehsilId,
      },
      select: {
        id: true,
        name: true,
        aadharId: true,
        mobileNo: true,
        dob: true,
        role: true,
        stateId: true,
        districtId: true,
        tehsilId: true,
      },
    });

    const tokens = await this.generateTokens(user);

    return {
      user,
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const aadharId = dto.aadharId.trim();
  
    const user = await this.prisma.user.findUnique({
      where: {
        aadharId,
      },
    });
  
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
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
      name: user.name,
      aadharId: user.aadharId,
      mobileNo: user.mobileNo,
      role: user.role,
      stateId: user.stateId,
      districtId: user.districtId,
      tehsilId: user.tehsilId,
    };
  
    const tokens = await this.generateTokens(safeUser);
  
    return {
      user: safeUser,
      ...tokens,
    };
  }

  async refresh(dto: RefreshTokenDto) {
    let payload: TokenPayload;

    try {
      payload = await this.jwtService.verifyAsync<TokenPayload>(
        dto.refreshToken,
        {
          secret: this.configService.getOrThrow<string>(
            'JWT_REFRESH_SECRET',
          ),
        },
      );
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
      select: {
        id: true,
        name: true,
        mobileNo: true,
        role: true,
        stateId: true,
        districtId: true,
        tehsilId: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      mobileNo: user.mobileNo,
      role: user.role,
      stateId: user.stateId,
      districtId: user.districtId,
      tehsilId: user.tehsilId,
    };

    const tokens = await this.generateTokens(safeUser);

    return {
      user: safeUser,
      ...tokens,
    };
  }

  private async generateTokens(user: {
    id: string;
    mobileNo: string;
    role: string;
  }) {
    const payload: TokenPayload = {
      sub: user.id,
      mobileNo: user.mobileNo,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>(
        'JWT_REFRESH_SECRET',
      ),
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}