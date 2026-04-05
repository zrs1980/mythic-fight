# Project: Girls Beat-Em-Up Game
A Double Dragon-style 2D beat-em-up game built with Phaser 3 and JavaScript.
Designed for two young players (ages 7 and 9). Co-op focused, colorful, and kid-friendly.

## Tech Stack
- **Framework:** Phaser 3 (loaded via CDN)
- **Language:** JavaScript (ES6+)
- **Entry point:** `index.html`
- **Game source:** `src/`
- **Assets:** `assets/` (sprites, sounds, tilemaps)

## Project Structure
```
/
├── index.html          # Game entry point (open in browser to play)
├── src/
│   ├── main.js         # Phaser game config and scene registry
│   ├── scenes/         # Game scenes (Boot, Preload, Menu, Game, GameOver)
│   ├── entities/       # Player, Enemy, Projectile classes
│   └── config/         # Game constants, input maps, level data
├── assets/
│   ├── sprites/        # Sprite sheets (players, enemies, tiles)
│   ├── audio/          # Sound effects and music
│   └── tilemaps/       # Level map JSON files
└── CLAUDE.md
```

## Deployment
- **Hosting:** Vercel (static site deployment)
- **Live URL:** Set after first deploy via `vercel --prod`
- **Deploy command:** `vercel` (from project root)
- **No build step required** — Vercel serves static files directly
- Add a `vercel.json` if custom routing or headers are needed

## Commands
- **Play locally:** Open `index.html` in a browser (use Live Server in VS Code for best results)
- **Deploy to Vercel:** Run `vercel` in the project root, or push to a connected GitHub repo
- **No build step required** — pure browser JavaScript

## Game Design Rules (DO NOT change without asking)
- **Always support 2-player co-op** — Player 1 uses WASD + F/G, Player 2 uses Arrow Keys + K/L
- **Keep it colorful and bright** — no dark, gritty, or scary art styles
- **Forgiving difficulty** — players start with 5 lives, health regenerates slightly between waves
- **No blood or gore** — enemies flash and disappear when defeated (stars/sparkles effect)
- **Short levels** — each level should take 3–5 minutes to complete
- **Clear progress indicator** — always show a level progress bar on screen

## Code Style
- Use ES6 classes for all game entities
- One class per file
- Prefer `const` and `let` — never `var`
- Comment all public methods with a one-line description
- Keep scene files under 200 lines — extract logic into entity classes

## Player Characters
- **Player 1:** "Lily" — pink outfit, faster movement speed
- **Player 2:** "Rose" — purple outfit, slightly stronger punch
- Both players have: walk, punch, kick, jump animations

## Enemy Behavior (keep simple)
- Enemies walk toward the nearest player
- Enemies have 3 health points
- Enemies telegraph attacks with a 0.5s wind-up animation before hitting
- Max 4 enemies on screen at once

## Important Notes
- NEVER break 2-player co-op support — this is the #1 feature
- Keep all asset paths relative — works both locally and on Vercel
- If adding new scenes, register them in `src/main.js`
- The game runs entirely client-side — no server or API calls needed
- Phaser 3 docs reference: https://newdocs.phaser.io/docs/3.60.0
