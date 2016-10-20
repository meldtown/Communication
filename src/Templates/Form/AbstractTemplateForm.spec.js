import assert from 'assert'
import AbstractTemplateForm from './AbstractTemplateForm'
import * as ko from 'knockout'

describe('AbstractTemplateForm', () => {
	let model
	let dispatcher

	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new AbstractTemplateForm(dispatcher)
	})
	it('should be instantiable', () => {
		assert.equal(model instanceof AbstractTemplateForm, true)
	})
})
