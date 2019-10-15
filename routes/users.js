const express = require('express');
const router = express.Router();
const mysqlModels = require('../modules/mysqlModels');

//　ログインページの描画処理
router.get('/login', (req, res, next) => {
	const data = {
		title: 'Login',
		form: {name:'',password:''},
		content:'※名前とパスワードを入力してください。※'
	}
	res.status(200).render('users/login', data);
});

//　ログイン処理
router.post('/login', (req, res, next) => {
	// バリデーションチェック（nullでないか）
	const request = req;
	const response = res;
	req.check('name','NAME を入力してください。').notEmpty();
	req.check('password','PASSWORD を入力してください。').notEmpty();
	
	req.getValidationResult().then( result => {
		if (!result.isEmpty()) {
			let content = '<ul class="error">';
			const result_arr = result.array();
			for (let index in result_arr) {
				content += '<li>' + result_arr[index].msg + '</li>';
			}
			content += '</ul>';
			const data = {
				title: 'Login',
				content: content,
				form: req.body
			}
			response.status(200).render('users/login', data);
		} else {
			const nm = req.body.name;
			const pw = req.body.password;
			mysqlModels.User.query({where: {name: nm}, andWhere: {password: pw}})
			.fetch()
			.then( model => {
				if (model == null) {
					const data = {
						title: 'retry',
						content: '<p class="error">※名前またはパスワードが違います。※</p>',
						form: req.body
					}
					response.status(401).render('users/login',data);
				} else {
					request.session.login = model.attributes;
					request.session.login.password = 'secret';
					response.status(303).redirect('/main/1');
				}
			});
		}
	});
});

const crypto = require('crypto');
const N = 24;

// ゲストユーザーのログイン処理
router.post('/guestlogin', (req, res, next) => {
	const cookie = req.cookies;
	const guest_token = crypto.randomBytes(N).toString('base64').substring(0, N);
	if (cookie.guest_token === undefined) {
		res.cookie("guest_token", guest_token, {maxAge: 14 * 24 * 60 * 60 * 1000});
		const guestdata = {
			token: guest_token,
			name: 'ゲスト',
			password: 'guest',
			comment: 'ゲストユーザーです。',
			icon: null,
			type: 'guest'
		}
		new mysqlModels.User(guestdata).save().then( model => {
			req.session.login = model.attributes;
			res.status(303).redirect('/main/1');
		});
	} else {
		//セッション内のトークン更新とDB内のトークン更新を行う
		//トランザクションによってどちらかが失敗したらロールバックする
		mysqlModels.Bookshelf.transaction( t => {
			return new mysqlModels.User().where('token','=',cookie.guest_token).fetch({transaction: t})
			.then( model => {
				req.session.login = model.attributes;
				req.session.login.token = guest_token;
				return new mysqlModels.User().where('token','=',cookie.guest_token).save({token:guest_token},{patch:true},{transaction: t});
			});
		}).then(() => {
			res.cookie("guest_token", guest_token, {maxAge: 14 * 24 * 60 * 60 * 1000});
			res.status(303).redirect('/main/1');
		}).catch( err => {
			console.log(err);
			res.status(400).json({error: true, data: {messages: err.message}});
		});
	}
});

// ユーザー新規作成ページの描画処理
router.get('/add', (req, res, next) => {
  const data = {
    title: 'Create',
    form: {name:'',password:'',comment:''},
    content:'※登録する名前・パスワード・コメントを入力してください。※'
  }
  res.status(200).render('users/add', data);
});

// ユーザー新規作成実行処理
router.post('/add', (req, res, next) => {
	// バリデーションチェック（nullでないか）
	const request = req;
	const response = res;
	req.check('name','NAME を入力してください。').notEmpty();
	req.check('name','NAME は10文字以内で指定してください。').isLength({max:10});
	req.check('password','PASSWORD を入力してください。').notEmpty();
	req.check('password','PASSWORD は8文字以上で入力してください。').isLength({min:8});
	req.check('comment','COMMENT を入力してください。').notEmpty();

	req.getValidationResult().then( result => {
		if (!result.isEmpty()) {
			let content = '<ul class="error">';
			const result_arr = result.array();
			for (let index in result_arr) {
				content += '<li>' + result_arr[index].msg + '</li>';
			}
			content += '</ul>';
			const data = {
				title: 'Create',
				content: content,
				form: req.body
			}
			response.status(200).render('users/add', data);
		} else {
			// 同名のユーザーが存在しない場合は新規作成を行う
			const nm = req.body.name;
			mysqlModels.User.query({where: {name: nm}})
			.fetch()
			.then( model => {
				if (model == null && nm != 'ゲスト') {
					request.session.login = null;
					new mysqlModels.User(req.body).save().then(() => {
						response.status(303).redirect('/users/login');
					});
				} else {
					const data = {
						title: 'Create',
						form: req.body,
						content:'<a class="error">※すでに利用されているか使用不可のユーザー名です※</a>'
					}
					res.status(200).render('users/add', data);
				}
			});
		}
	});
});

module.exports = router;
