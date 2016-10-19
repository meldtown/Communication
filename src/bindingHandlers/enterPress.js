import * as ko from 'knockout'

ko.bindingHandlers.enterPress = {
	init: (element, valueAccessor, allBindingsAccessor, viewModel) => {
		var allBindings = allBindingsAccessor()
		element.addEventListener('keydown', event => {
			var keyCode = (event.which ? event.which : event.keyCode)
			if (keyCode === 13) {
				allBindings.enterPress.call(viewModel)
				return false
			}
			return true
		})
	}
}
