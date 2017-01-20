import 'jquery-ui/ui/core'
import 'jquery-ui/ui/widgets/autocomplete'
import 'jquery-ui/themes/base/core.css'
// import 'jquery-ui/themes/base/theme.css'

ko.bindingHandlers.cityAutocomplete = {
	init(element, valueAccessor) {
		let availableTags = [
			'Киев',
			'Львов',
			'Харьков',
			'Запорожье',
			'Днепр',
			'Одесса'
		];
		$(element).autocomplete({
			source: availableTags
		})
	},
	update(element, valueAccessor) {}
}
