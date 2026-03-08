require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Gift = require('./models/Gift');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'lovescape_secret_key',
    resave: false,
    saveUninitialized: false
}));

const mongoURI = process.env.MONGODB_URI;
if (mongoURI) {
    mongoose.connect(mongoURI)
        .then(() => console.log('✅ MongoDB Connected!'))
        .catch(err => console.error('❌ MongoDB Error:', err));
}

// --- အခြေခံ Routes များ ---
app.get('/', (req, res) => { res.render('index'); });

app.get('/register', (req, res) => { res.render('register', { error: null }); });

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

app.get('/login', (req, res) => { res.render('login', { error: null }); });

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.role = user.role; // <-- Admin ဟုတ်မဟုတ် မှတ်သားထားမည်
        res.redirect('/dashboard');
    } else {
        res.render('login', { error: 'Username သို့မဟုတ် Password မှားယွင်းနေပါသည်။' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/dashboard', async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    const user = await User.findById(req.session.userId);
    res.render('dashboard', { user, role: req.session.role });
});


// --- Admin Routes များ ---

// (၁) မိမိကိုယ်ကို Admin အဖြစ်ပြောင်းရန် လျှို့ဝှက်လမ်းကြောင်း
app.get('/make-me-admin/:username', async (req, res) => {
    const username = req.params.username;
    await User.findOneAndUpdate({ username: username }, { role: 'admin', isApproved: true });
    res.send(`<h3 style="color: green; text-align: center; margin-top: 50px;">✅ ${username} ကို Admin အဖြစ် ပြောင်းလဲပေးလိုက်ပါပြီ!</h3> <p style="text-align: center;"><a href="/logout">ကျေးဇူးပြု၍ Logout ထွက်ပြီး ပြန် Login ဝင်ပါ</a></p>`);
});

// (၂) Admin Panel စာမျက်နှာ
app.get('/admin', async (req, res) => {
    if (!req.session.userId || req.session.role !== 'admin') {
        return res.send('<h2 style="color:red; text-align:center; margin-top:50px;">Access Denied. Admin Only.</h2>');
    }
    const users = await User.find({});
    res.render('admin', { users, currentUser: req.session.username });
});

// (၃) User ကို Approve လုပ်ရန်
app.post('/admin/approve/:id', async (req, res) => {
    if (req.session.role !== 'admin') return res.redirect('/');
    await User.findByIdAndUpdate(req.params.id, { isApproved: true });
    res.redirect('/admin');
});

// (၄) User ကို Revoke (ခွင့်ပြုချက်ပြန်ရုပ်သိမ်းရန်)
app.post('/admin/revoke/:id', async (req, res) => {
    if (req.session.role !== 'admin') return res.redirect('/');
    await User.findByIdAndUpdate(req.params.id, { isApproved: false });
    res.redirect('/admin');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
