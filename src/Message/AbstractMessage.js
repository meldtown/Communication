import * as ko from 'knockout'
import * as helpers from '../helpers'
import moment from 'moment'
import Attach from '../Attach/Attach'

export default class AbstractMessage {
	constructor({id, addDate, chatId, text, isRead, isMultiUser, avatar, seekerName, headId, attachId, attach = {}} = {}) {
		this.id = ko.observable(id)
		this.addDate = ko.observable(addDate)
		this.chatId = ko.observable(chatId)
		this.text = ko.observable(text)
		this.isRead = ko.observable(isRead)
		this.isMultiUser = ko.observable(isMultiUser)
		this.avatar = ko.observable(avatar)
		this.seekerName = ko.observable(seekerName)
		this.headId = ko.observable(headId)
		this.attachId = ko.observable(attachId)
		this.attach = ko.observable(new Attach(attach))

		this.template = ko.observable()

		this.ago = ko.computed(() => moment(this.addDate()).fromNow().toString())
		this.formattedDate = ko.computed(() => helpers.formattedDate(this.addDate()))
		this.formattedTime = ko.computed(() => helpers.formattedTime(this.addDate()))
	}
}
