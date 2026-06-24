# M3 Expressive — Motion System Reference

## Spring Physics (Replacing Easing + Duration)

M3 Expressive introduces a **spring-physics motion system** replacing the legacy easing-curve + fixed-duration model. Springs feel more natural because they model real-world physical behavior.

### Spring Parameters

| Parameter | Description | Typical Range |
|---|---|---|
| `stiffness` | Resistance to displacement (higher = snappier) | 100–1500 |
| `dampingRatio` | Oscillation decay (1.0 = critically damped, <1.0 = bouncy) | 0.4–1.0 |
| `mass` | Inertia of the animated object | 0.5–2.0 (usually 1.0) |

### Expression Presets

#### Default Spring
```
stiffness: 400
dampingRatio: 0.7
```
Use for: standard button presses, toggles, small state changes.

#### Expressive Spatial
```
stiffness: 300
dampingRatio: 0.6
```
Use for: page transitions, shared-element transforms, navigation changes. The lower damping produces a visible but subtle bounce that conveys energy and liveliness.

#### Expressive Effects
```
stiffness: 200–500 (variable)
dampingRatio: 0.4–0.8 (variable)
```
Use for: celebration moments, success confirmations, delight animations. Tuned per-context for emotional impact.

#### Snappy / Utility
```
stiffness: 800–1500
dampingRatio: 0.9–1.0
```
Use for: dismissals, swipe-to-delete, utility animations where speed matters over expressiveness.

## Transition Patterns

### Container Transform
The hero element's container expands into a full detail view. The outgoing and incoming content cross-fade within the morphing container.

```
Trigger: tap on card / list item / FAB
Container: morphs shape, size, position, elevation
Content: cross-fade outgoing → incoming
Motion: expressive spatial spring
```

### Shared Axis
Sequential navigation along X, Y, or Z axis. Outgoing element exits in one direction; incoming enters from the same direction.

```
Forward:  outgoing slides left/up + fades out
          incoming slides in from right/down + fades in
Backward: reverse of forward
Motion: default spring
```

### Fade Through
For unrelated destinations (e.g., bottom nav switches). Outgoing fades out and scales down slightly; incoming fades in and scales up.

```
Outgoing: fade out + scale(0.92)
Incoming: fade in + scale(1.0) from scale(1.08)
Motion: default spring with short settle
```

### Collapse / Expand
Progressive disclosure of content.

```
Expand: height animates from 0 to intrinsic
        content fades in after container settles
Collapse: content fades out, then height animates to 0
Motion: default spring
```

## Shape Morphing

M3 Expressive introduces **shape morphing** where container corners animate between shape states.

```
FAB at rest:     shapeCornerFull (circle)
FAB pressed:     shapeCornerExtraLarge (squircle)
FAB expanded:    shapeCornerLarge (rounded rectangle)
```

### Compose Implementation

```kotlin
val shape by animateShape(
    targetShape = if (expanded) RoundedCornerShape(16.dp)
                  else CircleShape,
    animationSpec = spring(
        dampingRatio = 0.6f,
        stiffness = 300f
    )
)

Surface(shape = shape) { /* content */ }
```

## Motion + Accessibility

### Respecting User Preferences

Always check system accessibility settings:

```kotlin
// Compose
val reduceMotion = LocalReduceMotion.current
val animationSpec = if (reduceMotion) {
    snap<Float>() // instant, no animation
} else {
    spring(dampingRatio = 0.7f, stiffness = 400f)
}
```

```css
/* Web */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Motion Principles Checklist

- [ ] Every animation communicates meaning (spatial relationship, state change, or feedback)
- [ ] No animation is purely decorative
- [ ] `prefers-reduced-motion` / "Remove animations" setting is respected
- [ ] Springs settle within ~400ms for most interactions
- [ ] Page transitions settle within ~600ms
- [ ] Celebration/delight moments ≤ 1000ms

## Legacy Migration (Easing → Spring)

| Old (M3 / M2) | New (M3 Expressive) |
|---|---|
| `EaseInOut` 300ms | `spring(stiffness=400, dampingRatio=0.7)` |
| `EaseIn` 200ms | `spring(stiffness=800, dampingRatio=0.9)` (exit) |
| `EaseOut` 250ms | `spring(stiffness=600, dampingRatio=0.8)` (enter) |
| `LinearEasing` 150ms | `spring(stiffness=1500, dampingRatio=1.0)` (snap) |
| Path-based easing curves | Spring with variable stiffness per segment |
