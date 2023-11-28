const express = require('express');
const router = express.Router();
const chatController = require('../controller/chatController')

router.post('/postChat', chatController.methodPost)
router.get('/getChat', chatController.methodGet)

module.exports = router