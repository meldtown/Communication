import assert from 'assert'
import AddressForm from './AddressForm'
import * as ko from 'knockout'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const api = 'http://sample.com'

before(() => {
	global.api = api
})

describe('AddressForm', () => {
	let model
	let mock
	beforeEach(() => {
		mock = new MockAdapter(axios)
		model = new AddressForm()
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof AddressForm, true)
	})

	it('should have city prop', () => {
		assert.equal(ko.isObservable(model.city), true)
	})

	it('should have street prop', () => {
		assert.equal(ko.isObservable(model.street), true)
	})

	it('should have houseNumber prop', () => {
		assert.equal(ko.isObservable(model.houseNumber), true)
	})

	it('should have office prop', () => {
		assert.equal(ko.isObservable(model.office), true)
	})

	it('should have description prop', () => {
		assert.equal(ko.isObservable(model.description), true)
	})

	it('should have mapFile prop', () => {
		assert.equal(ko.isObservable(model.mapFile), true)
	})

	it('should have save method', () => {
		assert.equal(typeof model.save, 'function')
	})

	it('should save entered data after saving', () => {
		let data = {
			street: '15th avenue',
			houseNumber: '12',
			office: '13',
			city: 'Denver',
			description: ''
		}
		model.city(data.city)
		model.street(data.street)
		model.office(data.office)
		model.houseNumber(data.houseNumber)
		model.description(data.description)


		mock.onPost(`${api}/addresses/`, data).reply(200, Object.assign({}, data, {id: 12}))
		return model.save().then(() => {
			assert.equal(model.id, 12)
		})
	})
})
