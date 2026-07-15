import {InputList} from "fwtoolkit"
import {NameFieldForm} from "./name.js"
import type {NameDictObject} from "../../types/biblio.js"

export class NameListForm {
    dom: HTMLElement
    fieldHandlers: WeakMap<HTMLElement, NameFieldForm>
    inputList: InputList<unknown>

    constructor(dom: HTMLElement, initialValue: NameDictObject[] = []) {
        this.dom = dom
        this.fieldHandlers = new WeakMap()
        this.inputList = new InputList<unknown>({
            dom,
            initialValues: initialValue as unknown[],
            emptyValue: {} as NameDictObject as unknown,
            renderItem: value => ({
                html: `<div class="name-field"></div>`,
                bind: el => {
                    const fieldHandler = new NameFieldForm(
                        el.firstElementChild as HTMLElement,
                        value as NameDictObject
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

    get value(): NameDictObject[] | false {
        const formValue = this.inputList.values.filter(
            value => value !== false
        ) as NameDictObject[]
        if (formValue.length === 0) {
            return false
        }
        return formValue
    }

    check(): boolean {
        return true
    }
}
