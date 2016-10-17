import assert from 'assert'
import DeclineTemplateForm from './DeclineTemplateForm'
import AbstractTemplateForm from './AbstractTemplateForm'
import AbstractTemplate from '../AbstractTemplate'

describe('DeclineTemplateForm', () => {
	it('should be instantiable', () => {
		let model = new DeclineTemplateForm()
		assert.equal(model instanceof DeclineTemplateForm, true)
		assert.equal(model instanceof AbstractTemplateForm, true)
		assert.equal(model instanceof AbstractTemplate, true)
	})
})
