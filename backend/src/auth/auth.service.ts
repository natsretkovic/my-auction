import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const existingEmail = await this.userService.findUserByEmail(
      createUserDto.email,
    );
    if (existingEmail) {
      throw new UnauthorizedException('Email postoji');
    }

    const existingUsername = await this.userService.findUserByUsername(
      createUserDto.username,
    );
    if (existingUsername) {
      throw new UnauthorizedException('Username postoji');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: User; token: string }> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Neispravan email ili lozinka');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Neispravan email ili lozinka');
    }

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return { user, token };
  }
}
