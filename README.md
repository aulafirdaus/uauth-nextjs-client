# UAuth Next.js Client

Package ini adalah *custom provider* OIDC untuk [Auth.js](https://authjs.dev/) (sebelumnya NextAuth.js) yang dirancang khusus untuk mempermudah developer jika projectnya menggunakan ekosistem **Next.js**.

💡 **Referensi & Inspirasi:** 
Ide pembuatan *package* ini berasal dari *package* Laravel Socialite [ataufik135/uauth-oidc-client](https://github.com/ataufik135/uauth-oidc-client). Karena aslinya dibuat untuk Laravel, *package* ini hadir untuk memberikan kemudahan dan fungsionalitas yang identik (seperti pengecekan keamanan `pkce`, `state`, dan `nonce` yang sesuai standar) tapi 100% *native* untuk ekosistem Next.js!

---

## 📦 Cara Instalasi

Karena *package* ini bergantung pada Auth.js, pastikan Anda telah menginstal `next-auth` (versi beta untuk App Router) terlebih dahulu.

```bash
# Instal next-auth (jika belum ada)
npm install next-auth@beta

# Instal package ini
npm install uauth-nextjs-client
```

## 🛠️ Cara Penggunaan

Gunakan *package* ini persis seperti *provider* bawaan NextAuth (Google, GitHub, dll).

Buat atau modifikasi file `auth.ts` Anda:

```typescript
import NextAuth from "next-auth"
import UAuth from "uauth-nextjs-client"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    UAuth({
      // Ambil nilai ini dari Environment Variables (.env.local) Anda
      issuer: process.env.UAUTH_BASE_URL!,
      clientId: process.env.UAUTH_CLIENT_ID!,
      clientSecret: process.env.UAUTH_CLIENT_SECRET!,
    }),
  ],
})
```

### Konfigurasi Environment Variables

Jangan lupa mengatur nilai variabel di dalam `.env.local` proyek Anda:

```env
AUTH_SECRET="random_string_acak_panjang"
UAUTH_BASE_URL="https://auth.namadomain.com"
UAUTH_CLIENT_ID="client_id_anda"
UAUTH_CLIENT_SECRET="client_secret_anda"
```

### Callback URL

Pastikan Anda mendaftarkan Callback URL berikut ini ke dalam *dashboard* Client UAuth Anda:
`http://localhost:3000/api/auth/callback/uauth` (untuk lokal) atau `https://domain-anda.com/api/auth/callback/uauth` (untuk *production*).

---

## Fitur

- 🚀 Dibangun di atas standar `OIDC` (OpenID Connect).
- 🔒 Menggunakan `PKCE`, `State`, dan `Nonce` secara bawaan untuk keamanan yang ketat.
- 📘 Dukungan TypeScript 100% (*Autocompletion* penuh di Editor Anda).
- ⚡ Kompatibel penuh dengan Next.js App Router dan Pages Router.
