import assert from 'assert'
import OfferTemplateForm from './OfferTemplateForm'
import AbstractTemplateForm from './AbstractTemplateForm'
import AbstractTemplate from '../AbstractTemplate'
import * as ko from 'knockout'

describe('OfferTemplateForm', () => {
	let model
	let dispatcher
	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new OfferTemplateForm(dispatcher)
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof OfferTemplateForm, true)
		assert.equal(model instanceof AbstractTemplateForm, true)
		assert.equal(model instanceof AbstractTemplate, true)
	})
})
