var express = require('express');
var router = express.Router();

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
// Bookshelf.plugin('bookshelf-update');

var User = Bookshelf.Model.extend({
  tableName: 'users'
});

var Topic = Bookshelf.Model.extend({
  tableName: 'topics',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(User);
  }
});

var Message = Bookshelf.Model.extend({
  tableName: 'messages',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(User);
  }
});

var TopicMessage = Bookshelf.Model.extend({
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
            title: 'miniBoard',
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
      title: 'miniBoard',
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
            console.log(result.toJSON());
            res.status(303);
            res.redirect('./1');
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
              title: 'miniBoard',
              topicName: Record.attributes.name,
              login: {name: req.session.login.name, id: req.session.login.id},
              collection: collection.toArray().reverse(),
              pagination: collection.pagination
            };
            res.render('topic', data);
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
