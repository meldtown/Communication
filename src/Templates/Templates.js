import * as ko from 'knockout'
import * as $ from 'jquery'
import './Templates.scss'
import * as types from '../types'
import TemplateFactory from './TemplateFactory'


export default class Templates {
	constructor() {
		this.templates = ko.observableArray()
		this.selectedTab = ko.observable()
		this.isStandardTabSelected = ko.computed(() => this.selectedTab() === types.STANDARD)
		this.isInviteTabSelected = ko.computed(() => this.selectedTab() === types.INVITE)
		this.isDeclineTabSelected = ko.computed(() => this.selectedTab() === types.DECLINE)
		this.isOfferTabSelected = ko.computed(() => this.selectedTab() === types.OFFER)
	}

	fetch() {
		return $.getJSON(`${api}/templates`)
			.then(templates => {
					this.selectedTab(types.STANDARD)
					return this.templates(templates.map(TemplateFactory.create))
				}
			)
	}

	selectStandardTab() {
		this.selectedTab(types.STANDARD)
	}

	selectInviteTab() {
		this.selectedTab(types.INVITE)
	}

	selectDeclineTab() {
		this.selectedTab(types.DECLINE)
	}

	selectOfferTab() {
		this.selectedTab(types.OFFER)
	}
}
