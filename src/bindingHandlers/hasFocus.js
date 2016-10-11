import $ from 'jquery'
import * as ko from 'knockout'

const hasFocus = {
	init: (element, valueAccessor) => {
		$(element).focus(() => {
			let value = valueAccessor()
			value(true)
		})

		$(element).blur(() => {
			let value = valueAccessor()
			value(false)
		})
	},
	update: (element, valueAccessor) => {
		var value = valueAccessor()
		if (ko.unwrap(value)) {
			element.focus()
		} else {
			element.blur()
		}
	}
}

export default hasFocus
