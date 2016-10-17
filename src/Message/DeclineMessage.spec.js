import assert from 'assert'
import DeclineMessage from './DeclineMessage'
import AbstractMessage from './AbstractMessage'

describe('DeclineMessage', () => {
	it('should be instantiable', () => {
		let model = new DeclineMessage()
		assert.equal(model instanceof DeclineMessage, true)
		assert.equal(model instanceof AbstractMessage, true)
	})
})
