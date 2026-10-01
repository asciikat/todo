// Cloud sync settings for Mission Board (optional).
//
// Leave this as null and the board works on each device on its own.
// To sync your phone and desktop, follow "Turn on sync" in README.md, then
// replace null below with the firebaseConfig values Firebase gives you.
//
// These values are not secret. Your board stays private because of the
// security rules in the README: only your Google account can read or write it.
window.MISSION_BOARD_FIREBASE = null;

/* Example — yours will have your own values:
window.MISSION_BOARD_FIREBASE = {
  apiKey: 'AIza...',
  authDomain: 'my-mission-board.firebaseapp.com',
  projectId: 'my-mission-board',
  appId: '1:1234567890:web:abc123',
};
*/
