import * as ko from 'knockout'
import moment from 'moment'


export default class AbstractMessage {
	constructor({id, date, conversationId, text, isRead} = {}) {
		this.id = ko.observable(id)
		this.date = ko.observable(date)
		this.conversationId = ko.observable(conversationId)
		this.text = ko.observable(text)
		this.isRead = ko.observable(isRead)

		this.ago = ko.computed(() => moment(this.date()).fromNow().toString())
		this.formattedDate = ko.computed(() => moment(this.date()).format('LL'))
		this.formattedTime = ko.computed(() => moment(this.date()).format('HH:mm'))
	}
}
