<div align="center">

<img src="https://img.shields.io/badge/Obsidian-Theme-8bd36b?style=for-the-badge&logoColor=white" height="28">
<img src="https://img.shields.io/badge/Pterodactyl-Panel-1a1a2e?style=for-the-badge&logoColor=7c5cff" height="28">
<img src="https://img.shields.io/badge/Blueprint-Extension-00b4d8?style=for-the-badge" height="28">

### A polished dark theme for the Pterodactyl Panel

**Restyle the entire panel** - dashboard, login, server pages, console, file manager and admin area - with a single command. Then fine-tune every color, radius, animation and density live, from one admin-only page.

[Install](#installation) &middot; [Customize](#customizing) &middot; [Support](https://discord.gg/TZmtT5tNmU)

</div>

---

## Installation

> **Prerequisites:** Pterodactyl Panel + [Blueprint](https://blueprint.zip) already installed.

```bash
curl -sL https://themetmt.vercel.app -o install.sh && sudo bash install.sh
```

That is it. The installer checks your environment, downloads the theme, packages it as a Blueprint extension and installs it - rebuilding the panel frontend automatically along the way.

To **update** later, run the same command again. Blueprint upgrades the extension in place without touching your configuration.

## Customizing

Once installed, an **Obsidian Theme** entry appears in the account navigation (administrators only).

**Direct link:**

```
https://your-panel-domain/account/customizer
```

> Example: panel at `panel.example.com` -> customizer at `https://panel.example.com/account/customizer`

The customizer applies changes **live** - no rebuilds, no restarts, no downtime. Settings are saved per browser.

**What you can adjust:**

| Category | Options |
|---|---|
| Appearance | dark / light / follow system |
| Colors (23 tokens) | primary, secondary, accent, background, surface, sidebar, navbar, text, muted text, border, button, button hover, input, input focus, console, code, scrollbar, modal, tooltip, success, warning, danger, info |
| Border radius | square to fully rounded |
| Animations | off / low / medium / high |
| Density | compact / default / comfortable |

Every color change flows through the entire interface via the central **design-token system** (`--obsidian-*` CSS custom properties), so updating your primary color simultaneously refreshes buttons, highlights, navigation and every component that references it.

**Portable configs:** export your setup as JSON and import it on another device or browser. One click resets everything to the built-in defaults.

## What is included

- Full dark restyle of dashboard, auth pages, server management and admin area
- Live admin-only customizer (23 color tokens + radius/animations/density)
- Responsive from 320px phones to ultrawide displays
- Reduced-motion support (`prefers-reduced-motion`)
- Admin status page showing the active extension
- Clean uninstall that reverts every patch and restores the original panel

## Requirements

| Dependency | Version |
|---|---|
| Pterodactyl Panel | 1.x |
| Blueprint | latest |
| Node.js | 18+ |
| Yarn | 1.x |

## Uninstalling

```bash
cd /var/www/pterodactyl
sudo ./blueprint -r obsidiantheme
```

Removes all theme files, reverts layout patches and rebuilds the panel back to stock.

## Support

**[Obsidian HQ](https://discord.gg/TZmtT5tNmU)** - questions, bug reports and feature requests.

Developers: `@6fck` / `@dray.me`

## License

Released under the [MIT license](LICENSE).