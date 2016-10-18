import * as ko from 'knockout'
import $ from 'jquery'
import './Conversation.scss'
import Conversation from './Conversation'
import * as types from '../types'

export default class ConversationList {
	constructor(dispatcher) {
		if (!ko.isSubscribable(dispatcher)) {
			throw new Error('ko.subscribable is required')
		}

		this.dispatcher = dispatcher
		this.conversations = ko.observableArray()

		this.term = ko.observable()
		this.selectedType = ko.observable(types.ACTIVE_CONVERSATION)

		this.isActiveSelected = ko.computed(() => this.selectedType() === types.ACTIVE_CONVERSATION)
		this.isArchiveSelected = ko.computed(() => this.selectedType() === types.ARCHIVED_CONVERSATION)
		this.isBlockedSelected = ko.computed(() => this.selectedType() === types.BLOCKED_CONVERSATION)
	}

	fetch() {
		let request = {type: this.selectedType()}

		if (this.term()) {
			request.q = this.term()
		}

		return $.getJSON(`${api}/conversations`, request)
			.then(conversations => {
				this.conversations(conversations.map(data => new Conversation(this.dispatcher, data)))
				if (conversations.length > 0) {
					this.conversations()[0].select()
				}
			})
			.fail(() => this.conversations([]))
	}

	selectActive() {
		this.selectedType(types.ACTIVE_CONVERSATION)
	}

	selectArchive() {
		this.selectedType(types.ARCHIVED_CONVERSATION)
	}

	selectBlocked() {
		this.selectedType(types.BLOCKED_CONVERSATION)
	}
}
