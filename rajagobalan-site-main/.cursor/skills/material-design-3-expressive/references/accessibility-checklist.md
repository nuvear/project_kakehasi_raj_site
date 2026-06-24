# M3 Expressive — Accessibility Checklist

## WCAG 2.1 Compliance Matrix

### Color Contrast (WCAG 1.4.3 / 1.4.6)

| Element | Minimum Ratio (AA) | Enhanced Ratio (AAA) | M3 Token Pairing |
|---|---|---|---|
| Body text (< 24sp) | 4.5:1 | 7:1 | `onSurface` / `surface` |
| Large text (≥ 24sp or ≥ 18.66sp bold) | 3:1 | 4.5:1 | `onSurface` / `surface` |
| UI components (icons, borders) | 3:1 | — | `onSurfaceVariant` / `surface` |
| Button text | 4.5:1 | 7:1 | `onPrimary` / `primary` |
| Link text | 4.5:1 | 7:1 | `primary` / `surface` |
| Disabled state | No minimum | — | Use `onSurface` @ 38% opacity |
| Placeholder text | 4.5:1 | — | `onSurfaceVariant` / `surfaceContainerHighest` |

### M3 Guaranteed Accessible Pairings

These token pairings **always** meet AA contrast requirements at any tonal palette:

```
✓ onPrimary          on  primary
✓ onPrimaryContainer on  primaryContainer
✓ onSecondary        on  secondary
✓ onSecondaryContainer on secondaryContainer
✓ onTertiary         on  tertiary
✓ onTertiaryContainer on tertiaryContainer
✓ onError            on  error
✓ onErrorContainer   on  errorContainer
✓ onSurface          on  surface (all variants)
✓ onSurfaceVariant   on  surfaceVariant
```

---

## Touch Targets (WCAG 2.5.8)

| Requirement | Value |
|---|---|
| Minimum touch target | 48dp × 48dp |
| Minimum visual size | 24dp (icon) with padding to 48dp |
| Spacing between targets | ≥ 8dp |
| Slider thumb | 48dp touch target (20dp visual) |
| Checkbox/Radio | 48dp touch target (18dp visual) |

### Compose Enforcement

```kotlin
// Automatic enforcement — M3 components include this by default
IconButton(onClick = { /* ... */ }) {
    Icon(
        imageVector = Icons.Default.Favorite,
        contentDescription = "Add to favorites" // Required!
    )
}

// Manual enforcement for custom components
Box(
    modifier = Modifier
        .minimumInteractiveComponentSize() // Ensures 48dp minimum
        .clickable { /* ... */ }
)
```

---

## Motion Accessibility (WCAG 2.3.3)

### System Settings to Respect

| Platform | Setting | Detection |
|---|---|---|
| **Android** | Settings → Accessibility → Remove animations | `Settings.Global.ANIMATOR_DURATION_SCALE == 0` |
| **Web** | `prefers-reduced-motion: reduce` | CSS media query or `matchMedia()` |
| **iOS** | Settings → Accessibility → Reduce Motion | `UIAccessibility.isReduceMotionEnabled` |

### Implementation Checklist

- [ ] All spring animations degrade to instant (`snap()`) when reduced motion enabled
- [ ] Shape morphing skips to final state
- [ ] No auto-playing animations (carousels, progress spinners exempt)
- [ ] Parallax effects disabled
- [ ] Page transitions use simple fade or cut
- [ ] No content depends solely on animation to be understood

```kotlin
// Compose
@Composable
fun accessibleSpring(): AnimationSpec<Float> {
    val reduceMotion = LocalReduceMotion.current
    return if (reduceMotion) snap() else spring(
        dampingRatio = 0.7f,
        stiffness = 400f
    )
}
```

```css
/* Web */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Screen Reader Support (WCAG 4.1.2)

### Content Descriptions

| Element | Requirement |
|---|---|
| Icon Button | `contentDescription` must describe the action (e.g., "Delete item") |
| Decorative icon | `contentDescription = null` (hidden from accessibility tree) |
| Image | `contentDescription` with meaningful alt text |
| FAB | `contentDescription` describing the action (e.g., "Compose new email") |
| Toggle (Switch) | State announced automatically; label must describe what it controls |
| Card | If clickable, needs `onClickLabel` (e.g., "Open article details") |

### Semantic Structure

```kotlin
// Group related content
Modifier.semantics(mergeDescendants = true) { /* ... */ }

// Override announcement
Modifier.semantics {
    contentDescription = "Price: $24.99, 20% off"
    stateDescription = "Selected"
    role = Role.Button
}

// Heading hierarchy
Text(
    "Section Title",
    modifier = Modifier.semantics { heading() }
)
```

### Navigation Order

- [ ] Logical reading order matches visual order
- [ ] Focus moves top-to-bottom, start-to-end
- [ ] Modal dialogs trap focus within
- [ ] Bottom sheets announce themselves and trap focus
- [ ] After dismissal, focus returns to trigger element

---

## Keyboard Navigation (WCAG 2.1.1)

| Pattern | Keys |
|---|---|
| Activate button/link | Enter or Space |
| Navigate between items | Arrow keys |
| Dismiss overlay | Escape |
| Tab between groups | Tab / Shift+Tab |
| Select in dropdown | Arrow + Enter |

- [ ] All interactive elements are focusable
- [ ] Focus indicator is visible (2dp outline, `primary` color, 3:1 contrast)
- [ ] Custom components support keyboard interaction
- [ ] No keyboard traps (user can always Tab out)

---

## Dynamic Content (WCAG 4.1.3)

### Live Regions

```kotlin
// Compose — announce updates to screen readers
Modifier.semantics {
    liveRegion = LiveRegionMode.Polite // or .Assertive
}

// Use for:
// - Snackbar messages
// - Error messages
// - Progress updates
// - Search result counts
```

### Error Handling

- [ ] Error messages appear adjacent to the input field
- [ ] `Text Field` `isError` state is set correctly
- [ ] Error description is linked to the field (`supportingText` parameter)
- [ ] Color is NOT the sole indicator of error (icon + text required)

---

## Testing Checklist

### Automated
- [ ] Run Accessibility Scanner (Android) on every screen
- [ ] Lighthouse accessibility audit (Web) — aim for 100
- [ ] `ComposeTestRule.onNode().assertHasContentDescription()`
- [ ] axe DevTools (Web) for WCAG violations

### Manual
- [ ] TalkBack (Android) / VoiceOver (iOS) walkthrough of all flows
- [ ] Keyboard-only navigation test (no mouse/touch)
- [ ] Font scale: test at 200% system font size
- [ ] Display size: test at largest system display size
- [ ] High contrast mode (Android/Windows)
- [ ] Inverted colors test
- [ ] Reduced motion test
- [ ] Switch Access / Voice Access test

### M3 Expressive–Specific
- [ ] Dynamic color palettes maintain AA contrast with user wallpapers
- [ ] Spring animations respect reduced motion settings
- [ ] Shape morphing doesn't cause content to be obscured
- [ ] Expressive FAB touch target remains 48dp despite shape changes
- [ ] Bold typography maintains readability at all Display sizes
- [ ] Tonal elevation differences are perceptible (not relying on color alone)
