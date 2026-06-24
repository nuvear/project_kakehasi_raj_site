# M3 Expressive — Component Catalog Reference

## Component Matrix

### Actions

| Component | Variants | M3E Enhancements | Key Tokens |
|---|---|---|---|
| **Button** | Filled, Outlined, Tonal, Elevated, Text | Pill shape (Full radius), bolder fill colors | `primary`, `onPrimary`, `shapeCornerFull` |
| **FAB** | Small, Regular, Large, Extended | Circle shape, vivid `primaryContainer` fill, spring-bounce on tap | `primaryContainer`, `onPrimaryContainer`, `shapeCornerFull` |
| **Icon Button** | Standard, Filled, Filled Tonal, Outlined | Larger 48dp default, higher contrast outlines | `onSurfaceVariant`, `primary` |
| **Segmented Button** | Single-select, Multi-select | Shape-morphing selection indicator | `secondaryContainer`, `shapeCornerFull` |

#### Button Selection Guide
```
Primary action (e.g., "Save")       → Filled Button
Secondary action (e.g., "Cancel")   → Outlined or Text Button
Prominent action (e.g., "Compose")  → FAB or Extended FAB
Toggle/group (e.g., "List/Grid")    → Segmented Button
Icon-only (e.g., "Favorite")        → Icon Button (Filled Tonal)
```

### Communication

| Component | Variants | M3E Enhancements | Key Tokens |
|---|---|---|---|
| **Badge** | Small (dot), Large (count) | Bolder color contrast on `error` | `error`, `onError` |
| **Progress Indicator** | Linear, Circular | Richer track colors, spring-based determinate fill | `primary`, `surfaceContainerHighest` |
| **Snackbar** | Standard, Action, Dismiss | Higher contrast surface, pill-shape action button | `inverseSurface`, `inverseOnSurface` |
| **Tooltip** | Plain, Rich | Improved contrast, `surfaceContainer` fill | `onSurface`, `surfaceContainer` |

### Containment

| Component | Variants | M3E Enhancements | Key Tokens |
|---|---|---|---|
| **Bottom Sheet** | Standard, Modal | ExtraLarge top corners, spring open/close | `surfaceContainerLow`, `shapeCornerExtraLargeTop` |
| **Card** | Elevated, Filled, Outlined | Squircle option, richer tonal elevation, shape morph on expand | `surfaceContainerLow`–`High`, `shapeCornerMedium` |
| **Carousel** | Multi-browse, Hero, Full-screen | New component — shape-morphing item containers | `shapeCornerExtraLarge`, variable per item |
| **Dialog** | Basic, Full-screen | ExtraLarge shape, spring entrance | `surfaceContainerHigh`, `shapeCornerExtraLarge` |
| **Divider** | Full-width, Inset, Middle-inset | Thinner (1dp → 0.5dp hairline option) | `outlineVariant` |
| **Side Sheet** | Standard, Modal | LargeEnd shape, coexists with navigation rail | `surfaceContainerLow`, `shapeCornerLargeEnd` |

### Navigation

| Component | Variants | M3E Enhancements | Key Tokens |
|---|---|---|---|
| **Bottom App Bar** | Standard (with FAB cradle) | Tonal elevation, spring FAB animation | `surfaceContainer`, Level 2 |
| **Navigation Bar** | Standard | Active indicator uses `secondaryContainer` with pill shape, bold label weight | `secondaryContainer`, `shapeCornerFull` |
| **Navigation Drawer** | Standard, Modal | Large end shape, persistent on Expanded windows | `surfaceContainerLow`, `shapeCornerLargeEnd` |
| **Navigation Rail** | Standard | Active pill indicator, visible on Medium+ windows | `secondaryContainer`, `shapeCornerFull` |
| **Search Bar** | Standard, Docked, Full-screen | Pill shape, spring expand transition | `surfaceContainerHigh`, `shapeCornerFull` |
| **Tabs** | Primary, Secondary | Spring-animated active indicator, bolder color | `primary`, `shapeCornerFull` (indicator) |
| **Top App Bar** | Center-aligned, Small, Medium, Large | Scroll-collapse with spring physics | `surface`, `surfaceContainer` on scroll |

### Selection

| Component | Variants | M3E Enhancements | Key Tokens |
|---|---|---|---|
| **Checkbox** | Standard, Indeterminate | Bouncy check animation (spring), bolder fill | `primary`, `onPrimary` |
| **Chip** | Assist, Filter, Input, Suggestion | Spring-animated selection state, shape morph | `surfaceContainerLow`, `shapeCornerSmall` |
| **Date Picker** | Docked, Modal, Range | Rounded selection indicators, spring transitions | `primary`, `shapeCornerFull` |
| **Menu** | Standard, Cascading | ExtraSmall shape, shadow elevation | `surfaceContainer`, `shapeCornerExtraSmall` |
| **Radio Button** | Standard | Spring-animated dot fill | `primary` |
| **Slider** | Continuous, Discrete | Thumb shape morph on drag, vibrant track | `primary`, `shapeCornerFull` |
| **Switch** | Standard, Icon | Spring-animated thumb slide + shape morph | `primary`, `onPrimary`, `shapeCornerFull` |
| **Time Picker** | Docked, Modal | Circular dial with spring physics | `primary`, `tertiaryContainer` |

### Text Input

| Component | Variants | M3E Enhancements | Key Tokens |
|---|---|---|---|
| **Text Field** | Filled, Outlined | ExtraSmall top shape (filled), error state with spring shake | `surfaceContainerHighest`, `primary`, `error` |

---

## Adaptive Layout Breakpoints

### Window Size Classes

| Class | Width | Nav Pattern | Layout |
|---|---|---|---|
| **Compact** | < 600dp | Bottom Navigation Bar | Single-column, full-width |
| **Medium** | 600–840dp | Navigation Rail | Two-column, side-by-side |
| **Expanded** | > 840dp | Navigation Drawer (persistent) | Multi-pane, detail-aside |

### Responsive Component Mapping

```
Compact:
  Navigation → Navigation Bar (bottom)
  Sheets    → Bottom Sheet (modal)
  Detail    → Full-screen push
  Search    → Full-screen expand

Medium:
  Navigation → Navigation Rail (side)
  Sheets    → Side Sheet (standard)
  Detail    → Pane alongside list
  Search    → Docked search bar

Expanded:
  Navigation → Navigation Drawer (persistent)
  Sheets    → Side Sheet (persistent)
  Detail    → Detail pane with master list
  Search    → Docked, always visible
```

### Compose Adaptive Layout

```kotlin
val windowSizeClass = calculateWindowSizeClass(activity)

NavigationSuiteScaffold(
    navigationSuiteItems = {
        items.forEach { item ->
            item(
                icon = { Icon(item.icon, contentDescription = item.label) },
                label = { Text(item.label) },
                selected = item == currentItem,
                onClick = { currentItem = item }
            )
        }
    }
) {
    // Content adapts automatically based on window size class
    // Compact → bottom bar, Medium → rail, Expanded → drawer
}
```

---

## Component Selection Decision Tree

```
Is it a primary action?
├─ Yes → Is it persistent on screen?
│        ├─ Yes → FAB or Extended FAB
│        └─ No  → Filled Button
├─ Is it a secondary action?
│  ├─ Needs visual weight? → Outlined Button or Tonal Button
│  └─ Minimal weight?      → Text Button
├─ Is it a toggle or group selection?
│  └─ Yes → Segmented Button or Chip (Filter)
├─ Is it navigation?
│  ├─ Top-level destinations? → Navigation Bar / Rail / Drawer (adaptive)
│  ├─ Within a section?       → Tabs
│  └─ Hierarchical?          → Top App Bar with back nav
├─ Is it content display?
│  ├─ Scrollable group?  → Carousel or List
│  ├─ Actionable unit?   → Card (Elevated, Filled, or Outlined)
│  └─ Modal overlay?     → Dialog or Bottom Sheet
└─ Is it data input?
   ├─ Text → Text Field (Filled or Outlined)
   ├─ Selection → Checkbox, Radio, Switch, Slider
   ├─ Date → Date Picker
   └─ Time → Time Picker
```

---

## Touch Target Requirements

| Minimum | Context |
|---|---|
| **48dp × 48dp** | All interactive elements (buttons, icons, toggles) |
| **24dp** | Visual icon size (with 48dp touch target padding) |
| **8dp** | Minimum spacing between adjacent touch targets |

Ensure `Modifier.minimumInteractiveComponentSize()` in Compose, or `android:minHeight="48dp"` in XML.
