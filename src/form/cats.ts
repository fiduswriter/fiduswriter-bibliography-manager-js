import {CheckableList} from "fwtoolkit"
import type {BibCategory} from "../types/biblio.js"

export class CatsForm {
    dom: HTMLElement
    checkableList: CheckableList

    constructor(
        dom: HTMLElement,
        initialValue: (string | number)[] = [],
        options: BibCategory[] = []
    ) {
        this.dom = dom
        this.checkableList = new CheckableList({
            dom,
            options: options.map(option => ({
                id: option.id,
                label: option.category_title
            })),
            initialValue,
            multiple: true
        })
    }

    init(): void {
        // CheckableList is already rendered by the constructor.
    }

    get value(): (string | number)[] {
        return this.checkableList.value
    }
}
