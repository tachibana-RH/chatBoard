const request = require('supertest');
const should = require("should");
const app = require('../bin/www').app;

describe('home.jsのテスト', function() {
    describe(' / へのGETリクエスト', function() {
      it('「/main/1」へのリダイレクトによって302のステータスコードが返ってくること', function(done) {
        request(app)
        .get('/home')
        .end((err, res)=>{
            if (err) return done(err);
            should(res.status).equal(302);
            should(res.header.location).equal('/main/1');
            done();
        })
      });
    });
});