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

describe('Testes de Login', () => {
  afterEach(sinon.restore);

  it('Não é possível realizar o login sem informar o e-mail.', async () => {
    const result = await chai.request(app).post('/login').send({ password: invalidUser.password });
    expect(result.status).to.be.equal(400);
    expect(result.body).to.be.deep.equal({ message: 'All fields must be filled' });
  });

  it('Não é possível realizar o login sem informar a senha.', async () => {
    const result = await chai.request(app).post('/login').send({ email: invalidUser.email });
    expect(result.status).to.be.equal(400);
    expect(result.body).to.be.deep.equal({ message: 'All fields must be filled' });
  });

  it('Não é possível realizar o login com dados incorretos.', async () => {
    const result = await chai.request(app).post('/login').send({ email: invalidUser.email, password: invalidUser.password });
    expect(result.status).to.be.equal(401);
    expect(result.body).to.be.deep.equal({ message: 'Incorrect email or password' });
  });

  it('Não é possível realizar o login com formato de e-mail incorreto.', async () => {
    const result = await chai.request(app).post('/login').send({ email: "guyddo", password: invalidUser.password });
    expect(result.status).to.be.equal(401);
    expect(result.body).to.be.deep.equal({ message: 'Incorrect email or password' });
  });

  it('Não é possível realizar o login com a senha incorreta.', async () => {
    const result = await chai.request(app).post('/login').send({ email: validUser.email, password: "xablau" });
    expect(result.status).to.be.equal(401);
    expect(result.body).to.be.deep.equal({ message: 'Incorrect email or password' });
  });

  it('É possível realizar o login com sucesso.', async () => {
    sinon.stub(usersModel, 'findOne').resolves({ dataValues: validUser } as any);
    const result = await chai.request(app).post('/login').send({ email: validUser.email, password: "secret_admin" });
    expect(result.status).to.be.equal(200);
    expect(result.body).to.have.property('token');
  });

  it('Rota validate retorna "Token not found" se não tiver o Authorization', async () => {
    const result = await chai.request(app).get('/login/validate');
    expect(result.status).to.be.equal(400);
    expect(result.body.message).to.have.equal('Token not found');
  });

  it('Rota validate retorna a role do usuário', async () => {
    sinon.stub(usersModel, 'findOne').resolves({ dataValues: validUser } as any);
    const result = await chai.request(app).get('/login/validate').set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicGFzc3dvcmQiOiIkMmEkMDgkeGkuSHhrMWN6QU8wblpSLi5CMzkzdTEwYUVEMFJRMU4zUEFFWFE3SHh0TGpLUEVaQnUuUFciLCJpYXQiOjE2NzQzMDQwMzUsImV4cCI6MTY3NDMyNTYzNX0.nZS7CdjfCueciyAdMy2ezBXi3A_qWZbdbOvo036Qh1M');
    expect(result.status).to.be.equal(200);
    expect(result.body).to.have.property('role');
    expect(result.body.role).to.have.equal('admin');
  });

});
