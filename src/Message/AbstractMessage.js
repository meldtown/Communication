import * as ko from 'knockout'
import * as helpers from '../helpers'
import moment from 'moment'

export default class AbstractMessage {
	constructor({id, date, chatId, text, isRead, avatar, seekerName, headId} = {}) {
		this.id = ko.observable(id)
		this.addDate = ko.observable(date)
		this.chatId = ko.observable(chatId)
		this.text = ko.observable(text)
		this.isRead = ko.observable(isRead)
		this.avatar = ko.observable(avatar)
		this.seekerName = ko.observable(seekerName)
		this.headId = ko.observable(headId)

		this.template = ko.observable()

		this.ago = ko.computed(() => moment(this.addDate()).fromNow().toString())
		this.formattedDate = ko.computed(() => helpers.formattedDate(this.addDate()))
		this.formattedTime = ko.computed(() => helpers.formattedTime(this.addDate()))
	}
}
