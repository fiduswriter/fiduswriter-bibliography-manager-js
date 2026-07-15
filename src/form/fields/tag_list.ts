import TokenField from "tokenfield"

export class TagListForm {
    dom: HTMLElement
    initialValue: string[]
    tokenInput!: TokenField

    constructor(dom: HTMLElement, initialValue: string[] = []) {
        this.dom = dom
        this.initialValue = initialValue
    }

    init(): void {
        this.dom.innerHTML = '<input class="tags" type="text">'
        this.tokenInput = new TokenField({
            el: this.dom.querySelector(".tags") as HTMLInputElement,
            setItems: this.initialValue.map((key, index) => {
                return {id: index, name: key}
            }),
            keys: {
                188: "delimiter"
            }
        })
    }

    get value(): string[] | false {
        const formValue = this.tokenInput.getItems().map(item => {
            return item.name
        })
        // If the form has not been filled out, don't consider this form
        return formValue.length > 0 ? formValue : false
    }

    check(): boolean {
        return true
    }
}
