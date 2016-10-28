import AbstractTemplateView from './AbstractTemplateView'
import assert from 'assert'
import StandardTemplateView from './StandardTemplateView'
import AbstractTemplate from '../AbstractTemplate'
import * as ko from 'knockout'
import * as generator from '../../../db'

describe('StandardTemplateView', () => {
	let model
	let dispatcher

	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new StandardTemplateView(dispatcher)
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof StandardTemplateView, true)
		assert.equal(model instanceof AbstractTemplateView, true)
		assert.equal(model instanceof AbstractTemplate, true)
	})

	it('should have template prop', () => {
		assert.equal(ko.isObservable(model.template), true)
		assert.equal((model.template()), 'StandardTemplateForm')
	})

	it('should accept data into constructor', () => {
		let data = generator.generateStandardTemplate(1)
		model = new StandardTemplateView(dispatcher, data)
		let actual = ko.toJS(model)
		let overrides = {dispatcher: 1, isSelected: 1, template: 1, type: 1}
		assert.deepEqual({...actual, ...overrides}, {...data, ...overrides})
	})
})
