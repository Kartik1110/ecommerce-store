import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import app from '../src/app';
import { title } from '../src/constants/title.constants';

/* Mocking prisma */
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    items: {
      findMany: jest
        .fn()
        .mockImplementationOnce(() => {
          return 'Items found';
        })
        .mockImplementationOnce(() => {
          return null;
        })
        .mockImplementationOnce(() => {
          throw new Error('Database error');
        })
        .mockImplementation(() => {
          return [{ item_id: '99', quantity: 1 }];
        }),
    },
    cart: {
      findUnique: jest
        .fn()
        .mockImplementationOnce(() => false)
        .mockImplementation(() => true),
      create: jest
        .fn()
        .mockImplementationOnce(() => {
          return {
            items: [
              {
                item_id: '65b693b9e7d0b3740c0ac7b3',
                quantity: 1,
              },
            ],
          };
        })
        .mockImplementation(() => {
          throw new Error('Database error');
        }),
      update: jest
        .fn()
        .mockImplementationOnce(() => {
          return {
            items: [
              {
                item_id: '99',
                quantity: 1,
              },
            ],
          };
        })
        .mockImplementation(() => {
          throw new Error('Database error');
        }),
      findFirst: jest
        .fn()
        .mockImplementationOnce(() => {
          return { items: [{ item_id: '99', quantity: 1 }] };
        })
        .mockImplementationOnce(() => null)
        .mockImplementation(() => {
          throw new Error('Database error');
        }),
    },
    order: {
      findFirst: jest.fn().mockImplementation(() => ({
        order_count: 5,
      })),
    },
  })),
}));

describe(`${title.userRoutes.desc}`, () => {
  it(`${title.userRoutes.itShouldGetAllItems}`, async () => {
    const response = await request(app).get('/api/items').send();

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toMatch('Items found');
  });

  it(`${title.userRoutes.itShouldHandleItemNotFound}`, async () => {
    const response = await request(app).get('/api/items').send();

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toMatch('Items not found');
  });

  it(`${title.userRoutes.itShouldHandleError}`, async () => {
    const response = await request(app).get('/api/items').send();

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toMatch('Internal Server Error');
  });

  it(`${title.userRoutes.itShouldAddCartIfNotExists}`, async () => {
    const mockRequestBody = {
      items: [
        {
          item_id: '123',
          quantity: 1,
        },
        {
          item_id: '456',
          quantity: 4,
        },
      ],
      user_id: 'abc',
    };
    const response = await request(app).post('/api/cart/add').send(mockRequestBody);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toMatch('Items added to cart');
  });

  it(`${title.userRoutes.itShouldAddCartIfExists}`, async () => {
    const mockRequestBody = {
      items: [
        {
          item_id: '99',
          quantity: 1,
        },
      ],
      user_id: 'abc',
    };
    const response = await request(app).post('/api/cart/add').send(mockRequestBody);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toMatch('Items added to your existing cart');
  });

  it(`${title.userRoutes.itShouldHandleValidation}`, async () => {
    const mockRequestBody = {
      user_id: 'abc',
    };
    const response = await request(app).post('/api/cart/add').send(mockRequestBody);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch('Validation error');
  });

  it(`${title.userRoutes.itShouldHandleError}`, async () => {
    const mockRequestBody = {
      items: [
        {
          item_id: '123',
          quantity: 1,
        },
        {
          item_id: '456',
          quantity: 4,
        },
      ],
      user_id: 'abc',
    };
    const response = await request(app).post('/api/cart/add').send(mockRequestBody);

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toMatch('Internal Server Error');
  });

  it(`${title.userRoutes.itShouldCheckoutCart}`, async () => {
    const mockRequestBody = {
      user_id: 'abc',
    };

    const response = await request(app).post('/api/cart/checkout').send(mockRequestBody);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toMatch('Items added to cart');
  });

  it(`${title.userRoutes.itShouldHandleErrorCheckout}`, async () => {
    const mockRequestBody = {
      user_id: 'abc',
    };

    const response = await request(app).post('/api/cart/checkout').send(mockRequestBody);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toMatch('No items in the cart');
  });

  it(`${title.userRoutes.itShouldHandleError}`, async () => {
    const mockRequestBody = {
      user_id: 'abc',
    };
    const response = await request(app).post('/api/cart/checkout').send(mockRequestBody);

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toMatch('Internal Server Error');
  });
});
