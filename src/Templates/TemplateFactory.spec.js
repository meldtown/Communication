import * as ko from 'knockout'
import * as types from '../constants'
import assert from 'assert'
import TemplateFactory from './TemplateFactory'
import StandardTemplateView from './View/StandardTemplateView'
import InviteTemplateView from './View/InviteTemplateView'
import OfferTemplateView from './View/OfferTemplateView'
import DeclineTemplateView from './View/DeclineTemplateView'
import * as generator from '../../db'


describe('TemplatesFactory', () => {
	it('should have static create method', () => {
		assert.equal(typeof TemplateFactory.create, 'function')
	})
	describe('create', () => {
		let data
		beforeEach(() => {
			data = {
				id: 1,
				title: "Yeah",
				text: "Great !!!",
				language: "ru"
			}
		})

		it(`should create ${types.STANDARD_MESSAGE} template`, () => {
			data.type = types.STANDARD_MESSAGE
			let expected = new StandardTemplateView(data)
			let actual = TemplateFactory.create(data)
			assert.deepEqual(ko.toJS(actual), ko.toJS(expected))
		})

		it(`should create ${types.INVITE_MESSAGE} template`, () => {
			data.type = types.INVITE_MESSAGE
			data.inviteDate = '2015-04-24T23:04:59'
			data.adressId = 2
			let expected = new InviteTemplateView(data)
			let actual = TemplateFactory.create(data)
			assert.deepEqual(ko.toJS(actual), ko.toJS(expected))
		})

		it(`should create ${types.DECLINE_MESSAGE} template`, () => {
			data.type = types.DECLINE_MESSAGE
			let expected = new DeclineTemplateView(data)
			let actual = TemplateFactory.create(data)
			assert.deepEqual(ko.toJS(actual), ko.toJS(expected))
		})

		it(`should create ${types.OFFER_MESSAGE} template`, () => {
			data.type = types.OFFER_MESSAGE
			let expected = new OfferTemplateView(data)
			let actual = TemplateFactory.create(data)
			assert.deepEqual(ko.toJS(actual), ko.toJS(expected))
		})

		it('should return null in all other cases', () => {
			let data = {
				type: 'UNKNOWN',
				id: 1,
				title: "Yeah",
				text: "Great !!!",
				language: "ru"
			}
			assert.equal(TemplateFactory.create(data), null)
		})

		it('should map array', () => {
			let items = [
				generator.generateStandardTemplate(1),
				generator.generateInviteTemplate(2)
			]

			let models = items.map(TemplateFactory.create)

			assert.ok(models[0] instanceof StandardTemplateView)
			assert.ok(models[1] instanceof InviteTemplateView)
		})
	})
})
