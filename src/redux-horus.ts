import {curry} from '@typed/curry'

export type Dictionary<T> = {[key: string]: T}

export type Action = {
    [key: string]: any;
    type: string;
}

export type Reducer<T> = (state: T | undefined, action: Action) => T

const propOr = (def: any, prop: string, obj: any): any => (
    (obj && obj[prop]) || def
)

const pathEq = (path: string[], value: any, obj: any): boolean => (
    obj === undefined || obj == null || path.length === 0
        ? (obj !== undefined && value === obj)
        : pathEq(path.slice(1), value, obj[path[0]])
    )

export const hash = curry(<T>(
    reducer: (state: T, action: Action) => Dictionary<(state?: T, action?: Action) => T>,
    initialState: T | (() => T)
): Reducer<T> => (
    (state: T | undefined, action: Action): T => {
        const initializedState = (state === undefined)
            ? typeof initialState === 'function' ? (initialState as () => T)() : initialState
            : state
        const defaultCase = () => initializedState
        const cases = reducer(initializedState, action)
        const matchedCase: (state?: T, action?: Action) => T = propOr(defaultCase, action.type, cases)
        return matchedCase(state, action)
    }
))
    
export const when = curry(<T>(
    condition: (state: T, action: Action) => boolean,
    reducer: Reducer<T>,
    initialState: T | (() => T),
): Reducer<T> => (state: T | undefined, action: Action): T => {
    const initializedState: T = (state === undefined)
            ? typeof initialState === 'function' ? (initialState as () => T)() : initialState
            : state
    return condition(initializedState, action)
        ? reducer(initializedState, action)
        : initializedState
})

export const whenAction = curry(<T>(
    condition: (action: Action) => boolean,
    reducer: Reducer<T>,
    initialState: T,
): Reducer<T> =>
    when((action: Action) => condition(action), reducer, initialState)
)

export const whenState = curry(<T>(
    condition: (state: T) => boolean,
    reducer: Reducer<T>,
    initialState: T,
): Reducer<T> =>
    when(({state}: {state: T}) => condition(state), reducer, initialState)
)

export const branch = curry(<T>(
    condition: (state: T | undefined, action: Action) => boolean,
    thenReducer: Reducer<T>,
    elseReducer: Reducer<T>
): Reducer<T> => (
    (state, action) => (
        condition(state, action)
            ? thenReducer(state, action)
            : elseReducer(state, action)
    )
))

export const has = curry((path: string, value: any, obj: any) => (
    pathEq(path.split('.'), value, obj)
))

export const is = curry((type: string, action: Action) => (
    has('type', type, action)
))
