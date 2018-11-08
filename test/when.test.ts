import {when} from "../src/redux-horus"

const startAction = {type: '@@INIT'}

export const whenTests = whenFn => () => {
    it('should initialize state when condition fails', () => {
        const actual = whenFn(() => false, x => x, 0)(undefined, startAction)
        const expected = 0
        expect(actual).toBe(expected)
    })

    it('should pass initialized state when condition succeeds', () => {
        const actual = whenFn(() => true, x => x, 0)(undefined, startAction)
        const expected = 0
        expect(actual).toBe(expected)
    })

    it('should use reducer when condition succeeds', () => {
        const actual = whenFn(() => true, x => x + 1, 0)(undefined, startAction)
        const expected = 1
        expect(actual).toBe(expected)
    })

    it('should not use reducer when condition fails', () => {
        const actual = whenFn(() => false, x => x + 1, 0)(undefined, startAction)
        const expected = 0
        expect(actual).toBe(expected)
    })

    it('should pass the state and the action to the reducer', () => {
        const spy = jest.fn(x => x)
        const state = {a: 'test'}
        whenFn(() => true, spy, {})(state, startAction)
        expect(spy).toBeCalledWith(state, startAction)
    })
}

describe('when', () => {
    describe('Common functionality', whenTests(when))
    
    it('should pass the state and the action to the condition', () => {
        const spy = jest.fn(() => true)
        const state = {a: 'test'}
        when(spy, x => x, {})(state, startAction)
        expect(spy).toBeCalledWith(state, startAction)
    })
})
