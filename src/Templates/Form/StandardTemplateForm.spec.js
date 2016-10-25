import assert from 'assert'
import StandardTemplateForm from './StandardTemplateForm'
import AbstractTemplateForm from './AbstractTemplateForm'
import AbstractTemplate from '../AbstractTemplate'
import * as ko from 'knockout'

describe('StandardTemplateForm', () => {
	let model
	let dispatcher
	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new StandardTemplateForm(dispatcher)

	})
	it('should be instantiable', () => {
		assert.equal(model instanceof StandardTemplateForm, true)
		assert.equal(model instanceof AbstractTemplateForm, true)
		assert.equal(model instanceof AbstractTemplate, true)
	})

	it('should have save method', () => {
		assert.equal(typeof model.save, 'function')
	})
})
