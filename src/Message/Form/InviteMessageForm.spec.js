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

const api = 'http://sample.com'

describe('InviteMessageForm', () => {
	const conversationId = 1
	const text = 'Hello World'
	const inviteDate = (new Date()).toISOString()
	const addressId = 1

	let model
	let dispatcher
	let mock

	before(() => {
		global.api = api
	})

	beforeEach(() => {
		mock = new MockAdapter(axios)
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

	it('should have save method', () => {
		assert.equal(typeof model.save, 'function')
	})

	it('should not try save message without conversationId', () => {
		assert.throws(() => model.save(), Error)
	})

	const arrangeForSaveTest = () => {
		model.conversationId(conversationId)
		model.text(text)
		model.inviteDate(inviteDate)
		model.addressId(addressId)

		mock.onPost(`${api}/messages`).reply(200, {
			conversationId,
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
			assert.equal(message.conversationId(), conversationId)
			assert.equal(message.id(), 1)
		})
	})

	it('should reset form on successful save', () => {
		arrangeForSaveTest()

		return model.save().then(() => {
			assert.equal(model.text(), '')
			assert.equal(model.addressId(), 0)
			assert.equal(model.inviteDate(), '')
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

			mock.onGet(`${api}/addresses`).reply(200, [
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
			model.conversationId(1)
			assert.ok(!model.canBeSaved())
			model.addressId(1)
			assert.ok(!model.canBeSaved())
			model.text('Hello')
			assert.ok(model.canBeSaved())
		})
	})
})
