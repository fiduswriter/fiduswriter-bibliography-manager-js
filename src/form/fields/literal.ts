import {toggleMark} from "prosemirror-commands"

import {InlineInput, icon} from "fwtoolkit"

import {litSchema} from "../../schema/literal.js"

export class LiteralFieldForm {
    inlineInput: InlineInput

    constructor(
        dom: HTMLElement,
        initialValue: Record<string, unknown>[] = [],
        placeHolder: string | false = false
    ) {
        this.inlineInput = new InlineInput(dom, {
            schema: litSchema,
            nodeType: "literal",
            initialValue,
            placeholder: placeHolder || undefined,
            tools: [
                {
                    command: toggleMark(litSchema.marks.strong),
                    dom: icon("strong", gettext("Strong"))
                },
                {
                    command: toggleMark(litSchema.marks.em),
                    dom: icon("em", gettext("Emphasis"))
                },
                {
                    command: toggleMark(litSchema.marks.smallcaps),
                    dom: icon("smallcaps", gettext("Small caps"))
                },
                {
                    command: toggleMark(litSchema.marks.sub),
                    dom: icon("sub", gettext("Subscript₊"))
                },
                {
                    command: toggleMark(litSchema.marks.sup),
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
