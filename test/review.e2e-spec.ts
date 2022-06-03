import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Types, disconnect } from 'mongoose';

import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';

const testProductId = new Types.ObjectId().toHexString();
const testDto: CreateReviewDto = {
  name: 'test-name',
  title: 'test-title',
  description: 'test-description',
  rating: 1,
  productId: testProductId,
};

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let createdId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/review/create (POST) - success', (done) => {
    request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        expect(createdId).toBeDefined();

        done();
      });
  });

  it('/review/create (POST) - fail', (done) => {
    request(app.getHttpServer())
      .post('/review/create')
      .send({ ...testDto, rating: 0 })
      .expect(400)
      .then(({ body }: request.Response) => {
        console.log(`body: `, body);

        done();
      });
  });

  afterAll(() => {
    disconnect();
  });
});
