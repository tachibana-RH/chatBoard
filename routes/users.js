const express = require('express');
const router = express.Router();
const mysqlModels = require('../modules/mysqlModels');
const crypto = require('crypto');
const N = 16;

//　ログインページの描画処理
router.get('/login', function(req, res, next) {
  const data = {
    title: 'Login',
    form: {name:'',password:''},
    content:'※名前とパスワードを入力してください。※'
  }
  res.status(200).render('users/login', data);
});

//　ログイン処理
router.post('/login', function(req, res, next) {
  // バリデーションチェック（nullでないか）
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
      response.status(200).render('users/login', data);
    } else {
      const nm = req.body.name;
      const pw = req.body.password;
      mysqlModels.User.query({where: {name: nm}, andWhere: {password: pw}})
      .fetch()
      .then((model) => {
        if (model == null) {
          const data = {
            title: 'retry',
            content: '<p class="error">※名前またはパスワードが違います。※</p>',
            form: req.body
          }
          response.status(200).render('users/login',data);
        } else {
          request.session.login = model.attributes;
          request.session.login.password = crypto.randomBytes(N).toString('base64').substring(0, N);
          response.status(303).redirect('/main/1');
        }
      });
    }
  });
});

// ユーザー新規作成ページの描画処理
router.get('/add', function(req, res, next) {
  const data = {
    title: 'Create',
    form: {name:'',password:'',comment:''},
    content:'※登録する名前・パスワード・コメントを入力してください。※'
  }
  res.status(200).render('users/add', data);
});
// ユーザー新規作成実行処理
router.post('/add', function(req, res, next) {
  // バリデーションチェック（nullでないか）
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
      response.status(200).render('users/add', data);
    } else {
      // 同名のユーザーが存在しない時新規作成を行う
      const nm = req.body.name;
      mysqlModels.User.query({where: {name: nm}})
      .fetch()
      .then((model) => {
        if (model == null) {
          request.session.login = null;
          new mysqlModels.User(req.body).save().then(() => {
            response.status(303).redirect('/main');
          });
        } else {
          const data = {
            title: 'Create',
            form: req.body,
            content:'<a class="error">※すでに利用されているユーザー名です※</a>'
          }
          res.status(200).render('users/add', data);
        }
      });
    }
  });
});

module.exports = router;
