import {BibliographyFileImportDialog} from "./dialog.js"
export {BibliographyFileImportDialog} from "./dialog.js"
export {BibliographyImporter} from "./bibliography_import.js"

import type {BibliographyApp, BibDBCollection} from "../types/biblio.js"

export function importBibFile(
    bibDB: BibDBCollection,
    addToListCall: (ids: number[]) => void,
    app: BibliographyApp
): void {
    const dialog = new BibliographyFileImportDialog(bibDB, addToListCall, app)
    dialog.init()
}
