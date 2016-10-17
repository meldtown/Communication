import assert from 'assert'
import OfferMessage from './OfferMessage'
import AbstractMessage from './AbstractMessage'

describe('OfferMessage', () => {
	it('should be instantiable', () => {
		let model = new OfferMessage()
		assert.equal(model instanceof OfferMessage, true)
		assert.equal(model instanceof AbstractMessage, true)

	})


})
