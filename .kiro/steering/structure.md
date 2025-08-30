# Project Structure

## Root Directory

```
├── src/                    # Source code
├── public/                 # Static assets
├── dist/                   # Build output (generated)
├── node_modules/           # Dependencies (generated)
├── .kiro/                  # Kiro configuration and steering
├── .vscode/                # VS Code settings
└── .git/                   # Git repository
```

## Source Code Organization (`src/`)

```
src/
├── main.tsx               # Application entry point
├── App.tsx                # Main application component (BreathTimer)
├── App.css                # Component-specific styles
├── index.css              # Global styles and CSS variables
├── vite-env.d.ts          # Vite type definitions
└── assets/                # Static assets (images, icons)
    └── react.svg
```

## Configuration Files

- `package.json` - Dependencies and npm scripts
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript project references
- `tsconfig.app.json` - App-specific TypeScript config
- `tsconfig.node.json` - Node.js TypeScript config
- `eslint.config.js` - ESLint rules and plugins
- `index.html` - HTML entry point

## Architecture Patterns

- **Single Page Application** - All functionality in one main component
- **Functional Components** - React hooks-based architecture
- **Canvas Rendering** - Direct canvas manipulation for animations
- **Ref-based State** - Uses `useRef` for animation values that don't trigger re-renders
- **Controlled Components** - Form inputs managed by React state

## File Naming Conventions

- React components: PascalCase (e.g., `App.tsx`, `BreathTimer`)
- Stylesheets: kebab-case matching component (e.g., `App.css`)
- Configuration files: lowercase with extensions (e.g., `vite.config.ts`)
- Assets: lowercase with descriptive names