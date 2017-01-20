
export default class Attach {
	constructor(data = {}) {
		let {id, fileName, fileSize, url} = data
		this.id = id
		this.fileName = fileName
		this.fileSize = fileSize
		this.url = url
	}
}
