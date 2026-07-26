# Dayflow — installable web app

A browser can only install a site that is served from a web address. Opening
`index.html` straight from your downloads folder gives you the app, but not the
install option — and in Chrome it also blocks local storage, so nothing saves.

Put these files on any static host and Dayflow becomes a real installable,
offline app.

## Files

    index.html              the app
    manifest.webmanifest    name, colours, icons, standalone display
    sw.js                   service worker — caches the app for offline use
    icons/                  app icons (192, 512, maskable, apple touch)

Keep them together. `index.html` must sit next to `manifest.webmanifest`,
`sw.js` and the `icons` folder.

## Putting it online

**Netlify Drop** — go to app.netlify.com/drop and drag this whole folder onto
the page. You get a URL in a few seconds. No account needed to start.

**GitHub Pages** — push the folder to a repo, then Settings → Pages → deploy
from branch. Your app lives at `https://<user>.github.io/<repo>/`.

**Cloudflare Pages / Vercel** — same idea: upload the folder, no build command,
output directory is the folder itself.

**On your own machine** — from inside this folder run one of:

    python3 -m http.server 8000
    npx serve .

then open `http://localhost:8000`. Installing works on localhost too.

## Installing it

**iPhone / iPad** — open the URL in Safari (not Chrome), tap Share, then
*Add to Home Screen*.

**Android** — open in Chrome, then either tap *Install* in Dayflow's Settings
tab, or use the browser menu → *Install app*.

**Desktop Chrome / Edge** — an install icon appears in the address bar, or use
Settings → Install in the app.

Once installed it launches full screen with no browser chrome, and works with
no connection.

## Your data

Everything is stored in IndexedDB in the browser, on the device. It is not
uploaded anywhere and it is not synced between devices. Settings → Export
writes a JSON backup; Import restores it. Export before clearing browser data
or switching phones.

Note that the installed app and the same site in a browser tab share one
database, but a different browser (or a different domain) is a different
database.
