import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import usersModel from '../database/models/usersModel';
import token from '../utils/token';

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

describe('Testa o Login', () => {
  afterEach(sinon.restore);

  it('Não é possível realizar o login sem informar o e-mail.', async () => {
    const response = await chai.request(app).post('/login').send({ password: invalidUser.password });
    expect(response.status).to.be.equal(400);
    expect(response.body).to.be.deep.equal({ message: 'All fields must be filled' });
  });

  it('Não é possível realizar o login sem informar a senha.', async () => {
    const response = await chai.request(app).post('/login').send({ email: invalidUser.email });
    expect(response.status).to.be.equal(400);
    expect(response.body).to.be.deep.equal({ message: 'All fields must be filled' });
  });

  it('Não é possível realizar o login com dados incorretos.', async () => {
    const response = await chai.request(app).post('/login').send({ email: invalidUser.email, password: invalidUser.password });
    expect(response.status).to.be.equal(401);
    expect(response.body).to.be.deep.equal({ message: 'Incorrect email or password' });
  });

  it('É possível realizar o login com sucesso.', async () => {
    sinon.stub(usersModel, 'findOne').resolves(validUser as any);

    const response = await chai.request(app).post('/login').send({ email: validUser.email, password: validUser.password });
    console.log(response.body);

    // const decoded = token.verifyToken(response.body.token);

    expect(response.status).to.be.equal(200);
    // expect(response.body).to.have.property('token');
    // expect(decoded.email).to.be.equal('guyddogl@gmail.com');
    // expect(decoded.role).to.be.equal('admin');
  });
});
