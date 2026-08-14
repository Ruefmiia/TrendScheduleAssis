# Trend Schedule Assistant

A lightweight Chrome and Edge side-panel extension for reading `TREND SCHEDULE` posts on X and extracting the information needed for trend participation.

## Features

- Monitor multiple trend accounts and find their latest schedule posts.
- Extract Keyword and Hashtag values with validation.
- Convert GMT, UTC, and Bangkok time to Beijing time.
- Show a countdown to the trend start and its 24-hour end.
- Save, switch, copy, and remove tasks locally.
- Merge duplicate tasks published by different accounts.
- Generate local draft captions in Chinese, English, Japanese, or Korean.
- Support both Keyword + Hashtag and Hashtag-only tasks.
- Export diagnostic information when automatic reading fails.
- Stay open as a browser side panel.

The extension does not post to X automatically. Parsed tasks and generated captions remain in the browser.

## Install

1. Download or clone this repository.
2. Open `chrome://extensions` or `edge://extensions`.
3. Enable **Developer mode**.
4. Select **Load unpacked**.
5. Choose the `extension` directory.
6. Open the extension from the browser toolbar.

Refresh any X pages that were already open after installation.

## Test

Node.js 18 or later is required.

```powershell
npm test
```
