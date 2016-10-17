import * as ko from 'knockout'
import assert from 'assert'
import InviteTemplateForm from './InviteTemplateForm'

describe('InviteTemplateForm', () => {
	let model

	beforeEach(() => {
		model = new InviteTemplateForm()
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof InviteTemplateForm, true)
	})

	it('should have time', () => {
		assert.equal(ko.isObservable(model.time), true)
	})

	it('should have address', () => {
		assert.equal(ko.isObservable(model.address), true)
	})
})
