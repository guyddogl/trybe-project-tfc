import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import teamsModel from '../database/models/teamsModel';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

// const valideToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicGFzc3dvcmQiOiIkMmEkMDgkeGkuSHhrMWN6QU8wblpSLi5CMzkzdTEwYUVEMFJRMU4zUEFFWFE3SHh0TGpLUEVaQnUuUFciLCJpYXQiOjE2NzQzMDQwMzUsImV4cCI6MTY3NDMyNTYzNX0.nZS7CdjfCueciyAdMy2ezBXi3A_qWZbdbOvo036Qh1M'

const invalidUser = {
  username: 'guyddogl',
  role: 'admin',
  email: 'guyddogl@gmail.com',
  password: 'B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.$2a$08$xi.Hxk1czAO0nZR..PW'
}

const validUser = {
  username: 'Admin',
  role: 'admin',
  email: 'admin@admin.com',
  password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW'
}

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
