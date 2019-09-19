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

const TopicMessage = Bookshelf.Model.extend({
  tableName: 'topics',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(Message);
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
    .fetchPage({page:pg, pageSize:10})
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

router.post('/main/createTopic', function(req, res, next) {
  if(req.session.login == null){
    res.redirect('/users/login');
  } else {
    const data  = {
      title: 'chatBoard',
      topicName: req.body.topicname
    }
    res.render('createTopic', data);
  }
})

router.post('/main/:topicId/sendMsg',function(req, res, next){
  var rec = {
    message: req.body.msg,
    user_id: req.session.login.id,
    topic_id: req.params.topicId
  }
  new Message(rec).save().then((model) => {
    new Topic().where('id','=',req.params.topicId)
    .fetch()
    .then((topic) => {
      let cnt = topic.attributes.count + 1;
      new Topic().where('id','=',req.params.topicId)
      .save({count: cnt},{patch:true})
      .then((result) =>{
        console.log(result);
        rec['user_name'] = req.session.login.name;
        rec['user_icon'] = req.session.login.icon;
        res.json(rec);
      })
      .catch((err) => {
        res.status(500).json({error: true, data: {messages: err.message}});
        res.redirect('./1');
      });
    });
  });
});

router.get('/main/:topicId/:page', function(req, res, next) {

  if(req.session.login == null){
    res.redirect('/users/login');
  } else {
    let id = req.params.topicId;
    let pg = req.params.page;
    pg *= 1;
    if (pg < 1) {
      pg = 1;
    }
    new Topic().where('id','=',id)
    .fetch()
    .then((Record) => {
      new Message().orderBy('created_at', 'DESC')
      .where('topic_id','=',id)
      .fetchPage({page:pg, pageSize:10, withRelated: ['user']})
      .then((collection) => {
        const data = {
          title: 'chatBoard',
          topicName: Record.attributes.name,
          topicId: id,
          login: {name: req.session.login.name, id: req.session.login.id, icon:req.session.login.icon},
          collection: collection.toArray().reverse(),
          pagination: collection.pagination
        };
        res.render('inTopic', data);
      }).catch((err) => {
        res.status(500).json({error: true, data: {messages: err.message}});
        res.redirect('/main');
      });
    }).catch((err) => {
      res.redirect('/main');
    })
  }
});

router.post('/main/createTopic/submit', function(req, res, next) {
  const topicRec  = {
    name: req.body.topicname,
    user_id: req.session.login.id
  }
  new Topic(topicRec).save().then((model) => {
    new Topic().orderBy('created_at', 'DESC')
    .where('user_id', '=', topicRec.user_id)
    .fetch().then((collection) => {
      const messageRec = {
        message: req.body.msg,
        user_id: collection.attributes.user_id,
        topic_id: collection.attributes.id
      }
      new Message(messageRec).save().then((model) => {
        res.redirect('/main');
      });
    });
  });
})

router.get('/logout',function(req, res, next){
  res.redirect('/main');
});

router.post('/logout',function(req, res, next){
  delete req.session.login;
  res.redirect('/users/login');
});

module.exports = router;
