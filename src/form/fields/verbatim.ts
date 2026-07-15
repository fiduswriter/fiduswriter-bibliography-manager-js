export class VerbatimFieldForm {
    dom: HTMLElement
    initialValue: string
    placeHolder: string

    constructor(dom: HTMLElement, initialValue = "", placeHolder = "") {
        this.dom = dom
        this.initialValue = initialValue
        this.placeHolder = placeHolder
    }

    init(): void {
        this.dom.innerHTML = `<input class="verbatim" type="text" value="${this.initialValue}" placeholder="${this.placeHolder}">`
    }

    get value(): string | false {
        const formValue = (this.dom.querySelector("input.verbatim") as HTMLInputElement)
            .value
        // If the form has not been filled out, don't consider this form
        return formValue.length > 0 ? formValue : false
    }

    check(): boolean {
        return true
    }
}
