---
name: SwitchGuard Design System
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#44464f'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#757780'
  outline-variant: '#c5c6d1'
  surface-tint: '#495d92'
  primary: '#000519'
  on-primary: '#ffffff'
  primary-container: '#001b4e'
  on-primary-container: '#7185bd'
  inverse-primary: '#b2c5ff'
  secondary: '#775a00'
  on-secondary: '#ffffff'
  secondary-container: '#ffce51'
  on-secondary-container: '#735700'
  tertiary: '#000703'
  on-tertiary: '#ffffff'
  tertiary-container: '#002416'
  on-tertiary-container: '#0e996b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001848'
  on-primary-fixed-variant: '#304579'
  secondary-fixed: '#ffdf98'
  secondary-fixed-dim: '#f0c044'
  on-secondary-fixed: '#251a00'
  on-secondary-fixed-variant: '#5a4300'
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
The brand personality is rooted in institutional trust and modern security. This design system serves as a bridge between the heritage of the National Bank of Malawi and contemporary fintech efficiency. The emotional response should be one of immediate reassurance and unwavering stability, particularly during sensitive financial operations.

The design style follows a **Corporate / Modern** aesthetic with **Minimalist** tendencies. It leverages high-quality typography and structured card-based layouts to manage information density. The visual language is intentional and controlled, avoiding unnecessary ornamentation to ensure clarity and professional gravitas.

## Colors
The palette is dominated by the **Deep Navy Blue**, representing the bank's authority and depth. **Warm Gold** is used as a strategic accent to draw attention to high-value actions and brand signatures.

- **Primary (Navy):** Used for headers, primary buttons, and navigational anchors.
- **Secondary (Gold):** Reserved for call-to-actions that drive growth or highlight premium features.
- **Surface (Neutral):** A clean hierarchy of white and light grey (#F8F9FA) provides the canvas for data-heavy views.
- **Status (Emerald & Red):** Functional colors used strictly for system feedback—Emerald for successful security switches and Red for critical alerts or declined transactions.

## Typography
This design system utilizes **Inter** across all levels to maintain a systematic and utilitarian feel. The typeface’s high x-height and neutral character ensure maximum legibility in complex data tables and financial statements.

Headlines should use tighter letter spacing and heavier weights to command authority. Body text maintains generous line heights to facilitate reading comfort during high-stress interactions. Labels are occasionally set in uppercase with slight tracking to differentiate them from interactive body elements.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy for desktop (12 columns) and a **Fluid Grid** for mobile (4 columns). 

- **Desktop:** 1280px max-width container centered on the viewport.
- **Spacing Rhythm:** Based on an 8px base unit. Card padding is consistently 24px (stack-md) to provide "breathing room" for dense financial data.
- **Admin Views:** For internal dashboards, density is increased by reducing vertical spacing to 12px (stack-sm) and using a fluid layout that spans the full width of the screen to maximize data visibility.

## Elevation & Depth
Depth is conveyed through **Tonal Layers** and **Ambient Shadows**. 

The background is typically Light Grey (#F8F9FA), with primary content appearing on White cards. These cards utilize a very soft, diffused shadow (0px 4px 20px rgba(0, 27, 78, 0.05)) to lift them slightly off the page without creating visual noise. This "Soft Elevation" approach ensures the UI feels tactile and organized. 

Interactive elements like hover states on cards should slightly increase this shadow's intensity to indicate clickability. Borders are used minimally, mostly for input fields and table row separators, using a low-contrast grey (#E5E7EB).

## Shapes
The shape language is defined as **Rounded**, utilizing a standard 12px (0.75rem) corner radius for most containers and cards. This softens the formal nature of the Navy palette, making the security-focused application feel approachable and modern.

- **Standard Buttons:** 8px radius.
- **Data Cards:** 12px to 16px radius.
- **Status Badges:** Fully pill-shaped (100px radius) to distinguish them from interactive buttons.
- **Icon Badges:** Circular (50%) to create a distinct visual anchor.

## Components

### Buttons
- **Primary:** Deep Navy Blue background with White text. Solid, no border.
- **Secondary:** Warm Gold background with Navy text for high-contrast visibility.
- **Ghost:** Transparent background with Navy outline and text, used for secondary actions like "Cancel" or "Export."

### Status Indicators & Badges
- **Security Badges:** Icons contained within circular background badges. Use a 10% opacity tint of the status color (e.g., light emerald for success) as the badge background.
- **Status Badges:** Pill-shaped text labels. Success (Green), Warning (Gold), Alert (Red).

### Input Fields
- **Default:** White background, 1px border (#D1D5DB), 8px radius.
- **Focus:** 2px border using Primary Navy with a subtle outer glow.
- **Labeling:** Labels are always positioned above the field in `label-sm` for clarity.

### Data Tables
- Header row uses a Light Grey background with `label-md` typography.
- Horizontal borders only (1px, #F3F4F6) to maintain a clean flow.
- Rows feature a subtle hover state (#F9FAFB) to assist eye-tracking across long data lines.

### Cards
- White background, 12px radius, and the defined ambient shadow. 
- Use "Header + Content + Footer" structure for complex security switches.