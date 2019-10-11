const express = require('express');
const router = express.Router();
const mysqlModels = require('../modules/mysqlModels');
const Promise = require('bluebird');

router.get('/', (req, res, next) => {
  res.status(302).redirect('/main');
});

router.get('/main', (req, res, next) => {
  res.status(302).redirect('/main/1');
});

// メインページの描画処理
router.get('/main/:page', (req, res, next) => {
	if(req.session.login == null){
		res.status(302).redirect('/users/login');
	} else {
		let pg = parseFloat(req.params.page);
		if (pg < 1) { pg = 1; }
		new mysqlModels.Topic().orderBy('updated_at', 'DESC')
		.fetchPage({page:pg, pageSize:10, withRelated: ['user']})
		.then( collection => {
			const data = {
				title: 'chatBoard',
				login: {name: req.session.login.name, id: req.session.login.id, type: req.session.login.type},
				collection: collection.toArray(),
				pagination: collection.pagination
			};
			res.status(200).render('index', data);
		}).catch( err => {
			res.status(404).json({error: true, data: {messages: err.message}});
		});
	}
});
// トピック削除処理
router.delete('/main/:topicid', (req, res, next) => {
	// トランザクション処理でトピックとトピックに紐付くメッセージの削除を行う
	mysqlModels.Bookshelf.transaction( t => {
		return Promise.all([
			new mysqlModels.Topic().orderBy('created_at', 'DESC').where('id', '=', req.params.topicid).fetch({transaction: t}),
			new mysqlModels.Message().orderBy('created_at', 'DESC').where('topic_id', '=', req.params.topicid).fetchAll({transaction: t})
		]).spread((topic, messages)=>{
			topic.destroy();
			msgObj = messages.toArray();
			for (let i of Object.keys(msgObj)) {
			msgObj[i].destroy();
			}
		});
	}).then(() => {
		res.status(204).send('OK');
	}).catch( err => {
		res.status(404).json({error: true, data: {messages: err.message}});
	});
});

// ログアウト処理
router.get('/main/logout',(req, res, next) => {
  res.status(302).redirect('/main');
});
router.post('/main/logout',(req, res, next) => {
  delete req.session.login;
  res.status(303).redirect('/users/login');
});

module.exports = router;
