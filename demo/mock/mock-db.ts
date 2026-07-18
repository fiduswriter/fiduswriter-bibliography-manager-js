import type {
    BibCategory,
    BibDBEntry,
    BibDBCollection,
    IdTranslation,
    SaveCategoriesRequest
} from "../../src/types/biblio.js"

/**
 * Minimal in-memory mock of BibDBCollection for standalone demos and tests.
 * Stores bibliography entries and categories in memory with stub persistence.
 */
export class MockBibDB implements BibDBCollection {
    db: Record<number, BibDBEntry>
    cats: BibCategory[]
    private nextId: number

    constructor() {
        this.db = {}
        this.cats = []
        this.nextId = 1
    }

    /** Add a bibliography entry programmatically (not part of BibDBCollection). */
    addEntry(entry: BibDBEntry): number {
        const id = this.nextId++
        this.db[id] = {...entry, id}
        return id
    }

    async saveBibEntries(
        tmpDB: Record<number, BibDBEntry>,
        isNew: boolean
    ): Promise<IdTranslation[]> {
        const translations: IdTranslation[] = []
        for (const [tmpId, entry] of Object.entries(tmpDB)) {
            const numTmpId = Number(tmpId)
            if (isNew) {
                const newId = this.nextId++
                this.db[newId] = {...entry, id: newId}
                translations.push([numTmpId, newId])
            } else {
                this.db[numTmpId] = {...entry, id: numTmpId}
                translations.push([numTmpId, numTmpId])
            }
        }
        return translations
    }

    async saveCategories(cats: SaveCategoriesRequest): Promise<BibCategory[]> {
        for (let i = 0; i < cats.ids.length; i++) {
            const id = cats.ids[i]
            const title = cats.titles[i]
            if (id) {
                const existing = this.cats.find(c => c.id === id)
                if (existing) {
                    existing.category_title = title
                }
            } else {
                this.cats.push({
                    id: Math.max(0, ...this.cats.map(c => c.id)) + 1,
                    category_title: title
                })
            }
        }
        return [...this.cats]
    }

    async deleteBibEntries(ids: number[]): Promise<number[]> {
        const deleted: number[] = []
        for (const id of ids) {
            if (id in this.db) {
                delete this.db[id]
                deleted.push(id)
            }
        }
        return deleted
    }
}

/** Mock BibPlugin tuple matching the BibPlugin type. */
export type MockBibPlugin = [string, Record<string, {
    new (overview: unknown): {init: () => Promise<void>}
    name: string
}>]

/** Empty plugins array matching the default. */
export const mockBibPlugins: MockBibPlugin[] = []
