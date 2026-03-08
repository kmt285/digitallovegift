require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');

// Models များကို ခေါ်ယူခြင်း
const User = require('./models/User');
const Gift = require('./models/Gift');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // Form data ဖတ်ရန်
app.use(express.json());

// Session Setup
app.use(session({
    secret: 'lovescape_secret_key',
    resave: false,
    saveUninitialized: false
}));

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;
if (mongoURI) {
    mongoose.connect(mongoURI)
        .then(() => console.log('✅ MongoDB Connected!'))
        .catch(err => console.error('❌ MongoDB Error:', err));
}

// --- Routes ---

// ပင်မစာမျက်နှာ (Home)
app.get('/', (req, res) => {
    res.render('index');
});

// Register စာမျက်နှာ
app.get('/register', (req, res) => {
    res.render('register', { error: null });
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.render('register', { error: 'Username ရှိပြီးသားဖြစ်နေပါသည်။' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.redirect('/login');
    } catch (err) {
        res.render('register', { error: 'အမှားအယွင်းဖြစ်ပေါ်နေပါသည်။' });
    }
});

// Login စာမျက်နှာ
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user._id;
        req.session.username = user.username;
        res.redirect('/dashboard');
    } else {
        res.render('login', { error: 'Username သို့မဟုတ် Password မှားယွင်းနေပါသည်။' });
    }
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Dashboard စာမျက်နှာ (Login ဝင်ထားမှ ဝင်ခွင့်ပြုမည်)
app.get('/dashboard', async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    
    const user = await User.findById(req.session.userId);
    res.render('dashboard', { user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
