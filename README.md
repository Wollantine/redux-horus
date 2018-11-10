<p align="center">
    <img src="./Eye_of_Horus.svg" width="200">
</p>

[![Build Status](https://travis-ci.org/kwirke/redux-horus.svg?branch=master)](https://travis-ci.org/kwirke/redux-horus)
[![Coverage Status](https://coveralls.io/repos/github/kwirke/redux-horus/badge.svg?branch=master)](https://coveralls.io/github/kwirke/redux-horus?branch=master)

# Redux Horus
Higher Order Reducers for Redux

## Install
```
npm install redux-horus
```

## Example
Instead of this:
```javascript
const counterReducer = (counterName) => (state = 0, action) => {
    if (action.counterName !== counterName) {
        return state
    }
    switch (action.type) {
        case 'INCREMENT':
            return state + 1
        case 'DECREMENT':
            return state - 1
        case 'RESET':
            return 0
        default:
            return state
    }
}
```

Do this:
```javascript
import {hash, whenAction, has} from 'redux-horus'

const counter = hash((state, action) => ({
    INCREMENT: () => state + 1,
    DECREMENT: () => state - 1,
    RESET: () => 0
}), 0)

const counterReducer = (counterName) => whenAction(has('counterName', counterName), counter, 0)
```

## API
All the functions are already curried.

Types:
```javascript
type Dictionary<T> = {[key: string]: T}

type Action = {
    [key: string]: any;
    type: string;
}

type Reducer<T> = (state: T | undefined, action: TAction) => T
```

- ### hash(reducer, initialState)
```
hash(
    reducer: (state: T, action: TAction) => Dictionary<(state?: T, action?: Action) => T>,
    initialState: T
): Reducer<T>
```

Returns a reducer that will return the result of `reducer[action.type](state, action)` if the action.type is among the hash keys, or current state otherwise.

It will use initialState instead of state when state is undefined.

- ### when(predicate, reducer, initialState)
```
when(
    predicate: (state: T, action: Action) => boolean,
    reducer: Reducer<T>,
    initialState: T
): Reducer<T>
```

Returns a reducer that will act as `reducer` when predicate returns true for current state and action, and as `identity` otherwise.

- ### whenAction(predicate, reducer, initialState)
```
whenAction(
    predicate: (action: Action) => boolean,
    reducer: Reducer<T>,
    initialState: T
): Reducer<T>
```

Same as `when`, but only passes action to the predicate.

- ### whenState(predicate, reducer, initialState)
```
whenState(
    predicate: (state: T) => boolean,
    reducer: Reducer<T>,
    initialState: T
): Reducer<T>
```

Same as `when`, but only passes state to the predicate. Useful for functions that have variable arity.

- ### branch(predicate, thenReducer, elseReducer)
```
branch(
    predicate: (state: T, action: Action) => boolean,
    thenReducer: Reducer<T>,
    elseReducer: Reducer<T>
): Reducer<T>
```

Returns a reducer that will act as `thenReducer` when predicate returns true, and as `elseReducer` when predicate returns false.

Both reducers are responsible of handling undefined initial state.

- ### has(path, value, obj)
```
has(
    path: string,
    value: T,
    obj: Dictionary<T>
)
```

Returns true if the object `obj` has a property equal to `value` in the path described with dot-notation `path`.
Example:
```
has('a.b.c', 3, { a: { b: { c: 3 } } }) // returns true
has('a.b.c', 3, { a: null }) // returns false
```

- ### is(type, action)
```
is(
    type: string,
    action: Action
)
```

Shorthand of `has('type')`, with stricter typing.

## Motivation
There is already a good similar library, [astx-redux-util](https://astx-redux-util.js.org/), that offers mostly the same reducers
than this one.

I don't totally agree with the syntax and naming, so I uploaded this one. *It is likely to end up as a PR on astx-redux-util.*

Some differences are:
- Redux Horus aims for a shorter naming that is more naturally readable.
- `reducerHash` needs each case to receive state and action parameters. `hash` uses a closure, though it accepts also the other syntax (as a function instead of an object).
```javascript
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
```javascript
// astx-redux-util
conditionalReducer((state, action) => action.type === TYPE, reducer)

// redux-horus
whenAction(action => action.type === TYPE, reducer)

// redux-horus, with 'is'
whenAction(is(TYPE), reducer)
```
- Redux Horus has no `joinReducers`
- Redux Horus exposes some silly but always needed functional helpers.
- Redux Horus functions are all curried.

## Thanks
Thanks to @alexjoverm for his [typescript-library-starter](https://github.com/alexjoverm/typescript-library-starter).
