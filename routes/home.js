const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path')
const mysqlModels = require('../modules/mysqlModels');


router.get('/', (req,res,next) => {
    res.redirect('/');
});

router.get('/:id', (req,res,next) => {
    res.redirect('/home/' + req.params.id + '/message' + '/1');
});

router.get('/:id/:contents/:page', (req,res,next) => {

  if (req.session.login == null) {
      res.redirect('/users/login');
  } else {
      let id = parseFloat(req.params.id);
      let pg = parseFloat(req.params.page);
      if (pg < 1) { pg = 1; }

      if (req.params.contents == 'message') {
        new mysqlModels.Message().orderBy('created_at','DESC')
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
        new mysqlModels.Topic().orderBy('updated_at','DESC')
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
});
const uploadDir = multer({ storage: storage });

router.post('/:id/:contents/image/upload', uploadDir.single('uploadfile'), (req, res) => {

  new mysqlModels.User().where('id','=',req.params.id)
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
