# Breaking Bad API
> This app shows the main cast of the Breaking Bad show, loaded from the [TVmaze API](https://www.tvmaze.com/api), and lets you search for any character or actor.

Live demo: https://breakingbadapp.vercel.app/

### Made with
* Bootstrap 5
* Vanilla JavaScript
* [TVmaze API](https://www.tvmaze.com/api) (cast of show [169](https://www.tvmaze.com/shows/169/breaking-bad))

> The app originally used `breakingbadapi.com`, which has since shut down. Data now comes from TVmaze and is used under its CC BY-SA license.

### Running locally
It's a static site with no build step or dependencies. Serve the repository root with any static file server, for example:

```
npx serve .
# or
python3 -m http.server 8000
```

Then open the printed URL (e.g. http://localhost:8000). You can open `index.html` directly from disk too, but some browsers restrict `fetch` and audio for `file://` pages.

### Features
* Lists each main character with the actor and the actor's birthday (hover over a card, or focus it with the keyboard)
* Filters by character or actor name as you type
* Theme music with a play/pause button (browsers may block autoplay until you interact with the page)
