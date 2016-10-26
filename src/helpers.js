import moment from 'moment'

export const injectTemplate = (name, template) => {
	let script = document.createElement('SCRIPT')
	script.setAttribute('id', name)
	script.setAttribute('type', 'text/html')
	script.text = template
	document.body.appendChild(script)
}

export const uniqueReducer = (result = [], item) => {
	if (result.indexOf(item) === -1) {
		result.push(item)
	}
	return result
}

export const formattedDate = date => date && !isNaN(Date.parse(date)) && moment(date).isValid() ? moment(date).format('LL') : null
export const formattedTime = date => date && !isNaN(Date.parse(date)) && moment(date).isValid() ? moment(date).format('HH:mm') : null
export const isoDateTime = date => date && !isNaN(Date.parse(date)) && moment(date).isValid() ? moment(date).format() : null
export const inputFormattedDate = date => date && !isNaN(Date.parse(date)) && moment(date).isValid() ? moment(date).format('YYYY-MM-DD') : null
