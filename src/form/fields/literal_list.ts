import {InputList} from "fwtoolkit"
import {LiteralFieldForm} from "./literal.js"

export class LiteralListForm {
    dom: HTMLElement
    fieldHandlers: WeakMap<HTMLElement, LiteralFieldForm>
    inputList: InputList<unknown>

    constructor(
        dom: HTMLElement,
        initialValue: Record<string, unknown>[][] = [[]]
    ) {
        this.dom = dom
        this.fieldHandlers = new WeakMap()
        this.inputList = new InputList<unknown>({
            dom,
            initialValues: initialValue as unknown[],
            emptyValue: [],
            renderItem: value => ({
                html: `<div class="literal-field"></div>`,
                bind: el => {
                    const fieldHandler = new LiteralFieldForm(
                        el.firstElementChild as HTMLElement,
                        value as Record<string, unknown>[]
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

    get value(): Record<string, unknown>[][] | false {
        const formValue = this.inputList.values.filter(
            value => value !== false
        ) as Record<string, unknown>[][]
        if (formValue.length === 0) {
            return false
        }
        return formValue
    }

    check(): boolean {
        return true
    }
}
