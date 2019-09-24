const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const crypto = require('crypto');
const N = 16

const knex = require('knex') ({
  client: 'mysql',
  connection: {
    host    : process.env.CHATBOARD_DB_HOST,
    user    : process.env.CHATBOARD_DB_USER,
    password: process.env.CHATBOARD_DB_PASSWORD,
    database: process.env.CHATBOARD_DB_NAME,
    charset : 'utf8'
  }
});

const Bookshelf = require('bookshelf')(knex);

const User = Bookshelf.Model.extend({
  tableName: 'users'
});

router.get('/login', function(req, res, next) {
  const data = {
    title: 'Login',
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
        title: 'Login',
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
          response.redirect('/main/1');
        }
      });
    }
  });
});

/* GET users listing. */
router.get('/add', function(req, res, next) {
  const data = {
    title: 'Create',
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
        title: 'Create',
        content: content,
        form: req.body
      }
      response.render('users/add', data);
    } else {
      const nm = req.body.name;
      const pw = req.body.password;
      User.query({where: {name: nm}, andWhere: {password: pw}})
      .fetch()
      .then((model) => {
        if (model == null) {
          request.session.login = null;
          new User(req.body).save().then((model) => {
            response.redirect('/');
          });
        } else {
          const data = {
            title: 'Create',
            form: {name: req.body.name,password: req.body.password,comment: req.body.comment},
            content:'<a class="error">※すでに利用されているユーザー名です※</a>'
          }
          res.render('users/add', data);
        }
      });
    }
  });
});

module.exports = router;
