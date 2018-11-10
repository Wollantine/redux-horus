import {branch} from '../src/redux-horus'

describe('branch', () => {
    const firstReducer = (s, a) => a.type === 'A' ? s + 1 : s
    const secondReducer = (s, a) => a.type === 'A' ? s + 2 : s

    it('should call first reducer when predicate passes', () => {
        const reducer = branch(() => true, firstReducer, secondReducer)
        expect(reducer(2, {type: 'A'})).toBe(3)
    })

    it('should call second reducer when predicate fails', () => {
        const reducer = branch(() => false, firstReducer, secondReducer)
        expect(reducer(2, {type: 'A'})).toBe(4)
    })

    it('should pass state and action to the predicate', () => {
        const spy = jest.fn(() => true)
        const reducer = branch(spy, firstReducer, secondReducer)
        const nextState = reducer(2, {type: 'B'})
        expect(spy).toBeCalledWith(2, {type: 'B'})
    })
})