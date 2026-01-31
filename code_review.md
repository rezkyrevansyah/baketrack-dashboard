# 🛡️ Code Review Checklist (Final – Strict & Practical)

Checklist ini adalah standar WAJIB untuk memastikan project:

- Rapi
- Maintainable
- Aman
- Siap dikembangkan

AI agent BOLEH refactor, tapi:
❌ DILARANG merusak flow utama
❌ DILARANG mengubah arsitektur besar
✅ Refactor harus bertahap & terkontrol

---

## 0️⃣ NON-NEGOTIABLE RULES

- [ ] Semua file source code (TS / TSX / JS / JSX) **WAJIB ≤ 200 baris**
- [ ] Jika ada file > 200 baris → **HARUS dipecah**
- [ ] Flow utama tetap berjalan:
  - input → simpan → tampil → report / export
- [ ] Build & deploy tetap sukses
- [ ] Jika ragu terhadap perubahan → **JANGAN diubah**

---

## 1️⃣ Keterbacaan (Readability)

- [ ] **Penamaan Deskriptif:** Variabel, fungsi, dan komponen menjelaskan tujuannya
- [ ] Tidak ada nama ambigu (`data`, `temp`, `process`, `handler`)
- [ ] **Self-Explanatory:** Kode mudah dipahami tanpa komentar berlebihan
- [ ] **Konsistensi:** Naming convention & indentasi konsisten
- [ ] Tidak ada nested logic berlebihan (if / loop terlalu dalam)

---

## 2️⃣ Desain & Arsitektur (Clean Code & SOLID – Praktis)

### SRP — Single Responsibility

- [ ] Satu file fokus pada satu tanggung jawab utama
- [ ] Komponen UI hanya mengurus tampilan & interaksi
- [ ] Logic bisnis (kalkulasi, rule) tidak bercampur di UI
- [ ] Integrasi eksternal (Google Sheet / API) tidak langsung di UI

### OCP & DIP (Versi Aman)

- [ ] Logic utama tidak “terkunci” ke detail Google Sheet
- [ ] Ada lapisan fungsi / service / wrapper sebelum ke API eksternal
- [ ] Use-case tidak memanggil Google API secara langsung

### DRY & KISS

- [ ] Tidak ada logika yang diulang-ulang
- [ ] Formatter (uang, tanggal, parsing angka) hanya satu sumber
- [ ] Tidak membuat abstraksi berlebihan yang memperumit kode

---

## 3️⃣ Ukuran File & Fungsi (WAJIB)

- [ ] Semua file **≤ 200 baris**
- [ ] Jika file terlalu panjang:
  - [ ] Pecah berdasarkan tanggung jawab (SRP)
  - [ ] Ekstrak sub-komponen UI
  - [ ] Pindahkan helper / formatter / mapper ke file terpisah
- [ ] Fungsi:
  - [ ] Fokus satu tugas
  - [ ] Idealnya ramping (±20–30 baris)
  - [ ] Tidak ada “God Function”

---

## 4️⃣ Logika & Performa

- [ ] Tidak ada nested loop yang tidak perlu
- [ ] Tidak ada perhitungan berat di render UI
- [ ] Data report tidak dihitung ulang tanpa kebutuhan
- [ ] Fetch data dilakukan seperlunya (tidak berulang tanpa alasan)

---

## 5️⃣ Validasi & Error Handling

- [ ] Semua input user divalidasi sebelum diproses
- [ ] Menangani edge case:
  - null / undefined
  - string kosong
  - tipe data tidak sesuai
- [ ] Parsing angka (contoh: `10.000`) dilakukan dengan aman & konsisten
- [ ] Error API / backend tidak silent
- [ ] UI punya state: loading / error / empty

---

## 6️⃣ Keamanan & Kebersihan (Security & Hygiene)

- [ ] **No Hardcoded Secrets:** Tidak ada API key / credential di kode
- [ ] Environment variable diambil dari `.env`
- [ ] Akses Google Sheet hanya lewat server / backend
- [ ] Tidak ada unused import, variabel, atau fungsi
- [ ] Komentar hanya menjelaskan **MENGAPA**, bukan **APA**

---

## 7️⃣ Login & Proteksi (Jika Ada)

- [ ] Password tidak disimpan plaintext
- [ ] Session / auth aman (httpOnly, protected routes)
- [ ] Dashboard tidak bisa diakses tanpa login

---

## 8️⃣ Final Quality Gate

- [ ] Semua file ≤ 200 baris ✅
- [ ] Tidak ada duplikasi logic yang jelas
- [ ] Kode lebih rapi dari sebelumnya
- [ ] Tidak ada breaking change
- [ ] Project siap dilanjutkan / dikembangkan

---

## 📌 Aturan Eksekusi untuk AI Agent

1. Prioritas utama: **stability > correctness > readability**
2. Refactor dilakukan bertahap, bukan sekaligus
3. Setelah refactor, flow utama WAJIB dites
4. Jika tidak yakin → jangan diubah

## Setelah selesai review buatkan list hasilnya dalam bentuk tabel
