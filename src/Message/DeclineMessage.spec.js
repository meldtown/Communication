import assert from 'assert'
import DeclineMessage from './DeclineMessage'

describe('DeclineMessage', () => {
	it('should be instantiable', () => {
		let model = new DeclineMessage()
		assert.equal(model instanceof DeclineMessage, true)
	})
})
