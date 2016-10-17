import assert from 'assert'
import InviteTemplateView from './InviteTemplateView'
import AbstractTemplate from '../AbstractTemplate'
import AbstractTemplateView from './AbstractTemplateView'
import * as ko from 'knockout'

describe('InviteTemplateView', () => {
	let model

	beforeEach(() => {
		model = new InviteTemplateView()
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof InviteTemplateView, true)
		assert.equal(model instanceof AbstractTemplateView, true)
		assert.equal(model instanceof AbstractTemplate, true)
	})

	it('should have address', () => {
		assert.equal(ko.isObservable(model.address), true)
	})

	it('should have time', () => {
		assert.equal(ko.isObservable(model.time), true)
	})
})