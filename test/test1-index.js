// const expect = require('expect');
// var server = supertest.agent("http://localhost:3000");
const request = require('supertest');
const should = require("should");
const app = require('../bin/www').app;

describe('index.jsのテスト', function() {
    describe(' / へのGETリクエスト', function() {
      it('トップページが描画され200のステータスコードが返ってくること', function(done) {
        request(app)
        .get('/')
        .end((err, res)=>{
            if (err) return done(err);
            should(res.status).equal(200);
            should(res.statusType).equal(2);
            done();
        })
      });
    });
});