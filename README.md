# Take-Home Test — Lambda Hero + Features + Hardware Sections

## Overview

Reconstruct **three sections** of [lambda.ai](https://lambda.ai) as pixel-perfect React components in a single project.

You have **1 hour**. The goal is to complete as much as you can in that time — most candidates won't finish all three sections, and that's expected. What matters is the quality and accuracy of what you do complete.

---

## What's in this folder

| File | What it is |
|------|------------|
| `artifacts/source_html.html` | Extracted DOM structure — all three sections in order |
| `artifacts/styles_css.css` | Extracted CSS — full design system + all component styles |
| `artifacts/hero-screenshot.png` | Reference screenshot — hero section |
| `artifacts/features-screenshot.png` | Reference screenshot — features section |
| `artifacts/hardware-screenshot.png` | Reference screenshot — hardware section |
| `guidelines.json` | Design system overview — all sections |

**The CSS file is your source of truth.** Every value you need is in there. Do not guess or invent values.

---

## AI Tool Rules

**This test must be completed using [Claude Code](https://claude.ai/code) only.**

- You must use Claude Code (the CLI tool) as your AI assistant throughout the test
- No other AI tools are permitted — not ChatGPT, Copilot, Cursor, v0, Bolt, or any other assistant
- Your prompting approach, how you communicate the task to Claude, and how you guide it toward the correct output are all part of what we are assessing
- The quality of your prompts matters as much as the final output

---

## Requirements

### Framework
- **React** is required
- You may use any React framework or router: **Next.js, Vite + React Router, TanStack Router, Remix**, etc.
- **Tailwind CSS** is required 

### What to build

All three sections appear on the lambda.ai homepage, stacked vertically in this order:

---

### Section 1 — Hero

Reconstruct the hero section as shown in `artifacts/hero-screenshot.png`
---

### Section 2 — Features

Reconstruct the features section as shown in `artifacts/features-screenshot.png`
---

### Section 3 — Hardware

Reconstruct the hardware section as shown in `artifacts/hardware-screenshot.png`

---

## What "visually perfect" means

The reconstruction must match the original so closely that a designer reviewing both side by side would not be able to tell which is the original.

- **Colors, gradients, and shadows** match exactly
- **Typography** (font family, size, weight, line height, letter spacing) matches exactly
- **Spacing and padding** between elements matches exactly
- **Layout and alignment** match exactly
- **Accordion transitions** (both vertical and horizontal) are smooth and match the original timing
- All sections are **responsive** — they should work across screen sizes

---

## Submission

1. Complete your implementation
2. Zip the project folder **without `node_modules`**
3. Upload the zip to the Google Drive link shared with you

---

## Using the live website

**You must visit [lambda.ai](https://lambda.ai) and study all three sections directly.** The screenshots alone are not enough to fully understand interactions and animations. Open the browser DevTools, inspect computed styles, watch animations in the Elements panel, and monitor the Network tab for assets.

---