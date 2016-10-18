import * as ko from 'knockout'
import AbstractMessage from './AbstractMessage'

export default class OfferMessage extends AbstractMessage {
	constructor(data = {}) {
		super(data)
		let {vacancyId} = data
		this.vacancyId = ko.observable(vacancyId)
	}
}
