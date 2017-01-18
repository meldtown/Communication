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
import StandardTemplateForm from './Form/StandardTemplateForm'
import InviteTemplateForm from './Form/InviteTemplateForm'
import OfferTemplateForm from './Form/OfferTemplateForm'
import DeclineTemplateForm from './Form/DeclineTemplateForm'
import Address from '../Address/Address'

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

	// it('should have fetchAddresses method', () => {
	// 	assert.equal(typeof model.fetchAddresses, 'function')
    //
	// 	assert.equal(model.addresses().length, 0)
    //
	// 	mock.onGet(`${api}/addresses`).reply(200, [
	// 		generator.generateAddress(1),
	// 		generator.generateAddress(2)
	// 	])
    //
	// 	return model.fetchAddresses().then(() => {
	// 		assert.equal(model.addresses().length, 2)
	// 		assert.ok(model.addresses()[0] instanceof Address)
	// 	})
	// })

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
			tplStandardRubyRu.name('Ruby')

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

		it('should filter by text in name', () => {
			let template = generator.generateStandardTemplate(1)

			model.templates([
				TemplateFactory.create(dispatcher, {...template, name: 'Javascript'}),
				TemplateFactory.create(dispatcher, {...template, name: 'Ruby'}),
				TemplateFactory.create(dispatcher, {...template, name: 'Java'})
			])

			assert.equal(model.templates().length, 3)
			assert.equal(model.filteredTemplates().length, 3)

			model.filter('Java')
			assert.equal(model.filteredTemplates().length, 2)
		})

		it('should filter by text in text', () => {
			let template = generator.generateStandardTemplate(1)

			model.templates([
				TemplateFactory.create(dispatcher, {...template, name: 'Javascript', text: 'Hello World'}),
				TemplateFactory.create(dispatcher, {...template, name: 'Ruby', text: 'Hello Javatron'}),
				TemplateFactory.create(dispatcher, {...template, name: 'Java', text: 'Hello universe'})
			])

			assert.equal(model.templates().length, 3)
			assert.equal(model.filteredTemplates().length, 3)

			model.filter('Java')
			assert.equal(model.filteredTemplates().length, 3)
		})

		it('should recompute filteredTemplates after pushing new one', () => {
			assert.equal(model.filteredTemplates().length, 0)

			model.templates.push(TemplateFactory.create(dispatcher, generator.generateStandardTemplate(1)))
			assert.equal(model.filteredTemplates().length, 1)
		})
	})

	describe('selectedTemplate', () => {
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

			let inviteTemplate = TemplateFactory.create(dispatcher, generator.generateInviteTemplate(1))
			let standardTemplate = TemplateFactory.create(dispatcher, generator.generateStandardTemplate(2))
			model.templates([inviteTemplate, standardTemplate])

			standardTemplate.select()
			inviteTemplate.select()
			assert.equal(model.selectedInviteTemplate(), inviteTemplate)
			assert.equal(model.selectedStandardTemplate(), standardTemplate)
		})

		it('should have selectedDeclineTemplate', () => {
			assert.ok(ko.isObservable(model.selectedDeclineTemplate))

			let template = TemplateFactory.create(dispatcher, generator.generateDeclineTemplate(1))
			model.templates([template])

			template.select()
			assert.equal(model.selectedDeclineTemplate(), template)
		})

		it('should have selectedOfferTemplate', () => {
			assert.ok(ko.isObservable(model.selectedOfferTemplate))

			let template = TemplateFactory.create(dispatcher, generator.generateOfferTemplate(1))
			model.templates([template])

			template.select()
			assert.equal(model.selectedOfferTemplate(), template)
		})

		it('should have selectedTemplate computed', () => {
			assert.ok(ko.isComputed(model.selectedTemplate))

			let standardTemplate1 = TemplateFactory.create(dispatcher, generator.generateStandardTemplate(1))
			let standardTemplate2 = TemplateFactory.create(dispatcher, generator.generateStandardTemplate(2))
			let inviteTemplate1 = TemplateFactory.create(dispatcher, generator.generateInviteTemplate(3))
			let declineTemplate1 = TemplateFactory.create(dispatcher, generator.generateDeclineTemplate(4))
			model.templates([standardTemplate1, standardTemplate2, inviteTemplate1, declineTemplate1])

			standardTemplate1.select()
			assert.equal(model.selectedTemplate(), standardTemplate1)
			standardTemplate2.select()
			assert.equal(model.selectedTemplate(), standardTemplate2)
			assert.equal(model.selectedTemplate(), standardTemplate2)

			inviteTemplate1.select()
			model.selectInviteTab()
			assert.equal(model.selectedTemplate(), inviteTemplate1)

			declineTemplate1.select()
			model.selectDeclineTab()
			assert.equal(model.selectedTemplate(), declineTemplate1)
		})

		it('should return standardTemplate if selectedTab is not defined', () => {
			let standard = TemplateFactory.create(dispatcher, generator.generateStandardTemplate(2))
			model.selectedStandardTemplate(standard)
			model.selectedTab(false)
			assert.ok(model.selectedTemplate() instanceof StandardTemplateView)
		})
	})

	describe('editTemplate', () => {
		it('should have isSelectedTemplateBeingEdited', () => {
			assert.ok(ko.isObservable(model.isSelectedTemplateBeingEdited))
		})

		it('should isSelectedTemplateBeingEdited return false by default', () => {
			assert.equal(model.isSelectedTemplateBeingEdited(), false)
		})

		it('should have selectedTemplateForm observable', () => {
			assert.ok(ko.isObservable(model.selectedTemplateForm))
		})

		it('should have edit method', () => {
			assert.equal(typeof model.edit, 'function')

			let template = TemplateFactory.create(dispatcher, generator.generateStandardTemplate(1))
			model.templates([template])

			template.select()
			model.edit()
			assert.equal(model.isSelectedTemplateBeingEdited(), true)
		})

		it('should do nothing while trying edit not selected template', () => {
			assert.equal(typeof model.edit, 'function')

			let template = TemplateFactory.create(dispatcher, generator.generateStandardTemplate(1))
			model.templates([template])

			model.edit()
			assert.equal(model.isSelectedTemplateBeingEdited(), false)
		})

		it('should set data from selectedTemplateView to selectedTemplateForm on edit', () => {
			let template = TemplateFactory.create(dispatcher, generator.generateStandardTemplate(1))
			model.templates([template])

			template.select()
			model.selectStandardTab()
			model.edit()

			// noinspection JSUnusedLocalSymbols
			var {isSelected, ...expected} = ko.toJS(template) // eslint-disable-line no-unused-vars
			var actual = ko.toJS(model.selectedTemplateForm())
			assert.deepEqual({...actual, template: 1}, {...expected, template: 1})
		})

		it('should have cancel method', () => {
			assert.equal(typeof model.cancel, 'function')
		})

		it('should reset selectedTemplateForm after cancel', () => {
			let template = TemplateFactory.create(dispatcher, generator.generateStandardTemplate(1))
			model.templates([template])

			template.select()
			model.selectStandardTab()
			model.edit()
			assert.equal(model.isSelectedTemplateBeingEdited(), true)

			model.cancel()
			assert.equal(model.isSelectedTemplateBeingEdited(), false)
			assert.equal(model.selectedTemplateForm(), null)
		})

		it('should create right form types', () => {
			let standardTemplate = TemplateFactory.create(dispatcher, generator.generateStandardTemplate(1))
			let inviteTemplate = TemplateFactory.create(dispatcher, generator.generateInviteTemplate(2))
			let declineTemplate = TemplateFactory.create(dispatcher, generator.generateDeclineTemplate(3))
			let offerTemplate = TemplateFactory.create(dispatcher, generator.generateOfferTemplate(4))

			model.templates([
				standardTemplate,
				inviteTemplate,
				declineTemplate,
				offerTemplate
			])

			model.selectStandardTab()
			standardTemplate.select()
			model.edit()
			assert.ok(model.selectedTemplateForm() instanceof StandardTemplateForm)

			mock.onGet(`${api}/addresses`).reply(200, [])
			model.selectInviteTab()
			inviteTemplate.select()
			model.edit()
			assert.ok(model.selectedTemplateForm() instanceof InviteTemplateForm)

			model.selectDeclineTab()
			declineTemplate.select()
			model.edit()
			assert.ok(model.selectedTemplateForm() instanceof DeclineTemplateForm)

			model.selectOfferTab()
			offerTemplate.select()
			model.edit()
			assert.ok(model.selectedTemplateForm() instanceof OfferTemplateForm)
		})
	})

	describe('save template', () => {
		it('should have save method', () => {
			assert.equal(typeof model.save, 'function')
		})

		it('should set data to corresponding templateView on success put request after save', () => {
			let data = generator.generateStandardTemplate(1)
			let template = TemplateFactory.create(dispatcher, data)

			model.templates([template])

			template.select()
			model.edit()

			let form = model.selectedTemplateForm()
			form.text('Hello')
			form.name('World')

			mock.onPut(`${api}/templates/${template.id()}`).reply(200, data)

			return model.save().then(() => {
				assert.equal(template.text(), 'Hello')
				assert.equal(template.name(), 'World')
				assert.equal(model.selectedTemplateForm(), null)
			})
		})

		it('should reset new and editing flags after save', () => {
			let data = generator.generateStandardTemplate(1)
			let template = TemplateFactory.create(dispatcher, data)

			model.templates([template])

			template.select()
			model.edit()

			mock.onPut(`${api}/templates/${template.id()}`).reply(200, data)

			return model.save().then(() => {
				assert.equal(model.isNewTemplateBeingCreated(), false)
				assert.equal(model.isSelectedTemplateBeingEdited(), false)
			})
		})
	})

	describe('remove template', () => {
		it('should have remove method', () => {
			assert.equal(typeof model.remove, 'function')
		})

		it('should call backend and remove item on success', () => {
			let template = TemplateFactory.create(dispatcher, generator.generateStandardTemplate(1))

			model.templates([template])
			template.select()
			assert.equal(model.templates().length, 1)

			mock.onDelete(`${api}/templates/${template.id()}`).reply(200)

			return model.remove().then(() => {
				assert.equal(model.templates().length, 0)
			})
		})

		it('should select the first filtered template after delete', () => {
			let template1 = TemplateFactory.create(dispatcher, generator.generateStandardTemplate(1))
			let template2 = TemplateFactory.create(dispatcher, generator.generateStandardTemplate(2))

			model.templates([template1, template2])
			template1.select()
			mock.onDelete(`${api}/templates/${template1.id()}`).reply(200)

			model.remove().then(() => {
				assert.equal(template2.isSelected(), true)
			})
		})
	})

	describe('create template', () => {
		it('should have create method', () => {
			assert.equal(typeof model.create, 'function')
		})

		it('should set isNewTemplateBeingCreated and isSelectedTemplateBeingEdited to true', () => {
			model.create()
			assert.ok(model.isNewTemplateBeingCreated())
			assert.ok(model.isSelectedTemplateBeingEdited())
		})

		it('should reset filters', () => {
			model.filter('Lisp')
			model.toggleRussianLanguage()
			model.toggleUkrainianLanguage()
			model.toggleEnglishLanguage()

			model.create()

			assert.equal(model.filter(), '')
			assert.equal(model.isRussianLanguageSelected(), false)
			assert.equal(model.isUkrainianLanguageSelected(), false)
			assert.equal(model.isEnglishLanguageSelected(), false)
		})

		it('should create right form types', () => {
			model.selectStandardTab()
			model.create()
			assert.ok(model.selectedTemplateForm() instanceof StandardTemplateForm)

			model.selectInviteTab()
			mock.onGet(`${api}/addresses`).reply(200, [])
			model.create()
			assert.ok(model.selectedTemplateForm() instanceof InviteTemplateForm)

			model.selectDeclineTab()
			model.create()
			assert.ok(model.selectedTemplateForm() instanceof DeclineTemplateForm)

			model.selectOfferTab()
			model.create()
			assert.ok(model.selectedTemplateForm() instanceof OfferTemplateForm)
		})

		it('should recompute filteredTemplates after saving new one', () => {
			let id = 1
			assert.equal(model.filteredTemplates().length, 0)

			model.create()
			assert.ok(model.selectedTemplateForm())
			mock.onPost(`${api}/templates/`).reply(200, {id})

			return model.save().then(() => {
				assert.equal(model.templates().length, 1)
				assert.equal(model.filteredTemplates().length, 1)
				assert.equal(model.templates()[0].id(), id)
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
