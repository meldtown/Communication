import * as ko from 'knockout'
import axios from 'axios'
import Attach from '../Attach/Attach'

ko.bindingHandlers.attach = {
	init: function (element, valueAccessor) {
		let value = ko.unwrap(valueAccessor())
		const currentId = value.attach().id
		element.addEventListener('change', function () {
			if (currentId) {
				axios.delete(`${api2}/attaches/${currentId}`).then(() => {
					ko.bindingHandlers.attach.doUpload(element, valueAccessor)
				}).catch(() => ko.bindingHandlers.attach.doUpload(element, valueAccessor))
			} else {
				ko.bindingHandlers.attach.doUpload(element, valueAccessor)
			}
		})
	},
	doUpload: function(element, valueAccessor) {
		let value = valueAccessor()
		const attach = value.attach
		const attachId = value.attachId
		const file = element.files[0]
		const formData = new FormData()
		formData.append('file', file)
		axios.post(`${api2}/attaches`, formData).then(response => {
			let id = response.data
			axios.get(`${api2}/attaches/${id}`).then(response => {
				if (attach) attach(new Attach(response.data))
				if (attachId) attachId(id)
			})
		}).catch(error => {
			throw new Error(`Error has occurred while attaching file: ${error}`)
		})
	}
}

