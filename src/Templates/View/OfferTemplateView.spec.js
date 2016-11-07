import AbstractTemplateView from './AbstractTemplateView'
import assert from 'assert'
import OfferTemplateView from './OfferTemplateView'
import AbstractTemplate from '../AbstractTemplate'
import * as ko from 'knockout'
import * as generator from '../../../db'

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

	it('should have template prop', () => {
		assert.equal(ko.isObservable(model.template), true)
		assert.equal((model.template()), 'OfferTemplateView')
	})

	it('should accept data into constructor', () => {
		let data = generator.generateOfferTemplate(1)
		model = new OfferTemplateView(dispatcher, data)
		let actual = ko.toJS(model)
		let overrides = {dispatcher: 1, isSelected: 1, template: 1, type: 1}
		assert.deepEqual({...actual, ...overrides}, {...data, ...overrides})
	})
})
