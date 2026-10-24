# Kharcha Pani Android shell

A Trusted Web Activity generated with Bubblewrap (`@bubblewrap/core` 1.25.0). It opens
https://mohitrawal2321.github.io/KharchaPani/ full screen, so website updates reach the app
without a reinstall. Rebuild only when the shell itself changes (name, icon, colours, version).

- Package: `io.github.mohitrawal2321.kharchapani`
- `kharcha-pani.apk` here is the signed build; GitHub Pages serves it at
  https://mohitrawal2321.github.io/KharchaPani/android/kharcha-pani.apk
- Digital Asset Links live in the `mohitrawal2321.github.io` repo at `.well-known/assetlinks.json`
  (must be at the domain root, not under /KharchaPani/).
- The signing key is NOT in this repo. It is kept privately by the owner.

## Rebuilding

1. Bump `versionCode` (and `versionName`) in `app/build.gradle` and `twa-manifest.json`.
2. Push to any branch other than `main`. The "Build Android app" workflow builds an unsigned APK
   and commits it to `android/unsigned/`.
3. Sign it with the private key:
   `apksigner sign --ks kharcha-pani-signing.keystore --ks-key-alias kharchapani --out kharcha-pani.apk kharcha-pani-unsigned.apk`
4. Replace `kharcha-pani.apk`, delete `android/unsigned/`, merge to `main`.
