const express = require('express');
const router = express.Router();
const mysqlModels = require('../modules/mysqlModels');
const dateFormat = require('../modules/dateFormat');
const Promise = require('bluebird');

//　メッセージの新規作成処理
router.post('/:topicId/msg',(req, res, next) => {
    const rec = {
        message: req.body.msg,
        user_id: req.session.login.id,
        topic_id: req.params.topicId
    }
    // トランザクション処理でメッセージの保存・メッセージ数の更新を行う
    mysqlModels.Bookshelf.transaction( t => {
        return Promise.all([
            new mysqlModels.Message(rec).save(null, {transaction: t}),
            new mysqlModels.Message(rec).where('topic_id','=',req.params.topicId).fetchAll({transaction: t})
            .then((msgs)=>{
                return new mysqlModels.Topic().where('id','=',req.params.topicId).save({count: msgs.length + 1},{patch:true},{transaction: t});
            })
        ]).spread((msg)=>{
            // フロント側で使用するデータをレスポンスに追加する
            rec['user_name'] = req.session.login.name;
            rec['user_icon'] = req.session.login.icon;
            rec['messege_id'] = msg.attributes.id;
            rec['create_time'] = dateFormat.exec(new Date(msg.attributes.created_at));
            return rec;
        });
    }).then( rec => {
        res.status(201).json(rec);
    }).catch( err => {
        console.log(err);
        res.status(500).json({error: true, data: {messages: err.message}});
    });
});

//　メッセージの読み取り処理
router.get('/:topicId', (req, res, next) => {
    res.status(303).redirect('/topic/' + req.params.topicId + '/1');
});

router.get('/:topicId/:page', (req, res, next) => {
    if(req.session.login == null){
        res.status(303).redirect('/users/login');
    } else {
        let id = parseFloat(req.params.topicId);
        let pg = parseFloat(req.params.page);
        if (pg < 1) { pg = 1; }
        // パラメーターに紐付くトピック名とメッセージデータを取得する
        new mysqlModels.Topic().where('id','=',id)
        .fetch()
        .then( Record => {
            // ページネーションで1ページ当たり10個のメッセージデータを取得する
            new mysqlModels.Message().orderBy('created_at', 'DESC')
            .where('topic_id','=',id)
            .fetchPage({page:pg, pageSize:10, withRelated: ['user']})
            .then( collection => {
                const data = {
                    title: 'chatBoard',
                    NODE_NAME: process.env.NODE_NAME,
                    topicName: Record.attributes.name,
                    topicId: id,
                    login: req.session.login,
                    collection: collection.toArray().reverse(),
                    pagination: collection.pagination
                };
                res.status(200).render('inTopic', data);
            }).catch( err => {
                res.status(500).json({error: true, data: {messages: err.message}});
            });
        }).catch( err => {
            res.status(500).json({error: true, data: {messages: err.message}});
        })
    }
});

//　メッセージの上書き処理
router.put('/:topicId/msg',(req, res, next) => {
    new mysqlModels.Message().where('id','=',req.body.msgid)
    .save({message:req.body.msgdata},{patch:true})
    .then(()=>{
        res.status(204).json({message:'OK'});
    })
    .catch( err => {
        res.status(500).json({error: true, data: {messages: err.message}});
    });
});

//　メッセージの削除処理
router.delete('/:topicId/msg',(req, res, next) => {
    new mysqlModels.Message().where('id','=',req.body.msgid)
    .fetch()
    .then( msg => {
        msg.destroy();
        res.status(201).json({message:'OK'});
    })
    .catch( err => {
        res.status(500).json({error: true, data: {messages: err.message}});
    });
});

//　メッセージ編集時のメッセージデータ取得処理
router.post('/:topicId/editMsg',(req, res, next) => {
    new mysqlModels.Message().where('id','=',req.body.msgid)
    .fetch()
    .then( msg => {
        res.status(201).json(msg);
    })
    .catch( err => {
        res.status(500).json({error: true, data: {messages: err.message}});
    });
});

module.exports = router;
