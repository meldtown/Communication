import assert from 'assert'
import AbstractTemplateForm from './AbstractTemplateForm'

describe('AbstractTemplateForm', () => {
	it('should be instantiable', () => {
		let model = new AbstractTemplateForm()
		assert.equal(model instanceof AbstractTemplateForm, true)
	})
})
