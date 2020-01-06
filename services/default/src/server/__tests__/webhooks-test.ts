import bodyParser from 'body-parser';
//import request from 'supertest';
import express from 'express';
import {webhooks} from '../webhooks';
import {setupENV} from './../env';
import {client, createTask} from './../tasks';
const request = require('supertest');

jest.mock('./../tasks');

describe('webhook handler tests', () => {
  let app;

  beforeAll(async (done) => {
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
