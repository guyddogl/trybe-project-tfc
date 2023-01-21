import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes da rota teams', () => {
  afterEach(sinon.restore);

  it('Retorna todos os times', async () => {
    const result = await chai.request(app).get('/teams');
    expect(result.status).to.be.equal(200);
    expect(result.body).to.be.an('array')
  });

  it('Retorna o time de acordo com o id', async () => {
    const result = await chai.request(app).get('/teams/7');
    expect(result.status).to.be.equal(200);
    expect(result.body.teamName).to.be.deep.equal("Flamengo");
  });

  it('Retorna erro caso o id não exista', async () => {
    const result = await chai.request(app).get('/teams/100');
    expect(result.status).to.be.equal(401);
    expect(result.body).to.be.deep.equal({ message: 'Result not found' });
  });

});
