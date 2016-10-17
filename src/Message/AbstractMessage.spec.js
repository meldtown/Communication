import assert from 'assert'
import AbstractMessage from './AbstractMessage'

describe('AbstractMessage', () => {
	it('should be instantiable', () => {
		let model = new AbstractMessage()
		assert.equal(model instanceof AbstractMessage, true)
	})
})
