// Chat conversation data
const conversation = [
    { type: 'received', text: 'Nabila...', delay: 2500, duration: 1500 },
    { type: 'received', text: 'Aku mau ngomong sesuatu', delay: 2000, duration: 2000 },
    { type: 'typing', duration: 5500 },
    { type: 'received', text: 'udah hari kedua kamu gak ngomong sama aku', delay: 0, duration: 500 },
    { type: 'received', text: 'Dan rasanya berat banget...', delay: 800, duration: 2000 },
    { type: 'typing', duration: 2000 },
    { type: 'received', text: 'Aku tau aku salah', delay: 0, duration: 1500 },
    { type: 'received', text: 'Aku tau aku masih belum sempurna jadi pacar kamu', delay: 0, duration: 2000 },
    { type: 'received', text: 'Masih banyak salah, masih banyak kurang', delay: 0, duration: 2000 },
    { type: 'typing', duration: 3000 },
    { type: 'received', text: 'Dan aku minta maaf buat semua itu 😔', delay: 0, duration: 2000 },
    { type: 'sticker', emoji: '🙏', delay: 0, duration: 4500 },
    { type: 'typing', duration: 3000 },
    { type: 'received', text: 'Tapi kamu harus tau...', delay: 0, duration: 1500 },
    { type: 'received', text: 'Setiap hari aku berusaha jadi lebih baik', delay: 0, duration: 2000 },
    { type: 'received', text: 'Untuk kamu ❤️', delay: 0, duration: 1500 },
    { type: 'typing', duration: 2000 },
    { type: 'received', text: 'Kamu itu berharga banget buat aku', delay: 0, duration: 2000 },
    { type: 'received', text: 'Makanya aku gak mau ngecewain kamu lagi', delay: 0, duration: 2000 },
    { type: 'sticker', emoji: '💝', delay: 0, duration: 1500 },
    { type: 'typing', duration: 2000 },
    { type: 'received', text: 'Aku bakal berusaha untuk:', delay: 0, duration: 1500 },
    { type: 'received', text: '✓ Lebih perhatian sama kamu', delay: 0, duration: 1200 },
    { type: 'received', text: '✓ Lebih pengertian', delay: 0, duration: 1200 },
    { type: 'received', text: '✓ Lebih menghargai kamu', delay: 0, duration: 1200 },
    { type: 'received', text: '✓ Selalu ada buat kamu', delay: 0, duration: 3200 },
    { type: 'received', text: 'Nabila, terima kasih udah sabar sama aku', delay: 0, duration: 2000 },
    { type: 'received', text: 'Terima kasih udah mau ada di hidup aku', delay: 0, duration: 2000 },
    { type: 'typing', duration: 2000 },
    { type: 'received', text: 'Rasanya berat banget gak bisa ngobrol sama kamu', delay: 0, duration: 2000 },
    { type: 'received', text: 'Padahal baru sehari...', delay: 0, duration: 1800 },
    { type: 'typing', duration: 2000 },
    { type: 'received', text: 'Maafin aku ya sayang... 🥺', delay: 0, duration: 2000 },
    { type: 'sticker', emoji: '😔', delay: 0, duration: 4500 },
    { type: 'typing', duration: 2500 },
    { type: 'question', 
      text: 'Kamu mau ga maafin aku dan ngobrol sama aku lagi?', 
      options: [
        { text: 'Iya, aku maafin ❤️', response: 'maafin' },
        { text: 'Masih kesel 😠', response: 'kesel' }
      ],
      delay: 0,
      duration: 0
    }
];

let currentMessage = 0;
let chatStarted = false;

// ========== FIREBASE REALTIME LOGGING SYSTEM ==========
let firebaseInitialized = false;
let database = null;

// Initialize Firebase
function initFirebase() {
    try {
        if (window.firebaseConfig && firebase) {
            firebase.initializeApp(window.firebaseConfig);
            database = firebase.database();
            firebaseInitialized = true;
            console.log('🔥 Firebase initialized successfully');
        }
    } catch (error) {
        console.warn('⚠️ Firebase initialization failed, using localStorage fallback:', error);
        firebaseInitialized = false;
    }
}

// Call init on load
initFirebase();

function getDeviceInfo() {
    const ua = navigator.userAgent;
    let device = 'Desktop';
    
    if (/mobile/i.test(ua)) device = 'Mobile';
    else if (/tablet|ipad/i.test(ua)) device = 'Tablet';
    
    return device;
}

function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    
    // Urutan penting: cek yang paling spesifik dulu
    if (ua.includes('Edg')) browser = 'Edge'; // Edge menggunakan 'Edg' bukan 'Edge'
    else if (ua.includes('OPR') || ua.includes('Opera')) browser = 'Opera';
    else if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari'; // Safari di cek terakhir karena Chrome juga ada kata Safari
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('MSIE') || ua.includes('Trident')) browser = 'Internet Explorer';
    
    return browser;
}

function getSessionId() {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
}

function getUserIP() {
    // IP will be captured from server-side or third-party API
    return 'IP_' + Math.random().toString(36).substr(2, 9);
}

function logActivity(action) {
    const logEntry = {
        timestamp: Date.now(),
        action: action,
        device: getDeviceInfo(),
        browser: getBrowserInfo(),
        sessionId: getSessionId(),
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        referrer: document.referrer || 'Direct',
        url: window.location.href
    };
    
    // Try Firebase first, fallback to localStorage
    if (firebaseInitialized && database) {
        // Save to Firebase Realtime Database
        const logsRef = database.ref('activityLogs');
        logsRef.push(logEntry)
            .then(() => {
                console.log('🔥 Activity logged to Firebase:', action);
            })
            .catch((error) => {
                console.error('Firebase log error:', error);
                // Fallback to localStorage
                saveToLocalStorage(logEntry);
            });
    } else {
        // Fallback to localStorage
        saveToLocalStorage(logEntry);
    }
}

function saveToLocalStorage(logEntry) {
    const logs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
    logs.push(logEntry);
    localStorage.setItem('activityLogs', JSON.stringify(logs));
    console.log('� Activity logged to localStorage:', logEntry.action);
}

// Log initial visit
logActivity('visit');
// ========================================

// Update waktu real-time
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('current-time').textContent = `${hours}:${minutes}`;
}

updateTime();
setInterval(updateTime, 1000);

// Auto start chat setelah 2 detik
setTimeout(() => {
    startChat();
}, 2000);

function startChat() {
    if (chatStarted) return;
    chatStarted = true;
    
    // Status online dulu selama 5 detik
    document.querySelector('.status').textContent = 'online';
    setTimeout(() => {
        document.querySelector('.status').textContent = 'mengetik...';
        showNextMessage();
    }, 3000);
}

function showNextMessage() {
    if (currentMessage >= conversation.length) {
        // Status jadi online saat bubble pilihan muncul
        document.querySelector('.status').textContent = 'online';
        return;
    }

    const msg = conversation[currentMessage];
    const delayBeforeShow = msg.delay || 0;
    const durationToShow = msg.duration || 0;
    
    setTimeout(() => {
        if (msg.type === 'typing') {
            showTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                currentMessage++;
                showNextMessage();
            }, durationToShow);
        } else {
            addMessage(msg);
            setTimeout(() => {
                currentMessage++;
                showNextMessage();
            }, durationToShow);
        }
    }, delayBeforeShow);
}

function addMessage(msg) {
    const container = document.getElementById('chat-container');
    const wrapper = document.createElement('div');
    wrapper.className = `message-wrapper ${msg.type === 'sent' ? 'sent' : 'received'}`;
    
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${msg.type === 'sent' ? 'sent' : 'received'}`;
    
    if (msg.type === 'sticker') {
        wrapper.classList.add('sticker-wrapper');
        bubble.classList.add('sticker-message');
        bubble.innerHTML = `<div class="sticker">${msg.emoji}</div>`;
    } else if (msg.type === 'question') {
        bubble.classList.add('question-message');
        let buttonsHtml = '<div class="button-row">';
        msg.options.forEach(opt => {
            buttonsHtml += `<button class="choice-btn" onclick="handleAnswer('${opt.response}')">${opt.text}</button>`;
        });
        buttonsHtml += '</div>';
        
        bubble.innerHTML = `
            <div class="message-text">${msg.text}</div>
            <div class="message-time">${getCurrentTime()}</div>
            ${buttonsHtml}
        `;
    } else {
        bubble.innerHTML = `
            <div class="message-text">${msg.text}</div>
            <div class="message-time">
                ${getCurrentTime()}
                ${msg.type === 'sent' ? '<span class="checkmark">✓✓</span>' : ''}
            </div>
        `;
    }
    
    wrapper.appendChild(bubble);
    container.appendChild(wrapper);
    container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
    const container = document.getElementById('chat-container');
    const wrapper = document.createElement('div');
    wrapper.className = 'message-wrapper received';
    wrapper.id = 'typing-indicator';
    
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble received';
    bubble.innerHTML = `
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    
    wrapper.appendChild(bubble);
    container.appendChild(wrapper);
    container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

function handleAnswer(response) {
    // Log user action
    logActivity(response === 'maafin' ? 'forgive' : 'angry');
    
    // Disable semua button setelah diklik
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
    });
    
    // Status jadi mengetik lagi
    document.querySelector('.status').textContent = 'mengetik...';
    
    const container = document.getElementById('chat-container');
    
    // Tambahkan response user
    setTimeout(() => {
        const wrapper = document.createElement('div');
        wrapper.className = 'message-wrapper sent';
        
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble sent';
        
        if (response === 'maafin') {
            bubble.innerHTML = `
                <div class="message-text">Iya, aku maafin ❤️</div>
                <div class="message-time">
                    ${getCurrentTime()}
                    <span class="checkmark">✓✓</span>
                </div>
            `;
        } else {
            bubble.innerHTML = `
                <div class="message-text">Masih kesel 😠</div>
                <div class="message-time">
                    ${getCurrentTime()}
                    <span class="checkmark">✓✓</span>
                </div>
            `;
        }
        
        wrapper.appendChild(bubble);
        container.appendChild(wrapper);
        container.scrollTop = container.scrollHeight;
        
        // Response dari Salman
        showTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            
            const responseWrapper = document.createElement('div');
            responseWrapper.className = 'message-wrapper received';
            
            const responseBubble = document.createElement('div');
            responseBubble.className = 'chat-bubble received';
            
            if (response === 'maafin') {
                // Show notes paper
                document.getElementById('notes-paper').classList.remove('hidden');
                
                responseBubble.innerHTML = `
                    <div class="message-text">Makasih banget sayang! ❤️❤️❤️</div>
                    <div class="message-time">${getCurrentTime()}</div>
                `;
                
                responseWrapper.appendChild(responseBubble);
                container.appendChild(responseWrapper);
                container.scrollTop = container.scrollHeight;
                
                // Tambah sticker terima kasih
                setTimeout(() => {
                    const stickerWrapper = document.createElement('div');
                    stickerWrapper.className = 'message-wrapper received sticker-wrapper';
                    const stickerBubble = document.createElement('div');
                    stickerBubble.className = 'chat-bubble received sticker-message';
                    stickerBubble.innerHTML = `<div class="sticker">🥰</div>`;
                    stickerWrapper.appendChild(stickerBubble);
                    container.appendChild(stickerWrapper);
                    container.scrollTop = container.scrollHeight;
                    
                    // Tambah pesan terakhir
                    showTypingIndicator();
                    setTimeout(() => {
                        removeTypingIndicator();
                        
                        const finalWrapper = document.createElement('div');
                        finalWrapper.className = 'message-wrapper received';
                        const finalBubble = document.createElement('div');
                        finalBubble.className = 'chat-bubble received';
                        finalBubble.innerHTML = `
                            <div class="message-text">Aku janji bakal berusaha jadi lebih baik! I love you! 💕</div>
                            <div class="message-time">${getCurrentTime()}</div>
                        `;
                        finalWrapper.appendChild(finalBubble);
                        container.appendChild(finalWrapper);
                        container.scrollTop = container.scrollHeight;
                        
                        // Show secret message
                        setTimeout(() => {
                            const secretWrapper = document.createElement('div');
                            secretWrapper.className = 'message-wrapper received';
                            const secretBubble = document.createElement('div');
                            secretBubble.className = 'chat-bubble received';
                            secretBubble.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
                            secretBubble.innerHTML = `
                                <div class="message-text" style="color: white;">🔐 Psst... klik foto profil aku buat liat kenangan kita</div>
                                <div class="message-time" style="color: rgba(255,255,255,0.7);">${getCurrentTime()}</div>
                            `;
                            secretWrapper.appendChild(secretBubble);
                            container.appendChild(secretWrapper);
                            container.scrollTop = container.scrollHeight;
                            
                            document.querySelector('.status').textContent = 'offline';
                        }, 2000);
                    }, 2000);
                }, 1500);
                
            } else {
                responseBubble.innerHTML = `
                    <div class="message-text">Aku ngerti kok... 😔</div>
                    <div class="message-time">${getCurrentTime()}</div>
                `;
                
                responseWrapper.appendChild(responseBubble);
                container.appendChild(responseWrapper);
                container.scrollTop = container.scrollHeight;
                
                // Tambah pesan sedih
                setTimeout(() => {
                    showTypingIndicator();
                    setTimeout(() => {
                        removeTypingIndicator();
                        
                        const sadWrapper = document.createElement('div');
                        sadWrapper.className = 'message-wrapper received';
                        const sadBubble = document.createElement('div');
                        sadBubble.className = 'chat-bubble received';
                        sadBubble.innerHTML = `
                            <div class="message-text">Tapi tetep, aku akan tunggu kamu sampai kamu siap maafin aku</div>
                            <div class="message-time">${getCurrentTime()}</div>
                        `;
                        sadWrapper.appendChild(sadBubble);
                        container.appendChild(sadWrapper);
                        container.scrollTop = container.scrollHeight;
                        
                setTimeout(() => {
                    const stickerWrapper = document.createElement('div');
                    stickerWrapper.className = 'message-wrapper received sticker-wrapper';
                    const stickerBubble = document.createElement('div');
                    stickerBubble.className = 'chat-bubble received sticker-message';
                    stickerBubble.innerHTML = `<div class="sticker">💔</div>`;
                    stickerWrapper.appendChild(stickerBubble);
                    container.appendChild(stickerWrapper);
                    container.scrollTop = container.scrollHeight;
                            
                            setTimeout(() => {
                                const lastWrapper = document.createElement('div');
                                lastWrapper.className = 'message-wrapper received';
                                const lastBubble = document.createElement('div');
                                lastBubble.className = 'chat-bubble received';
                                lastBubble.innerHTML = `
                                    <div class="message-text">I love you, Nabila ❤️</div>
                                    <div class="message-time">${getCurrentTime()}</div>
                                `;
                                lastWrapper.appendChild(lastBubble);
                                container.appendChild(lastWrapper);
                                container.scrollTop = container.scrollHeight;
                                
                                // Secret message untuk bujuk
                                setTimeout(() => {
                                    const secretWrapper = document.createElement('div');
                                    secretWrapper.className = 'message-wrapper received';
                                    const secretBubble = document.createElement('div');
                                    secretBubble.className = 'chat-bubble received secret-bubble';
                                    secretBubble.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                                    secretBubble.style.cursor = 'pointer';
                                    secretBubble.innerHTML = `
                                        <div class="message-text" style="color: white;">Tapi... kamu yakin gak mau kasih kesempatan lagi? 🥺</div>
                                        <div class="message-time" style="color: rgba(255,255,255,0.7);">${getCurrentTime()}</div>
                                    `;
                                    secretWrapper.appendChild(secretBubble);
                                    container.appendChild(secretWrapper);
                                    container.scrollTop = container.scrollHeight;

                                    
                                    // Tambahin tombol second chance
                                    setTimeout(() => {
                                        const chanceWrapper = document.createElement('div');
                                        chanceWrapper.className = 'message-wrapper received';
                                        const chanceBubble = document.createElement('div');
                                        chanceBubble.className = 'chat-bubble received question-message';
                                        chanceBubble.innerHTML = `
                                            <div class="message-text">Aku janji bakal berusaha lebih keras lagi...</div>
                                            <div class="message-time">${getCurrentTime()}</div>
                                            <div class="button-row">
                                                <button class="choice-btn second-chance" onclick="giveSecondChance()">Oke deh, aku maafin 💕</button>
                                                <button class="choice-btn-small reject-btn" onclick="stayMad()">Masih belum mau maafin</button>
                                            </div>
                                        `;
                                        chanceWrapper.appendChild(chanceBubble);
                                        container.appendChild(chanceWrapper);
                                        container.scrollTop = container.scrollHeight;
                                        
                                        // Status jadi online saat ada pilihan second chance
                                        document.querySelector('.status').textContent = 'online';
                                    }, 2000);
                                }, 3500);
                            }, 2000);
                        }, 1500);
                    }, 2000);
                }, 1500);
            }
        }, 2000);
    }, 500);
}

// Easter egg: klik foto profil
document.querySelector('.avatar').addEventListener('click', () => {
    document.getElementById('memory-overlay').classList.remove('hidden');
});

function closeMemory() {
    document.getElementById('memory-overlay').classList.add('hidden');
}

// Toggle notes paper (minimize/maximize on mobile)
function toggleNotes() {
    const notesPaper = document.getElementById('notes-paper');
    if (window.innerWidth <= 768) {
        notesPaper.classList.toggle('minimized');
    } else {
        notesPaper.classList.add('hidden');
    }
}

// Click on minimized notes to expand
document.addEventListener('DOMContentLoaded', () => {
    const notesPaper = document.getElementById('notes-paper');
    notesPaper.addEventListener('click', (e) => {
        if (notesPaper.classList.contains('minimized') && !e.target.classList.contains('notes-close')) {
            notesPaper.classList.remove('minimized');
        }
    });
});

// Klik di luar overlay untuk menutup
document.getElementById('memory-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'memory-overlay') {
        closeMemory();
    }
});

// Animasi polaroid
document.querySelectorAll('.polaroid').forEach(polaroid => {
    polaroid.addEventListener('click', function() {
        this.style.animation = 'stickerPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
});

// Function untuk second chance
function giveSecondChance() {
    // Log user action
    logActivity('second-chance');
    
    // Disable button
    document.querySelector('.second-chance').disabled = true;
    document.querySelector('.second-chance').style.opacity = '0.5';
    
    // Show notes paper
    document.getElementById('notes-paper').classList.remove('hidden');
    
    // Status jadi mengetik lagi
    document.querySelector('.status').textContent = 'mengetik...';
    
    const container = document.getElementById('chat-container');
    
    // User response
    setTimeout(() => {
        const wrapper = document.createElement('div');
        wrapper.className = 'message-wrapper sent';
        
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble sent';
        bubble.innerHTML = `
            <div class="message-text">Oke deh, aku maafin 💕</div>
            <div class="message-time">
                ${getCurrentTime()}
                <span class="checkmark">✓✓</span>
            </div>
        `;
        
        wrapper.appendChild(bubble);
        container.appendChild(wrapper);
        container.scrollTop = container.scrollHeight;
        
        // Salman's happy response
        showTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            
            const responseWrapper = document.createElement('div');
            responseWrapper.className = 'message-wrapper received';
            
            const responseBubble = document.createElement('div');
            responseBubble.className = 'chat-bubble received';
            responseBubble.innerHTML = `
                <div class="message-text">YESSS! Makasih banyak sayanggg!! 😭❤️❤️❤️</div>
                <div class="message-time">${getCurrentTime()}</div>
            `;
            
            responseWrapper.appendChild(responseBubble);
            container.appendChild(responseWrapper);
            container.scrollTop = container.scrollHeight;
            
            // Happy sticker
            setTimeout(() => {
                const stickerWrapper = document.createElement('div');
                stickerWrapper.className = 'message-wrapper received sticker-wrapper';
                const stickerBubble = document.createElement('div');
                stickerBubble.className = 'chat-bubble received sticker-message';
                stickerBubble.innerHTML = `<div class="sticker">🥳</div>`;
                stickerWrapper.appendChild(stickerBubble);
                container.appendChild(stickerWrapper);
                container.scrollTop = container.scrollHeight;
                
                // Final message
                setTimeout(() => {
                    showTypingIndicator();
                    setTimeout(() => {
                        removeTypingIndicator();
                        
                        const finalWrapper = document.createElement('div');
                        finalWrapper.className = 'message-wrapper received';
                        const finalBubble = document.createElement('div');
                        finalBubble.className = 'chat-bubble received';
                        finalBubble.innerHTML = `
                            <div class="message-text">Aku janji gak bakal ngecewain kamu lagi! I love you so much! 💕</div>
                            <div class="message-time">${getCurrentTime()}</div>
                        `;
                        finalWrapper.appendChild(finalBubble);
                        container.appendChild(finalWrapper);
                        container.scrollTop = container.scrollHeight;
                        
                        // Secret easter egg message
                        setTimeout(() => {
                            const secretWrapper = document.createElement('div');
                            secretWrapper.className = 'message-wrapper received';
                            const secretBubble = document.createElement('div');
                            secretBubble.className = 'chat-bubble received';
                            secretBubble.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
                            secretBubble.innerHTML = `
                                <div class="message-text" style="color: white;">🔐 Psst... klik foto profil aku buat liat kenangan kita</div>
                                <div class="message-time" style="color: rgba(255,255,255,0.7);">${getCurrentTime()}</div>
                            `;
                            secretWrapper.appendChild(secretBubble);
                            container.appendChild(secretWrapper);
                            container.scrollTop = container.scrollHeight;
                            
                            document.querySelector('.status').textContent = 'offline';
                        }, 2000);
                    }, 2000);
                }, 1500);
            }, 1500);
        }, 2000);
    }, 500);
}

// Function kalau tetep gak mau maafin
function stayMad() {
    // Log user action
    logActivity('reject');
    
    // Disable buttons
    document.querySelectorAll('.second-chance, .reject-btn').forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
    });
    
    // Status jadi mengetik lagi
    document.querySelector('.status').textContent = 'mengetik...';
    
    const container = document.getElementById('chat-container');
    
    // User response
    setTimeout(() => {
        const wrapper = document.createElement('div');
        wrapper.className = 'message-wrapper sent';
        
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble sent';
        bubble.innerHTML = `
            <div class="message-text">Masih belum mau maafin</div>
            <div class="message-time">
                ${getCurrentTime()}
                <span class="checkmark">✓✓</span>
            </div>
        `;
        
        wrapper.appendChild(bubble);
        container.appendChild(wrapper);
        container.scrollTop = container.scrollHeight;
        
        // Salman's sad response
        showTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            
            const responseWrapper = document.createElement('div');
            responseWrapper.className = 'message-wrapper received';
            
            const responseBubble = document.createElement('div');
            responseBubble.className = 'chat-bubble received';
            responseBubble.innerHTML = `
                <div class="message-text">Oke... aku ngerti 😢</div>
                <div class="message-time">${getCurrentTime()}</div>
            `;
            
            responseWrapper.appendChild(responseBubble);
            container.appendChild(responseWrapper);
            container.scrollTop = container.scrollHeight;
            
            setTimeout(() => {
                showTypingIndicator();
                setTimeout(() => {
                    removeTypingIndicator();
                    
                    const finalWrapper = document.createElement('div');
                    finalWrapper.className = 'message-wrapper received';
                    const finalBubble = document.createElement('div');
                    finalBubble.className = 'chat-bubble received';
                    finalBubble.innerHTML = `
                        <div class="message-text">Aku akan terus nunggu sampai kamu siap. Take your time, sayang ❤️</div>
                        <div class="message-time">${getCurrentTime()}</div>
                    `;
                    finalWrapper.appendChild(finalBubble);
                    container.appendChild(finalWrapper);
                    container.scrollTop = container.scrollHeight;
                    
                    setTimeout(() => {
                        const stickerWrapper = document.createElement('div');
                        stickerWrapper.className = 'message-wrapper received sticker-wrapper';
                        const stickerBubble = document.createElement('div');
                        stickerBubble.className = 'chat-bubble received sticker-message';
                        stickerBubble.innerHTML = `<div class="sticker">😔</div>`;
                        stickerWrapper.appendChild(stickerBubble);
                        container.appendChild(stickerWrapper);
                        container.scrollTop = container.scrollHeight;
                        
                        setTimeout(() => {
                            document.querySelector('.status').textContent = 'offline';
                        }, 1000);
                    }, 1500);
                }, 2500);
            }, 1500);
        }, 2500);
    }, 500);
}

console.log('💬 Chat dimulai... Buat Nabila tersayang 💝');
