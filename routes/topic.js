const express = require('express');
const router = express.Router();
const mysqlModels = require('../modules/mysqlModels');

router.post('/:topicId/sendMsg',function(req, res, next){
const rec = {
    message: req.body.msg,
    user_id: req.session.login.id,
    topic_id: req.params.topicId
}
new mysqlModels.Message(rec).save().then((model) => {
    new mysqlModels.Topic().where('id','=',req.params.topicId)
    .fetch()
    .then((topic) => {
    let cnt = topic.attributes.count + 1;
    new mysqlModels.Topic().where('id','=',req.params.topicId)
    .save({count: cnt},{patch:true})
    .then((result) =>{
        console.log(result);
        rec['user_name'] = req.session.login.name;
        rec['user_icon'] = req.session.login.icon;
        rec['messege_id'] = model.id;
        res.json(rec);
    })
    .catch((err) => {
        res.status(500).json({error: true, data: {messages: err.message}});
        res.redirect('./1');
    });
    });
});
});

router.post('/:topicId/deleteMsg',function(req, res, next){
    new mysqlModels.Message().where('id','=',req.body.msgid)
    .fetch()
    .then((msg)=>{
        msg.destroy();
    })
    .then(()=>{
        new mysqlModels.Topic().where('id','=',req.params.topicId)
        .fetch()
        .then((topic) => {
            let cnt = topic.attributes.count - 1;
            new mysqlModels.Topic().where('id','=',req.params.topicId)
            .save({count: cnt},{patch:true})
            .then((result) =>{
                res.json(result);
            })
            .catch((err) => {
                res.status(500).json({error: true, data: {messages: err.message}});
                res.redirect('./1');
            });
        });
    });
});

router.post('/:topicId/editMsg',function(req, res, next){
    new mysqlModels.Message().where('id','=',req.body.msgid)
    .fetch()
    .then((msg)=>{
        res.json(msg);
    })
    .catch((err) => {
        res.status(500).json({error: true, data: {messages: err.message}});
    });
});

router.post('/:topicId/retouchMsg',function(req, res, next){
    new mysqlModels.Message().where('id','=',req.body.msgid)
    .save({message:req.body.msgdata},{patch:true})
    .then((result)=>{
        res.json(result);
    })
    .catch((err) => {
        res.status(500).json({error: true, data: {messages: err.message}});
    });
});

router.get('/:topicId', function(req, res, next) {
    res.redirect('/topic/' + req.params.topicId + '/1');
});

router.get('/:topicId/:page', function(req, res, next) {

if(req.session.login == null){
    res.redirect('/users/login');
} else {
    let id = parseFloat(req.params.topicId);
    let pg = parseFloat(req.params.page);
    if (pg < 1) { pg = 1; }

    new mysqlModels.Topic().where('id','=',id)
    .fetch()
    .then((Record) => {
        new mysqlModels.Message().orderBy('created_at', 'DESC')
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

module.exports = router;
