import assert from 'assert'
import InviteTemplateView from './InviteTemplateView'
import AbstractTemplate from '../AbstractTemplate'
import AbstractTemplateView from './AbstractTemplateView'
import * as ko from 'knockout'

describe('InviteTemplateView', () => {
	let model
	let dispatcher

	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new InviteTemplateView(dispatcher)
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof InviteTemplateView, true)
		assert.equal(model instanceof AbstractTemplateView, true)
		assert.equal(model instanceof AbstractTemplate, true)
	})

	it('should have addressId', () => {
		assert.equal(ko.isObservable(model.addressId), true)
	})

	it('should have inviteDate', () => {
		assert.equal(ko.isObservable(model.inviteDate), true)
	})
})
