const request = require('supertest');
var should = require("should");
var app = require('../bin/www').app;

describe('users.jsのテスト', function() {
    describe('POST /login request', function() {
        it('should return 302', function(done) {
            request(app)
                .post('/users/login')
                .set('Accept','application/json')
                .send({name: "komitest", password: "eenz78sbrh"})
                .end((err, res)=>{
                    should(res.status).equal(302);
                    done();
                })
        });
        it('should return 401', function(done) {
            request(app)
                .post('/users/login')
                .set('Accept','application/json')
                .send({name: "komitest", password: "eenz78sb"})
                .end((err, res)=>{
                    should(res.status).equal(401);
                    done();
                })
        });
        it('should return 401', function(done) {
            request(app)
                .post('/users/login')
                .set('Accept','application/json')
                .send({name: "komit", password: "eenz78sbrh"})
                .end((err, res)=>{
                    should(res.status).equal(401);
                    done();
                })
        });
    });
});