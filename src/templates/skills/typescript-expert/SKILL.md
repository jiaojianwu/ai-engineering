---
name: typescript-expert
description: TypeScript and JavaScript expert with deep knowledge of type-level programming, performance optimization, monorepo management, migration strategies, and modern tooling.
---

# TypeScript Expert

Expert guidance for TypeScript and JavaScript development, including type-level programming, performance optimization, and modern tooling.

## Core Principles

1. **Type Safety First**: Leverage TypeScript's type system to catch errors at compile time
2. **Progressive Enhancement**: Start simple, add complexity as needed
3. **Performance Awareness**: Consider bundle size and runtime performance
4. **Tooling Mastery**: Use the right tools for the job

## Decision Tree

```
TypeScript issue?
├── Type definition needed
│   ├── Simple object → interface
│   ├── Union/Intersection → type
│   ├── Function signature → type
│   └── Class implementation → interface
├── Performance concern
│   ├── Bundle size → Tree shaking
│   ├── Compile time → Incremental builds
│   └── Runtime → Avoid heavy type operations
└── Migration needed
    ├── JavaScript → TypeScript
    ├── Old TS version → New version
    └── Module system → ESM/CJS
```

## Type Definitions

### 1. Interfaces vs Types

```typescript
// ✅ Use interface for object shapes
interface User {
  id: string
  name: string
  email: string
}

// ✅ Use type for unions, intersections, utilities
type Status = 'active' | 'inactive' | 'pending'
type UserWithStatus = User & { status: Status }

// ✅ Use interface for class implementations
interface Repository {
  findById(id: string): Promise<User>
  create(data: Omit<User, 'id'>): Promise<User>
}

class UserRepository implements Repository {
  async findById(id: string): Promise<User> {
    // implementation
  }
  
  async create(data: Omit<User, 'id'>): Promise<User> {
    // implementation
  }
}
```

### 2. Advanced Types

```typescript
// Discriminated Unions
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string }

function handleResult(result: Result<User>) {
  if (result.success) {
    console.log(result.data.name) // TypeScript knows data exists
  } else {
    console.log(result.error) // TypeScript knows error exists
  }
}

// Template Literal Types
type EventName = `${'on' | 'off'}${Capitalize<'click' | 'hover' | 'focus'>}`
// Result: 'onClick' | 'onHover' | 'onFocus' | 'offClick' | 'offHover' | 'offFocus'

// Conditional Types
type IsString<T> = T extends string ? true : false
type A = IsString<'hello'> // true
type B = IsString<123> // false

// Mapped Types
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

type Partial<T> = {
  [P in keyof T]?: T[P]
}
```

### 3. Utility Types

```typescript
// Built-in Utility Types
type UserProps = Pick<User, 'id' | 'name'>
type CreateUser = Omit<User, 'id'>
type UserUpdate = Partial<User>
type UserRequired = Required<User>

// Custom Utility Types
type Nullable<T> = T | null
type Optional<T> = T | undefined
type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (...args: any) => Promise<infer R> ? R : any

// Deep Partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
```

## Performance Optimization

### 1. Bundle Size

```typescript
// ❌ BAD: Import entire library
import _ from 'lodash'
const result = _.debounce(fn, 300)

// ✅ GOOD: Import specific function
import debounce from 'lodash/debounce'
const result = debounce(fn, 300)

// ✅ BETTER: Use native or lighter alternatives
const result = debounce(fn, 300) // from 'use-debounce'
```

### 2. Compile Time

```typescript
// ❌ BAD: Complex type operations
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

// ✅ GOOD: Simpler types when possible
type DeepReadonly<T> = Readonly<T>

// Use project references for large codebases
// tsconfig.json
{
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/utils" }
  ]
}
```

### 3. Runtime Performance

```typescript
// ❌ BAD: Heavy type operations at runtime
function processData<T extends { id: string }>(data: T[]): T[] {
  return data.map(item => ({ ...item, processed: true }))
}

// ✅ GOOD: Specific types
interface ProcessableItem {
  id: string
  [key: string]: any
}

function processData(data: ProcessableItem[]): ProcessableItem[] {
  return data.map(item => ({ ...item, processed: true }))
}
```

## Migration Strategies

### 1. JavaScript to TypeScript

```typescript
// Step 1: Add tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": false, // Start with false
    "allowJs": true
  },
  "include": ["src/**/*"]
}

// Step 2: Rename files gradually
// file.js → file.ts
// file.jsx → file.tsx

// Step 3: Add types incrementally
// Start with any, then refine

// Step 4: Enable strict mode
{
  "compilerOptions": {
    "strict": true
  }
}
```

### 2. Module System Migration

```typescript
// CommonJS to ESM
// ❌ OLD
const express = require('express')
module.exports = { app }

// ✅ NEW
import express from 'express'
export { app }

// Update package.json
{
  "type": "module"
}

// Update tsconfig.json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "node"
  }
}
```

## Best Practices

### 1. Type Assertions

```typescript
// ❌ BAD: Use 'as' excessively
const data = response.data as User

// ✅ GOOD: Type guards
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data
  )
}

if (isUser(response.data)) {
  console.log(response.data.name) // TypeScript knows it's User
}
```

### 2. Function Types

```typescript
// ❌ BAD: Verbose function types
interface UserService {
  getUser: (id: string) => Promise<User>
  createUser: (data: CreateUser) => Promise<User>
}

// ✅ GOOD: Method syntax
interface UserService {
  getUser(id: string): Promise<User>
  createUser(data: CreateUser): Promise<User>
}
```

### 3. Error Handling

```typescript
// ❌ BAD: Swallow errors
async function fetchData() {
  try {
    const response = await api.get('/data')
    return response.data
  } catch (error) {
    console.error(error)
    return null
  }
}

// ✅ GOOD: Typed errors
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string
  ) {
    super(message)
  }
}

async function fetchData(): Promise<User[]> {
  try {
    const response = await api.get('/data')
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(`Failed to fetch users: ${error.message}`)
    }
    throw error
  }
}
```

## Common Pitfalls

1. **Over-typing**: Don't add types everywhere, focus on API boundaries
2. **Using `any`**: Avoid `any`, use `unknown` or specific types
3. **Ignoring errors**: Handle errors explicitly
4. **Complex types**: Keep types simple and readable
5. **Missing exports**: Export types used in public APIs

## Checklist

- [ ] Use interface for object shapes
- [ ] Use type for unions and utilities
- [ ] Prefer type guards over type assertions
- [ ] Handle errors explicitly
- [ ] Export public types
- [ ] Keep types simple
- [ ] Use utility types when appropriate
- [ ] Consider bundle size impact
- [ ] Test type definitions
- [ ] Document complex types
