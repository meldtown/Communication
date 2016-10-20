import * as ko from 'knockout'
import assert from 'assert'
import BaseService from './BaseService'

const api = 'http://sample.com'

describe('BaseService', () => {
	let dispatcher
	let service

	beforeEach(() => {
		dispatcher = new ko.subscribable()
		service = new BaseService(dispatcher, api)
	})

	it('should be instantiable', () => {
		assert.ok(service instanceof BaseService)
	})

	it('should throw an error if api not given', () => {
		// noinspection JSCheckFunctionSignatures
		assert.throws(() => new BaseService(dispatcher), Error)
	})

	it('should have api prop', () => {
		assert.equal(service.api, api)
	})

	it('should throw an error if dispatcher not given', () => {
		// noinspection JSCheckFunctionSignatures
		assert.throws(() => new BaseService(undefined, api), Error)
	})

	it('should have dispatcher prop', () => {
		assert.equal(ko.isSubscribable(service.dispatcher), true)
	})
})
