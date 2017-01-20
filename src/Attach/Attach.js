import * as ko from 'knockout'
import axios from 'axios'

export default class Attach {
	constructor(data = {}) {
		let {id, fileName, fileSize, url} = data
		this.id = id
		this.fileName = fileName
		this.fileSize = `${fileSize} kb`
		this.url = url
	}
}
