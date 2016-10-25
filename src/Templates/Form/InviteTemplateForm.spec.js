import * as ko from 'knockout'
import assert from 'assert'
import InviteTemplateForm from './InviteTemplateForm'
import AbstractTemplateForm from './AbstractTemplateForm'
import AbstractTemplate from '../AbstractTemplate'

describe('InviteTemplateForm', () => {
	let model
	let dispatcher
	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new InviteTemplateForm(dispatcher)
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof InviteTemplateForm, true)
		assert.equal(model instanceof AbstractTemplateForm, true)
		assert.equal(model instanceof AbstractTemplate, true)
	})

	it('should have inviteDate', () => {
		assert.equal(ko.isObservable(model.inviteDate), true)
	})

	it('should have addressId', () => {
		assert.equal(ko.isObservable(model.addressId), true)
	})

	it('should have save method', () => {
		assert.equal(typeof model.save, 'function')
	})
})
