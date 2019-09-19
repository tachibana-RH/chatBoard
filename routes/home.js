var express = require('express');
var router = express.Router();
const multer = require('multer');
var path = require('path')

var mysql = require('mysql');

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

Bookshelf.plugin('pagination');

var User = Bookshelf.Model.extend({
  tableName: 'users'
});

var Message = Bookshelf.Model.extend({
  tableName: 'messages',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(User);
  }
});

router.get('/', (req,res,next) => {
    res.redirect('/');
});

router.get('/:id', (req,res,next) => {
    res.redirect('/home/' + req.params.id + '/1');
});

router.get('/:id/:page', (req,res,next) => {

    if (req.session.login == null) {
        res.redirect('/users/login');
    } else {
        let id = req.params.id;
        id *= 1;
        let pg = req.params.page;
        pg *= 1;
        if (pg < 1) {
            pg = 1;
        }
        new Message().orderBy('created_at','DESC')
        .where('user_id','=',id)
        .fetchPage({page:pg, pageSize:10, withRelated: ['user']})
        .then((collection) => {
            const data = {
                title: 'chatBoard',
                login: req.session.login,
                user_id: id,
                collection: collection.toArray(),
                pagination: collection.pagination
            };
            res.render('home', data);
        }).catch((err) => {
            res.status(500).json({error: true, data: {message: err.message}});
        });
    }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    cb(null, req.session.login.id + '-' + Date.now() + path.extname(file.originalname))
  }
})

// アップロードディレクトリを設定したmulterモジュール
const uploadDir = multer({ storage: storage });

router.post('/:id/upload', uploadDir.single('uploadfile'), (req, res) => {

  console.log('アップロードしたファイル名： ' + req.file.originalname);
  console.log('保存されたパス：' + req.file.path);
  console.log('保存されたファイル名： ' + req.file.filename);

  new User().where('id','=',req.params.id)
  .save({icon: req.file.filename},{patch:true})
  .then((result) =>{
    console.log(result);
    req.session.login.icon = req.file.filename;
    res.redirect('./');
  })
  .catch((err) => {
    res.status(500).json({error: true, data: {messages: err.message}});
    res.redirect('./');
  });
});

module.exports = router;
