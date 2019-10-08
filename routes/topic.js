const express = require('express');
const router = express.Router();
const mysqlModels = require('../modules/mysqlModels');

//　メッセージの新規作成処理
router.post('/:topicId/msg',(req, res, next) => {
    const rec = {
        message: req.body.msg,
        user_id: req.session.login.id,
        topic_id: req.params.topicId
    }
    //　メッセージデータを保存した後、トピックテーブルのメッセージ数をカウントアップする
    mysqlModels.Bookshelf.transaction((t) => {
        return new mysqlModels.Message(rec).save(null, {transaction: t})
        .then((model) => {
            return new mysqlModels.Topic().where('id','=',req.params.topicId).fetch(null, {transaction: t})
            .then((topic) => {
                let cnt = topic.attributes.count + 1;
                return new mysqlModels.Topic().where('id','=',req.params.topicId).save({count: cnt},{patch:true},{transaction: t})
                .then(()=>{
                    // 現在時刻のフォーマットを整える
                    const date = new Date(model.attributes.created_at);
                    const dateYear = date.getFullYear();
                    const dateMonth = ((date.getMonth() + 1).toString().length == 1)?'0' + (date.getMonth() + 1):(date.getMonth() + 1);
                    const dateDate = (date.getDate().toString().length == 1)?'0' + date.getDate():date.getDate();
                    const dateHours = (date.getHours().toString().length == 1)?'0' + date.getHours():date.getHours();
                    const dateMinutes = (date.getMinutes().toString().length == 1)?'0' + date.getMinutes():date.getMinutes();
                    const dateSeconds = (date.getSeconds().toString().length == 1)?'0' + date.getSeconds():date.getSeconds(); 
                    const dateStr = dateYear + '-' + dateMonth + '-' + dateDate + ' ' + dateHours + ':' + dateMinutes + ':' + dateSeconds;
                    // フロント側で使用するデータをレスポンスに追加する
                    rec['user_name'] = req.session.login.name;
                    rec['user_icon'] = req.session.login.icon;
                    rec['messege_id'] = model.attributes.id;
                    rec['create_time'] = dateStr;
                    res.status(201).json(rec);
                }).catch(t.rollback);
            }).catch(t.rollback);
        }).catch(t.rollback);
    });
});

router.get('/:topicId', function(req, res, next) {
    res.status(303).redirect('/topic/' + req.params.topicId + '/1');
});

//　メッセージの読み取り処理
router.get('/:topicId/:page', function(req, res, next) {

if(req.session.login == null){
    res.status(303).redirect('/users/login');
} else {
    let id = parseFloat(req.params.topicId);
    let pg = parseFloat(req.params.page);
    if (pg < 1) { pg = 1; }
    // パラメーターに紐付くトピック名とメッセージデータを取得する
    new mysqlModels.Topic().where('id','=',id)
    .fetch()
    .then((Record) => {
        // ページネーションで1ページ当たり10個のメッセージデータを取得する
        new mysqlModels.Message().orderBy('created_at', 'DESC')
        .where('topic_id','=',id)
        .fetchPage({page:pg, pageSize:10, withRelated: ['user']})
        .then((collection) => {
            const data = {
            title: 'chatBoard',
            NODE_NAME: process.env.NODE_NAME,
            topicName: Record.attributes.name,
            topicId: id,
            login: {name: req.session.login.name, id: req.session.login.id, icon:req.session.login.icon, type:req.session.login.type},
            collection: collection.toArray().reverse(),
            pagination: collection.pagination
            };
            res.status(200).render('inTopic', data);
        }).catch((err) => {
            res.status(500).json({error: true, data: {messages: err.message}});
        });
    }).catch((err) => {
        res.status(500).json({error: true, data: {messages: err.message}});
    })
}
});

//　メッセージの上書き処理
router.put('/:topicId/msg',function(req, res, next){
    new mysqlModels.Message().where('id','=',req.body.msgid)
    .save({message:req.body.msgdata},{patch:true})
    .then(()=>{
        res.status(204).send('OK');
    })
    .catch((err) => {
        res.status(500).json({error: true, data: {messages: err.message}});
    });
});

//　メッセージの削除処理
router.delete('/:topicId/msg',function(req, res, next){
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
            .then(() =>{
                res.status(204).send('OK');
            })
            .catch((err) => {
                res.status(500).json({error: true, data: {messages: err.message}});
            });
        });
    });
});

//　メッセージ編集時のメッセージデータ取得処理
router.post('/:topicId/editMsg',function(req, res, next){
    new mysqlModels.Message().where('id','=',req.body.msgid)
    .fetch()
    .then((msg)=>{
        res.status(201).json(msg);
    })
    .catch((err) => {
        res.status(500).json({error: true, data: {messages: err.message}});
    });
});

module.exports = router;
