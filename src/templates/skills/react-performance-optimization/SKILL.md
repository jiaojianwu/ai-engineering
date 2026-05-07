---
name: react-performance-optimization
description: React performance optimization patterns using memoization, code splitting, and efficient rendering strategies. Use when optimizing slow React applications, reducing bundle size, or improving user experience with large datasets.
---

# React Performance Optimization

Expert guidance for optimizing React application performance through memoization, code splitting, and efficient rendering strategies.

## Core Principles

1. **Measure First**: Always profile before optimizing
2. **Target Hot Paths**: Focus on frequently rendered components
3. **Balance Trade-offs**: Performance vs code maintainability
4. **Use Built-in Tools**: React.memo, useMemo, useCallback, React.lazy

## Decision Tree

```
Performance issue?
├── Component re-renders too often
│   ├── Parent re-renders → React.memo
│   ├── Expensive computation → useMemo
│   ├── Callback passed to child → useCallback
│   └── List items → Virtualization
├── Bundle too large
│   ├── Large libraries → Code splitting
│   ├── Route-based → React.lazy
│   └── Component-based → Dynamic import
└── Slow initial load
    ├── Images → Lazy loading
    ├── Below fold → Intersection Observer
    └── Data → Pagination/Infinite scroll
```

## Memoization Patterns

### 1. React.memo

```typescript
// ❌ BAD: Re-renders on every parent update
function UserCard({ user }) {
  return <div>{user.name}</div>
}

// ✅ GOOD: Only re-renders when user changes
const UserCard = React.memo(function UserCard({ user }) {
  return <div>{user.name}</div>
})
```

### 2. useMemo

```typescript
// ❌ BAD: Expensive computation on every render
function ProductList({ products, filter }) {
  const filtered = products.filter(p => p.category === filter)
  return filtered.map(p => <Product key={p.id} product={p} />)
}

// ✅ GOOD: Memoize expensive computation
function ProductList({ products, filter }) {
  const filtered = useMemo(
    () => products.filter(p => p.category === filter),
    [products, filter]
  )
  return filtered.map(p => <Product key={p.id} product={p} />)
}
```

### 3. useCallback

```typescript
// ❌ BAD: New function reference on every render
function Parent() {
  const [count, setCount] = useState(0)
  
  return <Child onClick={() => console.log('clicked')} />
}

// ✅ GOOD: Stable function reference
function Parent() {
  const [count, setCount] = useState(0)
  
  const handleClick = useCallback(() => {
    console.log('clicked')
  }, [])
  
  return <Child onClick={handleClick} />
}
```

## Code Splitting

### 1. Route-based Splitting

```typescript
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings = lazy(() => import('./pages/Settings'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  )
}
```

### 2. Component-based Splitting

```typescript
import { lazy, Suspense } from 'react'

const HeavyChart = lazy(() => import('./HeavyChart'))

function Dashboard() {
  const [showChart, setShowChart] = useState(false)
  
  return (
    <div>
      <button onClick={() => setShowChart(true)}>Show Chart</button>
      {showChart && (
        <Suspense fallback={<Spinner />}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  )
}
```

## Virtualization

### 1. Windowing for Large Lists

```typescript
import { FixedSizeList } from 'react-window'

function LargeList({ items }) {
  return (
    <FixedSizeList
      height={600}
      width="100%"
      itemCount={items.length}
      itemSize={50}
    >
      {({ index, style }) => (
        <div style={style}>
          {items[index].name}
        </div>
      )}
    </FixedSizeList>
  )
}
```

### 2. Dynamic Size Lists

```typescript
import { VariableSizeList } from 'react-window'

function DynamicList({ items }) {
  const getItemSize = (index) => {
    return items[index].expanded ? 100 : 50
  }
  
  return (
    <VariableSizeList
      height={600}
      width="100%"
      itemCount={items.length}
      itemSize={getItemSize}
    >
      {({ index, style }) => (
        <div style={style}>
          {items[index].content}
        </div>
      )}
    </VariableSizeList>
  )
}
```

## Image Optimization

### 1. Lazy Loading

```typescript
function LazyImage({ src, alt }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const imgRef = useRef()
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLoaded(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    
    if (imgRef.current) {
      observer.observe(imgRef.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  return (
    <div ref={imgRef}>
      {isLoaded ? (
        <img src={src} alt={alt} loading="lazy" />
      ) : (
        <div className="placeholder" />
      )}
    </div>
  )
}
```

### 2. Responsive Images

```typescript
function ResponsiveImage({ src, alt, sizes }) {
  return (
    <picture>
      <source
        media="(min-width: 800px)"
        srcSet={`${src}?w=800 800w, ${src}?w=1200 1200w`}
        sizes={sizes}
      />
      <source
        media="(min-width: 400px)"
        srcSet={`${src}?w=400 400w, ${src}?w=600 600w`}
        sizes={sizes}
      />
      <img
        src={`${src}?w=400`}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
    </picture>
  )
}
```

## Profiling Tools

### 1. React DevTools Profiler

```typescript
// Enable in development
import { Profiler } from 'react'

function onRenderCallback(
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) {
  console.log({
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  })
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <MyComponent />
    </Profiler>
  )
}
```

### 2. Performance Measurement

```typescript
function usePerformanceMeasure(name) {
  useEffect(() => {
    const start = performance.now()
    
    return () => {
      const end = performance.now()
      console.log(`${name}: ${end - start}ms`)
    }
  }, [name])
}

function SlowComponent() {
  usePerformanceMeasure('SlowComponent')
  
  // ... component logic
}
```

## Common Pitfalls

1. **Over-optimization**: Don't memoize everything, measure first
2. **Missing dependencies**: Always include all dependencies in useMemo/useCallback
3. **Inline objects/functions**: Create stable references outside render
4. **Large context values**: Split contexts or use selectors
5. **Unnecessary re-renders**: Use React.memo strategically

## Checklist

- [ ] Profile before optimizing
- [ ] Memoize expensive computations
- [ ] Use React.memo for pure components
- [ ] Implement code splitting for routes
- [ ] Virtualize large lists
- [ ] Lazy load images
- [ ] Avoid inline objects/functions
- [ ] Use stable references for callbacks
- [ ] Monitor bundle size
- [ ] Test performance impact
