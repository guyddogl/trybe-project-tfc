import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import matchModel from '../database/models/matchModel';
import matchesMock from './mocks/matches';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes da rota matches', () => {
  afterEach(sinon.restore);

  it('Retorna todos os jogos', async () => {
    const result = await chai.request(app).get('/matches');
    expect(result.status).to.be.equal(200);
  });

  it('Retorna todos os jogos com inProgress = true', async () => {
    const result = await chai.request(app).get('/matches?inProgress=true');
    expect(result.status).to.be.equal(200);
  });

  it('Retorna todos os jogos com inProgress = false', async () => {
    const result = await chai.request(app).get('/matches?inProgress=false');
    expect(result.status).to.be.equal(200);
  });

  it('É possível criar um jogo', async () => {
    const result = await chai.request(app).post('/matches').send({
      homeTeamId: 16,
      awayTeamId: 8,
      homeTeamGoals: 2,
      awayTeamGoals: 2
    });
    expect(result.status).to.be.equal(201);
  });

});
