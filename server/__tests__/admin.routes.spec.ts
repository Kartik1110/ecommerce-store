import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import app from '../src/app';
import { title } from '../src/constants/title.constants';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    discount: {
      create: jest
        .fn()
        .mockImplementationOnce(() => {
          return 'Discount generated';
        })
        .mockImplementationOnce(() => {
          throw new Error('Database error');
        }),
    },
  })),
}));

describe(`${title.adminRoutes.desc}`, () => {
  it(`${title.adminRoutes.itShouldGenerateDiscount}`, async () => {
    const requestBody = {
      code: 'DEMO_CODE',
      discount_percent: 25,
    };
    const response = await request(app).post('/api/discount/generate').send(requestBody);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toMatch('Discount generated');
  });

  it(`${title.adminRoutes.itShouldHandleValidation}`, async () => {
    const response = await request(app).post('/api/discount/generate').send({
      code: 'DEMO_CODE',
      discount_percent: '25',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch('Validation error');
  });

  it(`${title.adminRoutes.itShouldHandleError}`, async () => {
    const response = await request(app).post('/api/discount/generate').send({
      code: 'DEMO_CODE',
      discount_percent: 25,
    });

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toMatch('Internal Server Error');
  });
});
