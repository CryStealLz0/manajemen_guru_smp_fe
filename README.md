# 📦 Project Setup Guide

Panduan lengkap untuk menjalankan proyek ini di lingkungan lokal.

---

## 🔧 1. Install Dependencies

Jalankan perintah berikut di terminal untuk meng-install semua package yang dibutuhkan:

```bash
npm install
```
---

# 🛠️ 2. Konfigurasi Database

1. Buka file services/apiFetch.js.
2. Sesuaikan pengaturannya dengan environment lokal kamu:
   - Ubah nilai BASE agar sesuai dengan port Backend (BE) kamu.
   - Atau gunakan file .env untuk menyimpannya secara aman.

---

# 🧱 3. Konfigurasi .env

1. Buka atau buat file .env di root proyek.
2. Tambahkan konfigurasi berikut: VITE_API_BASE=http://localhost:5000

Catatan: Sesuaikan port (5000) dengan port backend yang kamu gunakan.

---

# ▶️ 4. Menjalankan Proyek

Setelah semua konfigurasi selesai, jalankan proyek dengan perintah berikut:  
```bash
npm run dev
```
(Bisa di cek di package.json untuk konfigurasinya)

---

# ✅ Selesai!

Proyek sekarang siap dijalankan dan diuji di lingkungan lokal kamu.

---

# 📌 Catatan Tambahan

- Pastikan server/backend sudah berjalan sebelum menjalankan frontend.
- Jika menggunakan file .env, pastikan file tersebut sudah diisi dan disimpan dengan benar.
- Jika terjadi error koneksi, periksa kembali pengaturan port dan URL pada .env serta file apiFetch.js.