# Goodreads Multi-Tag Search – Privacy Policy

_Last updated: 27 April 2025_

Goodreads Multi-Tag Search (“the extension”) runs **entirely inside your
browser**.  
It never transmits personal information, browsing data, or book data to
any remote server. The extension does not use analytics, advertising, or
tracking libraries of any kind.

## 1.  What data is processed?

| Data | Where it comes from | Where it is stored |
|------|--------------------|--------------------|
| Book titles, authors, shelves, average ratings, cover URLs | Your own “My Books” pages on Goodreads while you are logged-in | Locally in Chrome’s `chrome.storage.local` (on your device only) |

## 2.  How is the data used?

* To perform instant, client-side search and filtering by shelf and tags.
* To display book covers and metadata in the extension’s UI.

No data is shared, uploaded, or synced to external servers.

## 3.  Permissions explanation

The extension requests the minimum Chrome permissions required:

| Permission | Purpose |
|------------|---------|
| **storage** | Cache your book list locally so searches work offline. |
| **activeTab** | Temporarily inject the search overlay into the tab you clicked. |
| **scripting** | Execute the content script in that active tab. |
| **Host permissions** (`*.goodreads.com`, `i.gr-assets.com`, `images-na.ssl-images-amazon.com`) | Read your Goodreads book list and load cover thumbnails. |

## 4.  Third-party services

The extension communicates only with Goodreads’ own websites to read pages you
are already viewing. It does **not** embed ads, analytics, or any third-party
scripts.

## 5.  Data retention & deletion

All cached data stays inside your browser.  
You can delete it at any time:

* Click **🔄 Refresh** in the extension UI – this clears `chrome.storage.local`.
* Remove the extension – Chrome automatically deletes all related data.

## 6.  Contact

If you have privacy questions, open an issue on the GitHub repository or email
`mertsalar137@gmail.com`.
