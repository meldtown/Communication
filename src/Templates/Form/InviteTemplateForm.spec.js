import * as constants from '../../constants'
import * as ko from 'knockout'
import assert from 'assert'
import InviteTemplateForm from './InviteTemplateForm'
import AbstractTemplateForm from './AbstractTemplateForm'
import AbstractTemplate from '../AbstractTemplate'
import * as generator from '../../../db'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import TemplateFactory from '../TemplateFactory'
import Templates from '../Templates'
import InviteTemplateView from '../View/InviteTemplateView'


describe('InviteTemplateForm', () => {
	let model
	let dispatcher
	beforeEach(() => {
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

	it('should have save method', () => {
		assert.equal(typeof model.save, 'function')
	})

	it('should accept data into constructor', () => {
		let data = generator.generateInviteTemplate(1)
		model = new InviteTemplateForm(dispatcher, data)

		assert.equal(model.id(), data.id)
		assert.equal(model.title(), data.title)
	})

	it('should have template prop', () => {
		assert.equal(ko.isObservable(model.template), true)
		assert.equal((model.template()), 'InviteTemplateForm')
	})

	it('should have fill method', () => {
		assert.equal(typeof model.fill, 'function')
	})

	it('should fill given template', () => {
		model.id(1)
		model.title('title')
		model.text('text')
		model.language(constants.UA)
		model.inviteDate((new Date()).toISOString())
		model.addressId(1)

		let template = new InviteTemplateView(dispatcher)

		model.fill(template)

		// noinspection JSUnusedLocalSymbols
		let {isSelected, ...actual} =ko.toJS(template) // eslint-disable-line no-unused-vars

		assert.deepEqual(actual, ko.toJS(model))
	})

	describe('save method', () => {
		let model
		let dispatcher
		let mock
		beforeEach(() => {
			mock = new MockAdapter(axios)
			dispatcher = new ko.subscribable()
			let templates = [
				generator.generateStandardTemplate(1),
				generator.generateInviteTemplate(2),
				generator.generateOfferTemplate(3),
				generator.generateDeclineTemplate(4),
			].map(template => TemplateFactory.create(dispatcher, template))
			model = new Templates(dispatcher)
			model.templates(templates)
		})

		it('should successfully save data via put method', () => {
			let tpl = model.templates()[1]
			model.selectInviteTab()
			tpl.select()
			model.edit()
			model.selectedTemplateForm().title('ho-ho-ho')
			mock.onPut(`${api}/templates/2`).reply(200)
			model.save().then(() => {
				assert.equal(tpl.title(), 'ho-ho-ho')
			})
		})

		it('should successfully save data via post method', () => {
			model.selectInviteTab()
			model.create()
			model.selectedTemplateForm().title('ho-ho-ho')
			model.selectedTemplateForm().text('text')
			mock.onPost(`${api}/templates/`).reply(200, {id: 555})
			model.save().then(() => {
				assert.equal(model.templates()[4].id(), 555)
			})
		})
	})
})


