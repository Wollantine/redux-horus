import {hash, whenAction, has} from "../src/redux-horus"

const initAction = {type: '@@INIT'}

describe('hash', () => {
    describe('docs example', () => {
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

        const counter = hash((state, action) => ({
            INCREMENT: () => state + 1,
            DECREMENT: () => state - 1,
            RESET: () => 0
        }), 0)
        
        const counterReducer2 = (counterName) => whenAction(has('counterName', counterName), counter, 0)

        const referenceReducer = counterReducer('test')
        const reducer = counterReducer2('test')

        it('should return the same initial state', () => {
            const expected = referenceReducer(undefined, initAction)
            expect(reducer(undefined, initAction))
                .toBe(expected)
        })

        it('should return the same state after the same action', () => {
            const increment = {type: 'INCREMENT'}
            const expected = referenceReducer(referenceReducer(undefined, increment), increment)
            expect(reducer(reducer(undefined, increment), increment))
                .toBe(expected)
        })

        it('should return the same state after the same set of actions', () => {
            const increment = {type: 'INCREMENT'}
            const decrement = {type: 'DECREMENT'}
            const reset = {type: 'RESET'}
    
            const actions = [increment, reset, increment, decrement, increment]
            const expected = actions.reduce(referenceReducer, undefined)
            expect(actions.reduce(reducer, undefined)).toBe(expected)
        })

        it('should work for all types of actions', () => {
            const randomAction = {type: 'RANDOM_TYPE'}
            const expected = referenceReducer(42, randomAction)
            expect(reducer(42, randomAction)).toBe(expected)
        })

    })

    it('should fall to current state if action is not expected', () => {
        const reducer = hash(() => ({
            TEST: () => 0
        }), 0)
        const randomAction = {type: 'RANDOM_TYPE'}
        expect(reducer(42, randomAction)).toBe(42)
    })

    it('should fall to initialState if action is not expected and state is undefined', () => {
        const reducer = hash(() => ({
            TEST: () => 42
        }), 0)
        const randomAction = {type: 'RANDOM_TYPE'}
        expect(reducer(undefined, randomAction)).toBe(0)
    })
})
