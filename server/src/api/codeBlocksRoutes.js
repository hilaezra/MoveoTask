const express = require('express');
const router = express.Router();
const codeBlocksController = require('../../controllers/codeBlocksController');

router.route('/codeblocks').get(codeBlocksController.getAllCodeBlocks);
router.route('/codeblockdata/:blockId').get(codeBlocksController.getCodeBlockById);
router.route('/checksolution/:blockId').post(codeBlocksController.checkSolution);
router.route('/').get(codeBlocksController.sayHello);

module.exports = router;