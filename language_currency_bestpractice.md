# language_currency_bestpractice.md

Checklist Best Practice — Language (ID/EN) & Currency (IDR/USD)
Project: Baketrack (Dashboard + Google Sheet as DB)

> Tujuan checklist ini:
>
> - Fitur Bahasa & Mata Uang konsisten di seluruh UI + data
> - Tidak merusak perhitungan Report (omzet/laba/grafik)
> - Google Sheet tetap jadi "single source of truth"
> - Aman dari bug format angka (10.000 vs 10,000), rounding, dan mismatch kurs

---

## [Scope & Product Rules]

1. [ ] Definisikan dengan jelas: fitur bahasa hanya untuk UI (label/teks), bukan mengubah isi transaksi.
2. [ ] Definisikan dengan jelas: fitur currency untuk tampilan saja atau memengaruhi penyimpanan nilai.
3. [ ] Tentukan 1 aturan tunggal: nilai uang di database disimpan sebagai:
   - [ ] angka murni (number) tanpa format (disarankan), bukan string "10.000"
4. [ ] Tentukan field mana yang wajib currency-aware:
   - [ ] harga_jual, harga_modal, total, omzet, laba
5. [ ] Tentukan apakah transaksi bisa campur mata uang:
   - [ ] Jika tidak boleh: currency global (per user/app) dan semua transaksi mengikuti
   - [ ] Jika boleh: currency per transaksi + logic report harus grouping/konversi
6. [ ] Tentukan definisi "laba": (harga_jual - harga_modal) \* qty (konsisten di seluruh app)
7. [ ] Tentukan rounding rule (mis. 2 desimal untuk USD) dan konsisten di input, penyimpanan, dan report.

---

## [i18n Architecture (Bahasa)]

8. [ ] Semua teks UI memakai dictionary/translation file (bukan hardcode di komponen).
9. [ ] Struktur key translation konsisten (mis. `nav.report`, `form.qty`, `stats.totalRevenue`).
10. [ ] Ada fallback language (default Indonesia) jika key tidak ditemukan.
11. [ ] Tidak ada string campuran (ID + EN) dalam satu komponen.
12. [ ] Semua format tanggal mengikuti locale:
    - [ ] ID: `dd MMM yyyy` (contoh: 30 Jan 2026)
    - [ ] EN: `MMM dd, yyyy` (contoh: Jan 30, 2026)
13. [ ] Semua angka non-uang mengikuti locale (separator ribuan/desimal) tanpa mengubah nilai aslinya.

---

## [Currency Data Model & Google Sheet Design]

14. [ ] Google Sheet punya kolom yang jelas dan stabil (tidak berubah nama seenaknya).
15. [ ] Kolom angka disimpan sebagai number (bukan string berformat).
16. [ ] Format tampilan (titik/koma, simbol mata uang) hanya dilakukan di UI, bukan saat menyimpan.
17. [ ] Kolom transaksi minimal yang disarankan:
    - [ ] date (ISO / serial)
    - [ ] product_id atau product_name
    - [ ] qty (number)
    - [ ] price_sell (number)
    - [ ] price_cost (number)
    - [ ] total (number) = qty \* price_sell (boleh dihitung di backend/UI tapi disimpan sebagai number)
    - [ ] currency (optional tapi disarankan jika multi-currency)
18. [ ] Kolom Product minimal:
    - [ ] product_id
    - [ ] product_name
    - [ ] price_sell (number)
    - [ ] price_cost (number)
    - [ ] currency (kalau produk beda currency)
19. [ ] Tidak ada formula yang “mengubah data mentah” di Google Sheet (jaga agar sheet sebagai DB, bukan logic utama).
20. [ ] Jika memakai formula untuk report di sheet, pastikan UI tetap bisa hitung ulang tanpa bergantung formula (fallback).

---

## [Currency Formatting in UI (IDR/USD)]

21. [ ] Semua uang diformat menggunakan formatter berbasis locale:
    - [ ] IDR: `Rp 10.000` (tanpa desimal, default)
    - [ ] USD: `$10,000.00` (2 desimal)
22. [ ] Tidak ada formatting manual (regex/string concat) untuk menambah titik/koma; gunakan formatter.
23. [ ] Input uang memakai:
    - [ ] mask/formatter saat mengetik (user friendly)
    - [ ] parse ke number sebelum submit
24. [ ] Parsing input uang wajib tahan terhadap:
    - [ ] "10.000" (ID)
    - [ ] "10,000.00" (EN)
    - [ ] "10000" (plain)
25. [ ] UI menampilkan placeholder yang benar sesuai currency (contoh IDR: 10.000, USD: 10,000.00).
26. [ ] Semua card statistik (omzet/laba/total bayar) ikut currency formatter yang sama.

---

## [Exchange Rate (Kurs) Rules — jika Currency Toggle mengubah nilai]

> Bagian ini WAJIB hanya jika toggle USD/IDR berarti konversi nilai.

27. [ ] Sumber kurs ditentukan (manual input / API) dan dicatat di sistem.
28. [ ] Kurs memiliki timestamp (kapan dipakai).
29. [ ] Konversi hanya dilakukan di layer display atau layer report, bukan merusak data mentah.
30. [ ] Ada aturan pembulatan (rounding) yang konsisten setelah konversi.
31. [ ] Di report, label jelas: "Converted with rate X on date Y".
32. [ ] Jika kurs gagal diambil, sistem fallback:
    - [ ] pakai kurs terakhir
    - [ ] atau disable toggle dengan pesan yang jelas

---

## [Report Integrity (Omzet/Laba/Grafik)]

33. [ ] Report mengambil data mentah dari Sheet dan menghitung:
    - [ ] omzet = sum(total)
    - [ ] laba = sum((price_sell - price_cost) \* qty)
34. [ ] Jika multi-currency tanpa konversi:
    - [ ] report tidak boleh menjumlah mata uang berbeda; harus grouping per currency
35. [ ] Jika multi-currency dengan konversi:
    - [ ] report boleh dijumlah setelah konversi (jelas rate-nya)
36. [ ] Grafik mingguan memperhitungkan timezone & start-of-week (Senin vs Minggu) dan konsisten untuk ID/EN.
37. [ ] Filter tanggal / minggu tidak rusak karena locale (pastikan parsing date stabil).
38. [ ] Download report (CSV) menyimpan angka sebagai raw number + currency field (jangan menyimpan "Rp 10.000" sebagai string).

---

## [State Management (User Preference)]

39. [ ] Bahasa & currency preference tersimpan (minimal):
    - [ ] localStorage (simple)
    - [ ] atau di sheet/user settings (kalau multi device)
40. [ ] Default language & currency jelas (misal ID + IDR).
41. [ ] Toggle bahasa/currency tidak menyebabkan rerender yang merusak input (nilai tidak hilang).
42. [ ] Saat user switch language, hanya text berubah; angka tetap sama (kecuali memang ada konversi kurs).
43. [ ] Saat user switch currency (tanpa konversi), hanya simbol/format berubah, bukan nilai mentah.

---

## [Security & Access (karena pakai Google Sheet)]

44. [ ] Credential Google (service account / token) tidak pernah ditaruh di client-side.
45. [ ] Akses sheet dilakukan via backend/API route/server action (bukan langsung dari browser).
46. [ ] Login melindungi semua halaman dashboard (route guard).
47. [ ] Pastikan data tidak bisa dibaca tanpa login (cek direct URL `/report`).
48. [ ] CORS/Origin dibatasi jika ada API endpoint publik.
49. [ ] Rate limit dasar untuk endpoint write (menghindari spam/bot input).

---

## [UX & Edge Cases]

50. [ ] Tampilkan indikator jelas saat sheet belum connect / permission error.
51. [ ] Tombol refresh menunjukkan status loading dan waktu last synced.
52. [ ] Validasi input:
    - [ ] qty > 0
    - [ ] harga >= 0
    - [ ] currency selected valid
53. [ ] Empty state untuk report (kalau belum ada transaksi).
54. [ ] Error message bilingual (mengikuti language setting).
55. [ ] Pastikan icon, label, dan satuan konsisten setelah switch language/currency.

---

## [Testing Checklist]

56. [ ] Test input IDR: ketik `10.000` → tersimpan sebagai `10000` (number) di Sheet.
57. [ ] Test input USD: ketik `10,000.00` → tersimpan sebagai `10000` (number) di Sheet.
58. [ ] Test report: omzet/laba sama antara refresh pertama dan setelah refresh ulang.
59. [ ] Test toggle language: semua nav, label form, card stat, table header berubah.
60. [ ] Test toggle currency:
    - [ ] tanpa konversi: hanya format berubah
    - [ ] dengan konversi: nilai berubah sesuai rate + rounding rule
61. [ ] Test export CSV: angka tidak berubah jadi string berformat.
62. [ ] Test akses tanpa login: redirect ke login.
63. [ ] Test permission sheet: tampilkan error yang jelas (tidak blank page).

---

## [Delivery Notes]

64. [ ] Dokumentasikan di README:
    - [ ] aturan penyimpanan angka di sheet
    - [ ] apakah multi-currency per transaksi atau global
    - [ ] rule kurs (jika ada)
    - [ ] cara menambah bahasa baru (structure translation file)
65. [ ] Pastikan semua perubahan scope language/currency tercatat sebagai phase/feature terpisah (menghindari scope creep).

---
