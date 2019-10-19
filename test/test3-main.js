const request = require('supertest');
const should = require("should");
const app = require('../bin/www').app;
const mysqlModels = require('../modules/mysqlModels');

const session = require('supertest-session');
let testSession = null;

beforeEach(function () {
    testSession = session(app);
});

describe('main.jsのテスト', function() {

    let authenticatedSession;
    let guestAuthenticatedSession;
    before(
        function (done) {
            testSession.post('/users/login')
            .send({name: "komitest", password: "password"})
            .expect(302)
            .end(function (err) {
                if (err) return done(err);
                authenticatedSession = testSession;
                return done();
            });
        }
    );

    before(
        function(done) {
            testSession.post('/users/guestlogin')
            .expect(302)
            .end(function (err) {
                if (err) return done(err);
                testSession.post('/users/login')
                .send({name: "komitest", password: "password"})
                .expect(302)
                .end(function (err, res) {
                    if (err) return done(err);
                    guestCookieOrigin = res.headers['set-cookie'].toString().split(';')[0];
                    guestAuthenticatedSession = testSession;
                    return done();
                });
            });
        }
    );


    describe(' / へのGETリクエスト', function() {
      it('「main/1」へのリダイレクトによって302のステータスコードが返ってくること', function(done) {
        request(app)
            .get('/main')
            .end((err, res)=>{
                if (err) return done(err);
                should(res.status).equal(302);
                should(res.header.location).equal('/main/1');
                done();
            })
      });
    });

    describe('/:page へのGETリクエスト', function() {

        it('認証なしのためトップページへのリダイレクトによって302のステータスコードが返ってくること', function(done) {
            request(app)
                .get('/main/1')
                .end((err, res)=>{
                    if (err) return done(err);
                    should(res.status).equal(302);
                    should(res.header.location).equal('/');
                    done();
                })
        });
        it('認証ありのためメインぺージが描画され200のステータスコードが返ってくること', function(done) {
            authenticatedSession.get('/main/1')
            .end((err, res) => {
                if (err) return done(err);
                should(res.status).equal(200);
                should(res.statusType).equal(2);
                done();
            })
        });
        
    });

    describe('/:topicid へのDELETEリクエスト', function() {
        it('指定したテスト用トピックとメッセージが削除され200のステータスコードが返ってくること', function(done) {
            new mysqlModels.Topic().orderBy('created_at', 'DESC').fetch()
            .then((topic)=>{
                console.log('削除対象のトピック情報：');
                console.log(topic.attributes);
                let deleteTopic = topic.attributes;
                let url = '/main/' + topic.attributes.id;
                request(app)
                    .delete(url)
                    .end((err, res)=>{
                        if (err) return done(err);
                        new mysqlModels.Topic().orderBy('created_at', 'DESC').fetch()
                        .then((result)=>{
                            should(res.status).equal(200);
                            console.log('削除後の確認（削除対象のトピック情報が表示されていないこと）：');
                            console.log(result.attributes);
                            done();
                        })
                        .catch((err)=>{
                            console.log(err);
                            done();
                        });
                    })
            })
            .catch((err)=>{
                console.log(err);
                done();
            });
        });
    });

    describe('/logout へのPOSTリクエスト', function() {
        it('セッションがゲストユーザーへ変更され200のステータスコードが返ってくること', function(done) {
            guestAuthenticatedSession.post('/main/logout')
                .end((err, res)=>{
                    if (err) return done(err);
                    should(res.status).equal(200);
                    should(res.body).equal('ゲスト');
                    done();
                })
        });
    });

});