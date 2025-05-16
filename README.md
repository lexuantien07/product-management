# Product Management System (NestJS + MongoDB + Redis)

A backend system built using **NestJS**, supporting:

- Product management
- Like/unlike feature
- API caching with Redis
- JWT-based authentication

---

## Setup & Installation

### Requirements

- Node.js
- MongoDB
- Redis

### Install dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory and with same variables as `.env.example`:

## Running

### Development

```bash
npm run start:dev
```

## API Documentation

The API documentation is available at [http://localhost:{port}/docs](http://localhost:3000/docs) when the server is running.

### Authentication

#### Register

- `POST /auth/register`
- **Body**:

```json
{
  "username": "your_username",
  "password": "your_password"
}
```

#### Login

- `POST /auth/login`
- **Body**:

```json
{
  "username": "your_username",
  "password": "your_password"
}
```

### Products

#### Get all products

- `GET /products`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Number of products per page (default: 10)
  - `search`: Search term for product name
  - `sort`: Sort order (asc/desc) for price
- **Response**:

```json
{
  "products": [
    {
      "_id": "product_id",
      "name": "product_name",
      "description": "product_description",
      "price": 100,
      "likes": 10,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

#### Create a product

- `POST /products`
- **Headers**:
  - `Authorization`: `Bearer your_jwt_token`
- **Body**:

```json
{
  "name": "product_name",
  "description": "product_description",
  "price": 100
}
```

- **Response**:

```json
{
  "_id": "product_id",
  "name": "product_name",
  "description": "product_description",
  "price": 100,
  "likes": 0,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

#### Search products by name

- `GET /products/search?q=`
- **Query Parameters**:
  - `q`: Search term for product name
- **Response**:

```json
{
  "products": [
    {
      "_id": "product_id",
      "name": "product_name",
      "description": "product_description",
      "price": 100,
      "likes": 10,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Like/unlike a product

- `POST /products/:id/like`
- **Headers**:
  - `Authorization`: `Bearer your_jwt_token`
- **Response**:

```json
{
  "message": "Product liked successfully"
}
```

## Caching & Optimization

### API Caching with Redis

- The GET /products endpoint is cached based on query page and limit.
- Redis stores cached result for 60 seconds (customizable).
- Reduces redundant MongoDB queries.

### Cache Invalidation

- When a new product is added or a like is toggled, the cache is invalidated
- Ensures data freshness across clients.

## Like/Unlike Feature

- **Toggle-like**: users can like/unlike a product.
- A user cannot like more than once.
- Like action invalidates cache.
