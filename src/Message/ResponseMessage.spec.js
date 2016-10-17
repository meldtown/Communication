import assert from 'assert'
import * as ko from 'knockout'
import ResponseMessage from './ResponseMessage'
import AbstractMessage from './AbstractMessage'


describe('ResponseMessage', () => {
	let model
	beforeEach(() => {
		model = new ResponseMessage()
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof ResponseMessage, true)
	})

	it('should be extend AbstractMessage', () => {
		assert.equal(model instanceof AbstractMessage, true)
	})

	it('should have avatar', () => {
		assert.equal(ko.isObservable(model.avatar), true)
	})


	it('should accept data into constructor', () => {
		let data = {
			id: 1,
			date: '2015-04-24T23:04:59',
			conversationId: 1,
			text: 'Hello World',
			avatar: 'http://placehold.it/90x90'
		}
		let model = new ResponseMessage(data)
		assert.deepEqual(ko.toJS(model), data)
	})
})
