const express = require('express');
const router = express.Router();
const mysqlModels = require('../modules/mysqlModels');

router.get('/', (req,res,next) => {
    res.status(302).redirect('/main/1');
});

router.get('/:id', (req,res,next) => {
    res.status(302).redirect('/home/' + req.params.id + '/message' + '/1');
});

// マイページ画面の描画処理
router.get('/:id/:contents/:page', (req,res,next) => {

	if (req.session.login == null) {
		res.status(302).redirect('/main/1');
	} else {
		let id = parseFloat(req.params.id);
		let pg = parseFloat(req.params.page);
		if (pg < 1) { pg = 1; }
		new mysqlModels.User().where('id','=',id).fetch()
		.then( user => {
		// コンテンツごとに描画処理を分岐する
		if (req.params.contents == 'message') {
			// メッセージ履歴の描画処理
			new mysqlModels.Message().orderBy('created_at','DESC')
			.where('user_id','=',id)
			.fetchPage({page:pg, pageSize:10, withRelated: ['user']})
			.then( collection => {
				const data = {
					title: 'chatBoard',
					login: req.session.login,
					userdata: user,
					contents: req.params.contents,
					collection: collection.toArray(),
					pagination: collection.pagination
				};
				res.status(200).render('home', data);
			}).catch( err => {
				res.status(404).json({error: true, data: {message: err.message}});
			});
		} else {
			// トピック作成履歴の描画処理
			new mysqlModels.Topic().orderBy('updated_at','DESC')
			.where('user_id','=',id)
			.fetchPage({page:pg, pageSize:10, withRelated: ['user']})
			.then( collection => {
				const data = {
					title: 'chatBoard',
					login: req.session.login,
					userdata: user,
					contents: req.params.contents,
					collection: collection.toArray(),
					pagination: collection.pagination
				};
				res.status(200).render('home', data);
			}).catch( err => {
				res.status(404).json({error: true, data: {message: err.message}});
			});
		}
		}).catch( err => {
			res.status(404).json({error: true, data: {message: err.message}});
		});
	}
});

// アイコン画像アップロード処理
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // アップロードした画像の保存場所をプロジェクト内のimagesディレクトリへ変更する
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    // 保存時の画像ファイル名を変更する
    cb(null, req.session.login.id + '-' + Date.now() + path.extname(file.originalname))
  }
});
// 上記の設定をライブラリへ反映する
const uploadDir = multer({ storage: storage });

router.post('/:id/:contents/image/upload', uploadDir.single('uploadfile'), (req, res) => {
	new mysqlModels.User().where('id','=',req.params.id)
	.save({icon: req.file.filename},{patch:true})
	.then( result => {
		// 保存したファイル名を該当ユーザーのセッションへ設定
		req.session.login.icon = req.file.filename;
		res.status(201).json(result);
	})
	.catch( err => {
		res.status(404).json({error: true, data: {messages: err.message}});
	});
});

module.exports = router;
