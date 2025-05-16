import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.model';
import { UserModule } from '../user/user.module';
import { RedisService } from 'src/common/redis.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    UserModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, RedisService],
})
export class ProductModule {}
