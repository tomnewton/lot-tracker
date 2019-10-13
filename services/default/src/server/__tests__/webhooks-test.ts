import {webhooks} from '../webhooks';
const request = require('supertest');
//import request from 'supertest';
import express, {NextFunction} from 'express';
import bodyParser from 'body-parser';
import {setupENV} from './../env';

jest.mock('./../tasks');

import {createTask, client} from './../tasks';

describe('webhook handler tests', () => {
  let app;

  beforeAll((done) => {
    app = express();
    app.use(bodyParser.raw());
    app.use('/webhooks', webhooks);
    setupENV();
    done();
  });

  test('order/fulfilled webhook creates task', async (done) => {
    const payload = {test: 1};
    const response = await request(app)
      .post('/webhooks/orders/fulfilled')
      .send(payload);
    expect(response.status).toBe(200);
    expect(createTask).toBeCalledWith(
      process.env.DEFAULT_QUEUE,
      JSON.stringify(payload),
      client,
    );
    done();
  });
});
