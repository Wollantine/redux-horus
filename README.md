# Redux Horus
Higher Order Reducers for Redux

## Example
```
import {hash, whenAction, has}

const counter = hash((state, action) => ({
    INCREMENT: () => state + 1,
    DECREMENT: () => state - 1,
}))

const counterReducer = (counterName) => whenAction(has('counterName', counterName), counter)
```


## API

### hash

### when

### whenAction

### whenState

### branch

### has(path, value, obj)

### is(type, action)


## Motivation
There is already a good similar library, [astx-redux-util](https://astx-redux-util.js.org/), that offers mostly the same reducers
than this one.

I don't totally agree with the syntax and naming, so I uploaded this one. *It is likely to end up as a PR on astx-redux-util.*

Some differences are:
- Redux Horus aims for a shorter naming that is more naturally readable.
- `reducerHash` needs each case to receive state and action parameters. `hash` uses a closure, though it accepts also the other syntax (as a function instead of an object).
```
// astx-redux-util
reducerHash({
    INCREMENT: (state, action) => state + 1,
    DECREMENT: (state, action) => state - 1,
})

// redux-horus
hash((state, action) => ({
    INCREMENT: () => state + 1,
    DECREMENT: () => state - 1,
}))

// redux-horus, also
hash(() => ({
    INCREMENT: (state, action) => state + 1,
    DECREMENT: (state, action) => state - 1,
}))
```
- `conditionalReducer` passes state and action to the predicate as two parameters. `whenAction` and `whenState` allow to ignore one of both.
```
// astx-redux-util
conditionalReducer((state, action) => action.type === TYPE, reducer)

// redux-horus
whenAction(action => action.type === TYPE, reducer)
```
- Redux Horus exposes some silly but always needed functional helpers.
- Redux Horus functions are all curried.