import * as ko from 'knockout'
import assert from 'assert'
import InviteMessageForm from './InviteMessageForm'
import AbstractMessageForm from './AbstractMessageForm'

describe('InviteMessageForm', () => {
	let model

	beforeEach(() => {
		model = new InviteMessageForm()
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof InviteMessageForm, true)
		assert.equal(model instanceof AbstractMessageForm, true)
	})

	it('should have time', () => {
		assert.equal(ko.isObservable(model.time), true)
	})

	it('should have address', () => {
		assert.equal(ko.isObservable(model.address), true)
	})
})
