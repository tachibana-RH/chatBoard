const express = require('express');
const router = express.Router();
const mysqlModels = require('../modules/mysqlModels');

// トピック作成画面の描画処理
router.get('/', (req, res, next) => {
    if(req.session.login == null){
        res.status(302).redirect('/users/login');
    } else {
        const data  = {
        title: 'chatBoard',
        form: {topicname:'',msg:''},
        content:''
        }
        res.status(200).render('createTopic', data);
    }
})

// トピック新規作成処理
router.post('/', (req, res, next) => {
    // バリデーションチェック（nullでないか）
    const request = req;
    const response = res;
    req.check('topicname','トピック名 は必ず入力してください。').notEmpty();
    req.check('msg','ひと言 は必ず入力してください。').notEmpty();

    req.getValidationResult().then( result => {
        if (!result.isEmpty()) {
            let content = '<tr><th><ul class="error">';
            const result_arr = result.array();
            for (let index in result_arr) {
                content += '<li>' + result_arr[index].msg + '</li>';
            }
            content += '</ul></th></tr>';
            const data = {
                title: 'chatBoard',
                content: content,
                form: req.body
            }
            response.status(200).render('createTopic', data);
        } else {
            // トピックを保存し、保存後のIDと共にメッセージも保存する
            const topicRec  = {
                name: request.body.topicname,
                user_id: request.session.login.id,
                count: 1
            }
            mysqlModels.Bookshelf.transaction( t =>{
                return new mysqlModels.Topic(topicRec).save(null, {transaction: t})
                .then( topicRec => {
                    const messageRec = {
                        message: request.body.msg,
                        user_id: topicRec.attributes.user_id,
                        topic_id: topicRec.attributes.id
                    }
                    return new mysqlModels.Message(messageRec).save(null, {transaction: t});
                });
            }).then(() => {
                response.status(303).redirect('/main');
            }).catch( err => {
                res.status(400).json({error: true, data: {messages: err.message}});
            });
        }
    });
});

module.exports = router;