import assert from 'assert'
import AddressForm from './AddressForm'
import * as ko from 'knockout'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'


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

	it('should have building prop', () => {
		assert.equal(ko.isObservable(model.building), true)
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
			building: '12',
			office: '13',
			city: 'Denver',
			description: ''
		}
		model.city(data.city)
		model.street(data.street)
		model.office(data.office)
		model.building(data.building)
		model.description(data.description)


		mock.onPost(`${api}/addresses/`, data).reply(200, Object.assign({}, data, {id: 12}))
		return model.save().then(() => {
			assert.equal(model.id, 12)
		}).catch(() => {
			throw new Error('Fill the required fields')
		})
	})
})
