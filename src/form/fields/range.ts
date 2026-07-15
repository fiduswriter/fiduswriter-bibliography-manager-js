import {TypeSwitch, getFocusIndex, setFocusIndex} from "fwtoolkit"
import {LiteralFieldForm} from "./literal.js"
import type {NodeArray, RangeArray} from "../../types/biblio.js"

// There are only range lists, no range fields in the data format. The separation
// between RangeFieldForm and RangeListForm is for keeping consistency with other fields
// and lists.

export class RangeFieldForm {
    currentValue: NodeArray[]
    dom: HTMLElement
    range: boolean
    typeSwitch!: TypeSwitch
    fields: Record<string, LiteralFieldForm> = {}

    constructor(dom: HTMLElement, initialValue: NodeArray[] = [[]]) {
        this.currentValue = initialValue
        this.dom = dom
        // We set the mode based on whether there is one or two initial values.
        if (initialValue.length > 1) {
            this.range = true
        } else {
            this.range = false
        }
    }

    init(): void {
        this.typeSwitch = new TypeSwitch({
            dom: this.dom,
            label1: gettext("Single value"),
            label2: gettext("Range"),
            initialMode: this.range ? 2 : 1,
            beforeChange: () => {
                const formValue = this.value
                if (formValue) {
                    Object.assign(this.currentValue, formValue)
                }
            },
            onChange: mode => {
                this.range = mode === 2
                const focusIndex = getFocusIndex()
                this.drawForm()
                setFocusIndex(focusIndex)
            }
        })
        this.drawForm()
    }

    drawForm(): void {
        if (this.range) {
            this.drawRangeForm()
        } else {
            this.drawSingleValueForm()
        }
    }

    drawSingleValueForm(): void {
        this.fields = {}
        this.typeSwitch.innerElement.innerHTML = `<div class='single-value field-part field-part-single'></div>`
        this.fields["single"] = new LiteralFieldForm(
            this.typeSwitch.innerElement.querySelector(
                ".single-value"
            ) as HTMLElement,
            this.currentValue[0] as unknown as Record<string, unknown>[]
        )
        this.fields.single.init()
    }

    drawRangeForm(): void {
        this.fields = {}
        this.typeSwitch.innerElement.innerHTML = `
                <div class='range-from field-part field-part-huge'></div>
                <div class='range-to field-part field-part-huge'></div>
            `
        this.fields["from"] = new LiteralFieldForm(
            this.typeSwitch.innerElement.querySelector(
                ".range-from"
            ) as HTMLElement,
            this.currentValue[0] as unknown as Record<string, unknown>[],
            gettext("From")
        )
        this.fields.from.init()
        this.fields["to"] = new LiteralFieldForm(
            this.typeSwitch.innerElement.querySelector(
                ".range-to"
            ) as HTMLElement,
            this.currentValue[1] as unknown as Record<string, unknown>[],
            gettext("To")
        )
        this.fields.to.init()
    }

    get value(): RangeArray | false {
        if (this.range) {
            const fromValue = this.fields.from.value as NodeArray | false
            const toValue = this.fields.to.value as NodeArray | false
            if (!fromValue && !toValue) {
                return false
            }
            return [
                fromValue ? fromValue : ([{type: "text", text: ""}] as NodeArray),
                toValue ? toValue : ([{type: "text", text: ""}] as NodeArray)
            ]
        } else {
            const singleValue = this.fields.single.value as NodeArray | false
            if (!singleValue) {
                return false
            }
            return [singleValue]
        }
    }

    check(): boolean {
        return true
    }
}
