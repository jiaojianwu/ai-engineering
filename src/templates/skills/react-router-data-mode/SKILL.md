---
name: react-router-data-mode
description: Build React applications using React Router's data mode with createBrowserRouter and RouterProvider. Use when working with route objects, loaders, actions, Form, useFetcher, or pending/optimistic UI without the Vite plugin.
---

# React Router Data Mode

Expert guidance for building React applications using React Router's data mode with createBrowserRouter and RouterProvider.

## Core Principles

1. **Data Loading**: Load data in routes, not components
2. **Data Mutation**: Use actions for form submissions
3. **Pending UI**: Show loading states during transitions
4. **Error Handling**: Handle errors at route boundaries

## Decision Tree

```
Routing need?
├── Simple routing
│   ├── Static routes → Routes/Route
│   └── Nested routes → Layout routes
├── Data loading
│   ├── Route data → loader
│   ├── Component data → useLoaderData
│   └── Dependent data → Deferred data
├── Data mutation
│   ├── Form submission → action
│   ├── Optimistic UI → useNavigation
│   └── Revalidation → useRevalidator
└── Error handling
    ├── Route errors → ErrorBoundary
    ├── Not found → handleNotFound
    └── Redirects → redirect()
```

## Setup

### 1. Create Router

```typescript
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
        loader: homeLoader
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'users',
        element: <Users />,
        loader: usersLoader,
        children: [
          {
            path: ':userId',
            element: <UserDetail />,
            loader: userDetailLoader
          }
        ]
      }
    ]
  }
])

function App() {
  return <RouterProvider router={router} />
}
```

### 2. Root Layout

```typescript
import { Outlet, useNavigation } from 'react-router-dom'

function Root() {
  const navigation = useNavigation()
  
  return (
    <div>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/users">Users</Link>
        </nav>
      </header>
      
      <main>
        {navigation.state === 'loading' && <Loading />}
        <Outlet />
      </main>
      
      <footer>
        <p>© 2024</p>
      </footer>
    </div>
  )
}
```

## Data Loading

### 1. Basic Loader

```typescript
import { json } from 'react-router-dom'

async function usersLoader() {
  const response = await fetch('/api/users')
  
  if (!response.ok) {
    throw new Response('Failed to load users', { status: 500 })
  }
  
  const users = await response.json()
  return json(users)
}

function Users() {
  const users = useLoaderData<typeof usersLoader>()
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          <Link to={`/users/${user.id}`}>{user.name}</Link>
        </li>
      ))}
    </ul>
  )
}
```

### 2. Route Parameters

```typescript
import { json } from 'react-router-dom'

async function userDetailLoader({ params }) {
  const response = await fetch(`/api/users/${params.userId}`)
  
  if (!response.ok) {
    throw new Response('User not found', { status: 404 })
  }
  
  const user = await response.json()
  return json(user)
}

function UserDetail() {
  const user = useLoaderData<typeof userDetailLoader>()
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

### 3. Deferred Data

```typescript
import { defer, Suspense } from 'react-router-dom'

async function dashboardLoader() {
  return defer({
    user: await fetchUser(), // Critical data
    posts: fetchPosts(), // Non-critical data
    comments: fetchComments() // Non-critical data
  })
}

function Dashboard() {
  const { user, posts, comments } = useLoaderData<typeof dashboardLoader>()
  
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      
      <Suspense fallback={<PostsSkeleton />}>
        <Await resolve={posts}>
          {(posts) => <PostsList posts={posts} />}
        </Await>
      </Suspense>
      
      <Suspense fallback={<CommentsSkeleton />}>
        <Await resolve={comments}>
          {(comments) => <CommentsList comments={comments} />}
        </Await>
      </Suspense>
    </div>
  )
}
```

### 4. Dependent Data

```typescript
import { json } from 'react-router-dom'

async function userWithPostsLoader({ params }) {
  const userResponse = await fetch(`/api/users/${params.userId}`)
  
  if (!userResponse.ok) {
    throw new Response('User not found', { status: 404 })
  }
  
  const user = await userResponse.json()
  
  const postsResponse = await fetch(`/api/users/${params.userId}/posts`)
  const posts = await postsResponse.json()
  
  return json({ user, posts })
}

function UserWithPosts() {
  const { user, posts } = useLoaderData<typeof userWithPostsLoader>()
  
  return (
    <div>
      <h1>{user.name}</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

## Data Mutation

### 1. Basic Action

```typescript
import { json, redirect } from 'react-router-dom'

async function createUserAction({ request }) {
  const formData = await request.formData()
  const name = formData.get('name')
  const email = formData.get('email')
  
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email })
  })
  
  if (!response.ok) {
    throw new Response('Failed to create user', { status: 500 })
  }
  
  const user = await response.json()
  return redirect(`/users/${user.id}`)
}

function CreateUser() {
  return (
    <Form method="post">
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" required />
      </div>
      
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required />
      </div>
      
      <button type="submit">Create User</button>
    </Form>
  )
}
```

### 2. Optimistic UI

```typescript
import { useNavigation } from 'react-router-dom'

function CreateUser() {
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'
  
  return (
    <Form method="post">
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" required />
      </div>
      
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required />
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create User'}
      </button>
    </Form>
  )
}
```

### 3. useFetcher

```typescript
import { useFetcher } from 'react-router-dom'

function LikeButton({ postId }) {
  const fetcher = useFetcher()
  const isSubmitting = fetcher.state === 'submitting'
  
  return (
    <fetcher.Form method="post" action="/api/like">
      <input type="hidden" name="postId" value={postId} />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Liking...' : 'Like'}
      </button>
    </fetcher.Form>
  )
}
```

## Error Handling

### 1. Error Boundary

```typescript
import { useRouteError, isRouteErrorResponse } from 'react-router-dom'

function ErrorBoundary() {
  const error = useRouteError()
  
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>{error.status}</h1>
        <p>{error.statusText}</p>
        {error.data?.message && <p>{error.data.message}</p>}
      </div>
    )
  }
  
  return (
    <div>
      <h1>Something went wrong</h1>
      <p>An unexpected error occurred</p>
    </div>
  )
}
```

### 2. Not Found

```typescript
import { json } from 'react-router-dom'

async function userLoader({ params }) {
  const response = await fetch(`/api/users/${params.userId}`)
  
  if (response.status === 404) {
    throw new Response('User not found', { status: 404 })
  }
  
  if (!response.ok) {
    throw new Response('Failed to load user', { status: 500 })
  }
  
  const user = await response.json()
  return json(user)
}
```

## Advanced Patterns

### 1. Route Configuration

```typescript
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Home />,
        loader: homeLoader
      },
      {
        path: 'users',
        element: <UsersLayout />,
        children: [
          {
            index: true,
            element: <UsersList />,
            loader: usersLoader
          },
          {
            path: ':userId',
            element: <UserDetail />,
            loader: userDetailLoader,
            children: [
              {
                index: true,
                element: <UserPosts />,
                loader: userPostsLoader
              },
              {
                path: 'settings',
                element: <UserSettings />,
                loader: userSettingsLoader,
                action: userSettingsAction
              }
            ]
          }
        ]
      }
    ]
  }
])
```

### 2. Parallel Data Loading

```typescript
async function dashboardLoader() {
  const [user, posts, stats] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchStats()
  ])
  
  return json({ user, posts, stats })
}
```

### 3. Route Guards

```typescript
async function protectedLoader({ request }) {
  const user = await getUser()
  
  if (!user) {
    const url = new URL(request.url)
    return redirect(`/login?redirect=${url.pathname}`)
  }
  
  return json({ user })
}
```

## Best Practices

1. **Load data in loaders**: Not in components
2. **Handle errors**: Use error boundaries
3. **Show loading states**: Use navigation state
4. **Use deferred data**: For non-critical data
5. **Optimize revalidation**: Use useRevalidator

## Common Pitfalls

1. **Loading data in components**: Use loaders instead
2. **Not handling errors**: Always use error boundaries
3. **Missing loading states**: Show feedback during transitions
4. **Blocking navigation**: Use pending UI
5. **Ignoring revalidation**: Keep data fresh

## Checklist

- [ ] Use createBrowserRouter for data mode
- [ ] Load data in loaders
- [ ] Handle errors with error boundaries
- [ ] Show loading states
- [ ] Use deferred data for non-critical data
- [ ] Implement optimistic UI
- [ ] Handle not found cases
- [ ] Test route transitions
- [ ] Optimize revalidation
- [ ] Document route structure
