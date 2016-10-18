import * as ko from 'knockout'
import * as $ from 'jquery'
import './Templates.scss'
import * as types from '../constants'
import TemplateFactory from './TemplateFactory'


export default class Templates {
	constructor() {
		this.templates = ko.observableArray()
		this.selectedTab = ko.observable()
		this.isStandardTabSelected = ko.computed(() => this.selectedTab() === types.STANDARD_MESSAGE)
		this.isInviteTabSelected = ko.computed(() => this.selectedTab() === types.INVITE_MESSAGE)
		this.isDeclineTabSelected = ko.computed(() => this.selectedTab() === types.DECLINE_MESSAGE)
		this.isOfferTabSelected = ko.computed(() => this.selectedTab() === types.OFFER_MESSAGE)
	}

	fetch() {
		return $.getJSON(`${api}/templates`)
			.then(templates => {
				this.selectedTab(types.STANDARD_MESSAGE)
					return this.templates(templates.map(TemplateFactory.create))
				}
			)
	}

	selectStandardTab() {
		this.selectedTab(types.STANDARD_MESSAGE)
	}

	selectInviteTab() {
		this.selectedTab(types.INVITE_MESSAGE)
	}

	selectDeclineTab() {
		this.selectedTab(types.DECLINE_MESSAGE)
	}

	selectOfferTab() {
		this.selectedTab(types.OFFER_MESSAGE)
	}
}
