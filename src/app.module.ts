import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { OrderStatusModule } from './order_status/order_status.module';
import { CategoryModule } from './category/category.module';
import { S3ServiceService } from './s3-service/s3-service.service';
import { StripeModule as NestjsStripeModule } from 'nestjs-stripe';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NestjsStripeModule.forRoot({
      apiKey: process.env.STRIPE_ACCESS_KEY,
      apiVersion: '2023-10-16',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    PrismaModule,
    AuthModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    OrderStatusModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService, S3ServiceService],
})
export class AppModule {}
