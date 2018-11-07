import {curry} from '@typed/curry'

export type Dictionary<T> = {[key: string]: T}

export type TAction = {
    [key: string]: any;
    type: string;
}

export type TReducer<T> = (state: T | undefined, action: TAction) => T

const propOr = (def: any, prop: string, obj: any): any => (
    (obj && obj[prop]) || def
)

const pathEq = (path: string[], value: any, obj: any): boolean => (
    obj === undefined || obj == null || path.length === 0
        ? (obj !== undefined && value === obj)
        : pathEq(path.slice(1), value, obj[path[0]])
    )

export const hash = curry(<T>(
    reducer: (state: T, action: TAction) => Dictionary<(state?: T, action?: TAction) => T>,
    initialState: T | (() => T)
): TReducer<T> => (
    (state: T | undefined, action: TAction): T => {
        const initializedState = (state === undefined)
            ? typeof initialState === 'function' ? (initialState as () => T)() : initialState
            : state
        const defaultCase = () => initializedState
        const cases = reducer(initializedState, action)
        const matchedCase: (state?: T, action?: TAction) => T = propOr(defaultCase, action.type, cases)
        return matchedCase(state, action)
    }
))
    
export const when = curry(<T>(
    condition: ({state, action}: {state: T, action: TAction}) => boolean,
    reducer: TReducer<T>,
    initialState: T,
): TReducer<T> => (state: T = initialState, action: TAction): T => (
    condition({state, action})
        ? reducer(state, action)
        : state
))

export const whenAction = curry(<T>(
    condition: (action: TAction) => boolean,
    reducer: TReducer<T>,
    initialState: T,
): TReducer<T> =>
    when(({action}: {action: TAction}) => condition(action), reducer, initialState)
)

export const whenState = curry(<T>(
    condition: (state: T) => boolean,
    reducer: TReducer<T>,
    initialState: T,
): TReducer<T> =>
    when(({state}: {state: T}) => condition(state), reducer, initialState)
)

export const branch = curry(<T>(
    condition: (state: T | undefined, action: TAction) => boolean,
    thenReducer: TReducer<T>,
    elseReducer: TReducer<T>
): TReducer<T> => (
    (state, action) => (
        condition(state, action)
            ? thenReducer(state, action)
            : elseReducer(state, action)
    )
))

export const has = curry((path: string, value: any, obj: any) => (
    pathEq(path.split('.'), value, obj)
))

export const is = curry((type: string, action: TAction) => (
    has('type', type, action)
))
