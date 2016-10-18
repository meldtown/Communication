import * as ko from 'knockout'
import assert from 'assert'
import InviteMessageForm from './InviteMessageForm'
import AbstractMessageForm from './AbstractMessageForm'

describe('InviteMessageForm', () => {
	let model
	let dispatcher

	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new InviteMessageForm(dispatcher)
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof InviteMessageForm, true)
		assert.equal(model instanceof AbstractMessageForm, true)
	})

	it('should have inviteDate', () => {
		assert.equal(ko.isObservable(model.inviteDate), true)
	})

	it('should have addressId', () => {
		assert.equal(ko.isObservable(model.addressId), true)
	})
})
