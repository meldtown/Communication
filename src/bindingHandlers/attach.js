import * as ko from 'knockout'
import axios from 'axios'
import Attach from '../Attach/Attach'

ko.bindingHandlers.attach = {
	init: function (element, valueAccessor) {
		let value = valueAccessor()
		const attach = value.attach
		const attachId = value.attachId
		element.onchange = function () {
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
}

