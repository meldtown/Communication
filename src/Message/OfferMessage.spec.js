import * as ko from 'knockout'
import assert from 'assert'
import OfferMessage from './OfferMessage'
import AbstractMessage from './AbstractMessage'

describe('OfferMessage', () => {
	let model
	beforeEach(() => {
		model = new OfferMessage()
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof OfferMessage, true)
		assert.equal(model instanceof AbstractMessage, true)
	})

	it('should have vacancy', () => {
		assert.equal(ko.isObservable(model.vacancy), true)
	})
})
