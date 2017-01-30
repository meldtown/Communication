import * as ko from 'knockout'

ko.bindingHandlers.enterPress = {
	init: (element, valueAccessor, allBindingsAccessor, viewModel) => {
		let allBindings = allBindingsAccessor()
		element.addEventListener('keyup', event => {
			let keyCode = (event.which ? event.which : event.keyCode)
			if (keyCode === 13) {
				allBindings.enterPress.call(viewModel)
				return false
			}
			return true
		})
	}
}
