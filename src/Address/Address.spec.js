import * as ko from 'knockout'
import assert from 'assert'
import Address from './Address'

describe('Address', () => {
	let model

	beforeEach(() => {
		model = new Address()
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof Address, true)
	})

	it('should have props', () => {
		assert.ok(ko.isObservable(model.id))
		assert.ok(ko.isObservable(model.city))
		assert.ok(ko.isObservable(model.street))
		assert.ok(ko.isObservable(model.houseNumber))
		assert.ok(ko.isObservable(model.office))
		assert.ok(ko.isObservable(model.description))
		assert.ok(ko.isObservable(model.mapFile))

		let data = {
			id: 1,
			city: 'city',
			street: 'street',
			houseNumber: 'houseNumber',
			office: 'office',
			description: 'description',
			mapFile: 'Map933461_1.png'
		}

		model = new Address(data)

		// noinspection JSUnusedLocalSymbols
		let {optionText, ...actual} = ko.toJS(model) // eslint-disable-line no-unused-vars
		assert.deepEqual(actual, data)
	})

	it('should optionText prop', () => {
		assert.ok(ko.isComputed(model.optionText))
		model.street('street')
		model.houseNumber('1')
		model.office(1)
		assert.equal(model.optionText(), 'street 1, 1')
	})
})
