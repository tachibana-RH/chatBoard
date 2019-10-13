const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    const data = {title:'chatboard'};
	res.status(200).render('index', data);
});

module.exports = router;