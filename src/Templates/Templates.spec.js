import assert from 'assert'
import Templates from './Templates'
import * as ko from 'knockout'
import * as types from '../constants'
import * as generator from '../../db'
import $ from 'jquery'
import jQueryMockAjax from 'jquery-mockjax'
import StandardTemplateView from './View/StandardTemplateView'
import InviteTemplateView from './View/InviteTemplateView'
import DeclineMessage from './View/DeclineTemplateView'
import DeclineTemplateView from './View/OfferTemplateView'
import TemplateFactory from './TemplateFactory'

const api = 'http://sample.com'
const mockjax = jQueryMockAjax($, window)
$.mockjaxSettings.logging = 0


describe('Templates', () => {
	let model

	before(() => {
		global.api = api
	})

	beforeEach(() => {
		model = new Templates()
	})

	afterEach(() => mockjax.clear())

	it('should be instantiable', () => {
		assert.equal(model instanceof Templates, true)
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

		mockjax({
			url: `${api}/templates`,
			responseText
		})

		return model.fetch().then(() => {
			assert.equal(model.templates().length, 4)
			assert.deepEqual(Object.assign({}, ko.toJS(model.templates()[0]), {type: types.STANDARD_MESSAGE}), responseText[0])
			assert.deepEqual(Object.assign({}, ko.toJS(model.templates()[1]), {type: types.INVITE_MESSAGE}), responseText[1])
			assert.deepEqual(Object.assign({}, ko.toJS(model.templates()[2]), {type: types.DECLINE_MESSAGE}), responseText[2])
			assert.deepEqual(Object.assign({}, ko.toJS(model.templates()[3]), {type: types.OFFER_MESSAGE}), responseText[3])
		})
	})

	it('should have observable selectedTab', () => {
		assert.equal(ko.isObservable(model.selectedTab), true)
	})

	it('should have isStandardTabSelected comp', () => {
		assert.equal(ko.isComputed(model.isStandardTabSelected), true)

		model.selectStandardTab()
		assert.equal(model.isStandardTabSelected(), true)

		model.selectOfferTab()
		assert.equal(model.isStandardTabSelected(), false)
	})

	it('should have isInviteTabSelected comp', () => {
		assert.equal(ko.isComputed(model.isInviteTabSelected), true)

		model.selectInviteTab()
		assert.equal(model.isInviteTabSelected(), true)

		model.selectOfferTab()
		assert.equal(model.isInviteTabSelected(), false)
	})

	it('should have isDeclineTabSelected comp', () => {
		assert.equal(ko.isComputed(model.isDeclineTabSelected), true)

		model.selectDeclineTab()
		assert.equal(model.isDeclineTabSelected(), true)

		model.selectOfferTab()
		assert.equal(model.isDeclineTabSelected(), false)
	})

	it('should have isOfferTabSelected comp', () => {
		assert.equal(ko.isComputed(model.isOfferTabSelected), true)

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

		model.selectInviteTab()
		assert.equal(model.selectedTab(), InviteTemplateView)
	})

	it('should have selectDeclineTab method', () => {
		assert.equal(typeof model.selectDeclineTab, 'function')

		model.selectDeclineTab()
		assert.equal(model.selectedTab(), DeclineMessage)
	})

	it('should have selectOfferTab method', () => {
		assert.equal(typeof model.selectOfferTab, 'function')

		model.selectOfferTab()
		assert.equal(model.selectedTab(), DeclineTemplateView)
	})

	it('should set selectedTab to standard after fetch', () => {
		let responseText = [
			generator.generateStandardTemplate(1),
			generator.generateInviteTemplate(4),
			generator.generateDeclineTemplate(5),
			generator.generateOfferTemplate(6)
		]

		mockjax({
			url: `${api}/templates`,
			responseText
		})

		return model.fetch().then(() => {
			assert.equal(model.selectedTab(), StandardTemplateView)
		})
	})

	it('should have default selectedTab', () => {
		assert.equal(model.selectedTab(), StandardTemplateView)
	})


	it('should have isRussianLanguageSelected observable', () => {
		assert.equal(ko.isObservable(model.isRussianLanguageSelected), true)
	})

	it('should have isUkrainianLanguageSelected observable', () => {
		assert.equal(ko.isObservable(model.isUkrainianLanguageSelected), true)
	})

	it('should have isEnglishLanguageSelected observable', () => {
		assert.equal(ko.isObservable(model.isEnglishLanguageSelected), true)
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

	it('should have filter prop', () => {
		assert.equal(ko.isObservable(model.filter), true)
	})

	it('should have filteredTemplates com', () => {
		assert.equal(ko.isComputed(model.filteredTemplates), true)
	})

	describe('filteredTemplates', () => {

		let templates = [
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
		templates = templates.map(template => TemplateFactory.create(template))
		beforeEach(() => {
			model.templates(templates)
		})

		it('should have filteredTemplates com', () => {
			assert.ok(ko.isComputed(model.filteredTemplates))
		})

		it('should gracefuly handle undefined selected tab', () => {
			model.selectedTab(undefined)
			model.templates([TemplateFactory.create(generator.generateStandardTemplate(1))])
			assert.equal(model.filteredTemplates().length, 1)
		})

		it('should respect selected tab', () => {
			assert.equal(model.filteredTemplates().length, 3)
			assert.ok(model.filteredTemplates()[0] instanceof model.selectedTab())
			assert.ok(model.filteredTemplates()[1] instanceof model.selectedTab())
			assert.ok(model.filteredTemplates()[2] instanceof model.selectedTab())
			model.selectOfferTab()
			assert.ok(model.filteredTemplates()[0] instanceof model.selectedTab())
			assert.ok(model.filteredTemplates()[1] instanceof model.selectedTab())
			assert.ok(model.filteredTemplates()[2] instanceof model.selectedTab())
			assert.ok(model.filteredTemplates()[3] instanceof model.selectedTab())
			assert.ok(model.filteredTemplates()[4] instanceof model.selectedTab())
			assert.ok(model.filteredTemplates()[5] instanceof model.selectedTab())
		})


		it('should respect selected language', () => {
			templates = [,
				TemplateFactory.create({id: 1, type: "standard", title: "Yeah", text: "Success", language: "ru"}),
				TemplateFactory.create({id: 2, type: "standard", title: "Java", text: "Great !!!", language: "ua"}),
				TemplateFactory.create({id: 3, type: "standard", title: "Hello", text: "Great !!!", language: "en"}),
			]
			model.templates(templates)
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
			let tpl1 = TemplateFactory.create(generator.generateStandardTemplate(1))
			tpl1.language(types.RU)
			tpl1.title('Ruby')

			let tpl2 = TemplateFactory.create(generator.generateDeclineTemplate(2))
			tpl2.language(types.EN)

			model.templates([tpl1, tpl2])

			model.toggleEnglishLanguage()
			model.selectDeclineTab()
			assert.equal(model.filteredTemplates().length, 1)
			model.filter('Python')
			assert.equal(model.filteredTemplates().length, 0)
			model.filter('')
			assert.equal(model.filteredTemplates().length, 1)
		})

		it('should filter by text in title', () => {
			let tpl1 = TemplateFactory.create(generator.generateStandardTemplate(1))
			let tpl2 = TemplateFactory.create(generator.generateStandardTemplate(2))
			let tpl3 = TemplateFactory.create(generator.generateStandardTemplate(3))
			model.templates([tpl1, tpl2, tpl3])
			assert.equal(model.templates().length, 3)

			tpl1.title('Javascript')
			tpl2.title('Ruby')
			tpl3.title('Java')

			assert.equal(model.filteredTemplates().length, 3)

			model.filter('Java')
			assert.equal(model.filteredTemplates().length, 2)
		})

		it('should filter by text in text', () => {
			let tpl1 = TemplateFactory.create(generator.generateStandardTemplate(1))
			let tpl2 = TemplateFactory.create(generator.generateStandardTemplate(2))
			let tpl3 = TemplateFactory.create(generator.generateStandardTemplate(3))
			model.templates([tpl1, tpl2, tpl3])
			assert.equal(model.templates().length, 3)

			tpl1.title('Javascript')
			tpl2.title('Ruby')
			tpl3.title('Java')

			tpl1.text('Hello world')
			tpl2.text('Hello Javatron')
			tpl3.text('Hello universe')

			assert.equal(model.filteredTemplates().length, 3)

			model.filter('Java')
			assert.equal(model.filteredTemplates().length, 3)
		})
	})

	it('should have selectedStandardTemplate comp', () => {
		// assert.equal(ko)
	})

	describe('selectedTemplate', () => {
		it('should change when some template fires select event', () => {

		})
	})

	it('should have standard form prop', () => {
		// TODO: x4 for each type
		// model.standardForm = new StandardForm()
	})


})
