const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }, // admin or user
    isApproved: { type: Boolean, default: false } // Admin က ခွင့်ပြုမှ true ဖြစ်မည်
});

module.exports = mongoose.model('User', UserSchema);
