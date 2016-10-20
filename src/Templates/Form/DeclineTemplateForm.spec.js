import assert from 'assert'
import DeclineTemplateForm from './DeclineTemplateForm'
import AbstractTemplateForm from './AbstractTemplateForm'
import AbstractTemplate from '../AbstractTemplate'
import * as ko from 'knockout'

describe('DeclineTemplateForm', () => {
	let model
	let dispatcher

	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new DeclineTemplateForm(dispatcher)
	})
	it('should be instantiable', () => {
		assert.equal(model instanceof DeclineTemplateForm, true)
		assert.equal(model instanceof AbstractTemplateForm, true)
		assert.equal(model instanceof AbstractTemplate, true)
	})
})
