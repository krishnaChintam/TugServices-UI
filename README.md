# Firebase Hosting — Step-by-Step

A clean, copy-paste guide to deploy any frontend app (React, Vite, CRA, or static site) to **Firebase Hosting**.

---

## 0) Prerequisites

* **Node.js**: LTS (≥ 18) installed (includes `npm`).
* **Firebase CLI**: `npm i -g firebase-tools`
* A **Firebase project** (create one in the Firebase console if you don’t have it yet).

> Check versions: `node -v`, `npm -v`, `firebase --version`

---

## 1) Install Firebase CLI & Login

```bash
npm i -g firebase-tools
firebase login
```

---

## 2) Initialize Firebase Hosting

From your project folder:

```bash
firebase init hosting
```

During the wizard:

1. **Select your Firebase project** (or create one).
2. **Public directory**: specify your app’s build folder (e.g., `dist` or `build`).
3. **Configure as a single-page app** (rewrite all routes to `index.html`)? → **Yes** (for SPAs).
4. **Set up automatic builds & deploys with GitHub?** → Optional.

This creates `firebase.json` and `.firebaserc`.

---

## 3) Build & Test Locally

If your app has a build step:

```bash
npm run build
```

Run Firebase Emulator:

```bash
firebase emulators:start --only hosting
```

Open the localhost URL to verify.

---

## 4) Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

This publishes your app live.

---

## 5) Verify SPA Routing

Make sure your app works on page refresh/deep links. `firebase.json` should include:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

(Change `dist` to your build folder.)

---

## 6) Add Custom Domain (Optional)

1. Go to Firebase console → Hosting → **Add custom domain**.
2. Follow DNS verification and record setup.
3. Firebase provisions **HTTPS** automatically.

---

## 7) Quick Command Recap

```bash
# one-time
npm i -g firebase-tools
firebase login

# per project
firebase init hosting
npm run build
firebase deploy --only hosting
```

---

## 8) Troubleshooting

### A) Hosting target error

Set site ID in `firebase.json`:

```json
{ "hosting": { "site": "your-site-id", "public": "dist" } }
```

### B) Network / CLI errors

* Try `firebase logout && firebase login`
* Check DNS / firewall / VPN

### C) 404s on refresh

Ensure `rewrites` rule exists in `firebase.json`.

---

## 9) Useful Links

* [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
* [Firebase Console](https://console.firebase.google.com/)

---

## Credits

Created by **Krishna Chintam**
