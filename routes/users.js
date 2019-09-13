var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var crypto = require('crypto');
const N = 16

var knex = require('knex') ({
  client: 'mysql',
  connection: {
    host    :'localhost',
    user    :'root',
    password:'',
    database:'miniboard-db',
    charset :'utf8'
  }
});

var Bookshelf = require('bookshelf')(knex);

var User = Bookshelf.Model.extend({
  tableName: 'users'
});

router.get('/login', function(req, res, next) {
  var data = {
    title: 'Users/Login',
    form: {name:'',password:''},
    content:'※名前とパスワードを入力してください。※'
  }
  res.render('users/login', data);
});

router.post('/login', function(req, res, next) {
  const request = req;
  const response = res;
  req.check('name','NAME は必ず入力してください。').notEmpty();
  req.check('password','PASSWORD は必ず入力してください。').notEmpty();

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      let content = '<ul class="error">';
      const result_arr = result.array();
      for (let index in result_arr) {
        content += '<li>' + result_arr[index].msg + '</li>';
      }
      content += '</ul>';

      const data = {
        title: 'Users/Login',
        content: content,
        form: req.body
      }
      response.render('users/login', data);
    } else {
      const nm = req.body.name;
      const pw = req.body.password;
      User.query({where: {name: nm}, andWhere: {password: pw}})
        .fetch()
        .then((model) => {
          if (model == null) {
            const data = {
              title: '再入力',
              content: '<p>名前またはパスワードが違います。</p>',
              form: req.body
            }
            response.render('users/login',data);
          } else {
            request.session.login = model.attributes;
            request.session.login.password = crypto.randomBytes(N).toString('base64').substring(0, N);
            const data = {
              title: 'Users/Login',
              content: '<p>ログインしました!<br>トップページに戻ってメッセージを送信してください。</p>',
              form: req.body
            }
            response.render('users/login',data);
          }
        });
    }
  });
});

/* GET users listing. */
router.get('/add', function(req, res, next) {
  var data = {
    title: 'Users/Add',
    form: {name:'',password:'',comment:''},
    content:'※登録する名前・パスワード・コメントを入力してください。※'
  }
  res.render('users/add', data);
});

router.post('/add', function(req, res, next) {
  const request = req;
  const response = res;
  req.check('name','NAME は必ず入力してください。').notEmpty();
  req.check('password','PASSWORD は必ず入力してください。').notEmpty();

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      let content = '<ul class="error">';
      const result_arr = result.array();
      for (let index in result_arr) {
        content += '<li>' + result_arr[index].msg + '</li>';
      }
      content += '</ul>';

      const data = {
        title: 'Users/Add',
        content: content,
        form: req.body
      }
      response.render('users/add', data);
    } else {
      request.session.login = null;
      new User(req.body).save().then((model) => {
        response.redirect('/');
      });
    }
  });
});

module.exports = router;
