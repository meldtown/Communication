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

export const formattedDate = date => {
	return date ? moment(date).format('LL') : null
}

export const formattedTime = date => {
	return date ? moment(date).format('HH:mm') : null
}
