import AbstractMessageForm from './AbstractMessageForm'

export default class StandardMessageForm extends AbstractMessageForm {
	save() {
		if (!this.conversationId()) {
			throw new Error('conversationId is required')
		}
	}
}
