# Family Hub

Recreated for **Kevin, Kate, Luke and Max** in [KEVBOTBETS/Family-calendar](https://github.com/KEVBOTBETS/Family-calendar).

A responsive calendar and household dashboard with month, week, day, family and list views; recurring and multi-day events; person colours and filters; driver and packing notes; daily checklist and stars; grocery and household lists; clothing sizes; fridge notes; meal planning and recipe discovery; four colour themes; print and calendar export; and offline support.

The supplied `app.js`, `import.js` and `styles.css` are preserved with small compatibility fixes. Missing dependencies, page, storage, recipes, backend, tests and deployment were recreated. The original unavailable recipe library has been replaced by **12 starter recipes**; add your own or use Discover to expand it. Previous family data is not included in these source attachments. Import a JSON backup in Settings if you have one.

## Start

- Preview PIN: **1234**. Preview saves on this device only; its PIN is a convenience lock, not encryption.
- `npm test` runs syntax, calendar/import/export and backend regression checks.
- `npm run serve` opens the app at http://localhost:4173.
- `npm run build` packages only the public app into `dist/`.

## Sharing and reminders

Follow [SETUP.md](SETUP.md) to connect your private Google Sheet. The rebuilt Apps Script backend supports PIN-protected sharing, a revocable read-only calendar subscription, email reminders, morning and week-ahead summaries, checklist completion links, and manual/weekly Drive backups. These need Google setup and authorization; they are not active in preview mode. External weather and recipe discovery need an internet connection.

Sync is last-write-wins for each item, with offline changes queued until accepted. Devices must unlock again when the six-hour server session expires. Public repository files contain no family PIN, email addresses or calendar data. Locking does not encrypt or erase the device cache.

## Deploy

Select **Settings → Pages → Source: GitHub Actions**. Pushes to `main` run tests, build the public app, and deploy it. Expected URL: https://kevbotbets.github.io/Family-calendar/ (capitalization matters).
