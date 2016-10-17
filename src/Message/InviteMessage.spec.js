import assert from 'assert'
import * as ko from 'knockout'
import InviteMessage from './InviteMessage'


describe('InviteMessage', () => {
	let model
	beforeEach(() => {
		model = new InviteMessage()
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof InviteMessage, true)
	})

	it('should have time', () => {
		assert.equal(ko.isObservable(model.time), true)
	})

	it('should have address', () => {
		assert.equal(ko.isObservable(model.address), true)
	})
})
