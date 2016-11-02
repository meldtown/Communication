import * as ko from 'knockout'
import assert from 'assert'
import InviteTemplateForm from './InviteTemplateForm'
import AbstractTemplateForm from './AbstractTemplateForm'
import AbstractTemplate from '../AbstractTemplate'
import * as generator from '../../../db'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import TemplateFactory from '../TemplateFactory'
import Templates from '../Templates'
import AddressForm from '../../Address/AddressForm'
import Address from '../../Address/Address'


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

	it('should accept data into constructor', () => {
		let data = generator.generateInviteTemplate(1)
		model = new InviteTemplateForm(dispatcher, data)

		assert.equal(model.id(), data.id)
		assert.equal(model.title(), data.title)
	})

	it('should have template prop', () => {
		assert.equal(ko.isObservable(model.template), true)
		assert.equal((model.template()), 'InviteTemplateForm')
	})

	it('should have addressForm prop', () => {
		assert.equal(ko.isObservable(model.addressForm), true)
		assert.equal(model.addressForm(), null)
	})

	it('should have createAddress method', () => {
		assert.equal(typeof model.createAddress, 'function')
	})

	it('should have createAddress method', () => {
		assert.equal(typeof model.createAddress, 'function')
	})

	it('should have addresses observable array', () => {
		assert.ok(ko.isObservable(model.addresses))
		assert.equal(typeof model.addresses.push, 'function')
		assert.equal(model.addresses().length, 0)
	})

	it('should have saveAddress method', () => {
		let data = {
			street: '12th Avenue',
			houseNumber: '12',
			office: '13',
			city: 'New York',
			description: ''
		}

		let mock = new MockAdapter(axios)

		model.addresses([generator.generateAddress(1), generator.generateAddress(2)])
		assert.equal(typeof model.saveAddress, 'function')

		model.createAddress()
		model.addressForm().city('New York')
		model.addressForm().street('12th Avenue')
		model.addressForm().houseNumber('12')
		model.addressForm().office('13')
		model.addressForm().description('')
		mock.onPost(`${api}/addresses/`, data).reply(200, Object.assign({}, data, {id: 12}))
		model.saveAddress().then(() => {
			assert.equal(model.addressId(), 12)
			assert.equal(model.addresses().length, 3)
		})
	})

	it('should have cancelAddressForm method', () => {
		assert.equal(typeof model.cancelAddressForm, 'function')

		model.createAddress()
		assert.equal(model.addressForm() instanceof AddressForm, true)

		model.cancelAddressForm()
		assert.equal(model.addressForm(), null)
	})

	it('should have fetchAddresses method', () => {
		let mock = new MockAdapter(axios)
		assert.equal(typeof model.fetchAddresses, 'function')

		assert.equal(model.addresses().length, 0)

		mock.onGet(`${api}/addresses`).reply(200, [
			generator.generateAddress(1),
			generator.generateAddress(2)
		])

		return model.fetchAddresses().then(() => {
			assert.equal(model.addresses().length, 2)
			assert.ok(model.addresses()[0] instanceof Address)
		})
	})
})

describe('save method', () => {
	let model
	let dispatcher
	let mock
	beforeEach(() => {
		mock = new MockAdapter(axios)
		dispatcher = new ko.subscribable()
		let templates = [
			generator.generateStandardTemplate(1),
			generator.generateInviteTemplate(2),
			generator.generateOfferTemplate(3),
			generator.generateDeclineTemplate(4),
		].map(template => TemplateFactory.create(dispatcher, template))
		model = new Templates(dispatcher)
		model.templates(templates)
	})

	it('should successfully save data via put method', () => {
		let tpl = model.templates()[1]
		model.selectInviteTab()
		tpl.select()
		model.edit()
		model.selectedTemplateForm().title('ho-ho-ho')
		mock.onPut(`${api}/templates/2`).reply(200)
		model.save().then(() => {
			assert.equal(tpl.title(), 'ho-ho-ho')
		})
	})

	it('should successfully save data via post method', () => {
		model.selectInviteTab()
		model.create()
		model.selectedTemplateForm().title('ho-ho-ho')
		model.selectedTemplateForm().text('text')
		mock.onPost(`${api}/templates/`).reply(200, {id: 555})
		model.save().then(() => {
			assert.equal(model.templates()[4].id(), 555)
		})
	})
})
