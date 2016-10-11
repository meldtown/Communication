import $ from 'jquery'
import * as ko from 'knockout'
import './Hub.scss'
import '../bindingHandlers/hasFocus'

export default class Hub {
    constructor() {
        this.a = ko.observable();
        this.b = ko.observable();

        this.numericA = ko.computed(() => isNaN(parseInt(this.a())) ? 0 : parseInt(this.a()))
        this.numericB = ko.computed(() => isNaN(parseInt(this.b())) ? 0 : parseInt(this.b()))

        //noinspection JSUnusedGlobalSymbols
        this.aHasFocus = ko.observable()

        //noinspection JSUnusedGlobalSymbols
        this.sum = ko.computed(() => this.numericA() + this.numericB())
    }

    fetch() {
        return $.getJSON('https://jsonplaceholder.typicode.com/users')
            .then(users => {
                this.a(users.length / 2)
                this.b(users.length / 2)
            })
            .fail(() => {
                this.a(1)
                this.b(1)
            })
    }
}
