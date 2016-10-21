import assert from 'assert'
import * as ko from 'knockout'
import ApplyMessage from './ApplyMessage'
import AbstractMessage from './AbstractMessage'


describe('ApplyMessage', () => {
	let model
	beforeEach(() => {
		model = new ApplyMessage()
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof ApplyMessage, true)
	})

	it('should be extend AbstractMessage', () => {
		assert.equal(model instanceof AbstractMessage, true)
	})


	it('should accept data into constructor', () => {
		let data = {
			id: 1,
			date: '2015-04-24T23:04:59',
			conversationId: 1,
			text: 'Hello World',
			vacancyId: 1,
			resumeId: 1,
			isRead: false
		}
		let model = new ApplyMessage(data)
		// noinspection JSUnusedLocalSymbols
		var {ago, formattedDate, formattedTime, template, ...actual} = ko.toJS(model) // eslint-disable-line no-unused-vars
		assert.deepEqual(actual, data)
	})

	it('should have template prop been set in constructor', () => {
		assert.equal(model.template(), 'ApplyMessage')
	})

	it('should have vacancyId prop', () => {
		assert.ok(ko.isObservable(model.vacancyId))
	})

	it('should have resumeId prop', () => {
		assert.ok(ko.isObservable(model.resumeId))
	})
})
