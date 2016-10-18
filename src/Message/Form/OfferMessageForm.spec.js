import * as ko from 'knockout'
import assert from 'assert'
import OfferMessageForm from './OfferMessageForm'

describe('OfferMessageForm', () => {
	it('should be instantiable', () => {
		let model = new OfferMessageForm(new ko.subscribable())
		assert.equal(model instanceof OfferMessageForm, true)
	})
})
