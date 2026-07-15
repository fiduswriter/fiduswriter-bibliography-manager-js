import {post, postJson} from "fwtoolkit/network"
import type {
    BibCategory,
    BibDBEntry,
    BiblistResponse,
    DeleteBibEntriesRequest,
    DeleteCategoryRequest,
    IdTranslation,
    SaveCategoriesRequest,
    SaveCategoriesResponse,
    SaveBibEntriesRequest,
    ServerBibItem
} from "../types/biblio.js"

// class for server calls of BibliographyDB.
export class BibliographyDBServerConnector {
    constructor() {}

    getDB(
        lastModified: number,
        numberOfEntries: number,
        localStorageOwnerId: number
    ): Promise<{
        bibCats: BibCategory[]
        bibList: ServerBibItem[] | false
        lastModified: number
        numberOfEntries: number
        userId: number
    }> {
        return postJson("/api/bibliography/biblist/", {
            last_modified: lastModified,
            number_of_entries: numberOfEntries,
            user_id: localStorageOwnerId
        }).then(({json}) => {
            const response = json as BiblistResponse
            return {
                bibCats: response["bib_categories"],
                bibList: response.hasOwnProperty("bib_list")
                    ? (response["bib_list"] as BibDBEntry[]).map(item =>
                          this.serverBibItemToBibDB(item)
                      )
                    : false,
                lastModified: response["last_modified"],
                numberOfEntries: response["number_of_entries"],
                userId: response["user_id"]
            }
        })
    }

    /** Converts a bibliography item as it arrives from the server to a BibDB object.
     * @function serverBibItemToBibDB
     * @param item The bibliography item from the server.
     */
    serverBibItemToBibDB(bibDBEntry: BibDBEntry): ServerBibItem {
        return {
            id: (bibDBEntry as BibDBEntry & {id: number}).id,
            bibDBEntry
        }
    }

    saveBibEntries(
        tmpDB: Record<number, BibDBEntry>,
        isNew: boolean
    ): Promise<IdTranslation[]> {
        return postJson("/api/bibliography/save/", {
            is_new: isNew,
            bibs: tmpDB
        } as SaveBibEntriesRequest & Record<string, unknown>).then(
            ({json}) => (json as {id_translations: IdTranslation[]})["id_translations"]
        )
    }

    saveCategories(cats: SaveCategoriesRequest): Promise<BibCategory[]> {
        return postJson("/api/bibliography/save_category/", cats as unknown as Record<string, unknown>).then(
            ({json}) => {
                return (json as SaveCategoriesResponse).entries
            }
        )
    }

    deleteCategory(ids: number[]): Promise<Response> {
        return post("/api/bibliography/delete_category/", {
            ids
        } as DeleteCategoryRequest & Record<string, unknown>)
    }

    deleteBibEntries(ids: number[]): Promise<Response> {
        return post("/api/bibliography/delete/", {
            ids
        } as DeleteBibEntriesRequest & Record<string, unknown>)
    }
}
