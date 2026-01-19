# Contributing to Akelihle Capital Loan Application System

Thank you for your interest in contributing to the Akelihle Capital Loan Application System! We welcome contributions from the community and are pleased to have you join us.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to info@akelihlecap.co.za.

### Our Standards

- **Be respectful** and inclusive
- **Be collaborative** and constructive
- **Focus on what is best** for the community
- **Show empathy** towards other community members

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MySQL 8+ installed
- Git installed
- Basic knowledge of React, TypeScript, and Node.js

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/akelihle-capital-loan-application.git
   cd akelihle-capital-loan-application
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/original-owner/akelihle-capital-loan-application.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   cd backend && npm install
   ```

5. **Setup development database**:
   ```bash
   # Follow the database setup instructions in README.md
   ```

6. **Start development servers**:
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev
   
   # Terminal 2: Frontend
   npm run dev
   ```

## 🔄 Development Process

### Branching Strategy

We use a simplified Git flow:

- **`main`** - Production-ready code
- **`develop`** - Integration branch for features
- **`feature/feature-name`** - Feature development
- **`bugfix/bug-name`** - Bug fixes
- **`hotfix/hotfix-name`** - Critical production fixes

### Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes** thoroughly

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

## 📝 Coding Standards

### TypeScript/JavaScript

- Use **TypeScript** for all new code
- Follow **ESLint** and **Prettier** configurations
- Use **meaningful variable names**
- Add **JSDoc comments** for functions
- Prefer **const** over **let**, avoid **var**

```typescript
// Good
const calculateLoanAmount = (principal: number, rate: number, term: number): number => {
  return principal * (1 + rate) * term;
};

// Bad
var calc = function(p, r, t) {
  return p * (1 + r) * t;
}
```

### React Components

- Use **functional components** with hooks
- Use **TypeScript interfaces** for props
- Follow **component naming conventions**
- Keep components **small and focused**

```typescript
// Good
interface LoanCalculatorProps {
  initialAmount: number;
  onAmountChange: (amount: number) => void;
}

const LoanCalculator: React.FC<LoanCalculatorProps> = ({ 
  initialAmount, 
  onAmountChange 
}) => {
  // Component logic
};

export default LoanCalculator;
```

### Backend API

- Use **RESTful conventions**
- Implement **proper error handling**
- Add **input validation** with Joi
- Use **meaningful HTTP status codes**
- Add **comprehensive logging**

```typescript
// Good
router.post('/applications', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { error, value } = applicationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    
    // Process application
    const application = await createApplication(value);
    res.status(201).json({ application });
  } catch (error) {
    logger.error('Application creation failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Database

- Use **Prisma migrations** for schema changes
- Follow **naming conventions** (camelCase for fields)
- Add **proper indexes** for performance
- Include **foreign key constraints**

### CSS/Styling

- Use **Tailwind CSS** utility classes
- Follow **responsive design** principles
- Use **consistent spacing** and colors
- Prefer **utility classes** over custom CSS

## 🔍 Testing

### Frontend Testing

- Write **unit tests** for utility functions
- Add **component tests** for complex components
- Test **user interactions** and edge cases

### Backend Testing

- Write **unit tests** for business logic
- Add **integration tests** for API endpoints
- Test **error scenarios** and edge cases
- Ensure **database operations** are tested

### Manual Testing

Before submitting a PR, manually test:

1. **User registration and login**
2. **Loan application submission**
3. **Admin dashboard functionality**
4. **Email notifications**
5. **Responsive design** on different devices

## 📤 Submitting Changes

### Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Ensure all tests pass**
4. **Update CHANGELOG.md** if applicable
5. **Create detailed PR description**

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings introduced
```

### Commit Message Format

Use conventional commits:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add JWT token refresh functionality
fix(calculator): correct interest rate calculation
docs(readme): update installation instructions
```

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected behavior**
4. **Actual behavior**
5. **Environment details** (OS, Node.js version, browser)
6. **Screenshots** if applicable
7. **Error messages** or logs

### Feature Requests

When requesting features, please include:

1. **Clear description** of the feature
2. **Use case** and motivation
3. **Proposed solution** (if any)
4. **Alternative solutions** considered
5. **Additional context**

### Issue Labels

We use labels to categorize issues:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority: high` - High priority issue
- `priority: low` - Low priority issue

## 🎯 Areas for Contribution

We welcome contributions in these areas:

### Frontend
- **UI/UX improvements**
- **Accessibility enhancements**
- **Performance optimizations**
- **Mobile responsiveness**
- **New features**

### Backend
- **API improvements**
- **Performance optimizations**
- **Security enhancements**
- **Database optimizations**
- **Integration features**

### Documentation
- **Code documentation**
- **User guides**
- **API documentation**
- **Deployment guides**
- **Troubleshooting guides**

### Testing
- **Unit tests**
- **Integration tests**
- **End-to-end tests**
- **Performance tests**
- **Security tests**

## 📞 Getting Help

If you need help with contributing:

1. **Check existing issues** and documentation
2. **Ask questions** in issue comments
3. **Join discussions** in pull requests
4. **Contact maintainers** via email

## 🙏 Recognition

Contributors will be recognized in:

- **README.md** contributors section
- **CHANGELOG.md** for significant contributions
- **Release notes** for major features

Thank you for contributing to Akelihle Capital Loan Application System! 🎉