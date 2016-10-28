import assert from 'assert'
import DeclineTemplateForm from './DeclineTemplateForm'
import AbstractTemplateForm from './AbstractTemplateForm'
import AbstractTemplate from '../AbstractTemplate'
import * as ko from 'knockout'
import * as generator from '../../../db'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const api = 'http://sample.com'

describe('DeclineTemplateForm', () => {
	let mock
	let model
	let dispatcher

	before(() => global.api = api)

	beforeEach(() => {
		mock = new MockAdapter(axios)
		dispatcher = new ko.subscribable()
		model = new DeclineTemplateForm(dispatcher)
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof DeclineTemplateForm, true)
		assert.equal(model instanceof AbstractTemplateForm, true)
		assert.equal(model instanceof AbstractTemplate, true)
	})

	it('should accept data into constructor', () => {
		let data = generator.generateDeclineTemplate(1)
		model = new DeclineTemplateForm(dispatcher, data)

		assert.equal(model.id(), data.id)
		assert.equal(model.title(), data.title)
	})

	it('should have template prop', () => {
		assert.ok(ko.isObservable(model.template))
		assert.equal((model.template()), 'DeclineTemplateForm')
	})

	describe('save method', () => {
		let {id, ...data} = generator.generateDeclineTemplate(1)

		it('should have save method', () => {
			assert.equal(typeof model.save, 'function')
		})

		it('should call put while saving existing template', () => {
			model = new DeclineTemplateForm(dispatcher, {...data, id})
			mock.onPut(`${api}/templates/${id}`, {...data, id}).reply(200)

			return model.save().then(() => assert.ok(true))
		})

		it('should call post while saving new template', () => {
			model = new DeclineTemplateForm(dispatcher, data)
			mock.onPost(`${api}/templates/`, data).reply(200, {id})

			return model.save().then(() => assert.ok(true))
		})
	})
})


