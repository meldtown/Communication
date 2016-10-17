import assert from 'assert'
import DeclineTemplateForm from './DeclineTemplateForm'

describe('DeclineTemplateForm', () => {
	it('should be instantiable', () => {
		let model = new DeclineTemplateForm()
		assert.equal(model instanceof DeclineTemplateForm, true)
	})
})
