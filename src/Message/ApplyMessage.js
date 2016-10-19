import AbstractMessage from './AbstractMessage'
import * as ko from 'knockout'
export default class ApplyMessage extends AbstractMessage {
	constructor(data = {}) {
		super(data)
		let {vacancyId, resumeId} = data
		this.vacancyId = ko.observable(vacancyId)
		this.resumeId = ko.observable(resumeId)
		this.template('ApplyMessage')
	}
}
