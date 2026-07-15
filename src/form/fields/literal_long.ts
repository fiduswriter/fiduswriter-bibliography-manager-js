import {toggleMark} from "prosemirror-commands"

import {InlineInput, icon} from "fwtoolkit"

import {longLitSchema} from "../../schema/literal_long.js"

export class LiteralLongFieldForm {
    inlineInput: InlineInput

    constructor(dom: HTMLElement, initialValue: Record<string, unknown>[] = []) {
        this.inlineInput = new InlineInput(dom, {
            schema: longLitSchema,
            nodeType: "longliteral",
            initialValue,
            tools: [
                {
                    command: toggleMark(longLitSchema.marks.strong),
                    dom: icon("strong", gettext("Strong"))
                },
                {
                    command: toggleMark(longLitSchema.marks.em),
                    dom: icon("em", gettext("Emphasis"))
                },
                {
                    command: toggleMark(longLitSchema.marks.smallcaps),
                    dom: icon("smallcaps", gettext("Small caps"))
                },
                {
                    command: toggleMark(longLitSchema.marks.sub),
                    dom: icon("sub", gettext("Subscript₊"))
                },
                {
                    command: toggleMark(longLitSchema.marks.sup),
                    dom: icon("sup", gettext("Supscript²"))
                }
            ]
        })
    }

    init(): void {}

    get value(): Record<string, unknown>[] | false {
        return this.inlineInput.value
    }

    check(): boolean {
        return this.inlineInput.check()
    }
}
