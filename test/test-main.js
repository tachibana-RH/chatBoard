const request = require('supertest');
var should = require("should");
var app = require('../bin/www').app;

var session = require('supertest-session');
var testSession = null;

beforeEach(function () {
    testSession = session(app);
});

describe('main.jsのテスト', function() {
    describe('GET / request', function() {
      it('should return status 302', function(done) {
        request(app)
            .get('/main')
            .expect("Content-type",/json/)
            .expect(200)
            .end((err, res)=>{
                should(res.status).equal(302);
                done();
            })
      });
    });
    describe('GET /:page request', function() {
        it('should return 302', function(done) {
        request(app)
            .get('/main/1')
            .expect("Content-type",/json/)
            .expect(200)
            .end((err, res)=>{
                should(res.status).equal(302);
                done();
            })
        });
    });
    describe('GET /:page request', function() {
        var authenticatedSession;

        before(function (done) {
          testSession.post('/users/login')
            .send({name: "komitest", password: "eenz78sbrh"})
            .expect(302)
            .end(function (err) {
              if (err) return done(err);
              authenticatedSession = testSession;
              return done();
            });
        });

        it('should return 302', function(done) {
            request(app)
                .get('/main/1')
                .expect("Content-type",/json/)
                .expect(200)
                .end((err, res)=>{
                    should(res.status).equal(302);
                    done();
                })
        });
        it('should return 200', function(done) {
            authenticatedSession.get('/main/1')
            .end((err, res) => {
                should(res.status).equal(200);
                done();
            })
        });
        
    });
});