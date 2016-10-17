import assert from 'assert'
import OfferTemplateView from './OfferTemplateView'
import AbstractTemplate from '../AbstractTemplate'

describe('OfferTemplateView', () => {
	it('should be instantiable', () => {
		let model = new OfferTemplateView()
		assert.equal(model instanceof OfferTemplateView, true)
		assert.equal(model instanceof AbstractTemplate, true)
	})
})
