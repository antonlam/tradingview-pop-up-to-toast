# TradingView Pop-up to Toast (Tampermonkey)

Turns TradingView dialog pop-ups into unobtrusive toast notifications and auto-dismisses the dialog. Helpful when a popup interrupts your chart workflow.

## What it does

- Watches the page for TradingView dialog pop-ups.
- Extracts the dialog title and displays it as a toast.
- Clicks the dialog button to dismiss it.
- Adds lightweight toast styling on the page.

## Requirements

- Browser with Tampermonkey (or a compatible userscript manager).
- Access to TradingView.

## Install

1. Open Tampermonkey and create a new script.
2. Copy/paste the contents of [tradingview-pop-up-to-toast.js](tradingview-pop-up-to-toast.js).
3. Save the script.

## Match URL

The userscript runs on all URLs from /chart/*:

```
https://www.tradingview.com/chart/*
```

If you want it to run on any chart, update the `@match` line in the userscript header. Example:

```
// @match        https://www.tradingview.com/chart/*
```

## Configuration

Edit these constants inside [tradingview-pop-up-to-toast.js](tradingview-pop-up-to-toast.js):

- `TOAST_DURATION`: how long a toast stays on screen (ms).
- `TOAST_FADE_TIME`: toast fade duration (ms). Must match the CSS transition time.
- `DIALOG_CLASS` and `TITLE_CLASS`: TradingView dialog/title class names used to find dialogs.

## How it works

The script injects a small toast UI and sets up a `MutationObserver` on the document. When a dialog element appears, it:

1. Reads the dialog title text.
2. Shows a toast with the message.
3. Clicks the dialog button to close it.

## Notes and limitations

- TradingView can change class names at any time. If toasts stop appearing, you may need to update the class constants.
- The script assumes the dialog button exists and can be clicked. If the button selector changes, update it in `handleDialog()`.
- This script only runs on the pages matched by `@match`.

## Troubleshooting

- No toast appears: verify the `@match` URL and that Tampermonkey is enabled.
- Toast appears but dialog stays: update the button selector `.overlayBtn-xxA0F0Gn` in `handleDialog()`.
- Toast fades instantly: ensure `TOAST_FADE_TIME` matches the CSS transition duration.

## Disclaimer

This userscript is not affiliated with TradingView. Use at your own risk.