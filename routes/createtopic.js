const express = require('express');
const router = express.Router();
const mysqlModels = require('../modules/mysqlModels');

router.get('/', function(req, res, next) {
    if(req.session.login == null){
        res.redirect('/users/login');
    } else {
        const data  = {
        title: 'chatBoard',
        form: {topicname:'',msg:''},
        content:''
        }
        res.render('createTopic', data);
    }
})

router.post('/', function(req, res, next) {

    const request = req;
    const response = res;
    req.check('topicname','トピック名 は必ず入力してください。').notEmpty();
    req.check('msg','ひと言 は必ず入力してください。').notEmpty();

    req.getValidationResult().then((result) => {
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
            response.render('createTopic', data);
        } else {
            const topicRec  = {
                name: request.body.topicname,
                user_id: request.session.login.id
            }
            new mysqlModels.Topic(topicRec).save().then(() => {
                new mysqlModels.Topic().orderBy('created_at', 'DESC')
                .where('user_id', '=', topicRec.user_id)
                .fetch().then((collection) => {
                    const messageRec = {
                        message: request.body.msg,
                        user_id: collection.attributes.user_id,
                        topic_id: collection.attributes.id
                    }
                    new mysqlModels.Message(messageRec).save().then(() => {
                        response.redirect('/main');
                    });
                });
            });
        };
    });
});

module.exports = router;