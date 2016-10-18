import AbstractMessage from './AbstractMessage'

export default class DeclineMessage extends AbstractMessage {
	constructor(data = {}) {
		super(data)
		this.template('DeclineMessage')
	}
}
