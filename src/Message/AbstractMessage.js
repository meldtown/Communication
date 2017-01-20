import * as ko from 'knockout'
import * as helpers from '../helpers'
import moment from 'moment'

export default class AbstractMessage {
	constructor({id, date, conversationId, text, isRead} = {}) {
		this.id = ko.observable(id)
		this.addDate = ko.observable(date)
		this.conversationId = ko.observable(conversationId)
		// this.chatId = ko.observable(conversationId)
		this.text = ko.observable(text)
		this.isRead = ko.observable(isRead)

		this.template = ko.observable()

		this.ago = ko.computed(() => moment(this.addDate()).fromNow().toString())
		this.formattedDate = ko.computed(() => helpers.formattedDate(this.addDate()))
		this.formattedTime = ko.computed(() => helpers.formattedTime(this.addDate()))
	}
}
