/// <reference types="cypress" />

import contrato from "../contracts/usuarios.contract";

describe('Testes da Funcionalidade Usuários', () => {
     let token
     before(() => {
          cy.token('dudinha123@test.com.br', 'dudoca458').then(tkn => { token = tkn })
     });

     it.only('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response =>{
               return contrato.validateAsync(response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios',
               headers: { authorization: token },
          }).then((response) => {
               expect(response.body.usuarios[0].nome).to.equal('Eduarda Sartori')
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
               expect(response.duration).to.be.lessThan(20)
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          cy.cadastrarUsuarios('denise moraes', 'denisetest@test.com.br', 'testes', 'true')
               .then((response) => {
                    expect(response.status).to.equal(201)
                    expect(response.body.message).to.equal('Cadastro realizado com sucesso')

               })
     })

     it('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuarios2('ryan suco', 'ryansuco@test.com.br', 'tester', 'true')
               .then((response) => {
                    expect(response.status).to.equal(400)
                    expect(response.body.message).to.equal('Este email já está sendo usado')

               })
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          cy.request('usuarios').then(response => {
               let id = response.body.usuarios[0]._id
               cy.request({
                    method: 'PUT',
                    url: `usuarios/${id}`,
                    headers: { authorization: token },
                    body:
                    {
                         "nome": "ryan suco",
                         "email": "ryansuco@test.com.br",
                         "password": "tester",
                         "administrador": "false"
                    }
               }).then(response => {
                    expect(response.body.message).to.equal('Registro alterado com sucesso')
               })
          })

     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          cy.request('usuarios').then(response => {
               let id = response.body.usuarios._id
               cy.request({
                    method: 'DELETE',
                    url: `usuarios/${id}`,
                    headers: { authorization: token },
                    body:
                    {
                         "nome": "ryan suco",
                         "email": "ryansuco@test.com.br",
                         "password": "tester",
                         "administrador": "false"
                    }
               }).then(response => {
                    expect(response.body.message).to.equal('Registro excluído com sucesso')
               })
          })
     });


     it('Deve deletar usuario', () => {
          cy.cadastrarUsuarios3(token, 'maria santos','mariasan@test.com.br','testess', 'true')
               .then(response => {
                    let id = response.body._id
                    cy.request({
                         method: 'DELETE',
                         url: `usuarios/${id}`,
                         headers: { authorization: token }
                    })
                         .then(response => {
                              expect(response.body.message).to.equal('Registro excluído com sucesso')
                              expect(response.status).to.equal(200)
                         })
               })

     });
});



