import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import * as ko from 'knockout'
import assert from 'assert'
import InviteMessageForm from './InviteMessageForm'
import InviteMessage from '../InviteMessage'
import AbstractMessageForm from './AbstractMessageForm'
import * as constants from '../../constants'
import * as generator from '../../../db'
import Address from '../../Address/Address'
import AddressForm from '../../Address/AddressForm'

const api = 'http://sample.com'

describe('InviteMessageForm', () => {
	const chatId = 1
	const text = 'Hello World'
	const inviteDate = (new Date()).toISOString()
	const addressId = 1

	let model
	let dispatcher
	let mock

	before(() => {
		// noinspection JSPrimitiveTypeWrapperUsage
		global.api = global.api2 = api
	})

	beforeEach(() => {
		mock = new MockAdapter(axios)
		// noinspection JSPotentiallyInvalidConstructorUsage
		dispatcher = new ko.subscribable()
		model = new InviteMessageForm(dispatcher)
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof InviteMessageForm, true)
		assert.equal(model instanceof AbstractMessageForm, true)
	})

	describe('inviteDate', () => {
		let date = '2015-04-24'
		let time = '14:00'
		let dateTime = `${date}T${time}`

		it('should have inviteDate', () => {
			assert.ok(ko.isComputed(model.inviteDate))
			assert.ok(ko.isWriteableObservable(model.inviteDate))
			assert.ok(ko.isObservable(model.inviteDateDate))
			assert.ok(ko.isObservable(model.inviteDateTime))
		})

		it('should return combined date', () => {
			model.inviteDateDate(date)
			model.inviteDateTime(time)
			assert.equal(model.inviteDate().indexOf(dateTime), 0)
		})

		it('should set internals on write', () => {
			model.inviteDate(dateTime)
			assert.equal(model.inviteDateDate(), date)
			assert.equal(model.inviteDateTime(), time)
		})

		it('should not return value if date is missing', () => {
			model.inviteDateTime(time)

			model.inviteDateDate(null)
			assert.equal(model.inviteDate(), null)

			model.inviteDateDate(undefined)
			assert.equal(model.inviteDate(), null)

			model.inviteDateDate(false)
			assert.equal(model.inviteDate(), null)

			model.inviteDateDate('')
			assert.equal(model.inviteDate(), null)

			model.inviteDateDate('Hello')
			assert.equal(model.inviteDate(), null)
		})

		it('should not return value if time is missing', () => {
			model.inviteDateDate(date)

			model.inviteDateTime(null)
			assert.equal(model.inviteDate(), null)

			model.inviteDateTime(undefined)
			assert.equal(model.inviteDate(), null)

			model.inviteDateTime(false)
			assert.equal(model.inviteDate(), null)

			model.inviteDateTime('')
			assert.equal(model.inviteDate(), null)

			model.inviteDateTime('Hello')
			assert.equal(model.inviteDate(), null)
		})
	})

	it('should have addressId', () => {
		assert.equal(ko.isObservable(model.addressId), true)
	})

	it('should have save method', () => {
		assert.equal(typeof model.save, 'function')
	})

	it('should not try save message without chatId', () => {
		assert.throws(() => model.save(), Error)
	})

	const arrangeForSaveTest = () => {
		model.chatId(chatId)
		model.text(text)
		model.inviteDate(inviteDate)
		model.addressId(addressId)

		mock.onPost(`${api}/messages`).reply(200, {
			chatId,
			text,
			inviteDate,
			addressId,
			id: 1,
			type: constants.INVITE_MESSAGE,
			date: (new Date()).toISOString()
		})
	}

	it(`should call api on save`, () => {
		arrangeForSaveTest()

		return model.save().then(message => {
			assert.equal(message instanceof InviteMessage, true)
			assert.equal(message.text(), text)
			assert.equal(message.inviteDate(), inviteDate)
			assert.equal(message.addressId(), addressId)
			assert.equal(message.chatId(), chatId)
			assert.equal(message.id(), 1)
		})
	})

	it('should reset form on successful save', () => {
		arrangeForSaveTest()

		return model.save().then(() => {
			assert.equal(model.text(), '')
			assert.equal(model.addressId(), 0)
			assert.equal(model.inviteDate(), null)
		})
	})

	it(`should fire ${constants.NEW_MESSAGE} on successful save`, () => {
		let counter = 0

		dispatcher.subscribe(() => {
			counter = counter + 1
		}, null, constants.NEW_MESSAGE)

		arrangeForSaveTest()

		return model.save().then(() => {
			assert.equal(counter, 1)
		})
	})

	it('should have template been set in constructor', () => {
		assert.equal(model.template(), 'InviteMessageForm')
	})

	describe('addresses', () => {
		it('should have addresses observable array', () => {
			assert.ok(ko.isObservable(model.addresses))
			assert.equal(typeof model.addresses.push, 'function')
			assert.equal(model.addresses().length, 0)
		})

		it('should have hasAddresses comp', () => {
			assert.ok(ko.isComputed(model.hasAddresses))
			assert.equal(model.hasAddresses(), false)
			model.addresses([generator.generateVacancy()])
			assert.equal(model.hasAddresses(), true)
		})

		it('should have fetchAddresses method', () => {
			assert.equal(typeof model.fetchAddresses, 'function')

			assert.equal(model.addresses().length, 0)

			mock.onGet(`${api2}/employer/address`).reply(200, [
				generator.generateAddress(1),
				generator.generateAddress(2)
			])

			return model.fetchAddresses().then(() => {
				assert.equal(model.addresses().length, 2)
				assert.ok(model.addresses()[0] instanceof Address)
			})
		})

		it('should have canBeSaved computed', () => {
			assert.ok(ko.isComputed(model.canBeSaved))
			assert.ok(!model.canBeSaved())
			model.chatId(1)
			assert.ok(!model.canBeSaved())
			model.addressId(1)
			assert.ok(!model.canBeSaved())
			model.text('Hello')
			assert.ok(model.canBeSaved())
		})

		it('should have createAddress method', () => {
			assert.equal(typeof model.createAddress, 'function')
		})

		it('should have saveAddress method', () => {
			let data = {
				street: '12th Avenue',
				building: '12',
				office: '13',
				city: 'New York',
				description: ''
			}

			model.addresses([generator.generateAddress(1), generator.generateAddress(2)])
			assert.equal(typeof model.saveAddress, 'function')

			model.createAddress()
			model.addressForm().city('New York')
			model.addressForm().street('12th Avenue')
			model.addressForm().building('12')
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
	})

	describe('addressForm', () => {
		it('should have addressForm prop', () => {
			assert.equal(ko.isObservable(model.addressForm), true)
			assert.equal(model.addressForm(), null)
		})
	})
})
