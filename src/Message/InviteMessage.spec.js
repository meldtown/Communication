import assert from 'assert'
import * as ko from 'knockout'
import InviteMessage from './InviteMessage'
import AbstractMessage from './AbstractMessage'


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

	it('should accept data into constructor', () => {
		let data = {
			id: 1,
			date: '2015-04-24T23:04:59',
			conversationId: 1,
			text: 'Hello World',
			inviteDate: '2015-04-12T23:05',
			addressId: 1,
			isRead: false
		}
		let model = new InviteMessage(data)
		// noinspection JSUnusedLocalSymbols
		var {ago, formattedDate, formattedTime, template, ...actual} = ko.toJS(model)
		assert.deepEqual(actual, data)
	})

	it('should have template prop been set in constructor', () => {
		assert.equal(model.template(), 'InviteMessage')
	})
})
