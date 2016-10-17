import assert from 'assert'
import OfferTemplateForm from './OfferTemplateForm'

describe('OfferTemplateForm', () => {
	it('should be instantiable', () => {
		let model = new OfferTemplateForm()
		assert.equal(model instanceof OfferTemplateForm, true)
	})
})
