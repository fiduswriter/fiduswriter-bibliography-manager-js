import {Schema} from "prosemirror-model"
import {toggleMark} from "prosemirror-commands"

import {InlineInput, icon} from "fwtoolkit"
import {titleSpec} from "bibliojson"

const titleSchema = new Schema(titleSpec)

export class TitleFieldForm {
    inlineInput: InlineInput

    constructor(dom: HTMLElement, initialValue: Record<string, unknown>[]) {
        this.inlineInput = new InlineInput(dom, {
            schema: titleSchema,
            nodeType: "literal",
            initialValue,
            tools: [
                {
                    command: toggleMark(titleSchema.marks.strong),
                    dom: icon("strong", gettext("Strong"))
                },
                {
                    command: toggleMark(titleSchema.marks.em),
                    dom: icon("em", gettext("Emphasis"))
                },
                {
                    command: toggleMark(titleSchema.marks.smallcaps),
                    dom: icon("smallcaps", gettext("Small caps"))
                },
                {
                    command: toggleMark(titleSchema.marks.sub),
                    dom: icon("sub", gettext("Subscript₊"))
                },
                {
                    command: toggleMark(titleSchema.marks.sup),
                    dom: icon("sup", gettext("Supscript²"))
                },
                {
                    command: toggleMark(titleSchema.marks.nocase),
                    dom: icon("nocase", gettext("CasE ProTecT"))
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
