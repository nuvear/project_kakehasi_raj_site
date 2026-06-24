# M3 Expressive — Shape & Elevation System Reference

## Shape Scale

M3 defines a shape scale of corner rounding tokens. M3 Expressive adds **35 new shapes** and shape morphing.

### Core Shape Tokens

| Token | Corner Radius | Typical Use |
|---|---|---|
| `shapeCornerNone` | 0dp | Sharp-edged containers, full-bleed images |
| `shapeCornerExtraSmall` | 4dp | Tooltips, snackbars, small badges |
| `shapeCornerExtraSmallTop` | 4dp top, 0dp bottom | Top-attached elements |
| `shapeCornerSmall` | 8dp | Chips, small cards, text fields |
| `shapeCornerMedium` | 12dp | Cards, dialogs, menus |
| `shapeCornerLarge` | 16dp | FAB (resting), navigation drawers |
| `shapeCornerLargeEnd` | 0dp start, 16dp end | Side sheets |
| `shapeCornerLargeTop` | 16dp top, 0dp bottom | Bottom sheets |
| `shapeCornerExtraLarge` | 28dp | Expanded FAB, large cards |
| `shapeCornerExtraLargeTop` | 28dp top, 0dp bottom | Large bottom sheets |
| `shapeCornerFull` | 50% (pill/circle) | FAB circle, pills, toggles, circular avatars |

### M3 Expressive Shape Families (New)

#### Rounded (Default)
Classic rounded rectangles — the baseline M3 shape language.
```
RoundedCornerShape(12.dp) // shapeCornerMedium
```

#### Cut (Chamfered)
Angled corners creating a geometric, editorial feel.
```
CutCornerShape(12.dp) // 45° chamfer
```

#### Squircle (Superellipse)
Continuous curvature between circle and square — smoother than simple radius rounding. Provides an iOS-like smoothness within M3 vocabulary.
```
// Compose: use SmoothRoundedCornerShape (custom or library)
SmoothRoundedCornerShape(12.dp, smoothing = 0.6f)
```

#### Asymmetric Configurations
Mix corner treatments for dynamic, expressive containers:
```kotlin
RoundedCornerShape(
    topStart = 28.dp,    // ExtraLarge
    topEnd = 28.dp,      // ExtraLarge
    bottomStart = 4.dp,  // ExtraSmall
    bottomEnd = 4.dp     // ExtraSmall
)
```

### Shape Selection Guide

| Component | Shape Token | Expressiveness |
|---|---|---|
| FAB (resting) | `Full` (circle) | Maximum |
| Extended FAB | `Full` (pill) | Maximum |
| Filled Button | `Full` (pill) | High |
| Card | `Medium` (12dp) | Moderate |
| Dialog | `ExtraLarge` (28dp) | High |
| Bottom Sheet | `ExtraLarge` top | High |
| Text Field | `ExtraSmall` top | Low |
| Chip | `Small` (8dp) | Moderate |
| Navigation Bar | `None` (full-width) | — |
| Menu | `ExtraSmall` (4dp) | Low |
| Snackbar | `ExtraSmall` (4dp) | Low |
| Tooltip | `ExtraSmall` (4dp) | Low |

---

## Tonal Elevation System

M3 Expressive uses **tonal elevation** (surface color shift) instead of shadow-only elevation for most surfaces.

### How Tonal Elevation Works

Higher elevation → surface color shifts from `surface` toward `primary`:

```
Light theme: higher elevation = slightly tinted surface (warmer)
Dark theme:  higher elevation = lighter surface (more visible)
```

The color is computed via:
```
surfaceColorAtElevation(elevation) = surface.blend(primary, alpha)
```
Where `alpha` increases with elevation level.

### Elevation Scale

| Level | dp Value | Surface Color | Use Case |
|---|---|---|---|
| **Level 0** | 0dp | `surface` | Page background, flat content |
| **Level 1** | 1dp | `surfaceContainerLow` | Cards, app bars at rest |
| **Level 2** | 3dp | `surfaceContainer` | Elevated cards, navigation rail |
| **Level 3** | 6dp | `surfaceContainerHigh` | FAB, navigation bar, bottom app bar |
| **Level 4** | 8dp | `surfaceContainerHighest` | — (rarely used) |
| **Level 5** | 12dp | `surfaceContainerHighest` | — (reserved for special emphasis) |

### When to Use Shadow vs. Tonal Elevation

| Scenario | Elevation Type |
|---|---|
| Cards on page background | Tonal (no shadow) |
| Navigation bar / rail | Tonal (no shadow) |
| FAB resting | Tonal + subtle shadow |
| Bottom sheet | Shadow (needs visual lift) |
| Menu / dropdown | Shadow (floating overlay) |
| Dialog | Shadow (modal overlay) |
| Tooltip | Shadow (small floating element) |

### Compose Implementation

```kotlin
// Tonal elevation (default in M3)
Surface(
    tonalElevation = 3.dp, // Level 2
    shape = MaterialTheme.shapes.medium,
    color = MaterialTheme.colorScheme.surface
) {
    // Content — surface color auto-tints based on tonalElevation
}

// Shadow elevation (explicit)
Surface(
    shadowElevation = 6.dp,
    tonalElevation = 0.dp,
    shape = MaterialTheme.shapes.extraLarge,
) {
    // Floating content with drop shadow
}
```

### CSS Implementation

```css
/* Tonal elevation via surface container tokens */
.card-level-0 { background: var(--md-sys-color-surface); }
.card-level-1 { background: var(--md-sys-color-surface-container-low); }
.card-level-2 { background: var(--md-sys-color-surface-container); }
.card-level-3 { background: var(--md-sys-color-surface-container-high); }
.card-level-4 { background: var(--md-sys-color-surface-container-highest); }

/* Shadow elevation for floating elements */
.dialog {
    background: var(--md-sys-color-surface-container-high);
    box-shadow: 0 8px 12px rgba(0,0,0,0.15), 0 4px 4px rgba(0,0,0,0.12);
}
```

---

## Shape Morphing

M3 Expressive introduces animated shape transitions between states.

### Common Morphing Patterns

```
FAB tap:          Circle → Squircle → Expanded rectangle
Card expand:      Medium (12dp) → ExtraLarge (28dp) → Full sheet
Chip selection:   Small (8dp) → pill with checkmark
Bottom sheet:     ExtraLarge top corners → None (full-screen)
```

### Implementation

```kotlin
val cornerRadius by animateDpAsState(
    targetValue = if (expanded) 28.dp else 50.dp,
    animationSpec = spring(
        dampingRatio = 0.6f,
        stiffness = 300f
    )
)

Surface(
    shape = RoundedCornerShape(cornerRadius),
    modifier = Modifier.clickable { expanded = !expanded }
) { /* content */ }
```

### Shape + Motion Best Practices

1. Morph shape alongside position and size changes (container transform)
2. Use spring physics — never animate shape with linear easing
3. Keep morphing duration under 600ms (spring settle time)
4. Pair shape change with subtle elevation change for depth cue
5. Respect `prefers-reduced-motion` — skip to final state instantly
