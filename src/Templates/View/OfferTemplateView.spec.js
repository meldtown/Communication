import AbstractTemplateView from './AbstractTemplateView'
import assert from 'assert'
import OfferTemplateView from './OfferTemplateView'
import AbstractTemplate from '../AbstractTemplate'
import * as ko from 'knockout'

describe('OfferTemplateView', () => {
	let model
	let dispatcher

	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new OfferTemplateView(dispatcher)
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof OfferTemplateView, true)
		assert.equal(model instanceof AbstractTemplateView, true)
		assert.equal(model instanceof AbstractTemplate, true)
	})
})
