import assert from 'assert'
import DeclineTemplateView from './DeclineTemplateView'
import AbstractTemplate from '../AbstractTemplate'
import AbstractTemplateView from './AbstractTemplateView'
import * as ko from 'knockout'
import * as generator from '../../../db'

describe('DeclineTemplateView', () => {
	let model
	let dispatcher

	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new DeclineTemplateView(dispatcher)
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof DeclineTemplateView, true)
		assert.equal(model instanceof AbstractTemplateView, true)
		assert.equal(model instanceof AbstractTemplate, true)
	})

	it('should have template prop', () => {
		assert.equal(ko.isObservable(model.template), true)
		assert.equal((model.template()), 'DeclineTemplateForm')
	})

	it('should accept data into constructor', () => {
		let data = generator.generateDeclineTemplate(1)
		model = new DeclineTemplateView(dispatcher, data)
		let actual = ko.toJS(model)
		let overrides = {dispatcher: 1, isSelected: 1, template: 1, type: 1}
		assert.deepEqual({...actual, ...overrides}, {...data, ...overrides})
	})
})
