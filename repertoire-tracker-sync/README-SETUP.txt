REPERTOIRE TRACKER - CLOUD SYNC SETUP

IMPORTANT: This version needs a Netlify Functions deployment. Drag-and-drop static deployment may not install the function/dependency. Deploy with Netlify CLI or a Git-connected repository.

1. Back up your current practice history from BOTH devices using Export backup.
2. In Netlify > Project configuration > Environment variables, create PRACTICE_SYNC_CODE with a unique random value of at least 32 characters. Mark it as secret if offered. Do not put it in index.html.
3. Deploy this folder using a Git-connected Netlify project (recommended). Ensure the build installs npm dependencies and functions. Existing custom domain stays connected to the same project.
4. Open home.casamaderasa.com and choose Set sync code on each device, using the exact same value.
5. Verify Sync now says Synced on both devices.

Security: The URL is public. Anyone knowing the code can read/change records. Use a long random code; do not share it. The code is stored locally in each browser, and transmitted via HTTPS. For stronger security and rate limiting, add Netlify edge protection or use real account authentication.

Merging: On first sync, local and cloud counts are combined using the maximum recorded count per date and work; they are NOT added together. This avoids double-counting overlapping logs but can lose separately recorded same-day sessions. Back up first.

Limitations: Server writes use a revision check but simultaneous requests may still race; this is a personal-use lightweight solution, not a transactional multi-user database. Offline changes are retained locally and retried when the app reconnects.
