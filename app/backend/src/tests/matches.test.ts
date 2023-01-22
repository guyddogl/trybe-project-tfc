import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import matchModel from '../database/models/matchModel';
import matchesMock from './mocks/matches';

chai.use(chaiHttp);

const { expect } = chai;

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicGFzc3dvcmQiOiIkMmEkMDgkeGkuSHhrMWN6QU8wblpSLi5CMzkzdTEwYUVEMFJRMU4zUEFFWFE3SHh0TGpLUEVaQnUuUFciLCJpYXQiOjE2NzQ0MjI5MzMsImV4cCI6MTY3NDQ0NDUzM30.KsKmFKDDfF65Q_USJC2SOm4TvnMa4FZmSCpzSaqFKQc"

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
    const result = await chai.request(app).post('/matches').set('Authorization', token).send({
      homeTeamId: 16,
      awayTeamId: 8,
      homeTeamGoals: 2,
      awayTeamGoals: 2
    });
    expect(result.status).to.be.equal(201);
  });

  it('Não é possível criar um jogo com o ID de um time que não existe', async () => {
    const result = await chai.request(app).post('/matches').set('Authorization', token).send({
      homeTeamId: 400,
      awayTeamId: 8,
      homeTeamGoals: 2,
      awayTeamGoals: 2
    });
    expect(result.status).to.be.equal(404);
  });

  it('Não é possível criar um jogo com dois times com o mesmo ID', async () => {
    const result = await chai.request(app).post('/matches').set('Authorization', token).send({
      homeTeamId: 8,
      awayTeamId: 8,
      homeTeamGoals: 2,
      awayTeamGoals: 2
    });
    expect(result.status).to.be.equal(422);
  });

  it('Não é possível criar um jogo com um token inválido', async () => {
    const result = await chai.request(app).post('/matches').set('Authorization', 'token').send({
      homeTeamId: 400,
      awayTeamId: 8,
      homeTeamGoals: 2,
      awayTeamGoals: 2
    });
    expect(result.status).to.be.equal(401);
  });

  it('Não é possível criar um jogo com sem um token', async () => {
    const result = await chai.request(app).post('/matches').send({
      homeTeamId: 400,
      awayTeamId: 8,
      homeTeamGoals: 2,
      awayTeamGoals: 2
    });
    expect(result.status).to.be.equal(401);
  });

  it('É possível finalizar um jogo', async () => {
    const result = await chai.request(app).patch('/matches/1/finish')
    expect(result.status).to.be.equal(200);
  });

  it('É possível atualizar um jogo', async () => {
    const result = await chai.request(app).patch('/matches/1').set('Authorization', token).send({
      homeTeamGoals: 2,
      awayTeamGoals: 2
    });
    expect(result.status).to.be.equal(200);
  });

});
