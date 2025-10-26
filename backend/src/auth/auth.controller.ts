/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/createUser.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req) {
    const userId = parseInt(req.user.userId, 10);
    return this.authService.getProfileById(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile/:id')
  async getProfileById(@Param('id', ParseIntPipe) userId: number) {
    return this.authService.getProfileById(userId);
  }
}
