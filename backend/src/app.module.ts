import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { AuctionModule } from './auction/auction.module';
import { ItemModule } from './item/item.module';
import { BidModule } from './bid/bid.module';
import { ReviewModule } from './review/review.module';
import { AuthService } from './auth/auth.service';
import { User } from './user/user.entity';
import { Auction } from './auction/auction.entity';
import { Item } from './item/item.entity';
import { Bid } from './bid/bid.entity';
import { Review } from './review/review.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Auction, Item, Bid, Review],
        synchronize: true,
      }),
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          expiresIn:
            configService.get<string>('JWT_EXPIRES_IN') || ('1h' as any),
        },
      }),
    }),

    UserModule,
    AuctionModule,
    ItemModule,
    BidModule,
    ReviewModule,
    AuthModule,
  ],
  providers: [AuthService],
})
export class AppModule {}
