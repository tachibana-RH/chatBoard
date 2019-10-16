const request = require('supertest');
var should = require("should");
var app = require('../bin/www').app;

describe('users.jsのテスト', function() {

    describe('/login へのGETリクエスト', function() {
        it('200のステータスコードが返ってくること', function(done) {
            request(app)
                .get('/users/login')
                .end((err, res)=>{
                    if (err) return done(err);
                    should(res.status).equal(200);
                    done();
                })
        })
    })

    describe('/login へのPOSTリクエスト', function() {
        it('認証が成功し302のステータスコードが返ってくること', function(done) {
            request(app)
                .post('/users/login')
                .set('Accept','application/json')
                .send({name: "komitest", password: "eenz78sbrh"})
                .end((err, res)=>{
                    if (err) return done(err);
                    should(res.status).equal(302);
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

    // describe('/guestlogin へのPOSTリクエスト', function(){
    //     it('新規ゲストユーザーが作成され、リダイレクトによる302のステータスコードが返ってくること', function(done){
    //         request(app)
    //             .post('/guestlogin')
    //             .end((err, res)=>{
    //                 if(err) return done(err);
    //                 should(res.status).equal(302);
    //                 done();
    //             })
    //     });
    //     it('トークンが更新され、リダイレクトによる302のステータスコードが返ってくること', function(done){
    //         request(app)
    //             .post('/guestlogin')
    //             //テスト実行する度に更新が必要。。
    //             .set('Cookie','yH9o9uNTf9OfXRx/aEap/G6d')
    //             .end((err, res)=>{
    //                 if(err) return done(err);
    //                 should(res.status).equal(302);
    //                 done();
    //             })
    //     })
    // })

    describe('/users/add へのGETリクエスト',function(){
        it('200のステータスコードが返ってくること', function(done){
            request(app)
                .get('/users/add')
                .end((err, res)=>{
                    if (err) return done(err);
                    should(res.status).equal(200);
                    done();
                })
        });
    });

    describe('/users/add へのPOSTリクエスト',function(){
        // it('ユーザーの新規作成が成功し、リダイレクトによる302のステータスコードが返ってくること', function(done){
        //     request(app)
        //         .post('/users/add')
        //         .send({name: "test3", password: "testword3", comment:'test'})
        //         .end((err, res)=>{
        //             if (err) return done(err);
        //             should(res.status).equal(302);
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