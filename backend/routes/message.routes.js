const router = require('express').Router();
const { getMessages, createMessage, markRead, deleteMessage } = require('../controllers/message.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getMessages);
router.post('/', createMessage);
router.patch('/:id/read', protect, markRead);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
