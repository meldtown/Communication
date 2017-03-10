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

const api = 'http://sample.com'

before(() => {
	global.api = api
})

describe('InviteTemplateForm', () => {
	let model
	let dispatcher
	let mock
	beforeEach(() => {
		dispatcher = new ko.subscribable()
		mock = new MockAdapter(axios)
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
		// mock.onGet(`${api}/addresses`).reply(200, [])
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

	describe('save method', () => {
		let {id, ...data} = generator.generateInviteTemplate(1)

		it('should have save method', () => {
			assert.equal(typeof model.save, 'function')
		})

		it('should call put while saving existing template', () => {
			model = new InviteTemplateForm(dispatcher, {...data, id})
			console.log({...data, id})
			mock.onAny().reply(config => {
				console.log(config.method, config.url, config.data)
				return [500]
			})
			mock.onPut(`${api}/templates/${id}`, {...data, id}).reply(200)

			return model.save().then(() => assert.ok(true))
		})

		it('should call post while saving new template', () => {
			model = new InviteTemplateForm(dispatcher, data)
			mock.onPost(`${api}/templates/`, data).reply(200, {id})

			return model.save().then(() => assert.ok(true))
		})
	})

})


