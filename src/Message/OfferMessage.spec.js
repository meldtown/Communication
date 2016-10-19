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

	it('should have vacancyId', () => {
		assert.equal(ko.isObservable(model.vacancyId), true)
	})

	it('should have template prop been set in constructor', () => {
		assert.equal(model.template(), 'OfferMessage')
	})
})
