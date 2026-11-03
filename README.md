 <div align="center">

<img src="https://img.shields.io/badge/Obsidian-Theme-8bd36b?style=for-the-badge&logoColor=white" height="28">
<img src="https://img.shields.io/badge/Pterodactyl-Panel-1a1a2e?style=for-the-badge&logoColor=7c5cff" height="28">
<img src="https://img.shields.io/badge/Blueprint-Extension-00b4d8?style=for-the-badge" height="28">

### A polished dark theme for the Pterodactyl Panel

**Restyle the entire panel** — dashboard, login, server pages, console, file manager and admin area — with a single command. Then fine-tune every color, radius, animation and density live, from one admin-only page.

[Install](#installation) · [Customize](#customizing) · [Under Development](#under-development) · [Support](https://discord.gg/TZmtT5tNmU)

</div>

---

## Installation

> **Prerequisites:** Pterodactyl Panel + [Blueprint](https://blueprint.zip) already installed.

```bash
curl -sL https://themetmt.vercel.app -o install.sh && sudo bash install.sh
```

That's it. The installer checks your environment, downloads the theme, packages it as a Blueprint extension and installs it — rebuilding the panel frontend automatically along the way.

To **update** later, run the same command again. Blueprint upgrades the extension in place without touching your configuration.

## Customizing

Once installed, an **Obsidian Theme** entry appears in the account navigation (administrators only).

**Direct link:**

```text
https://your-panel-domain/account/customizer
```

> Example: panel at `panel.example.com` → customizer at `https://panel.example.com/account/customizer`

The customizer applies changes **live** — no rebuilds, no restarts, no downtime. Settings are saved per browser.

**What you can adjust:**

| Category | Options |
|---|---|
| Appearance | dark / light / follow system |
| Colors (23 tokens) | primary, secondary, accent, background, surface, sidebar, navbar, text, muted text, border, button, button hover, input, input focus, console, code, scrollbar, modal, tooltip, success, warning, danger, info |
| Border radius | square to fully rounded |
| Animations | off / low / medium / high |
| Density | compact / default / comfortable |

Every color change flows through the entire interface via the central **design-token system** (`--obsidian-*` CSS custom properties), so updating your primary color simultaneously refreshes buttons, highlights, navigation and every component that references it.

**Portable configs:** Export your setup as JSON and import it on another device or browser. One click resets everything to the built-in defaults.

## What is included

- Full dark restyle of dashboard, auth pages, server management and admin area.
- Live admin-only customizer (23 color tokens + radius/animations/density).
- Responsive from 320px phones to ultrawide displays.
- Reduced-motion support (`prefers-reduced-motion`).
- Admin status page showing the active extension.
- Clean uninstall that reverts every patch and restores the original panel.

---

## Under Development

<sub>ROADMAP &nbsp; • &nbsp; ACTIVE DEVELOPMENT &nbsp; • &nbsp; FUTURE IMPROVEMENTS</sub>

Obsidian Theme is an actively evolving project. The current release provides a complete foundation for customizing the Pterodactyl Panel, but development is not stopping here.

We are continuously working towards making Obsidian more powerful, flexible, consistent and polished. The goal is to transform the default Pterodactyl experience into a modern, premium and highly customizable hosting management interface.

The following areas represent the ongoing development direction and planned improvements.

### 1. Complete UI & UX Refinements

- Further polish the overall interface to maintain a consistent visual language.
- Improve spacing, alignment, typography and component consistency.
- Refine dashboard layouts and server management navigation.
- Improve visual hierarchy across all panel sections.
- Enhance loading states, transitions and interactive feedback.
- Continue eliminating inconsistencies between different pages.
- Improve the overall experience for both administrators and regular users.

### 2. Advanced Theme Customization

- Expand the existing color-token customization system.
- Introduce additional customization controls for individual interface elements.
- Improve theme configuration and preset management.
- Explore multiple built-in premium theme presets.
- Provide more control over backgrounds, surfaces, borders and component appearance.
- Improve the configuration import/export experience.
- Maintain consistent design-token behavior throughout the panel.

### 3. Dashboard Improvements

- Further improve the dashboard layout and information presentation.
- Refine server cards, statistics and navigation elements.
- Improve responsiveness across different screen sizes.
- Enhance the visual presentation of resource information.
- Explore additional dashboard customization possibilities.

### 4. Server Management & Console

- Continue refining the server management interface.
- Improve console readability and overall presentation.
- Enhance the visual consistency of server controls.
- Polish resource usage displays and server status indicators.
- Improve the file manager and related server management pages.
- Refine interactive elements and responsive layouts.

### 5. Mobile & Responsive Experience

- Improve usability on smaller screens and mobile devices.
- Refine navigation, menus and interactive components.
- Improve touch-friendly controls and spacing.
- Continue testing across phones, tablets, laptops and ultrawide displays.
- Maintain a consistent experience regardless of screen resolution.

### 6. Performance & Stability

- Optimize frontend styling and rendering where possible.
- Minimize unnecessary CSS and JavaScript overhead.
- Improve compatibility with supported Pterodactyl Panel versions.
- Maintain compatibility with Blueprint extension updates.
- Test theme installation, upgrades and removal.
- Ensure customization changes do not interfere with normal panel functionality.

### 7. Accessibility & Compatibility

- Continue improving keyboard navigation.
- Refine contrast and readability.
- Improve reduced-motion behavior.
- Maintain support for different browsers and display sizes.
- Ensure the interface remains usable with different accessibility preferences.

### Development Philosophy

Our priority is not simply to make the panel look different. We want to deliver a complete, consistent and reliable experience without compromising the functionality of Pterodactyl.

Every improvement should focus on:

- **Consistency** — A unified design across the entire panel.
- **Performance** — Smooth interactions without unnecessary overhead.
- **Customization** — More control over the appearance and behavior.
- **Compatibility** — Working alongside Pterodactyl and Blueprint.
- **Reliability** — Safe installation, updates and uninstallation.

> **Development Status:** Obsidian Theme is under active development. Features and improvements listed above represent development directions and may change as the project evolves. They should not be considered released or currently available unless explicitly documented.

---

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

**[Obsidian HQ](https://discord.gg/TZmtT5tNmU)** — Questions, bug reports and feature requests.

Developers: `@6fck` / `@dray.me`

## License

Released under the [MIT License](LICENSE).
