import assert from 'assert'
import Templates from './Templates'

describe('Templates', () => {
	let model

	beforeEach(() => {
		model = new Templates()
	})

	it('should be instantiable', () => {
		assert.equal(model instanceof Templates, true)
	})

	it('should have templates observable array', () => {
		// TODO: implement me
	})

	it('should have fetch method which loads items into array', () => {
		// TODO: implement me
	})

	it('should have isStandardTabSelected comp', () => {
		// TODO: implement me
	})

	it('should have isInviteTabSelected comp', () => {
		// TODO: implement me
	})

	it('should have isDeclineTabSelected comp', () => {
		// TODO: implement me
	})

	it('should have isOfferTabSelected comp', () => {
		// TODO: implement me
	})

	it('should have selectStandardTab method', () => {
		// TODO: implement me
	})

	it('should have selectInviteTab method', () => {
		// TODO: implement me
	})

	it('should have selectDeclineTab method', () => {
		// TODO: implement me
	})

	it('should have selectOfferTab method', () => {
		// TODO: implement me
	})

	it('should set selectedTab to standard after fetch', () => {
		// TODO: implement me
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

})
