import * as ko from 'knockout'
import assert from 'assert'
import StandardMessage from './StandardMessage'

describe('StandardMessage', () => {
	let model
	beforeEach(() => {
		model = new StandardMessage()
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof StandardMessage, true)
	})

	it('should have avatar prop', () => {
		assert.ok(ko.isObservable(model.avatar))
	})

	it('should set avatar in constructor', () => {
		let avatar = 'http://placehold.it/50x50'
		let model = new StandardMessage({avatar})
		assert.equal(model.avatar(), avatar)
	})

	it('should have multiUser prop', () => {
		assert.ok(ko.isObservable(model.multiUser))
	})

	it('should set multiUser in constructor', () => {
		let multiUser = 1
		let model = new StandardMessage({multiUser})
		assert.equal(model.multiUser(), multiUser)
	})

	it('should have isJobsearcher comp', () => {
		assert.ok(ko.isObservable(model.isJobsearcher))
		model.multiUser(0)
		assert.equal(model.isJobsearcher(), true)
		model.multiUser(1)
		assert.equal(model.isJobsearcher(), false)
	})
})
