import {whenAction} from "../src/redux-horus"
import { whenTests } from './when.test';

const startAction = {type: '@@INIT'}

describe('whenAction', () => {
    describe('Common functionality', whenTests(whenAction))
    
    it('should pass only the action to the condition', () => {
        const spy = jest.fn(() => true)
        const state = {a: 'test'}
        whenAction(spy, x => x, {})(state, startAction)
        expect(spy).toBeCalledWith(startAction)
    })
})
