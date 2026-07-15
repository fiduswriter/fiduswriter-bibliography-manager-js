import {TypeSwitch} from "fwtoolkit"
import {getBibOptionTitle} from "../strings.js"
import {LiteralFieldForm} from "./literal.js"
import type {BibFieldType} from "../../types/biblio.js"

export class KeyFieldForm {
    currentValue: Record<string, unknown>
    dom: HTMLElement
    fieldType: BibFieldType | undefined
    predefined: boolean
    typeSwitch!: TypeSwitch
    fields: Record<string, LiteralFieldForm> = {}

    constructor(
        dom: HTMLElement,
        initialValue: unknown,
        _unused?: unknown,
        fieldType: BibFieldType | undefined = undefined
    ) {
        this.currentValue = {}
        this.dom = dom
        this.fieldType = fieldType
        // We set the mode based on the type of value
        if (typeof initialValue === "object") {
            this.predefined = false
            this.currentValue["custom"] = initialValue
        } else {
            this.predefined = true
            this.currentValue["predefined"] = initialValue
        }
    }

    init(): void {
        this.typeSwitch = new TypeSwitch({
            dom: this.dom,
            label1: gettext("From list"),
            label2: gettext("Custom"),
            initialMode: this.predefined ? 1 : 2,
            disabled: this.fieldType?.strict,
            beforeChange: () => {
                const formValue = this.value
                if (formValue) {
                    if (this.predefined) {
                        this.currentValue["predefined"] = formValue
                    } else {
                        this.currentValue["custom"] = formValue
                    }
                }
            },
            onChange: mode => {
                this.predefined = mode === 1
                this.drawForm()
            }
        })
        this.drawForm()
    }

    drawForm(): void {
        if (this.predefined) {
            this.drawSelectionListForm()
        } else {
            this.drawCustomInputForm()
        }
    }

    drawSelectionListForm(): void {
        this.typeSwitch.innerElement.innerHTML = `
                <select class='key-selection'><option value=''></option></select>
                <div class="fw-select-arrow fa fa-caret-down"></div>
            `
        const selectEl = this.typeSwitch.innerElement.querySelector(
            ".key-selection"
        ) as HTMLSelectElement
        const options = this.fieldType?.options
        if (Array.isArray(options)) {
            options.forEach(option => {
                selectEl.insertAdjacentHTML(
                    "beforeend",
                    `<option value="${option}">${getBibOptionTitle(option)}</option>`
                )
            })
        } else if (options) {
            Object.keys(options).forEach(option => {
                selectEl.insertAdjacentHTML(
                    "beforeend",
                    `<option value="${option}">${getBibOptionTitle(option)}</option>`
                )
            })
        }

        if (this.currentValue["predefined"]) {
            selectEl.value = String(this.currentValue["predefined"])
        }
    }

    drawCustomInputForm(): void {
        this.fields = {}
        this.typeSwitch.innerElement.innerHTML = `<div class='custom-input field-part field-part-single'></div>`
        this.fields["custom"] = new LiteralFieldForm(
            this.typeSwitch.innerElement.querySelector(
                ".custom-input"
            ) as HTMLElement,
            this.currentValue["custom"] as Record<string, unknown>[]
        )
        this.fields.custom.init()
    }

    get value(): string | Record<string, unknown>[] | false {
        if (this.predefined) {
            const selectEl = this.typeSwitch.innerElement.querySelector(
                ".key-selection"
            ) as HTMLSelectElement
            const selectionValue =
                selectEl.options[selectEl.selectedIndex].value
            if (selectionValue === "") {
                return false
            } else {
                return selectionValue
            }
        } else {
            if (!this.fields.custom.value) {
                return false
            }
            return this.fields.custom.value
        }
    }

    check(): boolean {
        return true
    }
}
