import * as generator from '../../db'
import assert from 'assert'
import * as ko from 'knockout'
import InviteMessage from './InviteMessage'
import AbstractMessage from './AbstractMessage'
import Address from '../Address/Address'
import moment from 'moment'

describe('InviteMessage', () => {
	let model
	beforeEach(() => {
		model = new InviteMessage()
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof InviteMessage, true)
	})

	it('should be extend AbstractMessage', () => {
		assert.equal(model instanceof AbstractMessage, true)
	})

	it('should have inviteDate', () => {
		assert.equal(ko.isObservable(model.inviteDate), true)
	})

	it('should have addressId', () => {
		assert.equal(ko.isObservable(model.addressId), true)
	})

	it('should have address prop', () => {
		assert.ok(ko.isObservable(model.address))
	})


	it('should accept data into constructor', () => {
		let data = {
			id: 1,
			date: '2015-04-24T23:04:59',
			conversationId: 1,
			text: 'Hello World',
			inviteDate: '2015-04-12T23:05',
			addressId: 1,
			isRead: false,
			address: generator.generateAddress(1)
		}

		let model = new InviteMessage(data)

		// noinspection JSDuplicatedDeclaration, JSUnusedLocalSymbols
		var {ago, formattedDate, formattedTime, template, formattedInviteDate, formattedInviteTime, address, ...actual} = ko.toJS(model) // eslint-disable-line no-unused-vars, no-redeclare
		// noinspection JSDuplicatedDeclaration, JSUnusedLocalSymbols
		var {address, ...expected} = data // eslint-disable-line no-unused-vars, no-redeclare

		assert.deepEqual(actual, expected) // eslint-disable-line no-unused-vars
		assert.ok(model.address() instanceof Address)
	})

	it('should have template prop been set in constructor', () => {
		assert.equal(model.template(), 'InviteMessage')
	})

	it('should have formatted invite date comp', () => {
		assert.ok(ko.isComputed(model.formattedInviteDate))

		let date = '2015-01-01T23:23:23'

		model.date(date)

		assert.equal(model.formattedInviteDate(), moment(date).format('LL'))
	})

	it('should have formatted invite time comp', () => {
		assert.ok(ko.isComputed(model.formattedInviteTime))

		let date = '2015-01-01T23:23:23'

		model.date(date)

		assert.equal(model.formattedInviteTime(), moment(date).format('HH:mm'))
	})
})
