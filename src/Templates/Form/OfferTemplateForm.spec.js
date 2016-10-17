import assert from 'assert'
import OfferTemplateForm from './OfferTemplateForm'
import AbstractTemplateForm from './AbstractTemplateForm'
import AbstractTemplate from '../AbstractTemplate'

describe('OfferTemplateForm', () => {
	it('should be instantiable', () => {
		let model = new OfferTemplateForm()
		assert.equal(model instanceof OfferTemplateForm, true)
		assert.equal(model instanceof AbstractTemplateForm, true)
		assert.equal(model instanceof AbstractTemplate, true)
	})
})
