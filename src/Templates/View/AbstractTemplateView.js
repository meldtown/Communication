import AbstractTemplate from '../AbstractTemplate'
import * as actions from '../../constants'
import * as ko from 'knockout'
import axios from 'axios'

export default class AbstractTemplateView extends AbstractTemplate {
	constructor(dispatcher, data) {
		super(dispatcher, data)
		dispatcher.subscribe(template => {
			if (this.constructor === template.constructor) {
				this.isSelected(this.id() === template.id())
			}
		}, this, actions.TEMPLATE_SELECTED)

		this.isSelected = ko.observable(false)

	}

	select() {
		this.dispatcher.notifySubscribers(this, actions.TEMPLATE_SELECTED)
	}

	delete() {
		return axios.delete(`${api}/templates/${this.id()}`)
	}
}
