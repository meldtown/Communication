import assert from 'assert'
import * as helpers from './helpers'

describe('helpers', () => {
	describe('uniqueReducer', () => {
		it('should add only new values', () => {
			assert.deepEqual(helpers.uniqueReducer([1], 1), [1])
			assert.deepEqual(helpers.uniqueReducer([1], 2), [1, 2])
		})

		it('should handle undefined initial value', () => {
			assert.deepEqual(helpers.uniqueReducer(undefined, 1), [1])
		})
	})
})
