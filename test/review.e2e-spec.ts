import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Types, disconnect } from 'mongoose';

import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';

const loginDto: AuthDto = {
  login: 'test1@test.com',
  password: '12345',
};

const testProductId = new Types.ObjectId().toHexString();
const testDto: CreateReviewDto = {
  name: 'test-name',
  title: 'test-title',
  description: 'test-description',
  rating: 2,
  productId: testProductId,
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdReviewId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);

    token = res.body.access_token;
  });

  it('/review/create (POST) - success', (done) => {
    request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdReviewId = body._id;
        expect(createdReviewId).toBeDefined();

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

  it('/review/:id (DELETE) - success', (done) => {
    console.log(`createdReviewId: `, createdReviewId);

    request(app.getHttpServer())
      .delete('/review/' + createdReviewId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(({ body }: request.Response) => {
        console.log(`body: `, body);

        done();
      });
  });

  it('/review/:id (DELETE) - fail', (done) => {
    request(app.getHttpServer())
      .delete('/review/' + '629e606efcd95e221c89dbc3')
      .set('Authorization', 'Bearer ' + token)
      .expect(404, {
        statusCode: 404,
        message: REVIEW_NOT_FOUND,
      })
      .then(({ body }: request.Response) => {
        console.log(`body: `, body);

        done();
      });
  });

  afterAll(() => {
    disconnect();
  });
});
