const chai = require('chai')
const chaiHttp = require('chai-http')

const { app, runServer, closeServer } = require('../server')
const { expect } = chai

chai.use(chaiHttp)


describe('Everything', function() {

  before(function(){
    return runServer()
  })

  after(function(){
    return closeServer()
  })

  it('Should serve static asses at the root', function(){
    return chai.request(app)
      .get('/')
      .then(function(res){
        expect(res).to.have.status(200)
        expect(res).to.be.html
      })
  })

})