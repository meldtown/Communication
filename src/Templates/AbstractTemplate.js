import * as ko from 'knockout'
import * as languages from '../constants'
import Attach from '../Attach/Attach'
import { formattedDateTemplates } from '../helpers'


export default class AbstractTemplate {
	constructor(dispatcher, {id, name, text, updateDate, language, attach = {}} = {}) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}
		switch (language) {
			case undefined: language = languages.RU
				break
			case 1: language = languages.RU
				break
			case 2: language = languages.UA
				break
			case 3: language = languages.EN
				break
		}

		this.langRuTxt = languages.RU
		this.langUaTxt = languages.UA
		this.langEnTxt = languages.EN

		this.id = ko.observable(id)
		this.language = ko.observable(language)
		this.text = ko.observable(text)
		this.name = ko.observable(name)
		this.attach = ko.observable(new Attach(attach))
		this.dispatcher = dispatcher
		this.datetime = ko.observable(formattedDateTemplates(updateDate))

		this.selectRuLang = () => this.language(languages.RU)
		this.selectUaLang = () => this.language(languages.UA)
		this.selectEnLang = () => this.language(languages.EN)

		this.isRuActive = () => ko.computed(() => this.language() === languages.RU)
		this.isUaActive = () => ko.computed(() => this.language() === languages.UA)
		this.isEnActive = () => ko.computed(() => this.language() === languages.EN)
	}
}
