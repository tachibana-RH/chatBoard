const request = require('supertest');
const should = require("should");
const app = require('../bin/www').app;

const session = require('supertest-session');
let testSession = null;

beforeEach(function () {
    testSession = session(app);
});

describe('users.jsのテスト', function() {

    let guestAuthenticatedSession;
    let guestCookieOrigin;

    before(
        function(done) {
            testSession.post('/users/guestlogin')
            .expect(302)
            .end(function (err, res) {
                if (err) return done(err);
                // guestCookieOrigin = res.req._header.split('\n')[3];
                guestCookieOrigin = res.headers['set-cookie'].toString().split(';')[0];
                guestAuthenticatedSession = testSession;
                return done();
            });
        }
    );

    describe('/login へのGETリクエスト', function() {
        it('ログインページが描画され200のステータスコードが返ってくること', function(done) {
            request(app)
                .get('/users/login')
                .end((err, res)=>{
                    if (err) return done(err);
                    should(res.status).equal(200);
                    should(res.statusType).equal(2);
                    done();
                })
        })
    })

    describe('/login へのPOSTリクエスト', function() {
        it('認証が成功しメインページへのリダイレクトによる302のステータスコードが返ってくること', function(done) {
            request(app)
                .post('/users/login')
                .set('Accept','application/json')
                .send({name: "komitest", password: "eenz78sbrh"})
                .end((err, res)=>{
                    if (err) return done(err);
                    should(res.status).equal(302);
                    should(res.header.location).equal('/main/1');
                    done();
                })
        });
        it('認証が失敗し401のステータスコードが返ってくること（パスワードミス）', function(done) {
            request(app)
                .post('/users/login')
                .set('Accept','application/json')
                .send({name: "komitest", password: "eenz78sb"})
                .end((err, res)=>{
                    if (err) return done(err);
                    should(res.status).equal(401);
                    done();
                })
        });
        it('認証が失敗し401のステータスコードが返ってくること（名前ミス）', function(done) {
            request(app)
                .post('/users/login')
                .set('Accept','application/json')
                .send({name: "komit", password: "eenz78sbrh"})
                .end((err, res)=>{
                    if (err) return done(err);
                    should(res.status).equal(401);
                    done();
                })
        });
    });

    describe('/guestlogin へのPOSTリクエスト', function(){
        it('新規ゲストユーザーが作成され、メインページへのリダイレクトによる302のステータスコードが返ってくること', function(done){
            request(app)
                .post('/users/guestlogin')
                .end((err, res)=>{
                    if(err) return done(err);
                    should(res.status).equal(302);
                    should(res.header.location).equal('/main/1');
                    done();
                })
        });
        it('トークンが更新され、メインページへのリダイレクトによる302のステータスコードが返ってくること', function(done){
            guestAuthenticatedSession
                .post('/users/guestlogin')
                .end((err, res)=>{
                    if(err) return done(err);
                    console.log('変更前：' + guestCookieOrigin);
                    console.log('変更後：' + res.headers['set-cookie'].toString().split(';')[0]);
                    should(res.status).equal(302);
                    should(res.header.location).equal('/main/1');
                    done();
                })
        });
    })

    describe('/users/add へのGETリクエスト',function(){
        it('ユーザー新規登録画面が描画され200のステータスコードが返ってくること', function(done){
            request(app)
                .get('/users/add')
                .end((err, res)=>{
                    if (err) return done(err);
                    should(res.status).equal(200);
                    should(res.statusType).equal(2);
                    done();
                })
        });
    });

    describe('/users/add へのPOSTリクエスト',function(){
        // it('ユーザーの新規作成が成功し、メインページへのリダイレクトによる302のステータスコードが返ってくること', function(done){
        //     request(app)
        //         .post('/users/add')
        //         .send({name: "test3", password: "testword3", comment:'test'})
        //         .end((err, res)=>{
        //             if (err) return done(err);
        //             should(res.status).equal(302);
        //             should(res.header.location).equal('/main/1');
        //             done();
        //         })
        // });
        it('バリデーションによって401のステータスコードが返ってくること（全てnull値）', function(done){
            request(app)
                .post('/users/add')
                .send({name: '', password: '', comment:''})
                .end((err, res)=>{
                    if (err) return done(err);
                    should(res.status).equal(401);
                    done();
                })
        });
        it('バリデーションによって401のステータスコードが返ってくること（nameがnull値）', function(done){
            request(app)
                .post('/users/add')
                .send({name: '', password: 'testpassword', comment:'test'})
                .end((err, res)=>{
                    if (err) return done(err);
                    should(res.status).equal(401);
                    done();
                })
        });
        it('バリデーションによって401のステータスコードが返ってくること（passwordがnull値）', function(done){
            request(app)
                .post('/users/add')
                .send({name: 'test', password: '', comment:'test'})
                .end((err, res)=>{
                    if (err) return done(err);
                    should(res.status).equal(401);
                    done();
                })
        });
        it('バリデーションによって401のステータスコードが返ってくること（commentがnull値）', function(done){
            request(app)
                .post('/users/add')
                .send({name: 'test', password: 'testpassword', comment:''})
                .end((err, res)=>{
                    if (err) return done(err);
                    should(res.status).equal(401);
                    done();
                })
        });
        it('バリデーションによって401のステータスコードが返ってくること（nameが11文字以上）', function(done){
            request(app)
                .post('/users/add')
                .send({name: '12345678901', password: 'test12345', comment:'test'})
                .end((err, res)=>{
                    if (err) return done(err);
                    should(res.status).equal(401);
                    done();
                })
        });
        it('バリデーションによって401のステータスコードが返ってくること（passwordが8文字以下）', function(done){
            request(app)
                .post('/users/add')
                .send({name: '123456789', password: 'test', comment:'test'})
                .end((err, res)=>{
                    if (err) return done(err);
                    should(res.status).equal(401);
                    done();
                })
        });
        it('バリデーションによって401のステータスコードが返ってくること（nameがゲスト）', function(done){
            request(app)
                .post('/users/add')
                .send({name: 'ゲスト', password: 'password', comment:'test'})
                .end((err, res)=>{
                    if (err) return done(err);
                    should(res.status).equal(401);
                    done();
                })
        });
    });

});