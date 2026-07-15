import {
    BibFieldTypes,
    BibTypes,
    getFieldHelp,
    getFieldTitle,
    getLangidTitle,
    getLocale,
    getOtherOptionTitle,
    getTypeTitle
} from "bibliojson"
import type {Locale} from "bibliojson"
import type {BibFieldType} from "../types/biblio.js"

// Cache for the current locale to avoid repeated lookups
let cachedLocale: Locale | null = null
let cachedLang: string | null = null

function getCachedLocale(): Locale {
    const lang = document.documentElement.lang || "en"
    if (lang !== cachedLang || !cachedLocale) {
        cachedLocale = getLocale(lang)
        cachedLang = lang
    }
    return cachedLocale
}

// Dynamic field title getter that uses bibliojson's i18n
export function getBibFieldTitle(fieldKey: string, bibType: string | null = null): string {
    const locale = getCachedLocale()
    if (bibType && BibTypes[bibType]) {
        return getFieldTitle(locale, bibType, fieldKey)
    }
    // Fallback to generic field title
    const fieldType = BibFieldTypes[fieldKey] as BibFieldType
    if (fieldType && fieldType.title) {
        return fieldType.title
    }
    return fieldKey
}

// Dynamic type title getter
export function getBibTypeTitle(typeKey: string): string {
    const locale = getCachedLocale()
    return getTypeTitle(locale, typeKey)
}

// Dynamic field help getter
export function getBibFieldHelp(fieldKey: string): string | undefined {
    const locale = getCachedLocale()
    return getFieldHelp(locale, fieldKey)
}

// Dynamic option title getter (for editortype, pagination, pubstate, etc.)
export function getBibOptionTitle(optionKey: string): string {
    const locale = getCachedLocale()
    return getOtherOptionTitle(locale, optionKey)
}

// Dynamic langid title getter
export function getBibLangidTitle(langidKey: string): string {
    const locale = getCachedLocale()
    return getLangidTitle(locale, langidKey)
}

// For backward compatibility, create proxy objects that dynamically return translations
// These should be used sparingly - prefer using the function versions above
export const BibFieldTitles = new Proxy(
    {} as Record<string, string>,
    {
        get(_target, prop) {
            return getBibFieldTitle(String(prop))
        }
    }
)

export const BibTypeTitles = new Proxy(
    {} as Record<string, string>,
    {
        get(_target, prop) {
            return getBibTypeTitle(String(prop))
        }
    }
)

export const BibFieldHelp = new Proxy(
    {} as Record<string, string | undefined>,
    {
        get(_target, prop) {
            return getBibFieldHelp(String(prop))
        }
    }
)

export const BibOptionTitles = new Proxy(
    {} as Record<string, string>,
    {
        get(_target, prop) {
            return getBibOptionTitle(String(prop))
        }
    }
)

// Export a function to get all type titles as an object (for templates that need to map all types)
export function getAllTypeTitles(): Record<string, string> {
    const locale = getCachedLocale()
    const titles: Record<string, string> = {}
    Object.keys(BibTypes).forEach(typeKey => {
        titles[typeKey] = getTypeTitle(locale, typeKey)
    })
    return titles
}

// Export a function to get all field help texts
export function getAllFieldHelp(): Record<string, string> {
    const locale = getCachedLocale()
    const help: Record<string, string> = {}
    Object.keys(BibFieldTypes).forEach(fieldKey => {
        const helpText = getFieldHelp(locale, fieldKey)
        if (helpText) {
            help[fieldKey] = helpText
        }
    })
    return help
}
