const request = require('supertest');
const should = require("should");
const app = require('../bin/www').app;

const session = require('supertest-session');
let testSession = null;

beforeEach(function () {
    testSession = session(app);
});

describe('createtopic.jsのテスト', function() {

    let authenticatedSession;

    before(
        function (done) {
            testSession.post('/users/login')
            .send({name: "komitest", password: "eenz78sbrh"})
            .expect(302)
            .end(function (err) {
                if (err) return done(err);
                authenticatedSession = testSession;
                return done();
            });
        }
    );

    describe(' / へのGETリクエスト', function() {
      it('認証なしのためトップページへのリダイレクトによって302のステータスコードが返ってくること', function(done) {
        request(app)
        .get('/createtopic')
        .end((err, res)=>{
            if (err) return done(err);
            should(res.status).equal(302);
            should(res.header.location).equal('/');
            done();
        })
      });
      it('認証ありのためトピック作成画面が描画され200のステータスコードが返ってくること', function(done) {
        authenticatedSession
        .get('/createtopic')
        .end((err, res)=>{
            if (err) return done(err);
            should(res.status).equal(200);
            should(res.statusType).equal(2);
            done();
        })
      });
    });

    describe(' / へのPOSTリクエスト', function() {
        it('トピックの作成が成功しメインページへのリダイレクトによる302のステータスコードが返ってくること', function(done) {
            authenticatedSession
            .post('/createtopic')
            .send({topicname:'test', msg:'test'})
            .end((err, res)=>{
                if (err) return done(err);
                should(res.status).equal(302);
                should(res.header.location).equal('/main/1');
                done();
            })
        });
        it('トピックの作成が失敗し401のステータスコードが返ってくること（トピック名なし）', function(done) {
            authenticatedSession
            .post('/createtopic')
            .send({topicname:'', msg:'test'})
            .end((err, res)=>{
                if (err) return done(err);
                should(res.status).equal(401);
                done();
            })
        });
        it('トピックの作成が失敗し401のステータスコードが返ってくること（メッセージなし）', function(done) {
            authenticatedSession
            .post('/createtopic')
            .send({topicname:'test', msg:''})
            .end((err, res)=>{
                if (err) return done(err);
                should(res.status).equal(401);
                done();
            })
        });
    });
});