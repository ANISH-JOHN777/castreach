# Contributing to CastReach

First off, thank you for considering contributing to CastReach! It's people like you that make CastReach such a great platform.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if applicable**
- **Include your environment details** (OS, browser, Node version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternative solutions you've considered**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the coding standards** outlined below
3. **Write clear commit messages**
4. **Update documentation** as needed
5. **Test your changes** thoroughly
6. **Submit your pull request**

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/castreach.git
cd castreach

# Install dependencies
npm install

# Start development server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build
```

## Coding Standards

### JavaScript/React

- Use **functional components** with hooks
- Follow **React best practices**
- Use **meaningful variable names**
- Add **comments for complex logic**
- Keep components **small and focused**
- Use **PropTypes** or TypeScript for type checking (when migrated)

### CSS

- Use **CSS variables** from `variables.css`
- Follow **BEM naming convention** when applicable
- Keep styles **component-scoped**
- Use **mobile-first** approach
- Ensure **accessibility** (contrast, focus states)

### File Organization

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── context/        # React Context providers
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── styles/         # Global styles and variables
├── layouts/        # Layout components
└── mock-data/      # Mock data for development
```

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting, missing semicolons, etc.
refactor: code refactoring
test: adding tests
chore: updating build tasks, package manager configs, etc.
```

Examples:
```
feat: add pagination component
fix: resolve toast notification z-index issue
docs: update README with new features
style: format code with prettier
refactor: extract validation logic to utils
```

## Component Guidelines

### Creating New Components

1. **Create component file** in `src/components/`
2. **Create corresponding CSS file**
3. **Add PropTypes or TypeScript types**
4. **Include accessibility features** (ARIA labels, keyboard navigation)
5. **Make it responsive**
6. **Document props and usage**

Example component structure:

```jsx
import './ComponentName.css';

const ComponentName = ({ 
    prop1, 
    prop2 = 'default',
    onAction 
}) => {
    return (
        <div className="component-name">
            {/* Component content */}
        </div>
    );
};

export default ComponentName;
```

### Component Checklist

- [ ] Responsive design
- [ ] Accessibility (ARIA, keyboard nav)
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Proper prop validation
- [ ] CSS follows design system
- [ ] Works in all major browsers

## Testing Guidelines

### Manual Testing

Before submitting a PR, test:

- [ ] All user flows work as expected
- [ ] Responsive design on mobile, tablet, desktop
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] No console errors
- [ ] Performance is acceptable

### Automated Testing (Future)

When tests are added:
- Write unit tests for utilities
- Write component tests for UI components
- Write E2E tests for critical user flows

## Accessibility Requirements

All contributions must meet WCAG 2.1 Level AA standards:

- [ ] Proper heading hierarchy
- [ ] Alt text for images
- [ ] ARIA labels where needed
- [ ] Keyboard navigation support
- [ ] Sufficient color contrast (4.5:1 for text)
- [ ] Focus indicators visible
- [ ] No keyboard traps
- [ ] Screen reader friendly

## Performance Guidelines

- Use **debounce/throttle** for expensive operations
- Implement **lazy loading** for images and routes
- Avoid **unnecessary re-renders**
- Use **React.memo** when appropriate
- Keep bundle size **minimal**
- Optimize **images** before committing

## Documentation

### Code Documentation

- Add **JSDoc comments** for complex functions
- Document **component props**
- Explain **non-obvious logic**
- Include **usage examples**

### README Updates

Update README.md when:
- Adding new features
- Changing setup instructions
- Updating dependencies
- Modifying project structure

## Review Process

1. **Automated checks** must pass (linting, build)
2. **Code review** by maintainers
3. **Testing** on multiple devices/browsers
4. **Documentation** review
5. **Merge** when approved

## Questions?

Feel free to:
- Open an issue for discussion
- Join our community chat (when available)
- Email the maintainers

## Recognition

Contributors will be:
- Listed in the README
- Mentioned in release notes
- Credited in the project

Thank you for contributing to CastReach! 🎉
