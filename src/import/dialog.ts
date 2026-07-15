import {
    Dialog,
    activateWait,
    addAlert,
    deactivateWait
} from "fwtoolkit"
import type {DialogButtonSpec} from "fwtoolkit/dialog"
import {importBibFileTemplate} from "./templates.js"
import type {BibliographyApp, BibDBCollection} from "../types/biblio.js"

/** First step of the bibliography file import. Creates a dialog box to specify upload file.
 * Supports multiple formats: BibTeX/BibLaTeX, CSL-JSON, RIS, EndNote, Citavi, NBIB, ODT/DOCX citations.
 */

export class BibliographyFileImportDialog {
    bibDB: BibDBCollection
    addToListCall: (ids: number[]) => void
    tmpDB: boolean
    app: BibliographyApp

    constructor(
        bibDB: BibDBCollection,
        addToListCall: (ids: number[]) => void,
        app: BibliographyApp
    ) {
        this.bibDB = bibDB
        this.addToListCall = addToListCall
        this.tmpDB = false
        this.app = app
    }

    init(): void {
        if (this.app.isOffline()) {
            addAlert(
                "info",
                gettext(
                    "You are currently offline. Please try again when you are back online."
                )
            )
            return
        }
        const buttons: DialogButtonSpec[] = [
            {
                text: gettext("Import"),
                classes: "fw-dark submit-import",
                click: () => {
                    const bibFiles = (document.getElementById(
                        "bib-uploader"
                    ) as HTMLInputElement | null)?.files
                    if (!bibFiles || 0 === bibFiles.length) {
                        return false
                    }
                    const bibFile = bibFiles[0]
                    if (10485760 < bibFile.size) {
                        return false
                    }
                    if (this.app.isOffline()) {
                        addAlert(
                            "info",
                            gettext(
                                "You are currently offline. Please try again when you are back online."
                            )
                        )
                        dialog.close()
                        return false
                    }
                    activateWait()
                    const reader = new window.FileReader()
                    reader.onload = event => {
                        import("./bibliography_import.js").then(
                            ({BibliographyImporter}) => {
                                const importer = new BibliographyImporter(
                                    (event.target as FileReader).result as string,
                                    this.bibDB,
                                    this.addToListCall,
                                    () => deactivateWait()
                                )
                                importer.init()
                            }
                        )
                    }
                    reader.readAsText(bibFile)
                    dialog.close()
                    return false
                }
            },
            {
                type: "cancel"
            }
        ]
        const dialog = new Dialog({
            id: "importbibtex",
            title: gettext("Import a bibliography"),
            body: importBibFileTemplate(),
            height: 200,
            buttons
        })
        dialog.open()
        const uploader = document.getElementById("bib-uploader")
        if (uploader) {
            uploader.addEventListener("change", () => {
                const input = uploader as HTMLInputElement
                const label = document.getElementById("import-bib-name")
                if (label) {
                    label.innerHTML = input.value.replace(/C:\\fakepath\\/i, "")
                }
            })
        }
        const importBtn = document.getElementById("import-bib-btn")
        if (importBtn) {
            importBtn.addEventListener("click", () => {
                const input = document.getElementById("bib-uploader")
                if (input) {
                    input.click()
                }
            })
        }
    }
}
