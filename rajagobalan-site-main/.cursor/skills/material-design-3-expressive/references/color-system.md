# M3 Expressive — Color System Reference

## Dynamic Color Generation

M3's dynamic color algorithmically generates a full harmonious palette from a **single source color**. In M3 Expressive, color has a deeper role: it **guides user focus and signals importance**.

### Tonal Palette Construction

Each key color generates a **13-stop tonal palette** (T0–T100):

```
T0   T4   T6   T10  T12  T17  T20  T22  T24  T30  T35  T40  T50
T60  T70  T80  T87  T90  T92  T94  T95  T96  T98  T99  T100
```

- **T0** = pure black (#000000)
- **T100** = pure white (#FFFFFF)
- Intermediate stops derived via HCT (Hue-Chroma-Tone) color space
- HCT ensures **perceptually uniform** lightness steps

### Five Key Color Groups

| Group | Source | Role |
|---|---|---|
| **Primary** | Brand or user-selected color | Main actions, active states, emphasis |
| **Secondary** | Complementary hue shift | Supporting UI, less prominent actions |
| **Tertiary** | Analogous/triadic hue | Accent, balancing visual interest |
| **Neutral** | Desaturated primary | Surfaces, backgrounds, text |
| **Neutral-Variant** | Slightly chromatic neutral | Outlines, surface variants, dividers |

### 29 Semantic Color Roles

#### Primary Group
```
primary                → T40 light / T80 dark
onPrimary              → T100 light / T20 dark
primaryContainer       → T90 light / T30 dark
onPrimaryContainer     → T10 light / T90 dark
inversePrimary         → T80 light / T40 dark
```

#### Secondary Group
```
secondary              → T40 light / T80 dark
onSecondary            → T100 light / T20 dark
secondaryContainer     → T90 light / T30 dark
onSecondaryContainer   → T10 light / T90 dark
```

#### Tertiary Group
```
tertiary               → T40 light / T80 dark
onTertiary             → T100 light / T20 dark
tertiaryContainer      → T90 light / T30 dark
onTertiaryContainer    → T10 light / T90 dark
```

#### Error Group
```
error                  → T40 light / T80 dark
onError                → T100 light / T20 dark
errorContainer         → T90 light / T30 dark
onErrorContainer       → T10 light / T90 dark
```

#### Surface Group
```
surface                → T99 light / T6 dark
onSurface              → T10 light / T90 dark
surfaceVariant         → N-V T90 light / N-V T30 dark
onSurfaceVariant       → N-V T30 light / N-V T80 dark
surfaceDim             → N T87 light / N T6 dark
surfaceBright          → N T98 light / N T24 dark
surfaceContainerLowest → N T100 light / N T4 dark
surfaceContainerLow    → N T96 light / N T10 dark
surfaceContainer       → N T94 light / N T12 dark
surfaceContainerHigh   → N T92 light / N T17 dark
surfaceContainerHighest→ N T90 light / N T22 dark
```

#### Utility
```
outline                → N-V T50 light / N-V T60 dark
outlineVariant         → N-V T80 light / N-V T30 dark
inverseSurface         → N T20 light / N T90 dark
inverseOnSurface       → N T95 light / N T20 dark
scrim                  → T0 (always black, alpha varies)
shadow                 → T0 (always black)
```

### Fixed Accent Colors (Cross-Theme Stable)
```
primaryFixed           → T90
primaryFixedDim        → T80
onPrimaryFixed         → T10
onPrimaryFixedVariant  → T30
secondaryFixed         → T90
secondaryFixedDim      → T80
onSecondaryFixed       → T10
onSecondaryFixedVariant→ T30
tertiaryFixed          → T90
tertiaryFixedDim       → T80
onTertiaryFixed        → T10
onTertiaryFixedVariant → T30
```

## M3 Expressive Color Principles

1. **Bold for action**: Primary actions use bright, saturated primary tones
2. **Muted for support**: Secondary content and backgrounds use desaturated neutrals
3. **Hierarchy through contrast**: High-contrast pairings draw focus to interactive elements
4. **Personalization**: Dynamic color adapts to user wallpaper on Android 12+
5. **Content-derived color**: Media apps extract palette from album art, photos, etc.

## Accessibility Validation

| Pairing | Minimum Ratio | Level |
|---|---|---|
| `onPrimary` on `primary` | 4.5:1 | AA Normal |
| `onSurface` on `surface` | 4.5:1 | AA Normal |
| `onSurfaceVariant` on `surfaceVariant` | 3:1 | AA Large |
| Body text on any surface | 4.5:1 | AA Normal |
| Large text (≥24sp or ≥18.66sp bold) | 3:1 | AA Large |

### Compose Implementation

```kotlin
val colorScheme = if (dynamicColor && Build.VERSION.SDK_INT >= 31) {
    if (darkTheme) dynamicDarkColorScheme(context)
    else dynamicLightColorScheme(context)
} else {
    if (darkTheme) darkColorScheme(
        primary = Color(0xFFD0BCFF),
        onPrimary = Color(0xFF381E72),
        primaryContainer = Color(0xFF4F378B),
        // ... full scheme
    ) else lightColorScheme(
        primary = Color(0xFF6750A4),
        onPrimary = Color(0xFFFFFFFF),
        primaryContainer = Color(0xFFEADDFF),
        // ... full scheme
    )
}

MaterialTheme(colorScheme = colorScheme) { /* content */ }
```

### CSS Custom Properties (Web)

```css
:root {
  --md-sys-color-primary: #6750a4;
  --md-sys-color-on-primary: #ffffff;
  --md-sys-color-primary-container: #eaddff;
  --md-sys-color-surface: #fffbfe;
  --md-sys-color-on-surface: #1c1b1f;
  /* ... all 29 roles */
}

[data-theme="dark"] {
  --md-sys-color-primary: #d0bcff;
  --md-sys-color-on-primary: #381e72;
  --md-sys-color-surface: #1c1b1f;
  --md-sys-color-on-surface: #e6e1e5;
}
```
