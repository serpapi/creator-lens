Add this section to your CLAUDE.md:

# UI Style Requirements
Rebuild the UI to match the expected dashboard reference style.
The current UI looks too much like a simple blog/report page. It should look like a modern SaaS analytics dashboard.
## Visual Direction
Use a clean, professional, data-heavy dashboard style.
The UI should feel closer to tools like Linear, Vercel, Stripe, or modern analytics dashboards.
Avoid:
- large serif typography
- blog-like layout
- centered report page design
- oversized whitespace
- purple-heavy decorative style
- pill-only data presentation
Use:
- compact dashboard layout
- sidebar navigation
- card-based sections
- metrics cards
- charts
- tables
- clear visual hierarchy
## Theme Color
Use purple as the primary theme color.
Suggested colors:
```txt
Primary purple: #7C3AED
Light purple background: #F3E8FF
Purple border: #DDD6FE
Dark text: #111827
Muted text: #6B7280
Background: #F8FAFC
Card background: #FFFFFF
Border: #E5E7EB

Purple should be used as the accent color, not as the full page background.

Layout

The dashboard must use this structure:

Full page layout
├── Left sidebar
│   ├── CreatorLens logo
│   ├── Dashboard
│   ├── Videos
│   ├── Themes
│   ├── Title Patterns
│   ├── Core Beliefs
│   ├── Reports
│   └── Settings
└── Main content area
    ├── Top label badge, e.g. "3. Creator Dashboard"
    ├── Header row
    │   ├── Creator name + YouTube link
    │   └── Export Report button
    ├── Metric cards
    ├── Analysis cards with charts
    ├── Quick insights card
    └── Video analysis table

Sidebar

Add a fixed left sidebar.

Sidebar requirements:

* Width: around 240px
* White background
* Right border
* Logo at top: CreatorLens
* Navigation items with icons
* Active item: Dashboard
* Active item background: light purple
* Active item text/icon: primary purple

Navigation items:

* Dashboard
* Videos
* Themes
* Title Patterns
* Core Beliefs
* Reports
* Settings

Main Dashboard Header

At the top of the main content area:

* Show creator name, e.g. “Dan Koe”
* Show YouTube URL below the name
* Add small external-link icon beside creator name
* Add “Export Report” button on the right

Do not use a large avatar-first profile card layout.

Metric Cards

Use four compact cards in one row:

1. Videos Analyzed
2. Total Views
3. Average Views
4. Average Engagement

Card style:

* White background
* 1px border
* Rounded corners
* Light shadow
* Small label
* Large numeric value
* Small helper text

Analysis Grid

Below metric cards, use a grid layout.

First row:

* Top Content Themes
* Title Patterns
* Publishing Cadence

Second row:

* Core Beliefs
* Audience Pain Points
* Quick Insights

Charts

Use Recharts.

Expected chart types:

* Donut chart for content themes
* Horizontal bar chart for title patterns
* Vertical bar chart for publishing cadence
* Simple ranked list cards for beliefs and pain points

Use purple tones for the charts.

Card Style

All cards should use:

* White background
* 1px border: #E5E7EB
* Border radius: 12px
* Soft shadow
* Padding: 20-24px

Cards should look compact and dashboard-like.

Typography

Use sans-serif font.

Prefer:

* Inter
* Geist
* system-ui

Do not use serif fonts.

Typography scale:

* Page title: 28-32px, bold
* Card numbers: 28-32px, bold
* Card titles: 14-16px, semibold
* Body text: 13-14px
* Muted labels: 12-13px

Video Table

The video table should appear below the dashboard cards.

Columns:

* Thumbnail
* Title
* Published
* Views
* Theme
* Title Pattern
* Why It Works

Table style:

* White card wrapper
* Compact rows
* Subtle borders
* Small thumbnails
* No oversized typography

Important UI Correction

The current implementation looks like a simple report page.

Rewrite it to look like a real SaaS dashboard with:

* left sidebar
* compact metric cards
* chart cards
* analysis grid
* table section
* purple accent theme

Use the expected reference image as the target layout, but apply purple instead of green.