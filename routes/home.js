const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path')

const mysql = require('mysql');

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

Bookshelf.plugin('pagination');

const User = Bookshelf.Model.extend({
  tableName: 'users'
});

const Message = Bookshelf.Model.extend({
  tableName: 'messages',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(User);
  }
});

const Topic = Bookshelf.Model.extend({
  tableName: 'topics',
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

// router.get('/:id/:page', (req,res,next) => {

//     if (req.session.login == null) {
//         res.redirect('/users/login');
//     } else {
//         let id = req.params.id;
//         id *= 1;
//         let pg = req.params.page;
//         pg *= 1;
//         if (pg < 1) {
//             pg = 1;
//         }
//         new Message().orderBy('created_at','DESC')
//         .where('user_id','=',id)
//         .fetchPage({page:pg, pageSize:10, withRelated: ['user']})
//         .then((collection) => {
//             const data = {
//                 title: 'chatBoard',
//                 login: req.session.login,
//                 user_id: id,
//                 collection: collection.toArray(),
//                 pagination: collection.pagination
//             };
//             res.render('home', data);
//         }).catch((err) => {
//             res.status(500).json({error: true, data: {message: err.message}});
//         });
//     }
// });

router.get('/:id/:contents/:page', (req,res,next) => {

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

      if (req.params.contents == 'message') {
        new Message().orderBy('created_at','DESC')
        .where('user_id','=',id)
        .fetchPage({page:pg, pageSize:10, withRelated: ['user']})
        .then((collection) => {
            const data = {
                title: 'chatBoard',
                login: req.session.login,
                user_id: id,
                contents: req.params.contents,
                collection: collection.toArray(),
                pagination: collection.pagination
            };
            res.render('home', data);
        }).catch((err) => {
            res.status(500).json({error: true, data: {message: err.message}});
        });
      } else {
        new Topic().orderBy('updated_at','DESC')
        .where('user_id','=',id)
        .fetchPage({page:pg, pageSize:10, withRelated: ['user']})
        .then((collection) => {
            const data = {
                title: 'chatBoard',
                login: req.session.login,
                user_id: id,
                contents: req.params.contents,
                collection: collection.toArray(),
                pagination: collection.pagination
            };
            res.render('home', data);
        }).catch((err) => {
            res.status(500).json({error: true, data: {message: err.message}});
        });
      }
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

// アップロードディレクトリをmulterモジュールに設定
const uploadDir = multer({ storage: storage });

router.post('/:id/upload', uploadDir.single('uploadfile'), (req, res) => {

  console.log('アップロードしたファイル名： ' + req.file.originalname);
  console.log('保存されたパス：' + req.file.path);
  console.log('保存されたファイル名： ' + req.file.filename);

  new User().where('id','=',req.params.id)
  .save({icon: req.file.filename},{patch:true})
  .then((result) =>{
    req.session.login.icon = req.file.filename;
    res.json(result);
  })
  .catch((err) => {
    res.status(500).json({error: true, data: {messages: err.message}});
  });
});

module.exports = router;
