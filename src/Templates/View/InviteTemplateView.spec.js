import assert from 'assert'
import InviteTemplateView from './InviteTemplateView'
import AbstractTemplate from '../AbstractTemplate'
import * as ko from 'knockout'

describe('InviteTemplateView', () => {

	it('should be instantiable', () => {
		let model
		model = new InviteTemplateView()
		assert.equal(model instanceof InviteTemplateView, true)
		assert.equal(model instanceof AbstractTemplate, true)
	})

	it('should have address', () => {
		let model
		model = new InviteTemplateView()
		assert.equal(ko.isObservable(model.address), true)
	})

	it('should have time', () => {
		let model
		model = new InviteTemplateView()
		assert.equal(ko.isObservable(model.time), true)
	})

})
