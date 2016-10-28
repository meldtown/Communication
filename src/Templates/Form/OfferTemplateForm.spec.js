import assert from 'assert'
import OfferTemplateForm from './OfferTemplateForm'
import AbstractTemplateForm from './AbstractTemplateForm'
import AbstractTemplate from '../AbstractTemplate'
import * as ko from 'knockout'
import * as generator from '../../../db'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const api = 'http://sample.com'

describe('OfferTemplateForm', () => {
	let mock
	let model
	let dispatcher

	before(() => global.api = api)

	beforeEach(() => {
		mock = new MockAdapter(axios)
		dispatcher = new ko.subscribable()
		model = new OfferTemplateForm(dispatcher)
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof OfferTemplateForm, true)
		assert.equal(model instanceof AbstractTemplateForm, true)
		assert.equal(model instanceof AbstractTemplate, true)
	})



	it('should accept data into constructor', () => {
		let data = generator.generateOfferTemplate(1)
		model = new OfferTemplateForm(dispatcher, data)
		let actual = ko.toJS(model)
		let overrides = {dispatcher: 1, template: 1, type: 1}
		assert.deepEqual({...actual, ...overrides}, {...data, ...overrides})
	})

	it('should have template prop', () => {
		assert.equal(ko.isObservable(model.template), true)
		assert.equal((model.template()), 'OfferTemplateForm')
	})

	describe('save method', () => {
		let {id, ...data} = generator.generateOfferTemplate(1)

		it('should have save method', () => {
			assert.equal(typeof model.save, 'function')
		})

		it('should call put while saving existing template', () => {
			model = new OfferTemplateForm(dispatcher, {...data, id})
			mock.onPut(`${api}/templates/${id}`, {...data, id}).reply(200)

			return model.save().then(() => assert.ok(true))
		})

		it('should call post while saving new template', () => {
			model = new OfferTemplateForm(dispatcher, data)
			mock.onPost(`${api}/templates/`, data).reply(200, {id})

			return model.save().then(() => assert.ok(true))
		})
	})
})
