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
					return ((template.language() === constants.RU) && this.isRussianLanguageSelected()) ||
						((template.language() === constants.UA) && this.isUkrainianLanguageSelected()) ||
						((template.language() === constants.EN) && this.isEnglishLanguageSelected())
				})
				.filter(template => {
					if (!this.filter()) return true
					let str = this.filter()
					return template.title().indexOf(str) !== -1 || template.text().indexOf(str) !== -1
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
				return this.templates(response.data.map(TemplateFactory.create.bind(this, this.dispatcher)))
			})
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

	save(isNewTemplateBeingCreated) {
		this.selectedTemplateForm().save(isNewTemplateBeingCreated).then(() => {
			this.selectedTemplateForm().fill(this.selectedTemplate())
			if (isNewTemplateBeingCreated) {
				this.templates().push(this.selectedTemplate())
			}
			this.selectedTemplateForm(null)
			this.isNewTemplateBeingCreated(false)
			this.isSelectedTemplateBeingEdited(false)
		})
	}

	delete() {
		return new Promise(() => {
			this.selectedTemplate().delete()
		}).then(() => {
			this.templates().remove(this.selectedTemplate())
		})
	}

	create() {
		this.isNewTemplateBeingCreated(true)
		let newTemplateForm = null
		let newTemplateView = null
		let data = {text: '', title: '', id: 0, language: 'ru'}
		switch (this.selectedTab()) {
			case StandardTemplateView:
				newTemplateForm = new StandardTemplateForm(this.dispatcher, data)
				newTemplateView = new StandardTemplateView(this.dispatcher, data)
				break
			case InviteTemplateView:
				new InviteTemplateForm(this.dispatcher, Object.assign({}, data, {
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
