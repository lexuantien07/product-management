import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CreateProductDto, GetListProductDto } from './product.dto';

@Controller('products')
@ApiTags('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll(@Query() query: GetListProductDto) {
    return this.productService.findAll(query);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiSecurity('JWT-auth')
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Get('search')
  async search(@Query('q') query: string) {
    return this.productService.search(query);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard('jwt'))
  @ApiSecurity('JWT-auth')
  async toggleLike(@Param('id') id: string, @Req() req: any) {
    const user = req.user;
    return this.productService.toggleLike(id, user.userId);
  }
}
