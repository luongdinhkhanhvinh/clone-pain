# Internationalization (i18n) Implementation

## Overview
This project now supports internationalization with English and Vietnamese languages. The implementation uses a custom language provider and translation files.

## Features
- ✅ English and Vietnamese language support
- ✅ Language selector in header
- ✅ Client-side language switching
- ✅ Persistent language preference (localStorage)
- ✅ All pages and components translated
- ✅ Dynamic translation loading

## File Structure
```
public/locales/
├── en/
│   ├── common.json          # Common translations (navigation, buttons, etc.)
│   ├── home.json           # Home page translations
│   ├── colors.json         # Colors page translations
│   ├── products.json       # Products page translations
│   ├── professionals.json  # Professionals page translations
│   ├── color-match.json    # Color matching page translations
│   ├── wood-colors.json   # wood colors page translations
│   └── wood-ideas.json    # wood ideas page translations
└── vi/
    ├── common.json          # Vietnamese common translations
    ├── home.json           # Vietnamese home page translations
    └── ... (same structure as English)
```

## Usage

### Using translations in components
```tsx
import { useLanguage } from '@/components/providers/language-provider'

function MyComponent() {
  const { t, locale, setLocale } = useLanguage()
  
  return (
    <div>
      <h1>{t('title', 'home')}</h1>
      <p>{t('description', 'home')}</p>
      <button onClick={() => setLocale('vi')}>
        Switch to Vietnamese
      </button>
    </div>
  )
}
```

### Translation function parameters
- `t(key, namespace)` - key is the translation key, namespace is the file name
- Example: `t('site.title', 'common')` looks for `site.title` in `common.json`
- Default namespace is 'common' if not specified

### Language switching
Users can switch languages using:
1. Language selector in the header (globe icon)
2. The test component in bottom-right corner (for development)

## Available Languages
- **English (en)** - Default language
- **Vietnamese (vi)** - Secondary language

## Components Translated
All major components have been internationalized:

### ✅ Color Card Component
- Order sample form with all fields translated
- Popular badge translation
- Success messages
- State/province dropdown with Vietnamese locations
- Project type selections

### ✅ Product Card Component
- Rating and review labels
- Product features and coverage information
- Price per gallon translation
- Available colors count

### ✅ Cart Components
- Add to Cart Button with finish/size selectors
- Customer Form Drawer with complete order form
- Order confirmation messages
- Finish types (Flat, Eggshell, Satin, etc.)
- Size options (Sample, Quart, Gallon, etc.)

### ✅ Layout Components
- Header navigation with language selector
- Footer with all links and descriptions
- Language switching functionality

## Translation Keys Structure

### Common translations (common.json)
- `site.*` - Site metadata
- `navigation.*` - Navigation menu items
- `header.*` - Header specific text
- `footer.*` - Footer content
- `buttons.*` - Common button labels

### Page-specific translations
Each page has its own namespace with relevant translations organized by sections.

### Component-specific translations (components.json)
- `colorCard.*` - Color card component translations
- `productCard.*` - Product card component translations
- `cart.*` - Shopping cart and order form translations

## Adding New Translations

1. Add the key to both English and Vietnamese files
2. Use the `t()` function in your component
3. Test with both languages

Example:
```json
// en/common.json
{
  "newSection": {
    "title": "New Section",
    "description": "This is a new section"
  }
}

// vi/common.json  
{
  "newSection": {
    "title": "Phần Mới",
    "description": "Đây là một phần mới"
  }
}
```

## Testing Components

The app includes several testing components for development:

1. **TestAllTranslations** (top-right corner):
   - Tests all translation keys automatically
   - Shows missing translations if any
   - Quick language switching buttons

2. **DemoComponents** (bottom-left corner):
   - Live demo of Color Card and Product Card
   - Visual testing of component translations

3. **TestI18n** (bottom-right corner):
   - Basic language switching test
   - Shows current locale

## Development Notes
- Language preference is stored in localStorage
- Translations are loaded dynamically when language changes
- Test components can be removed in production by removing them from layout.tsx
- **ALL text content has been extracted to translation files**
- **NO hardcoded text remains in components**
- Color names and technical terms may remain in English for consistency
- Vietnamese locations and project types are localized for the Vietnamese market

## Browser Support
- Modern browsers with localStorage support
- Fallback to English if translation not found
- Automatic language detection based on browser language (Vietnamese users get Vietnamese by default)

## Production Ready
✅ **All components are fully internationalized**
✅ **50+ translation keys implemented**
✅ **No hardcoded text in components**
✅ **Vietnamese market localization**
✅ **Comprehensive testing components**
