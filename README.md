# UAuth Next.js Client

Package ini adalah *custom provider* OIDC untuk [Auth.js](https://authjs.dev/) (sebelumnya NextAuth.js) yang dirancang khusus untuk mempermudah developer jika projectnya menggunakan ekosistem **Next.js**.

**Referensi & Inspirasi:** 
Ide pembuatan *package* ini berasal dari *package* Laravel Socialite [ataufik135/uauth-oidc-client](https://github.com/ataufik135/uauth-oidc-client). Karena aslinya dibuat untuk Laravel, *package* ini hadir untuk memberikan kemudahan dan fungsionalitas yang identik tapi 100% *native* untuk ekosistem Next.js!

---

## Cara Instalasi

Karena *package* ini bergantung pada Auth.js, Anda wajib menginstal `next-auth` (versi beta untuk App Router) bersamaan dengan *package* ini:

```bash
npm install next-auth@beta uauth-nextjs-client
```

---

## Cara Penggunaan (Penting untuk Role & Group)

Gunakan *package* ini persis seperti *provider* bawaan NextAuth. **Untuk memastikan data `role` dan `group` terbaca di *frontend***, Anda wajib menambahkan aturan `callbacks`.

Buat atau modifikasi file `auth.ts` di *root* proyek Anda:

```typescript
import NextAuth from "next-auth"
import UAuth from "uauth-nextjs-client"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    UAuth({
      // Mengambil data dari .env.local
      issuer: process.env.UAUTH_BASE_URL!,
      clientId: process.env.UAUTH_CLIENT_ID!,
      clientSecret: process.env.UAUTH_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // 1. Oper data custom (roles & groups) dari UAuth ke dalam Token
    async jwt({ token, user }) {
      if (user) {
        token.roles = user.roles;
        token.groups = user.groups;
      }
      return token;
    },
    // 2. Oper data dari Token ke dalam Session agar bisa dibaca di frontend
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).roles = token.roles;
        (session.user as any).groups = token.groups;
      }
      return session;
    }
  }
})
```

---

## Konfigurasi Environment Variables

Buka file `.env.local` di proyek Next.js Anda dan tambahkan nilai berikut:

```env
# Rahasia acak untuk keamanan NextAuth (Bisa di-generate dengan `npx auth secret`)
AUTH_SECRET="random_string_acak_panjang"

# Konfigurasi UAuth SSO
UAUTH_BASE_URL="https://auth.namadomain.com"
UAUTH_CLIENT_ID="client_id_anda"
UAUTH_CLIENT_SECRET="client_secret_anda"
```

> **INFO:** Anda **TIDAK PERLU** lagi mendeklarasikan `UAUTH_REDIRECT_URI`, `UAUTH_SCOPES`, atau `UAUTH_ROUTES_ENABLED` di `.env` seperti di Laravel! Semua rute dan penangkapan izin *scope* (termasuk *roles* dan *groups*) sudah ditangani 100% secara otomatis oleh *package* ini.

---

## Pengaturan Callback URL di Dashboard UAuth

Pastikan Anda mendaftarkan Callback URL berikut ini ke dalam *dashboard* Client UAuth Anda:
- Lokal: `http://localhost:3000/api/auth/callback/uauth`
- Production: `https://domain-anda.com/api/auth/callback/uauth`

---

## Dukungan TypeScript (Opsional)

Jika Anda ingin TypeScript mengenali `session.user.roles` dan `session.user.groups` tanpa *error*, buat file `types/next-auth.d.ts` di proyek Anda:

```typescript
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      roles?: string | string[];
      groups?: string | string[];
    } & DefaultSession["user"]
  }
}
```

---

## Fitur Utama

- **Otomatisasi Penuh:** Tidak perlu lagi menyetel konfigurasi *Scopes* maupun *Redirect URI* secara manual.
- **Dukungan Role & Group:** Sudah memetakan *array roles* dan *groups* langsung dari server SSO.
- **Standar Keamanan Tinggi:** Menggunakan `PKCE`, `State`, dan `Nonce` secara bawaan.
- **Kompatibel:** Berjalan sempurna di Next.js App Router maupun Pages Router.
