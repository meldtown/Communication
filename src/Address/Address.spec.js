import * as ko from 'knockout'
import assert from 'assert'
import Address from './Address'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const api = 'http://sample.com'

before(() => {
	global.api = api
})

describe('Address', () => {
	let model
	var mock // eslint-disable-line no-unused-vars
	beforeEach(() => {
		mock = new MockAdapter(axios)
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
		let {optionText, fill, addressForm, ...actual} = ko.toJS(model) // eslint-disable-line no-unused-vars
		assert.deepEqual(actual, data)
	})

	it('should optionText prop', () => {
		assert.ok(ko.isComputed(model.optionText))
		model.street('street')
		model.houseNumber('1')
		model.office(1)
		assert.equal(model.optionText(), 'street 1, 1')
	})

	// it('should have save method', () => {
	// 	assert.equal(typeof model.save, 'function')
	//
	// 	let AddressFormModel = new AddressForm()
	// 	AddressFormModel.city('New York')
	// 	AddressFormModel.houseNumber('12')
	// 	AddressFormModel.street('12th Avenue')
	// 	AddressFormModel.office('13')
	// 	AddressFormModel.description('')
	// 	model.addressForm(AddressFormModel)
	//
	// 	// mock.onAny().reply(config => {
	// 	// 	console.log(`${config.method} ${config.url}`)
	// 	// 	console.log(config.data)
	// 	// 	return [500]
	// 	// })
	//
	// 	let data = {
	// 		street: '12th Avenue',
	// 		houseNumber: '12',
	// 		office: '13',
	// 		city: 'New York',
	// 		description: ''
	// 	}
	//
	// 	mock.onPost(`${api}/addresses/`, data).reply(200, Object.assign({}, data, {id: 12}))
	// 	model.save().then(() => {
	// 		assert.equal(model.id(), 12)
	// 		assert.equal(model.addressForm().city(), '')
	// 		assert.equal(model.addressForm().street(), '')
	// 		assert.equal(model.addressForm().office(), '')
	// 		assert.equal(model.addressForm().houseNumber(), '')
	// 		assert.equal(model.addressForm().description(), '')
	// 	})
	// })

})
