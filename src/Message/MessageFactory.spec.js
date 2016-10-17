import * as ko from 'knockout'
import * as types from './types'
import assert from 'assert'
import MessageFactory from './MessageFactory'
import StandardMessage from './StandardMessage'
import InviteMessage from './InviteMessage'
import DeclineMessage from './DeclineMessage'
import OfferMessage from './OfferMessage'

describe('MessageFactory', () => {
	it('should have static create method', () => {
		assert.equal(typeof MessageFactory.create, 'function')
	})

	describe('create', () => {
		let data

		beforeEach(() => {
			data = {id: 1, date: '2015-04-24T23:04:59', conversationId: 1, text: 'Hello World'}
		})

		it(`should create ${types.STANDARD} message`, () => {
			data.type = types.STANDARD
			let expected = new StandardMessage(data)
			let actual = MessageFactory.create(data)
			assert.deepEqual(ko.toJS(actual), ko.toJS(expected))
		})

		it(`should create ${types.INVITE} message`, () => {
			data.type = types.INVITE
			data.time = '23:04'
			data.time = 'Wallstreet st 5'
			let expected = new InviteMessage(data)
			let actual = MessageFactory.create(data)
			assert.deepEqual(ko.toJS(actual), ko.toJS(expected))
		})

		it(`should create ${types.DECLINE} message`, () => {
			data.type = types.DECLINE
			let expected = new DeclineMessage(data)
			let actual = MessageFactory.create(data)
			assert.deepEqual(ko.toJS(actual), ko.toJS(expected))
		})

		it(`should create ${types.OFFER} message`, () => {
			data.type = types.OFFER
			let expected = new OfferMessage(data)
			let actual = MessageFactory.create(data)
			assert.deepEqual(ko.toJS(actual), ko.toJS(expected))
		})

		it('should return null in all other cases', () => {
			let data = {type: 'UNKNOWN', id: 1, date: '2015-04-24T23:04:59', conversationId: 1, text: 'Hello World'}
			assert.equal(MessageFactory.create(data), null)
		})

	})
})