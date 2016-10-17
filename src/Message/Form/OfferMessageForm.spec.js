import assert from 'assert'
import OfferMessageForm from './OfferMessageForm'

describe('OfferMessageForm', () => {
	it('should be instantiable', () => {
		let model = new OfferMessageForm()
		assert.equal(model instanceof OfferMessageForm, true)
	})
})
