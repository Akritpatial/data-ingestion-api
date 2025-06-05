const request = require('supertest');
const app = require('../server');

test('POST /ingest returns ingestion_id', async () => {
  const res = await request(app)
    .post('/ingest')
    .send({ ids: [1, 2, 3, 4, 5], priority: 'HIGH' });

  expect(res.statusCode).toEqual(200);
  expect(res.body.ingestion_id).toBeDefined();
});
