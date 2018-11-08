import {has} from '../src/redux-horus'

const obj = {
    a: {
        b: {
            c: 42
        }
    },
    d: 'test',
}

describe('has', () => {
    it('should return true if object has the property with that value', () => {
        const actual = has('d', 'test', obj)
        expect(actual).toBe(true)
    })

    it('should return false if object has the property with different value', () => {
        const actual = has('d', 'wrongValue', obj)
        expect(actual).toBe(false)
    })

    it('should return false if object does not have the property', () => {
        const actual = has('x', 'test', obj)
        expect(actual).toBe(false)
    })
    
    it('should return true if object has the deep property with that value', () => {
        const actual = has('a.b.c', 42, obj)
        expect(actual).toBe(true)
    })

    it('should return false if object has the deep property with different value', () => {
        const actual = has('a.b.c', 'wrongValue', obj)
        expect(actual).toBe(false)
    })

    it('should return false if object does not have the deep property', () => {
        const actual = has('d.b.c', 42, obj)
        expect(actual).toBe(false)
    })
})
