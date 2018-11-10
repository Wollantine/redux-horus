import {is} from '../src/redux-horus'

describe('is', () => {
    it('should return true if the object is an action of that type', () => {
        const action = {type: 'INCREMENT', payload: {a: 'something'}}
        const actual = is('INCREMENT', action)
        expect(actual).toBe(true)
    })

    it('should return true if action has nothing else than type', () => {
        const action = {type: 'DECREMENT'}
        const actual = is('DECREMENT', action)
        expect(actual).toBe(true)
    })

    it('should be curried', () => {
        const action = {type: 'INCREMENT', payload: {a: 'something'}}
        expect(is('INCREMENT', action))
            .toBe(is('INCREMENT')(action))
    })

    it('should be case sensitive', () => {
        const action = {type: 'A'}
        expect(is('a', action)).toBe(false)
    })

    it('should return false if it is an action of another type', () => {
        const action = {type: 'INCREMENT'}
        expect(is('DECREMENT', action)).toBe(false)
    })

    it('should return false if the object is not an action', () => {
        const obj = {payload: {a: 'something'}}
        expect(is('INCREMENT', obj as any)).toBe(false)
    })

    it('should return false if type is null', () => {
        const action: any = {type: null}
        expect(is('INCREMENT', action)).toBe(false)
    })

    it('should return false if type is undefined', () => {
        const action: any = {type: undefined}
        expect(is('INCREMENT', action)).toBe(false)
    })
})