const request = require('supertest');
var should = require("should");
var app = require('../bin/www').app;

var session = require('supertest-session');
var testSession = null;

beforeEach(function () {
    testSession = session(app);
});

describe('main.jsのテスト', function() {
    describe(' / へのGETリクエスト', function() {
      it('リダイレクトによって302のステータスコードが返ってくること', function(done) {
        request(app)
            .get('/main')
            .end((err, res)=>{
                if (err) return done(err);
                should(res.status).equal(302);
                done();
            })
      });
    });

    describe('/:page へのGETリクエスト', function() {
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

        it('認証なしのためリダイレクトによって302のステータスコードが返ってくること', function(done) {
            request(app)
                .get('/main/1')
                .end((err, res)=>{
                    if (err) return done(err);
                    should(res.status).equal(302);
                    done();
                })
        });
        it('認証ありのためGETリクエストで200のステータスコードが返ってくること', function(done) {
            authenticatedSession.get('/main/1')
            .end((err, res) => {
                if (err) return done(err);
                should(res.status).equal(200);
                done();
            })
        });
        
    });
});