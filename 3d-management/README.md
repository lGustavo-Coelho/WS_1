# 3D Management Desktop

A comprehensive desktop application for managing 3D printing services, built with Electron, React, TypeScript, and SQLite.

## Features

- 📊 Dashboard with real-time metrics
- 🧵 Filament and component inventory management
- 🖨️ Printer fleet management
- 📋 Quote generation and job tracking
- 💰 Sales and financial transaction management
- 📈 Investment tracking and financial reports
- 🔒 Secure local authentication

## Tech Stack

- **Framework**: Electron + React + TypeScript
- **Database**: SQLite with Knex.js
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier + Husky

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Getting Started

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and configure your variables.

3. **Run database migrations:**
   ```bash
   npm run migrate
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Open Vitest UI
- `npm run test:coverage` - Generate coverage report
- `npm run type-check` - Run TypeScript type checking
- `npm run validate` - Run all checks (type-check + lint + test)
- `npm run migrate` - Run database migrations

## Project Structure

```
3d-management/
├── electron/           # Electron main and preload scripts
├── src/
│   ├── components/     # React components
│   ├── pages/          # Application pages
│   ├── db/             # Database migrations and schema
│   ├── services/       # Business logic services
│   ├── store/          # Zustand state management
│   ├── types/          # TypeScript type definitions
│   └── tests/          # Test files
├── dist/               # Vite build output
└── dist-electron/      # Electron build output
```

## Development Workflow

1. Make changes to the code
2. Pre-commit hooks will automatically run linting and formatting
3. Run tests with `npm run test`
4. Build with `npm run build`

## Testing

The project uses Vitest and React Testing Library for unit and integration tests.

```bash
# Run tests once
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Interactive UI
npm run test:ui
```

## Code Quality

The project enforces code quality through:

- **ESLint**: Linting for TypeScript and React
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit validation
- **lint-staged**: Run checks only on staged files

All checks run automatically on commit. You can also run them manually:

```bash
npm run validate
```

## Building for Production

```bash
npm run build
```

This will:
1. Run TypeScript compilation
2. Build the Vite app
3. Package with electron-builder

The output will be in the `dist-electron` directory.

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
