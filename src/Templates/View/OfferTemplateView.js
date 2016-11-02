import AbstractTemplateView from './AbstractTemplateView'
import * as ko from 'knockout'

export default class OfferTemplateView extends AbstractTemplateView {
	constructor(dispatcher, data = {}) {
		super(dispatcher, data)
		this.template = ko.observable('OfferTemplateView')
	}
}

