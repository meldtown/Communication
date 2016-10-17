import AbstractTemplate from './AbstractTemplate'
import * as ko from 'knockout'

export default class InviteTemplateView extends AbstractTemplate {
	constructor(data = {}) {
		super(data)
		let {time, address} = data
		this.time = ko.observable(time)
		this.address = ko.observable(address)
	}
}

