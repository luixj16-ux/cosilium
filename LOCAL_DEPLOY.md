# LOCAL DEPLOYMENT GUIDE — CONSILIUM

This document describes the different deployment types for the CONSILIUM application
and what is required to test locally in each format. It also includes the verification
results for the current WSL environment.

---

## 1. Deployment Types

This monorepo supports **three** deployment targets:

| Deployment | Package | Technology | Description |
|------------|---------|------------|-------------|
| **Web** | `@consilium/web` | SPA React (Vite) | Single Page Application that runs in browsers |
| **Desktop** | `@consilium/desktop` | Tauri v2 | Native app (Windows/Mac/Linux) using React + WebView |
| **Mobile** | `@consilium/mobile` | Capacitor v6 (Ionic) | Android/iOS apps running React in WebView |

**Key**: The app is designed to run as **web + desktop + mobile** with ~90% code sharing
via `@consilium/core` (domain + append-only offline sync).

---

## 2. Local Testing Requirements

### 🌐 **Web**
- **Node**: `>=22`
- **Commands**:
  - `npm install && npm run dev` (Vite dev server at http://localhost:5173)
  - `npm run build && npm run preview` (production build test)
  - `npm run test` (vitest unit tests)
- **Deps**: Only Node.js + npm — no native dependencies

### 🖥️ **Desktop (Tauri)**
- **Node**: `>=22`
- **Rust**: `cargo` required (Tauri v2 builds native backend)
- **Commands**:
  - `npm run dev` (starts Vite + Tauri dev mode)
  - `npm run tauri` (builds and runs native app)
- **Deps**: Node.js, Rust (cargo), Tauri CLI

### 📱 **Mobile (Capacitor)**
- **Node**: `>=22`
- **Android**: Android Studio + SDK (ANDROID_HOME must be set)
- **iOS**: macOS only, Xcode installed
- **Commands**:
  - `npm run dev` (Vite dev server)
  - `npm run cap:sync` (syncs dist to capacitor/www)
  - `npx cap run android` / `npx cap run ios` (run in emulator/device)
- **Deps**: Node.js, Android Studio (Android), Xcode (iOS)

---

## 3. WSL Environment Verification

The following check was performed in the current WSL environment:

| Tool | Status | Notes |
|------|--------|-------|
| **Node.js** | ✅ `v22.16.0` | Meets `>=22` requirement |
| **npm** | ✅ `11.4.1` | Latest |
| **Rust (rustc/cargo)** | ✅ Installed | `/home/dangelojan/.cargo/bin/` |
| **Android SDK** | ✅ Configured | `/home/dangelojan/Android/Sdk` |
| **adb** | ✅ Available | `platform-tools/adb` |
| **Xcode** | ❌ Not found | (Linux environment — iOS not possible) |

---

## 4. Conclusion

**Your WSL environment has everything needed for all three deployment types:**

1. ✅ **Web** — Node v22 + npm ready
2. ✅ **Desktop (Tauri)** — Rust/cargo installed
3. ✅ **Mobile (Capacitor)** — Android SDK with adb configured

**No additional installations are required** to test locally in all three forms.
Only web can be run immediately; desktop and mobile require the respective native
SDKs but the toolchain (Rust, Android) is already present in your WSL.

---
*Generated from repository analysis and WSL environment check.*