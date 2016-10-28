import assert from 'assert'
import AbstractTemplateForm from './AbstractTemplateForm'
import AbstractTemplate from '../AbstractTemplate'
import * as ko from 'knockout'
import * as generator from '../../../db'
import * as constants from '../../constants'

describe('AbstractTemplateForm', () => {
	let model
	let dispatcher

	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new AbstractTemplateForm(dispatcher)
	})
	it('should be instantiable', () => {
		assert.equal(model instanceof AbstractTemplateForm, true)
		assert.equal(model instanceof AbstractTemplate, true)
	})

	it('should accept data into constructor', () => {
		let data = generator.generateStandardTemplate(1)
		model = new AbstractTemplateForm(dispatcher, data)

		assert.equal(model.id(), data.id)
		assert.equal(model.title(), data.title)
	})

	it('should have fill method', () => {
		assert.equal(typeof model.fill, 'function')
	})

	it('should fill given template', () => {
		model.id(1)
		model.title('title')
		model.text('text')
		model.language(constants.UA)

		let template = new AbstractTemplate(dispatcher)

		model.fill(template)

		assert.deepEqual(ko.toJS(template), ko.toJS(model))
	})
})
