import * as ko from 'knockout'
import * as helpers from '../helpers'
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

		this.ago = ko.computed(() => helpers.formattedAgo(this.addDate()))
		this.formattedDate = ko.computed(() => helpers.formattedDate(this.addDate()))
		this.formattedTime = ko.computed(() => helpers.formattedTime(this.addDate()))

		// this.getInitials = ko.computed(() => {
		// 	if (this.isMultiUser() && this.seekerName()) {
		// 		let initails = this.seekerName().split(' ')
		// 		return (initails[0].charAt(0) + initails[1].charAt(0))
		// 	}
		// })
	}
}
