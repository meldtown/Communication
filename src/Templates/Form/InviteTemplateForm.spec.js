import assert from 'assert'
import InviteTemplateForm from './InviteTemplateForm'

describe('InviteTemplateForm', () => {
	it('should be instantiable', () => {
		let model = new InviteTemplateForm()
		assert.equal(model instanceof InviteTemplateForm, true)
	})
})
