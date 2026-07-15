import {TypeSwitch, getFocusIndex, setFocusIndex} from "fwtoolkit"
import {LiteralFieldForm} from "./literal.js"
import type {NameDictObject, NodeArray} from "../../types/biblio.js"

// There are only name lists, no name fields in the data format. The separation
// between NameFieldForm and NameListForm is for keeping consistency with other fields
// and lists.

export class NameFieldForm {
    currentValue: NameDictObject
    dom: HTMLElement
    realPerson: boolean
    typeSwitch!: TypeSwitch
    fields: Record<string, LiteralFieldForm> = {}

    constructor(
        dom: HTMLElement,
        initialValue: NameDictObject = {
            given: [],
            family: [],
            prefix: [],
            suffix: [],
            useprefix: false,
            literal: []
        }
    ) {
        this.currentValue = initialValue
        this.dom = dom
        // We set the mode based on whether there was a literal name.
        if (initialValue.literal) {
            this.realPerson = false
        } else {
            this.realPerson = true
        }
    }

    init(): void {
        this.typeSwitch = new TypeSwitch({
            dom: this.dom,
            label1: gettext("Person"),
            label2: gettext("Organization"),
            initialMode: this.realPerson ? 1 : 2,
            beforeChange: () => {
                const formValue = this.value
                if (formValue) {
                    Object.assign(this.currentValue, formValue)
                }
            },
            onChange: mode => {
                this.realPerson = mode === 1
                const focusIndex = getFocusIndex()
                this.drawForm()
                setFocusIndex(focusIndex)
            }
        })
        this.drawForm()
    }

    drawForm(): void {
        if (this.realPerson) {
            this.drawPersonForm()
        } else {
            this.drawOrganizationForm()
        }
    }

    drawPersonForm(): void {
        this.fields = {}
        this.typeSwitch.innerElement.innerHTML = `
                <div class='given field-part field-part-long'></div>
                <div class='prefix field-part field-part-short'></div>
                <div class='family field-part field-part-long'></div>
                <div class='suffix field-part field-part-short'></div>
                <div class='useprefix field-part'>
                    <input type='checkbox' class='useprefix'
                        ${this.currentValue.useprefix ? "checked" : ""}>
                    &nbsp;${gettext("Prefix used")}
                </div>
            `
        this.fields["given"] = new LiteralFieldForm(
            this.typeSwitch.innerElement.querySelector(".given") as HTMLElement,
            this.currentValue.given as unknown as unknown as Record<string, unknown>[],
            gettext("First name")
        )
        this.fields.given.init()
        this.fields["prefix"] = new LiteralFieldForm(
            this.typeSwitch.innerElement.querySelector(
                ".prefix"
            ) as HTMLElement,
            this.currentValue.prefix as unknown as Record<string, unknown>[],
            gettext("Prefix")
        )
        this.fields.prefix.init()
        this.fields["family"] = new LiteralFieldForm(
            this.typeSwitch.innerElement.querySelector(
                ".family"
            ) as HTMLElement,
            this.currentValue.family as unknown as Record<string, unknown>[],
            gettext("Last name")
        )
        this.fields.family.init()
        this.fields["suffix"] = new LiteralFieldForm(
            this.typeSwitch.innerElement.querySelector(
                ".suffix"
            ) as HTMLElement,
            this.currentValue.suffix as unknown as Record<string, unknown>[],
            gettext("Suffix")
        )
        this.fields.suffix.init()
    }

    drawOrganizationForm(): void {
        this.fields = {}
        this.typeSwitch.innerElement.innerHTML = `<div class='literal-text field-part field-part-single'></div>`
        this.fields["literal"] = new LiteralFieldForm(
            this.typeSwitch.innerElement.querySelector(
                ".literal-text"
            ) as HTMLElement,
            this.currentValue.literal as unknown as Record<string, unknown>[],
            gettext("Organization name")
        )
        this.fields.literal.init()
    }

    get value(): NameDictObject | false {
        if (this.realPerson) {
            const familyValue = this.fields.family.value as NodeArray | false
            const givenValue = this.fields.given.value as NodeArray | false
            const prefixValue = this.fields.prefix.value as NodeArray | false
            const suffixValue = this.fields.suffix.value as NodeArray | false
            if (!familyValue && !givenValue && !prefixValue && !suffixValue) {
                return false
            }
            const returnObject: NameDictObject = {
                family: familyValue ? familyValue : [],
                given: givenValue ? givenValue : []
            }
            if (prefixValue) {
                returnObject["prefix"] = prefixValue
                returnObject["useprefix"] = (
                    this.typeSwitch.innerElement.querySelector(
                        "input.useprefix"
                    ) as HTMLInputElement
                ).checked
                    ? true
                    : false
            }
            if (suffixValue) {
                returnObject["suffix"] = suffixValue
            }
            return returnObject
        } else {
            const literalValue = this.fields.literal.value as NodeArray | false
            if (!literalValue) {
                return false
            }
            return {
                literal: literalValue
            }
        }
    }

    check(): boolean {
        return true
    }
}
