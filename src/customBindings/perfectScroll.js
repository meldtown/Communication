import * as ko from 'knockout'
import perfectScroll from 'perfect-scrollbar'


ko.bindingHandlers.perfectScroll = {
	init(element) {
		perfectScroll.initialize(element)
	},
	update(element) {
		perfectScroll.update(element)
	}
}
