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

	it('should have time', () => {
		assert.equal(ko.isObservable(model.time), true)
	})

	it('should have address', () => {
		assert.equal(ko.isObservable(model.address), true)
	})

	it('should accept data into constructor', () => {
		let data = {
			id: 1,
			date: '2015-04-24T23:04:59',
			conversationId: 1,
			text: 'Hello World',
			time: '23:05',
			address: 'Wallstreet str 5'
		}
		let model = new InviteMessage(data)
		assert.deepEqual(ko.toJS(model), data)
	})
})
