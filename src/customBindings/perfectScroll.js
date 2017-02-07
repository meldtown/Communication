import * as ko from 'knockout'
import perfectScroll from 'perfect-scrollbar'
import 'perfect-scrollbar/dist/css/perfect-scrollbar.min.css'


ko.bindingHandlers.perfectScroll = {
	init(element) {
		perfectScroll.initialize(element)
	},
	update(element) {
		perfectScroll.update(element)
	}
}
