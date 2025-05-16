import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto, RefreshTokenDto, RegisterDto } from './auth.dto';
import { JwtAuthService } from './jwt-auth.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtAuthService: JwtAuthService,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.userService.createUser(dto.email, hashedPassword);
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: user.email,
      _id: user._id,
      type: 'access_token',
    };
    return {
      access_token: await this.jwtAuthService.signAccessToken({
        ...payload,
        type: 'access_token',
      }),
      refresh_token: await this.jwtAuthService.signRefreshToken({
        ...payload,
        type: 'refresh_token',
      }),
    };
  }

  async refresh(dto: RefreshTokenDto) {
    const payload = await this.jwtAuthService.verifyRefreshToken(
      dto.refreshToken,
    );
    if (!payload) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userService.findById(payload._id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const newPayload = { email: user.email, _id: user._id };
    return {
      access_token: await this.jwtAuthService.signAccessToken({
        ...newPayload,
        type: 'access_token',
      }),
      refresh_token: await this.jwtAuthService.signRefreshToken({
        ...newPayload,
        type: 'refresh_token',
      }),
    };
  }
}
