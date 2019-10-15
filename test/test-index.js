// const expect = require('expect');
// var server = supertest.agent("http://localhost:3000");
const request = require('supertest');
var should = require("should");
var app = require('../bin/www').app;

describe('index.jsのテスト', function() {
    describe('GET / request', function() {
      it('should return status 200', function(done) {
        request(app)
        .get('/')
        .expect("Content-type",/json/)
        .expect(200)
        .end((err, res)=>{
            should(res.status).equal(200);
            done();
        })
      });
    });
});