const request = require('supertest');
var should = require("should");
var app = require('../bin/www').app;

describe('topic.jsのテスト', function() {
    describe(' / へのGETリクエスト', function() {
        it('404のステータスコードが返ってくること', function(done) {
            request(app)
            .get('/topic')
            .end((err, res)=>{
                should(res.status).equal(404);
                done();
            })
        });
    });
    describe(' /:topicid へのGETリクエスト', function() {
        it('リダイレクトによる302のステータスコードが返ってくること', function(done) {
            request(app)
            .get('/topic/1')
            .end((err, res)=>{
                should(res.status).equal(302);
                done();
            })
        });
    });
});