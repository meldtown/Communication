import assert from 'assert'
import Templates from './Templates'
import * as ko from 'knockout'
import * as types from '../constants'
import * as generator from '../../db'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import StandardTemplateView from './View/StandardTemplateView'
import InviteTemplateView from './View/InviteTemplateView'
import DeclineTemplateView from './View/DeclineTemplateView'
import OfferTemplateView from './View/OfferTemplateView'
import TemplateFactory from './TemplateFactory'
import AbstractTemplate from './AbstractTemplate'
import StandardTemplateForm from './Form/StandardTemplateForm'
import InviteTemplateForm from './Form/InviteTemplateForm'
import OfferTemplateForm from './Form/OfferTemplateForm'
import DeclineTemplateForm from './Form/DeclineTemplateForm'

const api = 'http://sample.com'

describe('Templates', () => {
	let mock
	let model
	let dispatcher

	before(() => {
		global.api = api
	})

	beforeEach(() => {
		mock = new MockAdapter(axios)
		dispatcher = new ko.subscribable()
		model = new Templates(dispatcher)
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof Templates, true)
	})

	it('should throw an error if dispatcher not given', () => {
		// noinspection JSCheckFunctionSignatures
		assert.throws(() => new Templates(), Error)
	})

	it('should have dispatcher prop and accept it as first constructor argument of Templates', () => {
		assert.equal(ko.isSubscribable(model.dispatcher), true)
	})

	it('should have templates observable array', () => {
		assert.equal(ko.isObservable(model.templates), true)
		assert.equal(typeof model.templates.push, 'function')
	})

	it('should have fetch method which loads items into array', () => {
		let responseText = [
			generator.generateStandardTemplate(1),
			generator.generateInviteTemplate(4),
			generator.generateDeclineTemplate(5),
			generator.generateOfferTemplate(6)
		]

		mock.onGet(`${api}/templates`).reply(200, responseText)

		return model.fetch().then(() => {
			assert.equal(model.templates().length, 4)
			assert.ok(model.templates()[0] instanceof StandardTemplateView)
			assert.ok(model.templates()[1] instanceof InviteTemplateView)
			assert.ok(model.templates()[2] instanceof DeclineTemplateView)
			assert.ok(model.templates()[3] instanceof OfferTemplateView)
		})
	})

	describe('tabs', () => {
		it('should have observable selectedTab', () => {
			assert.ok(ko.isObservable(model.selectedTab))
		})

		it('should have default selectedTab', () => {
			assert.equal(model.selectedTab(), StandardTemplateView)
		})

		it('should have isStandardTabSelected comp', () => {
			assert.ok(ko.isComputed(model.isStandardTabSelected))

			model.templates([
				TemplateFactory.create(dispatcher, generator.generateStandardTemplate(1)),
				TemplateFactory.create(dispatcher, generator.generateOfferTemplate(2))
			])

			model.selectStandardTab()
			assert.equal(model.isStandardTabSelected(), true)

			model.selectOfferTab()
			assert.equal(model.isStandardTabSelected(), false)
		})

		it('should have isInviteTabSelected comp', () => {
			assert.ok(ko.isComputed(model.isInviteTabSelected))

			model.templates([
				TemplateFactory.create(dispatcher, generator.generateInviteTemplate(1)),
				TemplateFactory.create(dispatcher, generator.generateOfferTemplate(2))
			])

			model.selectInviteTab()
			assert.equal(model.isInviteTabSelected(), true)

			model.selectOfferTab()
			assert.equal(model.isInviteTabSelected(), false)
		})

		it('should have isDeclineTabSelected comp', () => {
			assert.ok(ko.isComputed(model.isDeclineTabSelected))

			model.templates([
				TemplateFactory.create(dispatcher, generator.generateDeclineTemplate(1)),
				TemplateFactory.create(dispatcher, generator.generateOfferTemplate(2))
			])

			model.selectDeclineTab()
			assert.equal(model.isDeclineTabSelected(), true)

			model.selectOfferTab()
			assert.equal(model.isDeclineTabSelected(), false)
		})

		it('should have isOfferTabSelected comp', () => {
			assert.ok(ko.isComputed(model.isOfferTabSelected))

			model.templates([
				TemplateFactory.create(dispatcher, generator.generateOfferTemplate(1))
			])

			model.selectOfferTab()
			assert.equal(model.isOfferTabSelected(), true)

			model.selectStandardTab()
			assert.equal(model.isOfferTabSelected(), false)
		})

		it('should have selectStandardTab method', () => {
			assert.equal(typeof model.selectStandardTab, 'function')

			model.selectStandardTab()
			assert.ok(model.isStandardTabSelected())
		})

		it('should have selectInviteTab method', () => {
			assert.equal(typeof model.selectInviteTab, 'function')
			model.templates([TemplateFactory.create(dispatcher, generator.generateInviteTemplate(1))])

			model.selectInviteTab()

			assert.equal(model.selectedTab(), InviteTemplateView)
			assert.equal(model.filteredTemplates()[0].isSelected(), true)
		})

		it('should have selectDeclineTab method', () => {
			assert.equal(typeof model.selectDeclineTab, 'function')
			model.templates([TemplateFactory.create(dispatcher, generator.generateDeclineTemplate(1))])

			model.selectDeclineTab()

			assert.equal(model.selectedTab(), DeclineTemplateView)
			assert.equal(model.filteredTemplates()[0].isSelected(), true)
		})

		it('should have selectOfferTab method', () => {
			assert.equal(typeof model.selectOfferTab, 'function')
			model.templates([TemplateFactory.create(dispatcher, generator.generateOfferTemplate(1))])

			model.selectOfferTab()

			assert.equal(model.selectedTab(), OfferTemplateView)
			assert.equal(model.filteredTemplates()[0].isSelected(), true)
		})

		it('should set selectedTab to standard after fetch', () => {
			let responseText = [
				generator.generateStandardTemplate(1),
				generator.generateInviteTemplate(4),
				generator.generateDeclineTemplate(5),
				generator.generateOfferTemplate(6)
			]

			mock.onGet(`${api}/templates`).reply(200, responseText)

			return model.fetch().then(() => {
				assert.equal(model.selectedTab(), StandardTemplateView)
			})
		})

		it('should set selectedTab to first available after fetch if there is not standard one', () => {
			let responseText = [
				generator.generateInviteTemplate(4),
				generator.generateDeclineTemplate(5),
				generator.generateOfferTemplate(6)
			]

			mock.onGet(`${api}/templates`).reply(200, responseText)

			return model.fetch().then(() => {
				assert.equal(model.selectedTab(), InviteTemplateView)
			})
		})

		it('should reset template mode to view after switching tabs', () => {
			// TODO: missing test?
		})
	})

	describe('languages', () => {
		it('should have isRussianLanguageSelected observable', () => {
			assert.ok(ko.isObservable(model.isRussianLanguageSelected))
		})

		it('should have isUkrainianLanguageSelected observable', () => {
			assert.ok(ko.isObservable(model.isUkrainianLanguageSelected))
		})

		it('should have isEnglishLanguageSelected observable', () => {
			assert.ok(ko.isObservable(model.isEnglishLanguageSelected))
		})

		it('should have unselected languages after loading', () => {
			assert.equal(model.isRussianLanguageSelected(), false)
			assert.equal(model.isUkrainianLanguageSelected(), false)
			assert.equal(model.isEnglishLanguageSelected(), false)
		})

		it('should have toggleRussianLanguage method', () => {
			assert.equal(typeof model.toggleRussianLanguage, 'function')

			model.toggleRussianLanguage()
			assert.equal(model.isRussianLanguageSelected(), true)

			model.toggleRussianLanguage()
			assert.equal(model.isRussianLanguageSelected(), false)
		})

		it('should have toggleUkrainianLanguage method', () => {
			assert.equal(typeof model.toggleUkrainianLanguage, 'function')

			model.toggleUkrainianLanguage()
			assert.equal(model.isUkrainianLanguageSelected(), true)

			model.toggleUkrainianLanguage()
			assert.equal(model.isUkrainianLanguageSelected(), false)
		})

		it('should have toggleEnglishLanguage method', () => {
			assert.equal(typeof model.toggleEnglishLanguage, 'function')

			model.toggleEnglishLanguage()
			assert.equal(model.isEnglishLanguageSelected(), true)

			model.toggleEnglishLanguage()
			assert.equal(model.isEnglishLanguageSelected(), false)
		})
	})

	it('should select the first standard template after fetch', () => {
		let responseText = [
			generator.generateStandardTemplate(1),
			generator.generateInviteTemplate(4),
			generator.generateDeclineTemplate(5),
			generator.generateOfferTemplate(6)
		]

		mock.onGet(`${api}/templates`).reply(200, responseText)

		return model.fetch().then(() => {
			assert.equal(model.filteredTemplates()[0].isSelected(), true)
		})
	})

	it('should select the first available template if there is no standard one after fetch', () => {
		let responseText = [
			generator.generateInviteTemplate(4),
			generator.generateDeclineTemplate(5),
			generator.generateOfferTemplate(6)
		]

		mock.onGet(`${api}/templates`).reply(200, responseText)

		return model.fetch().then(() => {
			assert.equal(model.filteredTemplates()[0].isSelected(), true)
		})
	})

	describe('filteredTemplates', () => {
		it('should have filteredTemplates com', () => {
			assert.ok(ko.isComputed(model.filteredTemplates))
		})

		it('should have filter prop', () => {
			assert.ok(ko.isObservable(model.filter))
		})

		it('should gracefully handle undefined selected tab', () => {
			model.selectedTab(undefined)
			model.templates([
				TemplateFactory.create(dispatcher, generator.generateStandardTemplate(1))
			])
			assert.equal(model.filteredTemplates().length, 1)
		})

		it('should respect selected tab', () => {
			model.templates([
				TemplateFactory.create(dispatcher, generator.generateStandardTemplate(1)),
				TemplateFactory.create(dispatcher, generator.generateOfferTemplate(2))
			])

			assert.ok(model.isStandardTabSelected())
			assert.equal(model.filteredTemplates().length, 1)
			assert.ok(model.filteredTemplates()[0] instanceof model.selectedTab())
			model.selectOfferTab()
			assert.equal(model.filteredTemplates().length, 1)
			assert.ok(model.filteredTemplates()[0] instanceof model.selectedTab())
		})

		it('should respect selected language', () => {
			let template = generator.generateStandardTemplate(1)

			model.templates([
				TemplateFactory.create(dispatcher, {...template, id: 1, language: types.RU}),
				TemplateFactory.create(dispatcher, {...template, id: 2, language: types.UA}),
				TemplateFactory.create(dispatcher, {...template, id: 3, language: types.EN})
			])

			model.toggleRussianLanguage()
			assert.equal(model.filteredTemplates().length, 1)
			assert.equal(model.filteredTemplates()[0].language(), types.RU)
			model.toggleEnglishLanguage()
			assert.equal(model.filteredTemplates().length, 2)
			assert.equal(model.filteredTemplates()[0].language(), types.RU)
			assert.equal(model.filteredTemplates()[1].language(), types.EN)
			model.toggleUkrainianLanguage()
			assert.equal(model.filteredTemplates().length, 3)
			assert.equal(model.filteredTemplates()[0].language(), types.RU)
			assert.equal(model.filteredTemplates()[1].language(), types.UA)
			assert.equal(model.filteredTemplates()[2].language(), types.EN)
			model.toggleRussianLanguage()
			model.toggleUkrainianLanguage()
			model.toggleEnglishLanguage()
			assert.equal(model.filteredTemplates().length, 3)
			assert.equal(model.filteredTemplates()[0].language(), types.RU)
			assert.equal(model.filteredTemplates()[1].language(), types.UA)
			assert.equal(model.filteredTemplates()[2].language(), types.EN)
		})

		it('should call all filters', () => {
			let tplStandardRubyRu = TemplateFactory.create(dispatcher, generator.generateStandardTemplate(1))
			tplStandardRubyRu.language(types.RU)
			tplStandardRubyRu.title('Ruby')

			let tplDeclineRandomEn = TemplateFactory.create(dispatcher, generator.generateDeclineTemplate(2))
			tplDeclineRandomEn.language(types.EN)

			model.templates([tplStandardRubyRu, tplDeclineRandomEn])

			model.toggleEnglishLanguage()
			model.selectDeclineTab()
			assert.equal(model.filteredTemplates().length, 1)
			model.filter('Python')
			assert.equal(model.filteredTemplates().length, 0)
			model.filter('')
			assert.equal(model.filteredTemplates().length, 1)
		})

		it('should filter by text in title', () => {
			let template = generator.generateStandardTemplate(1)

			model.templates([
				TemplateFactory.create(dispatcher, {...template, title: 'Javascript'}),
				TemplateFactory.create(dispatcher, {...template, title: 'Ruby'}),
				TemplateFactory.create(dispatcher, {...template, title: 'Java'})
			])

			assert.equal(model.templates().length, 3)
			assert.equal(model.filteredTemplates().length, 3)

			model.filter('Java')
			assert.equal(model.filteredTemplates().length, 2)
		})

		it('should filter by text in text', () => {
			let template = generator.generateStandardTemplate(1)

			model.templates([
				TemplateFactory.create(dispatcher, {...template, title: 'Javascript', text: 'Hello World'}),
				TemplateFactory.create(dispatcher, {...template, title: 'Ruby', text: 'Hello Javatron'}),
				TemplateFactory.create(dispatcher, {...template, title: 'Java', text: 'Hello universe'})
			])

			assert.equal(model.templates().length, 3)
			assert.equal(model.filteredTemplates().length, 3)

			model.filter('Java')
			assert.equal(model.filteredTemplates().length, 3)
		})
	})

	describe('selectedTemplate', () => {
		let templates

		beforeEach(() => {
			templates = [
				generator.generateInviteTemplate(4),
				generator.generateOfferTemplate(12),
				generator.generateOfferTemplate(33),
				generator.generateDeclineTemplate(666),
				generator.generateStandardTemplate(1),
				generator.generateDeclineTemplate(5),
				generator.generateDeclineTemplate(555),
				generator.generateStandardTemplate(9),
				generator.generateDeclineTemplate(17),
				generator.generateDeclineTemplate(444),
				generator.generateOfferTemplate(6),
				generator.generateOfferTemplate(56),
				generator.generateOfferTemplate(57),
				generator.generateOfferTemplate(78),
				generator.generateStandardTemplate(123)
			]
			templates = templates.map(template => TemplateFactory.create(dispatcher, template))
			model.templates(templates)
		})

		it('should have selectedStandardTemplate', () => {
			assert.ok(ko.isObservable(model.selectedStandardTemplate))

			let template1 = TemplateFactory.create(dispatcher, generator.generateStandardTemplate(1))
			let template2 = TemplateFactory.create(dispatcher, generator.generateStandardTemplate(2))

			model.templates([template1, template2])

			template1.select()
			assert.equal(model.selectedStandardTemplate(), template1)
			template2.select()
			assert.equal(model.selectedStandardTemplate(), template2)
		})

		it('should have selectedInviteTemplate', () => {
			assert.ok(ko.isObservable(model.selectedInviteTemplate))

			let invTpl1 = model.templates()[0]
			let stdTpl1 = model.templates()[4]
			stdTpl1.select()
			invTpl1.select()
			assert.equal(model.selectedInviteTemplate(), invTpl1)
			assert.equal(model.selectedStandardTemplate(), stdTpl1)
		})

		it('should have selectedDeclineTemplate', () => {
			assert.ok(ko.isObservable(model.selectedDeclineTemplate))

			let dclTpl = model.templates()[3]

			dclTpl.select()
			assert.equal(model.selectedDeclineTemplate(), dclTpl)
		})

		it('should have selectedOfferTemplate', () => {
			assert.ok(ko.isObservable(model.selectedOfferTemplate))

			let offTpl = model.templates()[11]
			offTpl.select()
			assert.equal(model.selectedOfferTemplate(), offTpl)
		})

		it('should have isSelected prop', () => {
			let template = TemplateFactory.create(dispatcher, generator.generateStandardTemplate(1))

			template.isSelected(true)

			assert.equal(ko.isObservable(template.isSelected), true)
			assert.equal(template.isSelected(), true)
		})

		it('should have dispatcher prop and accept it as first constructor argument', () => {
			let model = new AbstractTemplate(dispatcher, {id: 2, title: 'title', text: 'text', language: 'language'})
			assert.equal(ko.isSubscribable(model.dispatcher), true)
		})

		it('should throw an error if dispatcher not given', () => {
			assert.throws(() => new AbstractTemplate(), Error)
		})

		it('should have selectedTemplate com', () => {
			assert.ok(ko.isComputed(model.selectedTemplate))

			let stdTpl1 = model.templates()[4]
			let stdTpl2 = model.templates()[7]
			let invTpl = model.templates()[0]
			let dclTpl = model.templates()[3]
			stdTpl1.select()
			assert.equal(model.selectedTemplate(), stdTpl1)
			stdTpl2.select()
			assert.equal(model.selectedTemplate(), stdTpl2)
			invTpl.select()
			assert.equal(model.selectedTemplate(), stdTpl2)
			model.selectInviteTab()
			assert.equal(model.selectedTemplate(), invTpl)
			dclTpl.select()
			model.selectDeclineTab()
			assert.equal(model.selectedTemplate(), dclTpl)
		})

		it('should return standardTemplate if selectedTab is not defined', () => {
			let standard = TemplateFactory.create(dispatcher, generator.generateStandardTemplate(2))
			model.selectedStandardTemplate(standard)
			model.selectedTab(false)
			assert.ok(model.selectedTemplate() instanceof StandardTemplateView)
		})
	})

	it('should have standard form prop', () => {
		// TODO: x4 for each type
		// model.standardForm = new StandardForm()
	})

	describe('editTemplate', () => {
		let model
		let dispatcher
		beforeEach(() => {
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

		it('should have isSelectedTemplateBeingEdited', () => {
			assert.equal(ko.isObservable(model.isSelectedTemplateBeingEdited), true)
		})

		it('should isSelectedTemplateBeingEdited return false by default', () => {
			assert.equal(model.isSelectedTemplateBeingEdited(), false)
		})

		it('should have selectedTemplateForm observable', () => {
			assert.equal(ko.isObservable(model.selectedTemplateForm), true)
		})

		it('should have edit method', () => {
			assert.equal(typeof model.edit, 'function')

			let tplStd = model.templates()[0]
			tplStd.select()
			model.edit()
			assert.equal(model.isSelectedTemplateBeingEdited(), true)
		})
		//
		// it('should isSelectedTemplateBeingEdited and selectedTemplateForm have the same type', () => {
		// 	assert.equal(model.selectedTemplateForm())
		// })

		it('should edit method set data from selectedTemplateView to selectedTemplateForm', () => {
			let tplStd = model.templates()[0]
			tplStd.select()
			model.selectStandardTab()
			model.edit()
			// noinspection JSDuplicatedDeclaration, JSUnusedLocalSymbols
			var {template, ...actual} = ko.toJS(model.selectedTemplateForm()) // eslint-disable-line no-unused-vars, no-redeclare
			// noinspection JSDuplicatedDeclaration, JSUnusedLocalSymbols
			var {isSelected, template, ...expected} = ko.toJS(tplStd) // eslint-disable-line no-unused-vars, no-redeclare

			assert.deepEqual(actual, expected)
		})

		it('should have cancel method', () => {
			assert.equal(typeof model.cancel, 'function')
		})

		it('should reset data in selectedTemplateForm after cancel', () => {
			let tplStd = model.templates()[0]
			tplStd.select()
			model.selectStandardTab()
			model.edit()
			assert.equal(model.isSelectedTemplateBeingEdited(), true)

			model.cancel()
			assert.equal(model.isSelectedTemplateBeingEdited(), false)
			assert.equal(model.selectedTemplateForm(), null)
		})
	})

	describe('update template', () => {
		let model
		let dispatcher
		beforeEach(() => {
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

		it('should have save method', () => {

			assert.equal(typeof model.save, 'function')

		})

		it('should have fill method', () => {
			let stdTplForm = new StandardTemplateForm(dispatcher)
			let invTplForm = new InviteTemplateForm(dispatcher)
			let offerTplForm = new OfferTemplateForm(dispatcher)
			let declForm = new DeclineTemplateForm(dispatcher)
			let tplInv = model.templates()[1]
			assert.equal(typeof stdTplForm.fill, 'function')
			assert.equal(typeof invTplForm.fill, 'function')
			assert.equal(typeof offerTplForm.fill, 'function')
			assert.equal(typeof declForm.fill, 'function')

			model.selectInviteTab()
			tplInv.select()
			invTplForm.text('Hello')
			invTplForm.title('World')
			invTplForm.addressId(666)
			let selectedTemplate = model.selectedTemplate()
			invTplForm.fill(selectedTemplate)
			assert.equal(selectedTemplate.text(), 'Hello')
			assert.equal(selectedTemplate.title(), 'World')
			assert.equal(selectedTemplate.addressId(), 666)
		})

		it('should set data to corresponding templateView on success put request after save', () => {
			let responseText = [
				generator.generateStandardTemplate(1),
				generator.generateInviteTemplate(2),
				generator.generateOfferTemplate(3),
				generator.generateDeclineTemplate(4),
			]
			let tplStd = model.templates()[0]
			tplStd.select()
			model.edit()
			let tplForm = model.selectedTemplateForm()
			tplForm.text('Hello')
			tplForm.title('World')
			mock.onPut(`${api}/templates/1`).reply(200, responseText)
			model.save().then(() => {
				assert.equal(tplStd.text(), 'Hello')
				assert.equal(tplStd.title(), 'World')
				assert.equal(model.selectedTemplateForm(), null)
			})
		})
	})

	describe('delete template', () => {
		let model
		let dispatcher
		beforeEach(() => {
			dispatcher = new ko.subscribable()
			let templates = [
				generator.generateStandardTemplate(1),
				generator.generateInviteTemplate(2),
				generator.generateOfferTemplate(3),
				generator.generateDeclineTemplate(4),
				generator.generateStandardTemplate(6),
				generator.generateStandardTemplate(7),
				generator.generateStandardTemplate(8)
			].map(template => TemplateFactory.create(dispatcher, template))
			model = new Templates(dispatcher)
			model.templates(templates)
		})
		it('should have delete method', () => {
			assert.equal(typeof model.delete, 'function')

			let tplStd = model.templates()[0]
			tplStd.select()
			assert.equal(model.templates().length, 7)
			// mock.onAny().reply(config => {
			// 	console.log(config.method + ' ' + config.url)
			// 	return [200]
			// })
			mock.onDelete(`${api}/templates/1`).reply(200)
			model.delete().then(() => {
				assert.equal(model.templates().length, 3)
				assert.equal(model.selectedTemplate(), null)
			})
		})

		it('should select the first filtered template after delete', () => {
			model.templates()[4].select()
			mock.onDelete(`${api}/templates/${model.templates()[4].id()}`).reply(200)
			model.delete().then(() => {
				assert.equal(model.templates()[0].isSelected(), true)
			})
		})
	})

	describe('create template', () => {
		let model
		let dispatcher
		beforeEach(() => {
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
		it('should have create method', () => {
			assert.equal(typeof model.create, 'function')
			let stdTpl = new StandardTemplateForm(dispatcher, {
				id: 0, text: '', title: '', language: 'ru'
			})
			model.selectStandardTab()
			stdTpl.id(67)
			stdTpl.text('Hello')
			stdTpl.title('World')
			stdTpl.language('en')
			// noinspection JSUnusedLocalSymbols
			let {id, text, title, language} = ko.toJS(stdTpl) // eslint-disable-line no-unused-vars
			model.create()
			assert.equal(model.isNewTemplateBeingCreated(), true)

			mock.onPost(`${api}/templates/`).reply(200)
			model.save().then(() => {
				assert.equal(model.templates().length, 5)
				assert.equal(model.templates()[4].text(), 'Hello')
				assert.equal(model.filteredTemplates()[model.filteredTemplates().length - 1].isSelected(), true)
			})
		})

		it('should reset filters', () => {
			model.filter('Lisp')
			model.toggleRussianLanguage()
			model.toggleUkrainianLanguage()
			model.create()

			assert.equal(model.filter(), '')
			assert.equal(model.isRussianLanguageSelected(), false)
			assert.equal(model.isUkrainianLanguageSelected(), false)
		})

		it('should recompute filteredTemplates after pushing new one', () => {
			assert.equal(model.filteredTemplates().length, 1)

			model.templates.push(TemplateFactory.create(dispatcher, generator.generateStandardTemplate(1)))
			assert.equal(model.filteredTemplates().length, 2)
		})

		it('should recompute filteredTemplates after saving new one', () => {
			assert.equal(model.filteredTemplates().length, 1)

			model.create()
			assert.ok(model.selectedTemplateForm())
			mock.onPost(`${api}/templates/`).reply(200, {id: 1})

			return model.save().then(() => {
				assert.equal(model.filteredTemplates().length, 2)
			})
		})

		it('should push new instance while create method being called', () => {
			model.create()
			assert.ok(model.selectedTemplateForm())
			mock.onPost(`${api}/templates/`).reply(200, {id: 33})

			return model.save().then(() => {
				assert.equal(model.templates().length, 5)
			})
		})

		it('should push new instance after creating one more template', () => {
			model.templates([TemplateFactory.create(dispatcher, generator.generateStandardTemplate(1))])
			model.templates()[0].select()
			model.create()
			assert.ok(model.selectedTemplateForm())
			mock.onPost(`${api}/templates/`).reply(200, {id: 1})

			return model.save().then(() => {
				assert.equal(model.templates().length, 2)
			})
		})
	})

	describe('tabs', () => {
		it('should have tabs prop', () => {
			assert.equal(Array.isArray(model.tabs), true)
		})
	})

	describe('languages', () => {
		it('should have languages prop', () => {
			assert.equal(Array.isArray(model.languages), true)
		})
	})
})
