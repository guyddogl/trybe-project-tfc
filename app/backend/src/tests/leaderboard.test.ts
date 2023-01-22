import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes da rota leaderboard', () => {
  afterEach(sinon.restore);

  it('Retorna a classificação considerando home team', async () => {
    const result = await chai.request(app).get('/leaderboard/home');
    expect(result.status).to.be.equal(200);
    expect(result.body).to.be.an('array');
  });

  it('Retorna a classificação considerando away team', async () => {
    const result = await chai.request(app).get('/leaderboard/away');
    expect(result.status).to.be.equal(200);
    expect(result.body).to.be.an('array');
  });

  it('Retorna a classificação geral', async () => {
    const result = await chai.request(app).get('/leaderboard');
    expect(result.status).to.be.equal(200);
    expect(result.body).to.be.an('array');
  });

});
