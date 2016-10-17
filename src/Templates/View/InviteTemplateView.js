import AbstractTemplateView from './AbstractTemplateView'
import * as ko from 'knockout'

export default class InviteTemplateView extends AbstractTemplateView {
	constructor(data = {}) {
		super(data)
		let {time, address} = data
		this.time = ko.observable(time)
		this.address = ko.observable(address)
	}
}

