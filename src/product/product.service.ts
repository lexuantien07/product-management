import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.model';
import { Model, Types } from 'mongoose';
import { Cache } from 'cache-manager';
import { CreateProductDto } from './product.dto';
import { RedisService } from 'src/common/redis.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly redisService: RedisService,
  ) {}

  async create(dto: CreateProductDto) {
    const product = await this.productModel.create(dto);
    return product;
  }

  async findAll(query) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const cacheKey = `products:${page}:${limit}`;
    const cachedProducts = await this.redisService.get(cacheKey);
    if (cachedProducts) {
      return JSON.parse(cachedProducts);
    }

    const products = await this.productModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    await this.redisService.set(cacheKey, JSON.stringify(products), 60);

    const total = await this.productModel.countDocuments();
    const totalPage = Math.ceil(total / limit);

    return {
      products,
      currentPage: page,
      totalPage,
      limit,
      total: total,
    };
  }

  async search(query: string): Promise<Product[]> {
    return this.productModel.find({ name: new RegExp(query, 'i') }).exec();
  }

  async toggleLike(productId: string, userId: string): Promise<Product> {
    const product = await this.productModel.findById(productId);
    if (!product) throw new NotFoundException('Product not found');

    const userObjId = new Types.ObjectId(userId);
    const index = product.likedBy.findIndex((id) => id.equals(userObjId));

    if (index === -1) {
      product.likedBy.push(userObjId);
      product.likes++;
    } else {
      product.likedBy.splice(index, 1);
      product.likes--;
    }

    await product.save();
    await this.redisService.deleteByPattern('products');
    return product;
  }
}
