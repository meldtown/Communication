import assert from 'assert'
import StandardTemplateForm from './StandardTemplateForm'

describe('StandardTemplateForm', () => {
	it('should be instantiable', () => {
		let model = new StandardTemplateForm()
		assert.equal(model instanceof StandardTemplateForm, true)
	})
})
