const express = require('express');
const router = express.Router();
const mysqlModels = require('../modules/mysqlModels');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/main');
});

router.get('/main', function(req, res, next) {
  res.redirect('/main/1');
});

router.get('/main/:page', function(req, res, next) {

  if(req.session.login == null){
    res.redirect('/users/login');
  } else {
    let pg = parseFloat(req.params.page);
    if (pg < 1) { pg = 1; }
    
    new mysqlModels.Topic().orderBy('updated_at', 'DESC')
    .fetchPage({page:pg, pageSize:10, withRelated: ['user']})
    .then((collection) => {
      const data = {
        title: 'chatBoard',
        login: {name: req.session.login.name, id: req.session.login.id},
        collection: collection.toArray(),
        pagination: collection.pagination
      };
      res.render('index', data);
    }).catch((err) => {
      res.status(500).json({error: true, data: {messages: err.message}});
    });
  }
});

router.delete('/main/:topicid',function(req, res, next){
  new mysqlModels.Topic().orderBy('created_at', 'DESC')
  .where('id', '=', req.params.topicid)
  .fetch()
  .then((topic) => {
    new mysqlModels.Message().orderBy('created_at', 'DESC')
    .where('topic_id', '=', topic.id)
    .fetchAll()
    .then((messages) => {
      msgObj = messages.toArray();
      for (let i of Object.keys(msgObj)) {
        msgObj[i].destroy();
      }
      topic.destroy();
      res.send('OK');
    });
  }).catch((err) => {
    res.status(500).json({error: true, data: {messages: err.message}});
  });
});

router.get('/main/logout',function(req, res, next){
  res.redirect('/main');
});

router.post('/main/logout',function(req, res, next){
  delete req.session.login;
  res.send('OK');
});

module.exports = router;
