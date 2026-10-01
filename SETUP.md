# Family Hub setup

## Website

In [repository settings](https://github.com/KEVBOTBETS/Family-calendar/settings/pages), select **GitHub Actions** as the Pages source. The **Check and deploy Family Hub** workflow builds and deploys the app. Open https://kevbotbets.github.io/Family-calendar/ after the deployment succeeds. Preview PIN: **1234**.

## Connect the family phones

1. Create a private Google Sheet named **Family Hub Data**.
2. Open **Extensions → Apps Script**. Replace `Code.gs` with [apps-script/Code.gs](apps-script/Code.gs). Add another script file named **Calendar**, and paste [apps-script/Calendar.gs](apps-script/Calendar.gs) into it. Both files are required.
3. In **Project Settings**, set timezone to **America/Toronto**. Add a Script property named **FAMILY_PIN** with your own PIN. Keep it out of GitHub.
4. Run **setup** and authorize access to this Sheet, email and Drive. This creates the data tab, backup folder and a five-minute reminder timer.
5. **Deploy → New deployment → Web app**. Execute as **Me**, access **Anyone**. Copy the URL ending in `/exec`.
6. In Family Hub **Settings → Sharing & sync → Advanced**, save that URL on each device. Alternatively put it in `config.js` under `API_URL` and commit it so every device uses the same server.
7. Unlock with your private PIN on each device. To migrate preview items, export a backup before connecting, then import it after connecting. Nothing automatically uploads your local preview data.

There is no Google setup in this repository that can access your private Sheet until you complete these steps. Share the app link and PIN only with your family. Preview and shared caches are not encrypted; use your device passcode.

## Reminders

In **Settings → Reminders & notifications**, add each person's email, choose whose events they follow, and press **Test**. Turn on morning or weekly summaries as desired. Reminders check every five minutes and depend on Google quotas and email notification settings. Checklist emails open a page with a **Mark it done** button so email scanners cannot accidentally complete tasks. Completion links expire after six hours. The backend sends schedules in summaries; dinner and needs summaries are not included.

## Subscriptions and backups

**Settings → Show it in your phone's calendar → Get the calendar link** produces read-only links for everyone or one person. Use **Make a new link** to revoke the old links. Import into Apple Calendar, Google Calendar or Outlook as a subscribed calendar; refresh intervals depend on that service.

Drive backups run on Sunday after 8pm, once family settings exist, and retain eight copies. **Back up to Drive now** creates a copy on demand. Use **Export backup** for another copy you control. This rebuild preserves history rather than automatically pruning it.

## Wix and home screen

Link a Wix button to https://kevbotbets.github.io/Family-calendar/. You can also use **Embed a Site** with a fixed height of about 850px, plus a button to open the full app. Wix page protection does not protect the direct app URL.

On iPhone, open in Safari → Share → Add to Home Screen. On Android, open in Chrome → Add to Home screen.

## Updates and troubleshooting

- Updating either Apps Script file requires **Deploy → Manage deployments → Edit → New version → Deploy**. Keep the same URL and Sheet.
- Changing `FAMILY_PIN` in Script properties invalidates existing access tokens. Unlock again with the new PIN.
- Wrong PIN entry locks after eight attempts for 15 minutes. Tokens expire after six hours.
- If sync fails, correct the deployed `/exec` link, check access is **Anyone**, and run setup again.
- If browser storage is unavailable, the app shows a warning. Export your changes before closing the tab.
- If the app looks stale, refresh while online. Offline caches are scoped to this project.
- Never commit actual family data, personal emails or the private PIN into this public repository.
