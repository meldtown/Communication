import assert from 'assert'
import StandardTemplateForm from './StandardTemplateForm'
import AbstractTemplateForm from './AbstractTemplateForm'
import AbstractTemplate from '../AbstractTemplate'

describe('StandardTemplateForm', () => {
	it('should be instantiable', () => {
		let model = new StandardTemplateForm()
		assert.equal(model instanceof StandardTemplateForm, true)
		assert.equal(model instanceof AbstractTemplateForm, true)
		assert.equal(model instanceof AbstractTemplate, true)
	})
})
