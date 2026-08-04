const Message = require('../models/Message');
const { sendContactEmail } = require('../utils/email');
const { success, error } = require('../utils/response');

const getMessages = async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  return success(res, { messages });
};

const createMessage = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return error(res, 'Name, email, and message are required', 400);
  }

  const saved = await Message.create({ name, email, phone, subject, message });

  // Send email — do not fail request if email fails
  sendContactEmail({ name, email, phone, subject, message }).catch(err =>
    console.error('Email send failed:', err.message)
  );

  return success(res, { message: saved }, 'Message sent successfully', 201);
};

const markRead = async (req, res) => {
  const msg = await Message.findByIdAndUpdate(
    req.params.id, { isRead: true }, { new: true }
  );
  if (!msg) return error(res, 'Message not found', 404);
  return success(res, { message: msg }, 'Marked as read');
};

const deleteMessage = async (req, res) => {
  const msg = await Message.findByIdAndDelete(req.params.id);
  if (!msg) return error(res, 'Message not found', 404);
  return success(res, null, 'Message deleted');
};

module.exports = { getMessages, createMessage, markRead, deleteMessage };
