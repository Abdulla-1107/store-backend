import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { TelegramModule } from './telegram/telegram.module';
import { OrderModule } from './order/order.module';
import { CategoryModule } from './category/category.module';
import { UploadModule } from './upload/upload.module';


@Module({
  imports: [PrismaModule, UserModule, AuthModule, ProductModule, TelegramModule, OrderModule, CategoryModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
