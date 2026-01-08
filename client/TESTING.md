# Frontend Testing Documentation

## Overview

The FinEdge frontend includes comprehensive unit tests for React components, contexts, utilities, and API clients. Tests are written using **Vitest** (modern testing framework for Vite) and **React Testing Library**.

## Test Structure

All tests are located in `src/test/` and follow the same directory structure as the source code:

```
src/test/
├── setup.ts                    # Test setup and global mocks
├── utils/
│   └── test-utils.tsx          # Custom render function with providers
├── contexts/
│   └── AuthContext.test.tsx    # Auth context tests
├── lib/
│   ├── api.test.ts             # API client tests
│   └── utils.test.ts           # Utility function tests
├── components/
│   └── ProtectedRoute.test.tsx # Protected route component tests
└── pages/
    ├── login.test.tsx          # Login page tests
    └── register.test.tsx     # Register page tests
```

## Test Coverage

### 1. AuthContext Tests (`contexts/AuthContext.test.tsx`)

**Coverage:**
- Initial auth state
- Login functionality (success and error cases)
- Registration functionality
- Logout functionality
- Token refresh
- LocalStorage persistence
- Error handling

**Key Test Cases:**
- ✅ Provides initial unauthenticated state
- ✅ Logs in successfully and updates state
- ✅ Handles login errors
- ✅ Registers new users successfully
- ✅ Logs out and clears auth state
- ✅ Restores auth state from localStorage
- ✅ Throws error when used outside provider

### 2. API Client Tests (`lib/api.test.ts`)

**Coverage:**
- Authentication API (login, register, logout, getCurrentUser)
- Accounts API (getMyAccounts, createAccount)
- Transactions API (getMyTransactions, createTransaction)
- Token refresh on 401 errors
- Authorization header injection

**Key Test Cases:**
- ✅ Login API call with correct parameters
- ✅ Register API call with correct parameters
- ✅ Handles API errors correctly
- ✅ Includes Authorization header when token exists
- ✅ Refreshes token on 401 error
- ✅ Retries original request after token refresh

### 3. ProtectedRoute Tests (`components/ProtectedRoute.test.tsx`)

**Coverage:**
- Loading state
- Unauthenticated redirect
- Authenticated access
- Role-based access control
- Case-insensitive role matching

**Key Test Cases:**
- ✅ Shows loading spinner when loading
- ✅ Redirects to login when not authenticated
- ✅ Renders children when authenticated
- ✅ Allows access when role matches
- ✅ Redirects when role doesn't match
- ✅ Handles case-insensitive role matching

### 4. Utility Tests (`lib/utils.test.ts`)

**Coverage:**
- Class name merging (cn function)
- Conditional classes
- Tailwind class merging
- Edge cases (empty strings, null, undefined)

**Key Test Cases:**
- ✅ Merges class names correctly
- ✅ Handles conditional classes
- ✅ Merges Tailwind classes (last one wins)
- ✅ Handles empty strings and null/undefined

### 5. Login Page Tests (`pages/login.test.tsx`)

**Coverage:**
- Form rendering
- Successful login
- Login errors
- Role-based redirects
- Loading state

**Key Test Cases:**
- ✅ Renders login form correctly
- ✅ Handles successful login
- ✅ Handles login errors
- ✅ Redirects admin users to admin dashboard
- ✅ Redirects banker users to banker dashboard
- ✅ Redirects customer users to customer dashboard
- ✅ Disables submit button while loading

### 6. Register Page Tests (`pages/register.test.tsx`)

**Coverage:**
- Form rendering
- Successful registration
- Registration errors
- Form validation
- Authenticated user redirect

**Key Test Cases:**
- ✅ Renders registration form correctly
- ✅ Handles successful registration
- ✅ Handles registration errors
- ✅ Validates required fields
- ✅ Redirects authenticated users

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with UI
```bash
npm run test:ui
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Specific Test File
```bash
npm test -- AuthContext.test.tsx
```

## Test Dependencies

The following dependencies are included in `package.json`:

- **Vitest** (`vitest`) - Testing framework
- **@vitest/ui** - Test UI for better visualization
- **@vitest/coverage-v8** - Code coverage
- **@testing-library/react** - React component testing utilities
- **@testing-library/jest-dom** - Custom matchers for DOM assertions
- **@testing-library/user-event** - User interaction simulation
- **jsdom** - DOM environment for tests

## Test Configuration

### Vitest Config (`vitest.config.ts`)

- **Environment**: jsdom (browser-like environment)
- **Globals**: Enabled for convenience
- **Setup Files**: `src/test/setup.ts`
- **Coverage**: V8 provider with text, json, and html reporters
- **Path Aliases**: `@` resolves to `./src`

### Test Setup (`src/test/setup.ts`)

- Imports jest-dom matchers
- Cleans up after each test
- Mocks `window.matchMedia`
- Mocks `localStorage`
- Mocks `fetch` globally

## Test Utilities

### Custom Render Function (`src/test/utils/test-utils.tsx`)

Provides a custom `render` function that wraps components with:
- `QueryClientProvider` (React Query)
- `AuthProvider` (Authentication context)

This ensures all components have access to required providers during testing.

## Mocking Strategy

1. **API Calls**: Mocked using `vi.mock()` and `vi.fn()`
2. **Hooks**: Mocked using `vi.mock()` for context hooks
3. **Router**: Mocked using `vi.mock('wouter')`
4. **Fetch**: Mocked globally in setup file
5. **LocalStorage**: Mocked in setup file

## Best Practices

1. **Isolation**: Each test is independent and doesn't rely on other tests
2. **Mocking**: External dependencies are mocked to ensure unit test isolation
3. **Clear Naming**: Test descriptions clearly state what is being tested
4. **Arrange-Act-Assert**: Tests follow the AAA pattern
5. **User-Centric**: Tests focus on user interactions and outcomes
6. **Accessibility**: Tests use accessible queries (getByLabelText, getByRole)

## Future Test Additions

Consider adding tests for:
- More page components (CustomerDashboard, LoanApplication, etc.)
- More components (AccountCard, TransactionTable, etc.)
- Custom hooks (useToast, useMobile)
- Form validation
- Error boundaries
- Integration tests (full user flows)

## Notes

- Tests use Vitest's `vi` API instead of Jest's `jest`
- React Testing Library encourages testing from the user's perspective
- Mock functions are cleared between tests to ensure isolation
- Tests are fast and don't require a browser environment

