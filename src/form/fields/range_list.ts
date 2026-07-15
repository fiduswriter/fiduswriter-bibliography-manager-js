import {InputList} from "fwtoolkit"
import {RangeFieldForm} from "./range.js"
import type {NodeArray, RangeArray} from "../../types/biblio.js"

export class RangeListForm {
    dom: HTMLElement
    fieldHandlers: WeakMap<HTMLElement, RangeFieldForm>
    inputList: InputList<unknown>

    constructor(dom: HTMLElement, initialValue: NodeArray[][] = [[]]) {
        this.dom = dom
        this.fieldHandlers = new WeakMap()
        this.inputList = new InputList<unknown>({
            dom,
            initialValues: initialValue as unknown[],
            emptyValue: [],
            renderItem: value => ({
                html: `<div class="range-field"></div>`,
                bind: el => {
                    const fieldHandler = new RangeFieldForm(
                        el.firstElementChild as HTMLElement,
                        value as NodeArray[]
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

    get value(): RangeArray[] | false {
        const formValue = this.inputList.values.filter(
            value => value !== false
        ) as RangeArray[]
        if (formValue.length === 0) {
            return false
        }
        return formValue
    }

    check(): boolean {
        return true
    }
}
