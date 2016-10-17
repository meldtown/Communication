import assert from 'assert'
import OfferMessage from './OfferMessage'

describe('OfferMessage', () => {
	it('should be instantiable', () => {
		let model = new OfferMessage()
		assert.equal(model instanceof OfferMessage, true)
	})
})
