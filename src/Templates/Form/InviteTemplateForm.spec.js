import * as ko from 'knockout'
import assert from 'assert'
import InviteTemplateForm from './InviteTemplateForm'
import AbstractTemplateForm from './AbstractTemplateForm'
import AbstractTemplate from '../AbstractTemplate'
import * as generator from '../../../db'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import InviteTemplateView from '../View/InviteTemplateView'

const api = 'http://sample.com'

describe('InviteTemplateForm', () => {
	let mock
	let model
	let dispatcher

	before(() => global.api = api)

	beforeEach(() => {
		mock = new MockAdapter(axios)
		dispatcher = new ko.subscribable()
		model = new InviteTemplateForm(dispatcher)
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof InviteTemplateForm, true)
		assert.equal(model instanceof AbstractTemplateForm, true)
		assert.equal(model instanceof AbstractTemplate, true)
	})

	it('should have inviteDate', () => {
		assert.equal(ko.isObservable(model.inviteDate), true)
	})

	it('should have addressId', () => {
		assert.equal(ko.isObservable(model.addressId), true)
	})

	it('should accept data into constructor', () => {
		let data = generator.generateInviteTemplate(1)
		model = new InviteTemplateForm(dispatcher, data)
		let actual = ko.toJS(model)
		let overrides = {dispatcher: 1, template: 1, type: 1}
		assert.deepEqual({...actual, ...overrides}, {...data, ...overrides})
	})

	it('should have template prop', () => {
		assert.ok(ko.isObservable(model.template))
		assert.equal((model.template()), 'InviteTemplateForm')
	})

	it('should have fill method', () => {
		assert.equal(typeof model.fill, 'function')
	})

	it('should fill given template', () => {
		model = new InviteTemplateForm(dispatcher, generator.generateInviteTemplate(1))
		let template = new InviteTemplateView(dispatcher)

		model.fill(template)

		// noinspection JSUnusedLocalSymbols
		let {isSelected, ...actual} =ko.toJS(template) // eslint-disable-line no-unused-vars

		assert.deepEqual(actual, ko.toJS(model))
	})

	describe('save method', () => {
		let {id, ...data} = generator.generateInviteTemplate(1)

		it('should have save method', () => {
			assert.equal(typeof model.save, 'function')
		})

		it('should call put while saving existing template', () => {
			model = new InviteTemplateForm(dispatcher, {...data, id})
			mock.onPut(`${api}/templates/${id}`, {...data, id}).reply(200)

			return model.save().then(() => assert.ok(true))
		})

		it('should call post while saving new template', () => {
			model = new InviteTemplateForm(dispatcher, data)
			mock.onPost(`${api}/templates/`, data).reply(200, {id})

			return model.save().then(() => assert.ok(true))
		})
	})
})


