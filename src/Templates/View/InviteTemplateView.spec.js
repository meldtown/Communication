import assert from 'assert'
import InviteTemplateView from './InviteTemplateView'
import AbstractTemplate from '../AbstractTemplate'
import AbstractTemplateView from './AbstractTemplateView'
import * as ko from 'knockout'
import * as generator from '../../../db'
import Address from '../../Address/Address'

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

	// it('should have addressId', () => {
	// 	assert.equal(ko.isObservable(model.addressId), true)
	// })
    //
	// it('should have address prop', () => {
	// 	let data =  generator.generateInviteTemplate(33)
	// 	let model = new InviteTemplateView(dispatcher, data)
	// 	assert.equal(ko.isObservable(model.address), true)
	// 	assert.deepEqual(ko.toJS(model.address()), ko.toJS(new Address(data.address)))
	// })
    //
	// it('should have addressText comp', () => {
	// 	assert.equal(ko.isComputed(model.addressText), true)
	// })

	it('should have inviteDate', () => {
		assert.equal(ko.isObservable(model.inviteDate), true)
	})

	it('should have template prop', () => {
		assert.equal(ko.isObservable(model.template), true)
		assert.equal((model.template()), 'InviteTemplateView')
	})

	it('should accept data into constructor', () => {
		let data = generator.generateInviteTemplate(1)
		model = new InviteTemplateView(dispatcher, data)
		let actual = ko.toJS(model)
		let overrides = {dispatcher: 1, addressText: '', isSelected: 1, template: 1, type: 1, address: {...data.address, optionText: 1}}
		assert.deepEqual({...actual, ...overrides}, {...data, ...overrides})
	})
})
