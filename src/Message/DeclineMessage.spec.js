import assert from 'assert'
import DeclineMessage from './DeclineMessage'
import AbstractMessage from './AbstractMessage'

describe('DeclineMessage', () => {
	let model

	beforeEach(() => {
		model = new DeclineMessage()
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof DeclineMessage, true)
		assert.equal(model instanceof AbstractMessage, true)
	})

	it('should have template prop been set in constructor', () => {
		assert.equal(model.template(), 'DeclineMessage')
	})
})
