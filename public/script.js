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

// --- Sequence Logic ---
setTimeout(() => { document.getElementById('countdown').innerText = '2'; }, 1000);
setTimeout(() => { document.getElementById('countdown').innerText = '1'; }, 2000);

setTimeout(() => {
    document.getElementById('countdown-container').classList.add('hidden');
    document.getElementById('message-container').classList.remove('hidden');
}, 3000);

setTimeout(() => {
    document.getElementById('message-container').classList.add('hidden');
    document.getElementById('gallery-container').classList.remove('hidden');
    clearInterval(matrixInterval); // Stop matrix to focus on photos
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}, 6000);

// --- Gallery Logic ---
const photos = [
    { src: 'https://via.placeholder.com/300x400/ffb6c1/ffffff?text=Photo+1', text: 'အတူတူရှိနေပေးလို့ ကျေးဇူးပါ...' },
    { src: 'https://via.placeholder.com/300x400/87ceeb/ffffff?text=Photo+2', text: 'အမြဲတမ်း ပြုံးနေပါ...' },
    { src: 'https://via.placeholder.com/300x400/98fb98/ffffff?text=Photo+3', text: 'အရမ်းချစ်တယ်နော် ❤️' }
];
let currentIndex = 0;

document.getElementById('next-btn').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % photos.length;
    const imgElement = document.getElementById('gallery-img');
    const textElement = document.getElementById('gallery-text');
    
    imgElement.style.opacity = 0;
    setTimeout(() => {
        imgElement.src = photos[currentIndex].src;
        textElement.innerText = photos[currentIndex].text;
        imgElement.style.opacity = 1;
    }, 300);
});
