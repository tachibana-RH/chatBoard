const express = require('express');
const router = express.Router();

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
// Bookshelf.plugin('bookshelf-update');

const User = Bookshelf.Model.extend({
  tableName: 'users'
});

const Topic = Bookshelf.Model.extend({
  tableName: 'topics',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(User);
  }
});

const Message = Bookshelf.Model.extend({
  tableName: 'messages',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(User);
  }
});

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
    let pg = req.params.page;
    pg *= 1;
    if (pg < 1) {
      pg = 1;
    }
    new Topic().orderBy('updated_at', 'DESC')
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

router.post('/main/delete/:topicid',function(req, res, next){
  new Topic().orderBy('created_at', 'DESC')
  .where('id', '=', req.params.topicid)
  .fetch()
  .then((topic) => {
    new Message().orderBy('created_at', 'DESC')
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
