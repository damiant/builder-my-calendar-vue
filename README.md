# Builder My Calendar Vue

A modern Vue 3 calendar application built with Vite, featuring state management with Pinia and a comprehensive development toolchain.

## Tech Stack

- **Vue 3** - Progressive JavaScript framework with Composition API
- **Vite** - Next-generation frontend build tool
- **Pinia** - Official state management for Vue
- **Ant Design Vue** - Enterprise-class UI component library
- **Vitest** - Blazing fast unit test framework
- **ESLint** - Code linting for consistent code quality
- **Prettier** - Code formatting for consistent style

## Project Structure

```
src/
├── components/       # Vue components
│   └── __tests__/   # Component unit tests
├── stores/          # Pinia state management stores
├── assets/          # Static assets
├── App.vue          # Root component
└── main.js          # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
npm install
```

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run tests in watch mode |
| `npm run test:ui` | Run tests with UI |
| `npm run test:coverage` | Generate test coverage report |
| `npm run lint` | Lint and fix code |
| `npm run format` | Format code with Prettier |
| `npm run check` | Run build, format, lint, and tests |

## Development Guidelines

### Code Quality

This project follows strict code quality standards:
- ESLint enforces Vue 3 and JavaScript best practices
- Prettier maintains consistent code formatting
- Vitest ensures component reliability

Run the full quality check before committing:

```bash
npm run check
```

### State Management

Use Pinia stores for shared state. Create stores in `src/stores/`:

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMyStore = defineStore('myStore', () => {
  const state = ref(0)
  const doubleState = computed(() => state.value * 2)
  
  function increment() {
    state.value++
  }
  
  return { state, doubleState, increment }
})
```

### Component Testing

Write tests for components in `__tests__` directories:

```javascript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from '../MyComponent.vue'

describe('MyComponent', () => {
  it('renders properly', () => {
    const wrapper = mount(MyComponent)
    expect(wrapper.text()).toContain('Expected text')
  })
})
```

## Vue 3 Composition API

This project exclusively uses Vue 3's Composition API with `<script setup>`. Learn more in the [Vue 3 documentation](https://vuejs.org/guide/introduction.html).

## IDE Support

For the best development experience, use [VS Code](https://code.visualstudio.com/) with the [Vue - Official extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar).

## License

Private project
