# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Art Liberation Front (예술해방전선) is a Next.js-based Korean art activism website. This is a cultural/artistic organization's website featuring galleries, albums, activities, and news content.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production 
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run analyze` - Analyze bundle size with ANALYZE=true
- `npm run build:prod` - Build and export for static hosting (Note: This command will fail as `next export` is deprecated - use `npm run build` instead)

## Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS 4.x 
- **Language**: TypeScript with strict mode
- **UI Libraries**: Framer Motion, FSLightbox React, React Icons
- **Analytics**: Vercel Analytics
- **Email**: EmailJS for contact forms

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── (routes)/          # Route groups (about, activities, albums, etc.)
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/
│   ├── home/              # Homepage components
│   ├── layout/            # Layout components (Header, Footer, etc.)
│   ├── providers/         # React providers
│   └── ui/                # Reusable UI components
├── data/                  # JSON data files
└── utils/                 # Utility functions
```

### Key Components
- **Layout**: Header with navigation, Footer, NoiseBackground for texture
- **Home**: HeroSection with Giants-Inline font, LatestActivities
- **Gallery**: Lightbox integration with hundreds of webp images
- **Providers**: FontLoader, PageTransition with Framer Motion

### Fonts & Assets
- Custom fonts: PretendardVariable.woff2, SFTTF.ttf, Giants-Inline for hero
- Images: Extensive webp gallery (~800+ images), optimized with Sharp
- Custom image loader in `utils/imageLoader.js`

### Data Management
- Static JSON files in `src/data/` for activities, albums, newsletters, videos
- Gallery alt-texts managed separately in `gallery-alt-texts.json`
- Navigation structure defined in `navigation.ts`

### Performance Optimizations
- Font preloading in layout
- Image optimization with Sharp
- Bundle analysis available
- WebP format for all images
- Custom noise background texture

### Internationalization
- Korean language (ko_KR locale)
- SEO optimized with Korean keywords
- Naver site verification included

## Development Notes

- Path alias `@/*` maps to `./src/*`
- Gallery route has API endpoint at `/api/gallery`
- Some components commented out (SupportCTA, NewsletterSignup) - organization inactive
- Uses absolute imports with TypeScript path mapping
- Metadata templates configured for SEO
- Static export configuration with custom image loader for hosting compatibility
- TailwindCSS with custom color variables defined in globals.css