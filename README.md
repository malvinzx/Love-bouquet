# Love Bouquet — Untuk My Queen ♡

Website buket bunga digital dengan animasi, surat personal, tema warna, partikel, dan efek suara.

## Cara menjalankan

1. Ekstrak folder `love-bouquet`.
2. Buka `index.html` di browser atau lewat Acode di Android.
3. Tekan **Mulai kejutan**. Browser biasanya baru mengizinkan audio setelah ada interaksi pertama, jadi tombol ini sekaligus mengaktifkan efek suara.

## Cara mengubah isi surat

Edit file **`surat.js`**. Di dalam `window.SURAT_CONFIG`, kamu bisa mengganti:

- `recipient`: nama penerima surat.
- `introTitle` dan `introSubtitle`: teks pada layar pembuka.
- `stageMessage`: teks yang tampil dekat buket.
- `title` dan `greeting`: judul surat serta sapaan.
- `paragraphs`: daftar paragraf isi surat. Setiap teks dalam tanda kutip menjadi paragraf tersendiri.
- `signoff`: penutup dan nama pengirim.
- `captions`: kalimat singkat yang muncul saat bunga atau hati disentuh.

Simpan `surat.js`, lalu muat ulang `index.html`. Surat dibangun dari file konfigurasi ini—tidak perlu mengedit `script.js` atau HTML.

## Efek suara

Efek suara dibuat langsung dengan **Web Audio API** (chime, bunga mekar, bunyi amplop, hati, dan peluk virtual), sehingga tidak perlu mengunduh file audio tambahan. Gunakan tombol **Suara aktif / Suara mati** untuk mengontrolnya. Jika perangkat sedang senyap atau browser memblokir audio, animasi tetap dapat berjalan.

## Berkas

- `index.html` — struktur halaman.
- `style.css` — tampilan, responsivitas, transisi, dan animasi CSS.
- `script.js` — animasi buket, partikel, interaksi, dan efek suara.
- `surat.js` — **file yang diedit untuk mengubah isi surat**.
