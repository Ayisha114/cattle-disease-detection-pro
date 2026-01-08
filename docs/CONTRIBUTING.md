# 🤝 Contributing to Cattle Disease Detection System

First off, thank you for considering contributing to the Cattle Disease Detection System! It's people like you that make this project better for everyone.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Workflow](#development-workflow)
- [Style Guidelines](#style-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:
- Node.js (v16+)
- MongoDB (v5+)
- Python (v3.8+)
- Git
- A GitHub account

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/cattle-disease-detection-pro.git
   cd cattle-disease-detection-pro
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/Ayisha114/cattle-disease-detection-pro.git
   ```

4. **Install dependencies**:
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   
   # ML Model
   cd ../ml-model
   pip install -r requirements.txt
   ```

5. **Setup environment**:
   ```bash
   # Copy example env files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   
   # Edit with your configuration
   ```

## 💡 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the problem
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, Node version, etc.)

**Bug Report Template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. Ubuntu 20.04]
 - Node Version: [e.g. 18.0.0]
 - Browser: [e.g. Chrome 96]

**Additional context**
Any other context about the problem.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** - why is this enhancement useful?
- **Proposed solution**
- **Alternative solutions** considered
- **Mockups or examples** (if applicable)

**Enhancement Template:**
```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context, screenshots, or mockups.
```

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `bug` - Something isn't working
- `enhancement` - New feature or request

## 🔄 Development Workflow

### 1. Create a Branch

```bash
# Update your fork
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/amazing-feature

# Or for bug fixes
git checkout -b fix/bug-description
```

### 2. Make Changes

- Write clean, readable code
- Follow the style guidelines
- Add comments for complex logic
- Update documentation if needed
- Write/update tests

### 3. Test Your Changes

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add amazing feature"
```

See [Commit Guidelines](#commit-guidelines) for commit message format.

### 5. Push to Your Fork

```bash
git push origin feature/amazing-feature
```

### 6. Create Pull Request

Go to GitHub and create a pull request from your fork to the main repository.

## 🎨 Style Guidelines

### JavaScript/React Style Guide

We follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) with some modifications:

**General Rules:**
```javascript
// ✅ Good
const getUserData = async (userId) => {
  try {
    const response = await axios.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// ❌ Bad
const getUserData = async (userId) => {
  const response = await axios.get(`/api/users/${userId}`)
  return response.data
}
```

**React Components:**
```javascript
// ✅ Good - Functional component with proper structure
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function UserCard({ user, onUpdate }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Effect logic
  }, [user]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await onUpdate(user.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>{user.name}</h3>
      <button onClick={handleUpdate} disabled={loading}>
        Update
      </button>
    </div>
  );
}

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};
```

**CSS/Tailwind:**
```javascript
// ✅ Good - Organized classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-gray-800">Title</h2>
  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
    Action
  </button>
</div>

// ❌ Bad - Unorganized, hard to read
<div className="flex bg-white p-4 items-center shadow-md rounded-lg justify-between">
```

### Python Style Guide

Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/):

```python
# ✅ Good
def predict_disease(image_path: str) -> dict:
    """
    Predict cattle disease from image.
    
    Args:
        image_path: Path to the image file
        
    Returns:
        Dictionary containing prediction results
    """
    try:
        image = load_and_preprocess_image(image_path)
        prediction = model.predict(image)
        return format_prediction(prediction)
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise

# ❌ Bad
def predict_disease(image_path):
    image = load_and_preprocess_image(image_path)
    prediction = model.predict(image)
    return format_prediction(prediction)
```

### File Naming Conventions

- **React Components**: PascalCase - `UserCard.jsx`, `DashboardPage.jsx`
- **Utilities**: camelCase - `apiClient.js`, `formatDate.js`
- **Constants**: UPPER_SNAKE_CASE - `API_ENDPOINTS.js`, `CONFIG.js`
- **Python files**: snake_case - `model_trainer.py`, `data_processor.py`

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Examples

```bash
# Feature
git commit -m "feat(upload): add drag and drop support"

# Bug fix
git commit -m "fix(auth): resolve token expiration issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# With body
git commit -m "feat(reports): add PDF export functionality

- Implement jsPDF integration
- Add download button to reports page
- Include all report details in PDF

Closes #123"
```

### Commit Message Rules

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- First line should be 50 characters or less
- Reference issues and pull requests after the first line
- Be descriptive but concise

## 🔀 Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No console errors or warnings
- [ ] Commits follow commit guidelines

### PR Title Format

Follow the same format as commit messages:
```
feat(component): add new feature
fix(api): resolve authentication bug
docs(readme): update setup instructions
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123
Related to #456

## Changes Made
- Change 1
- Change 2
- Change 3

## Screenshots (if applicable)
[Add screenshots here]

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated checks** must pass (linting, tests, build)
2. **Code review** by at least one maintainer
3. **Address feedback** and make requested changes
4. **Approval** from maintainer
5. **Merge** by maintainer

### After Your PR is Merged

- Delete your feature branch
- Update your local repository:
  ```bash
  git checkout main
  git pull upstream main
  git push origin main
  ```

## 🧪 Testing Guidelines

### Writing Tests

```javascript
// Example test
describe('UserCard Component', () => {
  it('should render user name', () => {
    const user = { id: '1', name: 'John Doe' };
    render(<UserCard user={user} onUpdate={() => {}} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should call onUpdate when button clicked', async () => {
    const mockUpdate = jest.fn();
    const user = { id: '1', name: 'John Doe' };
    render(<UserCard user={user} onUpdate={mockUpdate} />);
    
    fireEvent.click(screen.getByText('Update'));
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledWith('1'));
  });
});
```

### Test Coverage

- Aim for at least 80% code coverage
- Test edge cases and error scenarios
- Test user interactions
- Test API integrations

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)

## ❓ Questions?

- Check existing [Issues](https://github.com/Ayisha114/cattle-disease-detection-pro/issues)
- Create a new issue with the `question` label
- Email: adadapee@gitam.in

## 🙏 Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!

---

**Happy Contributing! 🎉**
