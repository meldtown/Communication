import * as ko from 'knockout'
import axios from 'axios'
import './Templates.scss'
import * as constants from '../constants'
import TemplateFactory from './TemplateFactory'
import StandardTemplateView from '../Templates/View/StandardTemplateView'
import InviteTemplateView from '../Templates/View/InviteTemplateView'
import DeclineTemplateView from '../Templates/View/DeclineTemplateView'
import OfferTemplateView from '../Templates/View/OfferTemplateView'
import StandardTemplateForm from '../Templates/Form/StandardTemplateForm'
import InviteTemplateForm from '../Templates/Form/InviteTemplateForm'
import DeclineTemplateForm from '../Templates/Form/DeclineTemplateForm'
import OfferTemplateForm from '../Templates/Form/OfferTemplateForm'

export default class Templates {
	constructor(dispatcher) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}

		this.dispatcher = dispatcher
		this.templates = ko.observableArray()

		this.tabs = [constants.STANDARD_MESSAGE, constants.INVITE_MESSAGE, constants.DECLINE_MESSAGE, constants.OFFER_MESSAGE]
		this.selectedTab = ko.observable(StandardTemplateView)
		this.isStandardTabSelected = ko.computed(() => this.selectedTab() === StandardTemplateView)
		this.isInviteTabSelected = ko.computed(() => this.selectedTab() === InviteTemplateView)
		this.isDeclineTabSelected = ko.computed(() => this.selectedTab() === DeclineTemplateView)
		this.isOfferTabSelected = ko.computed(() => this.selectedTab() === OfferTemplateView)

		this.languages = [constants.RU, constants.UA, constants.EN]
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
					return ((template.language() === constants.RU) && this.isRussianLanguageSelected()) ||
						((template.language() === constants.UA) && this.isUkrainianLanguageSelected()) ||
						((template.language() === constants.EN) && this.isEnglishLanguageSelected())
				})
				.filter(template => {
					if (!this.filter()) return true
					let str = this.filter().toLowerCase()
					return template.title().toLowerCase().indexOf(str) !== -1 || template.text().toLowerCase().indexOf(str) !== -1
				})
		})


		this.selectedStandardTemplate = ko.observable()
		this.selectedInviteTemplate = ko.observable()
		this.selectedDeclineTemplate = ko.observable()
		this.selectedOfferTemplate = ko.observable()

		this.selectedTemplate = ko.computed(() => {
			switch (this.selectedTab()) {
				case StandardTemplateView:
					return this.selectedStandardTemplate()
				case InviteTemplateView:
					return this.selectedInviteTemplate()
				case DeclineTemplateView:
					return this.selectedDeclineTemplate()
				case OfferTemplateView:
					return this.selectedOfferTemplate()
			}
		})

		this.selectedTemplateForm = ko.observable(null)
		this.isSelectedTemplateBeingEdited = ko.observable(false)
		this.isNewTemplateBeingCreated = ko.observable(false)

		dispatcher.subscribe(template => {
			this.isSelectedTemplateBeingEdited(false)
			switch (template.constructor) {
				case StandardTemplateView:
					this.selectedStandardTemplate(template)
					break
				case InviteTemplateView:
					this.selectedInviteTemplate(template)
					break
				case DeclineTemplateView:
					this.selectedDeclineTemplate(template)
					break
				case OfferTemplateView:
					this.selectedOfferTemplate(template)
					break
				default:
					this.selectedStandardTemplate(template)
			}
		}, this, constants.TEMPLATE_SELECTED)
	}

	fetch() {
		return axios.get(`${api}/templates`)
			.then(response => {
				this.selectedTab(StandardTemplateView)
				let templates = this.templates(response.data.map(TemplateFactory.create.bind(this, this.dispatcher)))
				this.filteredTemplates()[0].select()
				return templates
			})
	}

	selectStandardTab() {
		this.selectedTab(StandardTemplateView)
		this.isSelectedTemplateBeingEdited(false)
	}

	selectInviteTab() {
		this.selectedTab(InviteTemplateView)
		if (!this.selectedInviteTemplate()) this.filteredTemplates()[0].select()
		this.isSelectedTemplateBeingEdited(false)
	}

	selectDeclineTab() {
		this.selectedTab(DeclineTemplateView)
		if (!this.selectedDeclineTemplate()) this.filteredTemplates()[0].select()
		this.isSelectedTemplateBeingEdited(false)
	}

	selectOfferTab() {
		this.selectedTab(OfferTemplateView)
		if (!this.selectedOfferTemplate()) this.filteredTemplates()[0].select()
		this.isSelectedTemplateBeingEdited(false)
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

	edit() {
		this.isSelectedTemplateBeingEdited(true)
		// noinspection JSUnusedLocalSymbols
		let {dispatcher, isSelected, ...selectedTemplateData} = ko.toJS(this.selectedTemplate()) // eslint-disable-line no-unused-vars
		let form = null
		switch (this.selectedTemplate().constructor) {
			case StandardTemplateView:
				form = new StandardTemplateForm(this.dispatcher, selectedTemplateData)
				break
			case InviteTemplateView:
				form = new InviteTemplateForm(this.dispatcher, selectedTemplateData)
				break
			case DeclineTemplateView:
				form = new DeclineTemplateForm(this.dispatcher, selectedTemplateData)
				break
			case OfferTemplateView:
				form = new OfferTemplateForm(this.dispatcher, selectedTemplateData)
				break
		}
		this.selectedTemplateForm(form)
	}

	cancel() {
		this.isSelectedTemplateBeingEdited(false)
		this.selectedTemplateForm(null)
	}

	save() {
		return this.selectedTemplateForm().save().then((response) => {
			this.selectedTemplateForm().fill(this.selectedTemplate())
			if (!this.selectedTemplateForm().id()) {
				this.selectedTemplate().id(response.data.id)
				this.templates.push(this.selectedTemplate())
			}
			this.selectedTemplateForm(null)
			this.isNewTemplateBeingCreated(false)
			this.isSelectedTemplateBeingEdited(false)
		})
	}

	delete() {
		return this.selectedTemplate().delete().then(() => {
			this.templates.remove(this.selectedTemplate())
			this.filteredTemplates()[0].select()
		})
	}

	create() {
		this.isNewTemplateBeingCreated(true)
		this.isSelectedTemplateBeingEdited(true)
		let newTemplateForm = null
		let newTemplateView = null
		let data = {text: '', title: '', language: 'ru'}
		switch (this.selectedTab()) {
			case StandardTemplateView:
				newTemplateForm = new StandardTemplateForm(this.dispatcher, data)
				newTemplateView = new StandardTemplateView(this.dispatcher, data)
				break
			case InviteTemplateView:
				newTemplateForm = new InviteTemplateForm(this.dispatcher, Object.assign({}, data, {
					addressId: 0,
					inviteDate: '2016-11-11'
				}))
				newTemplateView = new InviteTemplateView(this.dispatcher, Object.assign({}, data, {
					addressId: 0,
					inviteDate: '2016-11-11'
				}))
				break
			case DeclineTemplateView:
				newTemplateForm = new DeclineTemplateForm(this.dispatcher, data)
				newTemplateView = new DeclineTemplateView(this.dispatcher, data)
				break
			case OfferTemplateView:
				newTemplateForm = new OfferTemplateForm(this.dispatcher, data)
				newTemplateView = new OfferTemplateView(this.dispatcher, data)
				break
		}
		this.selectedTemplateForm(newTemplateForm)
		newTemplateView.select()
	}
}
