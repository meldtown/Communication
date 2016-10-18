import assert from 'assert'
import Templates from './Templates'
import * as ko from 'knockout'
import * as types from '../constants'
import * as generator from '../../db'
import $ from 'jquery'
import jQueryMockAjax from 'jquery-mockjax'

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
		assert.equal(model.selectedTab(), types.STANDARD_MESSAGE)
	})

	it('should have selectInviteTab method', () => {
		assert.equal(typeof model.selectInviteTab, 'function')

		model.selectInviteTab()
		assert.equal(model.selectedTab(), types.INVITE_MESSAGE)
	})

	it('should have selectDeclineTab method', () => {
		assert.equal(typeof model.selectDeclineTab, 'function')

		model.selectDeclineTab()
		assert.equal(model.selectedTab(), types.DECLINE_MESSAGE)
	})

	it('should have selectOfferTab method', () => {
		assert.equal(typeof model.selectOfferTab, 'function')

		model.selectOfferTab()
		assert.equal(model.selectedTab(), types.OFFER_MESSAGE)
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
			assert.equal(model.selectedTab(), types.STANDARD_MESSAGE)
		})
	})

	it('should have isRussianLanguageSelected comp', () => {

	})

	it('should have isUkrainianLanguageSelected comp', () => {

	})

	it('should have isEnglishLanguageSelected comp', () => {

	})

	it('should have selectRussianLanguage method', () => {

	})

	it('should have selectUkrainianLanguage method', () => {

	})

	it('should have selectEnglishLanguage method', () => {

	})

	it('should have filter prop', () => {

	})

	it('should have filteredTemplates com', () => {

	})

	describe('filteredTemplates', () => {
		it('should respect selected tab', () => {

		})

		it('should respect selected language', () => {

		})

		it('should filter by text in title', () => {

		})

		it('should filter by text in text', () => {

		})
	})

	it('should have selectedTemplate comp', () => {
		// TODO: x4 for each type
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
