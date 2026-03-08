const mongoose = require('mongoose');

const GiftSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiverName: { type: String, default: 'My Love' },
    messages: [{ type: String }],
    photos: [{ type: String }],
    uniqueUrl: { type: String, unique: true }
});

module.exports = mongoose.model('Gift', GiftSchema);
