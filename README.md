# Minta Maaf ke Nabila 💕

Project sederhana untuk minta maaf ke pacar tersayang dengan WhatsApp chat simulator.

## Features

### Main Page (index.html)
- ✨ WhatsApp-style chat simulator
- 💬 Auto-playing conversation dengan typing indicator
- 🎯 Interactive choice buttons dengan branching paths
- 📸 Easter egg: Polaroid memories (klik foto profil)
- 📝 Notes paper yang muncul saat user maafin
- 📱 Responsive design untuk semua device

### Admin Dashboard (admin.html)
- 📊 **Activity Monitoring System**
- 🎯 Track visitor actions (visit, forgive, angry, second-chance, reject)
- ⏰ Timestamp lengkap (tanggal & jam)
- 💻 Device & Browser detection
- 🔍 Filter by action & date
- 📥 Export logs to CSV
- 🗑️ Clear all logs function
- ⚡ Auto-refresh setiap 30 detik
- 🎨 Monokrom terminal-style UI

## URLs

- **Main Page**: `http://localhost:3000/index.html` atau `/`
- **Admin Dashboard**: `http://localhost:3000/admin.html`

## Admin Dashboard Features

### Statistics Cards
- Total Visits
- Total Forgave
- Total Still Angry
- Total Second Chances

### Activity Logs Table
Menampilkan:
- Timestamp lengkap
- Date & Time terpisah
- Action yang dilakukan (dengan badge warna)
- Device type (Mobile/Tablet/Desktop)
- Browser yang digunakan
- Screen resolution
- Location (timezone)
- Language preference
- Referrer source
- **Delete button per row** (🗑️)

### Actions Tracked
1. **Visit** 👁️ - User membuka halaman
2. **Maafin** ❤️ - User klik "Iya, aku maafin"
3. **Kesel** � - User klik "Masih kesel"
4. **Second Chance** 💕 - User klik "Oke deh, aku maafin" (kedua kali)
5. **Reject** ❌ - User klik "Masih belum mau maafin"

### Controls
- **🔄 Reload Page** - Reload halaman admin (real-time sync tetap jalan, tidak perlu manual reload)
- **📥 Export CSV** - Download logs sebagai CSV file (atau Ctrl+E)
- **🗑️ Clear All Logs** - Hapus semua data log
- **🗑️ Delete per row** - Hapus log individual di setiap baris

### Filters
- Filter by Action type
- Filter by Date
- Clear Filters button

## Tech Stack

- HTML5
- CSS3 (Pure CSS, no frameworks)
- Vanilla JavaScript
- **Firebase Realtime Database** untuk real-time logging
- LocalStorage untuk fallback

## Setup

### 1. Setup Firebase (REQUIRED untuk real-time logging)
Ikuti panduan lengkap di **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)**

Quick steps:
1. Buat project di https://console.firebase.google.com/
2. Setup Realtime Database
3. Copy config ke `firebase-config.js`
4. Update database rules

### 2. Jalankan Local Server
```bash
python -m http.server 3000
```

### 3. Akses Aplikasi
- Main: http://localhost:3000
- Admin: http://localhost:3000/admin.html

### 4. Deploy ke Public
```bash
# Menggunakan Vercel (Recommended)
vercel

# Atau Firebase Hosting
firebase deploy --only hosting
```

## File Structure

```
mintaMaaf/
├── index.html          # Main chat page
├── admin.html          # Admin dashboard
├── style.css           # Main styles
├── script.js           # Chat logic + logging system
├── README.md           # Documentation
└── image/              # Assets folder
    ├── wallpaperWAdefault.jpg
    ├── foto1.jpg
    ├── foto2.jpg
    ├── foto3.jpg
    └── foto4.jpg
```

## Real-time Logging System

### Firebase Integration
- ✅ Data tersimpan di **cloud database** (Firebase Realtime DB)
- ✅ **Real-time sync** - Admin langsung lihat aktivitas user
- ✅ **Accessible anywhere** - Bisa diakses dari device mana saja
- ✅ **Automatic backup** - Data aman tersimpan di cloud
- ✅ **No manual refresh** - Auto-update setiap ada aktivitas baru

### Fallback Mode
- Jika Firebase belum di-setup, otomatis pakai LocalStorage
- Data tetap tersimpan lokal di browser
- Manual refresh setiap 30 detik

### Data Captured
- Timestamp lengkap
- User action (visit, forgive, angry, etc)
- Device type & browser
- Screen resolution
- Timezone/Location
- Session ID (unique per visit)
- User Agent
- Referrer URL

## Keyboard Shortcuts (Admin)

- `Ctrl + R` - Reload page
- `Ctrl + E` - Export to CSV

---

Made with ❤️ for Nabila
