import assert from 'assert'
import OfferTemplateForm from './OfferTemplateForm'
import AbstractTemplateForm from './AbstractTemplateForm'
import AbstractTemplate from '../AbstractTemplate'
import * as ko from 'knockout'
import * as generator from '../../../db'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import TemplateFactory from '../TemplateFactory'
import Templates from '../Templates'

describe('OfferTemplateForm', () => {
	let model
	let dispatcher
	beforeEach(() => {
		dispatcher = new ko.subscribable()
		model = new OfferTemplateForm(dispatcher)
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof OfferTemplateForm, true)
		assert.equal(model instanceof AbstractTemplateForm, true)
		assert.equal(model instanceof AbstractTemplate, true)
	})

	it('should have save method', () => {
		assert.equal(typeof model.save, 'function')
	})

	it('should accept data into constructor', () => {
		let data = generator.generateOfferTemplate(1)
		model = new OfferTemplateForm(dispatcher, data)

		assert.equal(model.id(), data.id)
		assert.equal(model.title(), data.title)
	})

	it('should have template prop', () => {
		assert.equal(ko.isObservable(model.template), true)
		assert.equal((model.template()), 'OfferTemplateForm')
	})
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
		let tpl = model.templates()[2]
		model.selectOfferTab()
		tpl.select()
		model.edit()
		model.selectedTemplateForm().title('ho-ho-ho')
		mock.onPut(`${api}/templates/3`).reply(200)
		model.save().then(() => {
			assert.equal(tpl.title(), 'ho-ho-ho')
		})
	})

	it('should successfully save data via post method', () => {
		model.selectOfferTab()
		model.create()
		model.selectedTemplateForm().title('ho-ho-ho')
		model.selectedTemplateForm().text('text')
		mock.onPost(`${api}/templates/`).reply(200, {id: 666})
		model.save().then(() => {
			assert.equal(model.templates()[4].id(), 666)
		})
	})
})

