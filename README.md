# Family Hub

Recreated for **Kevin, Kate, Luke and Max** in [KEVBOTBETS/Family-calendar](https://github.com/KEVBOTBETS/Family-calendar).

A responsive calendar and household dashboard with month, week, day, family and list views; recurring and multi-day events; person colours and filters; driver and packing notes; daily checklist and stars; grocery and household lists; clothing sizes; fridge notes; meal planning and recipe discovery; four colour themes; print and calendar export; and offline support.

The supplied `app.js`, `import.js` and `styles.css` are preserved with small compatibility fixes. Missing dependencies, page, storage, recipes, backend, tests and deployment were recreated. The original unavailable recipe library has been replaced by **12 starter recipes**; add your own or use Discover to expand it. Previous family data is not included in these source attachments. Import a JSON backup in Settings if you have one.

## Studio redesign

A bright light theme, warm colours and a responsive seven-day overview now lead the experience. Use the sun/moon button for light or dark, or choose Maple/Aurora in Settings.

- **Overview:** filter family members, move events between days with drag-and-drop, or use each card’s Move button on touchscreens. Moving a repeating event defaults to just that occurrence; the Move dialog also supports the entire series. Undo is available.
- **Chores & stars:** per-person daily boards, completion celebrations, progress and editable goals. Stars count completed jobs in the last seven days and go to the person who completes them.
- **Meals:** drag recipes onto the dinner planner, tap to plan on phones, and build a combined grocery list from the week’s planned recipes.
- **Quick add:** event, routine, list item or fridge note. Search uses the magnifying glass or Ctrl/⌘K.
- **Wall display:** expands the overview and requests fullscreen and screen wake lock when supported. Exit display returns to the normal app.
- **Demo:** [interactive showcase](https://kevbotbets.github.io/Family-calendar/?demo=1). Demo data and preferences use separate storage, and the demo cannot connect to the family server.

The interface is an original Family Hub design. There is no affiliation with Skylight.

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
