// --- Matrix Rain Effect ---
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth; canvas.height = window.innerHeight;
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*'.split('');
const fontSize = 16; const columns = canvas.width / fontSize;
const drops = []; for (let x = 0; x < columns; x++) drops[x] = 1;

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ff69b4'; ctx.font = fontSize + 'px monospace';
    for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
const matrixInterval = setInterval(drawMatrix, 33);

// --- Cinematic 3, 2, 1 Countdown ---
let count = 3;
const countdownEl = document.getElementById('countdown');
const countInterval = setInterval(() => {
    count--;
    if (count > 0) {
        countdownEl.innerText = count;
    } else {
        clearInterval(countInterval);
        document.getElementById('countdown-container').classList.add('hidden');
        document.getElementById('message-container').classList.remove('hidden');
        
        // ၃ စက္ကန့်ကြာလျှင် ဓာတ်ပုံများပြမည်
        setTimeout(() => {
            document.getElementById('message-container').classList.add('hidden');
            document.getElementById('gallery-container').classList.remove('hidden');
            clearInterval(matrixInterval);
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Effect ဖျောက်မည်
        }, 3000);
    }
}, 1000);

// --- Gallery Logic (Database မှ Data များကို အသုံးပြုခြင်း) ---
let currentIndex = 0;
document.getElementById('next-btn').addEventListener('click', () => {
    if (photosData.length === 0) return;
    
    currentIndex++;
    if (currentIndex >= photosData.length) currentIndex = 0;
    
    const imgElement = document.getElementById('gallery-img');
    const textElement = document.getElementById('gallery-text');
    
    imgElement.style.opacity = 0;
    setTimeout(() => {
        imgElement.src = photosData[currentIndex];
        // စာသားက ပုံအရေအတွက်ထက် နည်းနေလျှင် ရှိတဲ့စာသားကိုပဲ ပြန်ပတ်ပြမည်
        textElement.innerText = messagesData[currentIndex % messagesData.length] || '';
        imgElement.style.opacity = 1;
    }, 300);
});
