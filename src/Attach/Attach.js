import * as ko from 'knockout'

export default class Attach {
	constructor(data = {}) {
		let {id, fileName, fileSize, url} = data
		this.id = id
		this.fileName = fileName
		this.fileSize = fileSize
		this.url = url
		this.isImage = ko.computed(() => {
			if (this.id) {
				let index = this.url.search(/\.png|\.jpg|\.jpeg|\.svg|\.gif/i)
				return index !== -1
			}
		})
	}
}
