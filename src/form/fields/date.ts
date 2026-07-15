import {edtfParse} from "bibliojson"

export class DateFieldForm {
    dom: HTMLElement
    initialValue: string
    placeHolder: string

    constructor(dom: HTMLElement, initialValue = "", placeHolder = "") {
        this.dom = dom
        this.initialValue = initialValue
        this.placeHolder = placeHolder
    }

    init(): void {
        this.dom.innerHTML = `<input class="fw-date" type="text" value="${this.initialValue}" placeholder="${this.placeHolder}">`
    }

    get value(): string | false {
        const formValue = (this.dom.querySelector("input.fw-date") as HTMLInputElement)
            .value
        // If the form has not been filled out, don't consider this form
        return formValue.length > 0 ? formValue : false
    }

    check(): boolean {
        const formValue = this.value
        if (formValue) {
            const checkValue = edtfParse(formValue).valid
            if (!checkValue) {
                this.dom.classList.add("fw-fomt-error")
                return false
            }
        }
        return true
    }
}
