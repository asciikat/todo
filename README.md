# Mission Board

A gamified, GTA-inspired to-do board. Single file: `index.html`, no build step.

## Host free on GitHub Pages
1. Merge to `main`.
2. Repo **Settings → Pages → Deploy from a branch → `main` / root → Save**.
3. Open `https://<user>.github.io/<repo>/`.

Without sync, your jobs and cash are saved only in each browser. **Save backup**
/ **Merge backup** at the bottom of the page combine two devices by hand: jobs
from both are kept, jobs finished or dropped on either device stay gone, and
cash, wins and heists keep the higher number.

## Turn on sync (phone ↔ desktop, free)
Sync uses Firebase's free plan: you sign in with Google on each device and
changes show up on the other one within a few seconds. About 10 minutes, once.

1. Go to <https://console.firebase.google.com>, click **Create a project**,
   name it (e.g. `mission-board`). Google Analytics can be switched off.
   The free "Spark" plan is all you need; no card required.
2. **Build → Authentication → Get started → Sign-in method → Google → Enable**,
   pick your email as support email, **Save**.
3. Still in Authentication: **Settings → Authorized domains → Add domain** →
   `asciikat.github.io` (your GitHub Pages address, without `/todo`).
4. **Build → Firestore Database → Create database**. Pick a location near you,
   choose **production mode**, **Create**.
5. In Firestore open the **Rules** tab, replace everything with this, then **Publish**:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /boards/{uid} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```
   This makes each board readable and writable only by the Google account that owns it.
6. Click the **gear → Project settings → Your apps → Web (`</>`)**, register an
   app called `Mission Board` (no Firebase Hosting needed), and copy the
   `firebaseConfig = { ... }` values it shows.
7. On GitHub open `firebase-config.js` → **Edit** (pencil) → replace `null`
   with those values (see the example in the file) → **Commit changes** to `main`.
8. After a minute, reload the site on each device, scroll to the bottom and tap
   **Sign in to sync**. Sign in with the same Google account everywhere.

The values in `firebase-config.js` are meant to be public; the rules in step 5
are what keep your board private. Your to-dos are stored in your Firebase
project.

How sync combines changes: new jobs from either device are added; finished,
dropped or moved jobs disappear everywhere; the newest star change wins; cash,
wins and heists keep the higher number. Undoable actions (drop, reset stars,
call off a big score) wait about 6 seconds before syncing so Undo still works.

Optional: drop your own jingle next to `index.html` as
`Mission_passed_jingl_#2-1783759697834.mp3`; otherwise a built-in fanfare plays.
