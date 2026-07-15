import {InputList} from "fwtoolkit"
import {KeyFieldForm} from "./key.js"
import type {BibFieldType} from "../../types/biblio.js"

export class KeyListForm {
    dom: HTMLElement
    fieldType: BibFieldType | undefined
    fieldHandlers: WeakMap<HTMLElement, KeyFieldForm>
    inputList: InputList<unknown>

    constructor(
        dom: HTMLElement,
        initialValue: unknown[] = [""],
        _unused?: unknown,
        fieldType: BibFieldType | undefined = undefined
    ) {
        this.dom = dom
        this.fieldType = fieldType
        this.fieldHandlers = new WeakMap()
        this.inputList = new InputList<unknown>({
            dom,
            initialValues: initialValue,
            emptyValue: "",
            renderItem: value => ({
                html: `<div class="key-field"></div>`,
                bind: el => {
                    const fieldHandler = new KeyFieldForm(
                        el.firstElementChild as HTMLElement,
                        value,
                        false,
                        this.fieldType
                    )
                    fieldHandler.init()
                    this.fieldHandlers.set(el, fieldHandler)
                }
            }),
            getValue: el => this.fieldHandlers.get(el)!.value
        })
    }

    init(): void {
        // InputList is already rendered by the constructor.
    }

    get value(): unknown[] | false {
        const formValue = this.inputList.values.filter(value => value !== false)
        if (formValue.length === 0) {
            return false
        }
        return formValue
    }

    check(): boolean {
        return true
    }
}
