# Save the Axolotls: Dragons of the Sea website

A kid-friendly website about wild axolotls, keeping water clean, and rain gardens, made by the
Dragons of the Sea FIRST LEGO League team.

Plain HTML, CSS, and JavaScript. No installs, no build step, no accounts, no tracking.

## Open the website

**Easiest:** double-click `index.html`. It opens in your web browser.

**With a tiny local server** (closer to how a real website works):

```bash
cd ~/fll && python3 -m http.server 8123
```

Then open <http://localhost:8123> in a browser. Press `Ctrl + C` in the terminal to stop it.

## Share a Spanish link

Add `?lang=es` to the end of the address to open the site in Spanish, for example
`https://YOUR-USERNAME.github.io/save-the-axolotls/?lang=es`. Use `?lang=en` for English.
When a visitor switches languages, the address bar updates too, so copying the link shares that language.
Add `&calm=1` for a link that opens with animations off, for example `?lang=es&calm=1`.

## What each file does

| File | What it holds |
| --- | --- |
| `index.html` | The page structure and all the SVG drawings (axolotl, Carl, taco, diagrams). |
| `css/styles.css` | Colors, layout, and animations. Team colors are at the very top. |
| `js/i18n.js` | **Every word on the site**, in English (`en`) and Spanish (`es`), plus the quiz setup. |
| `js/main.js` | What happens when you press things: language switch, pause, taco shower, filter demo, Follow the water, idea parts, quiz. |
| `HANDOFF.md` | Things adults still need to check before sharing the site. |

## How to change things

- **Words:** open `js/i18n.js`, find the key (for example `"hero.title"`), and change the text.
  Change it in both `en` and `es`.
- **Colors:** change the values at the top of `css/styles.css` (for example `--pink`).
- **Dance speed:** change `--dance-speed` at the top of `css/styles.css`. Bigger number = slower dance.
- **Quiz:** questions and answers are words in `js/i18n.js` (keys starting with `quiz.`).
  The list of questions and correct answers is `window.QUIZ` at the bottom of that file.
- **Axolotl parts:** in `index.html`, look for the comment `THE DANCING AXOLOTL`. Each part has an id:
  `axo-tail`, `axo-body`, `axo-arms`, `axo-gills-left`, `axo-gills-right`, `axo-head`, `axo-eyes`, `axo-mouth`.

## How to test

1. **Phone and tablet:** make the browser window narrow, or use your browser's device view.
2. **Keyboard:** press `Tab` to move between buttons and `Enter` or `Space` to press them. You should always see a dark ring around the focused button.
3. **Language:** press English / Español at the top. Every word, button, and quiz answer should switch.
4. **Pause / Play animations:** the button at the top switches the page to the calm version (below) and
   says "Play animations" while motion is off. Press it again to turn motion back on. The choice is remembered,
   and the address bar adds `calm=1` while motion is off, so a copied link opens the same way.
5. **Calm (reduced motion) version:** turn on "Reduce motion" in your computer or tablet settings, or open
   `index.html?calm=1` (for example <http://localhost:8123/?calm=1>). The page starts calm: the axolotl stands still,
   tacos and confetti show as a small row instead of falling, and Follow the water lights up all steps at once.
   The button says "Play animations"; pressing it turns motion on until that browser tab is closed.
   The next visit starts calm again, and `?calm` always starts calm.
6. **Taco Button:** press it many times fast. No more than 24 tacos appear, and they disappear on their own.
7. **Filter demo, Follow the water, idea parts, quiz:** press every button and check that the text below explains what happened.
8. **Quiz celebration:** answer all four right. Confetti falls and a "Congratulations!" box appears with a **Celebrate** button.
   If you never picked a wrong answer, tacos fall with the confetti. Pick one wrong answer first, then fix it: confetti but no tacos.

## Privacy

The site has no forms, accounts, analytics, or tracking. Quiz answers stay on the page and are never sent anywhere.
The only thing saved is your language and pause choice, in your own browser.
Do not add student last names, contact details, or photos without permission.

## Publishing

This is a local version only. Do not put it online until an adult has reviewed `HANDOFF.md` and approved it.
