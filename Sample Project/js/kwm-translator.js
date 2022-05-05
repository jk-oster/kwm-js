'use strict';

/**********************************************************************
 *     Translation-Engine for KWM-JS
 *     Just add your ressource key:"value" Pairs down by.
 *
 *     @param languages - Give me an array of languages supported e.q. ['de','en'],
 *     the fist value is the default language
 *
 *     @author Jakob Osterberger - 2022-03-28
 **********************************************************************/
export default class KWM_Translator {
    constructor(languages = []) {
        if (languages.length === 0) return console.error('Error: No languages specified');
        for (const lang of languages) {
            this[lang] = KWM_Resources[lang];
        }
        this.currentLanguage = languages[0];
    }

    translate(key, language = this.currentLanguage) {
        if (!this[language]) return ` --Missing translation: non_existing_language "${language}"-- `;
        if (!this[language][key]) return ` --Missing translation: "${key}"-- `;
        return this[language][key];
    }
}

/****************************
 *
 *         RESOURCES
 *
 ***************************/
const KWM_Resources = {
    "de": {
        welcome_message: "Willkommen bei kwmJS!",
        click_me: "Klick mich!",
        our_shop: "Unser Haustierchen-Shop",
        whoops: "Upsi, da ist wohl was schief gegangen!",
        contact: "Kontakt",
        description: "Beschreibung",
        price: "Preis",
        back_home: "Zurück zur Startseite",
    },
    "en": {
        welcome_message: "Welcome to kwmJS!",
        click_me: "Click me!",
        our_shop: "Our Pet-Shop",
        whoops: "Whoopsy Daisy! Something went wrong!",
        contact: "Contact",
        description: "Description",
        price : "Price",
        back_home: "Back to Homepage",
    }
};