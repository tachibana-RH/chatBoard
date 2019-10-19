const request = require('supertest');
const should = require("should");
const app = require('../bin/www').app;

const session = require('supertest-session');
let testSession = null;

beforeEach(function () {
    testSession = session(app);
});

describe('topic.jsのテスト', function() {
    describe(' / へのGETリクエスト', function() {
        it('404のステータスコードが返ってくること', function(done) {
            request(app)
            .get('/topic')
            .end((err, res)=>{
                if (err) return done(err);
                should(res.status).equal(404);
                console.log(res.res.text);
                done();
            })
        });
    });
    describe(' /:topicid へのGETリクエスト', function() {
        it('「/:topicid/1」へのリダイレクトによる302のステータスコードが返ってくること', function(done) {
            request(app)
            .get('/topic/1')
            .end((err, res)=>{
                if (err) return done(err);
                should(res.status).equal(302);
                should(res.header.location).equal('/topic/1/1');
                done();
            })
        });
    });
    describe(' /:topicid/:page へのGETリクエスト', function() {
        let authenticatedSession;

        before(function (done) {
          testSession.post('/users/login')
            .send({name: "komitest", password: "password"})
            .expect(302)
            .end(function (err) {
              if (err) return done(err);
              authenticatedSession = testSession;
              return done();
            });
        });

        it('認証なしのためトップページへのリダイレクトによる302のステータスコードが返ってくること', function(done) {
            request(app)
            .get('/topic/1/1')
            .end((err, res)=>{
                if (err) return done(err);
                should(res.status).equal(302);
                should(res.header.location).equal('/');
                done();
            })
        });

        it('認証ありのためトピックページが描画され200のステータスコードが返ってくること', function(done) {
            authenticatedSession.get('/topic/1/1')
            .end((err, res)=>{
                if (err) return done(err);
                should(res.status).equal(200);
                should(res.statusType).equal(2);
                done();
            })
        });

    });
});