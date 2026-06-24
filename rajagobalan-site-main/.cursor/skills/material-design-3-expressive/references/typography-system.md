# M3 Expressive — Typography System Reference

## Type Scale (15+ Styles)

M3 Expressive updates the type scale to support **bold editorial layouts** and **variable emotional expression**.

### Complete Type Scale

| Role | Size (sp/px) | Line Height | Weight | Tracking | Use Case |
|---|---|---|---|---|---|
| **Display XL** | 88 | 96 | 475 | 0 | Hero banners, splash screens (M3E new) |
| **Display Large** | 57 | 64 | 475 | −0.25 | Primary headlines, landing pages |
| **Display Medium** | 45 | 52 | 475 | 0 | Section heroes, marketing headers |
| **Display Small** | 36 | 44 | 475 | 0 | Feature callouts, card headlines |
| **Headline Large** | 32 | 40 | 475 | 0 | Page titles, dialog headlines |
| **Headline Medium** | 28 | 36 | 475 | 0 | Section headings |
| **Headline Small** | 24 | 32 | 475 | 0 | Sub-section headings |
| **Title Large** | 22 | 30 | 400 | 0 | Top app bar titles |
| **Title Medium** | 16 | 24 | 500 | 0.15 | List item primary text, card titles |
| **Title Small** | 14 | 20 | 500 | 0.1 | Supporting titles, tab labels |
| **Body Large** | 16 | 24 | 400 | 0.5 | Primary body content |
| **Body Medium** | 14 | 20 | 400 | 0.25 | Default body text |
| **Body Small** | 12 | 16 | 400 | 0.4 | Captions, supplementary text |
| **Label Large** | 14 | 20 | 500 | 0.1 | Button text, navigation labels |
| **Label Medium** | 12 | 16 | 500 | 0.5 | Chips, badges, small buttons |
| **Label Small** | 11 | 16 | 500 | 0.5 | Timestamps, fine print |

### Code Styles
| Role | Size | Line Height | Weight | Font |
|---|---|---|---|---|
| Code Large | 16 | 24 | 400 | Monospace |
| Code Medium | 14 | 20 | 400 | Monospace |

## Font Recommendations

### Display / Headlines
- **Google Sans** (Google products)
- **Roboto Flex** (variable font, full axis control)
- Any branded display typeface with optical sizing

### Body / Labels
- **Google Sans Text** (Google products)
- **Roboto** (Android system default)
- **Noto Sans** (multilingual coverage)

### Code
- **Google Sans Mono**
- **JetBrains Mono**
- **Roboto Mono**

## Variable Font Axes

M3 Expressive recommends variable fonts for fluid expression:

| Axis | Tag | Range | Use |
|---|---|---|---|
| Weight | `wght` | 100–900 | Responsive emphasis without font swaps |
| Width | `wdth` | 75–125 | Space-adaptive text fitting |
| Optical Size | `opsz` | 8–144 | Auto-adjusts letterforms for reading size |
| Grade | `GRAD` | −50–200 | Subtle weight changes without layout shift |
| Slant | `slnt` | −12–0 | Italicized emphasis |

### Compose Variable Font Usage

```kotlin
val displayLargeStyle = TextStyle(
    fontFamily = FontFamily(
        Font(
            googleFont = GoogleFont("Roboto Flex"),
            fontProvider = googleFontProvider,
            weight = FontWeight(475),
        )
    ),
    fontSize = 57.sp,
    lineHeight = 64.sp,
    letterSpacing = (-0.25).sp,
    fontFeatureSettings = "opsz" // enable optical sizing
)
```

## Expressive Typography Principles

### 1. Editorial Impact
Use Display roles to create bold, magazine-style layouts:
```
Display Large → hero text
Body Large → supporting paragraph
Label Medium → metadata / attribution
```

### 2. Emotional Expression
Weight transitions convey emotional states:
```
Normal state:  Body Medium (weight 400)
Emphasis:      Body Medium (weight 600 via variable font)
De-emphasis:   Body Medium (weight 300, opacity 0.8)
```

### 3. Information Hierarchy
Never use more than 3 type scale levels in a single view:
```
✓  Headline Medium → Title Medium → Body Medium
✗  Display Large → Headline Small → Title Large → Body Large → Label Small
```

### 4. Responsive Scaling
Type should scale with window size class:
```
Compact:   Display Small (36sp) for heroes
Medium:    Display Medium (45sp) for heroes
Expanded:  Display Large (57sp) for heroes
```

## Compose Implementation

```kotlin
val typography = Typography(
    displayLarge = TextStyle(
        fontFamily = brandFontFamily,
        fontWeight = FontWeight(475),
        fontSize = 57.sp,
        lineHeight = 64.sp,
        letterSpacing = (-0.25).sp,
    ),
    headlineMedium = TextStyle(
        fontFamily = brandFontFamily,
        fontWeight = FontWeight(475),
        fontSize = 28.sp,
        lineHeight = 36.sp,
    ),
    bodyMedium = TextStyle(
        fontFamily = readingFontFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        letterSpacing = 0.25.sp,
    ),
    labelLarge = TextStyle(
        fontFamily = readingFontFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        letterSpacing = 0.1.sp,
    ),
    // ... remaining styles
)

MaterialTheme(typography = typography) { /* content */ }
```

## CSS Custom Properties (Web)

```css
:root {
  --md-sys-typescale-display-large-font: 'Roboto Flex', sans-serif;
  --md-sys-typescale-display-large-size: 57px;
  --md-sys-typescale-display-large-line-height: 64px;
  --md-sys-typescale-display-large-weight: 475;
  --md-sys-typescale-display-large-tracking: -0.25px;

  --md-sys-typescale-body-medium-font: 'Roboto', sans-serif;
  --md-sys-typescale-body-medium-size: 14px;
  --md-sys-typescale-body-medium-line-height: 20px;
  --md-sys-typescale-body-medium-weight: 400;
  --md-sys-typescale-body-medium-tracking: 0.25px;
}
```

## Accessibility

- **Minimum body text**: 12sp (Body Small) — never go below
- **Minimum touch-associated label**: 11sp (Label Small)
- **Contrast**: all text must meet WCAG 2.1 AA ratios on its background
- **Dynamic type**: support system font scaling (Android `sp` units, iOS Dynamic Type, CSS `rem`)
- **Line length**: 45–75 characters per line for body text readability
