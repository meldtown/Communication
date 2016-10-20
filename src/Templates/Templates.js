import * as ko from 'knockout'
import * as $ from 'jquery'
import './Templates.scss'
import * as types from '../constants'
import TemplateFactory from './TemplateFactory'
import StandardTemplateView from '../Templates/View/StandardTemplateView'
import InviteTemplateView from '../Templates/View/InviteTemplateView'
import DeclineTemplateView from '../Templates/View/DeclineTemplateView'
import OfferTemplateView from '../Templates/View/OfferTemplateView'

export default class Templates {
	constructor(dispatcher) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}

		this.dispatcher = dispatcher
		this.templates = ko.observableArray()
		this.selectedTab = ko.observable(StandardTemplateView)
		this.isStandardTabSelected = ko.computed(() => this.selectedTab() === StandardTemplateView)
		this.isInviteTabSelected = ko.computed(() => this.selectedTab() === InviteTemplateView)
		this.isDeclineTabSelected = ko.computed(() => this.selectedTab() === DeclineTemplateView)
		this.isOfferTabSelected = ko.computed(() => this.selectedTab() === OfferTemplateView)

		this.isRussianLanguageSelected = ko.observable(false)
		this.isUkrainianLanguageSelected = ko.observable(false)
		this.isEnglishLanguageSelected = ko.observable(false)

		this.filter = ko.observable()
		this.filteredTemplates = ko.computed(() => {
			if (!this.selectedTab()) this.selectStandardTab()
			return this.templates().filter(template => {
				return template instanceof this.selectedTab()
			})
				.filter(template => {
					if (!this.isRussianLanguageSelected() && !this.isUkrainianLanguageSelected() && !this.isEnglishLanguageSelected()) return true
					return ((template.language() === types.RU) && this.isRussianLanguageSelected()) ||
						((template.language() === types.UA) && this.isUkrainianLanguageSelected()) ||
						((template.language() === types.EN) && this.isEnglishLanguageSelected())
				})
				.filter(template => {
					if (!this.filter()) return true
					let str = this.filter()
					return template.title().indexOf(str) !== -1 || template.text().indexOf(str) !== -1
				})
		})

		this.selectedStandardTemplate = ko.observable()
	}

	fetch() {
		return $.getJSON(`${api}/templates`)
			.then(templates => {
				this.selectedTab(StandardTemplateView)
				return this.templates(templates.map(TemplateFactory.create.bind(this, this.dispatcher)))
				}
			)
	}

	selectStandardTab() {
		this.selectedTab(StandardTemplateView)
	}

	selectInviteTab() {
		this.selectedTab(InviteTemplateView)
	}

	selectDeclineTab() {
		this.selectedTab(DeclineTemplateView)
	}

	selectOfferTab() {
		this.selectedTab(OfferTemplateView)
	}

	toggleRussianLanguage() {
		this.isRussianLanguageSelected(!this.isRussianLanguageSelected())
	}

	toggleUkrainianLanguage() {
		this.isUkrainianLanguageSelected(!this.isUkrainianLanguageSelected())
	}

	toggleEnglishLanguage() {
		this.isEnglishLanguageSelected(!this.isEnglishLanguageSelected())
	}
}
