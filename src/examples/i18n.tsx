import React from 'react'
import { MDXEditor, MDXEditorI18n } from '..'
import { ALL_PLUGINS } from './_boilerplate'
import i18nExampleMarkdown from './assets/i18n.md?raw'
import './dark-editor.css'

// Quick and rough translations, purely for demonstration purposes
const slovenianLocale: MDXEditorI18n = {
  toolbar: {
    blockTypeSelect: {
      selectBlockTypeTooltip: 'Izberi vrsto bloka',
      placeholder: 'Vrsta bloka'
    },

    blockTypes: {
      paragraph: 'Odstavek',
      heading: 'Naslov',
      quote: 'Citat'
    },

    undo: 'Razveljavi',
    redo: 'Ponovno uveljavi',

    bold: 'Krepko',
    removeBold: 'Odstrani krepko',
    italic: 'Poševno',
    removeItalic: 'Odstrani poševno',
    underline: 'Podčrtano',
    removeUnderline: 'Odstrani podčrtano',
    strikethrough: 'Prečrtano',
    removeStrikethrough: 'Odstrani prečrtano',

    inlineCode: 'Oblika v vrstici',
    removeInlineCode: 'Odstrani obliko v vrstici',

    bulletedList: 'Seznam s pikami',
    removeBulletedList: 'Odstrani seznam s pikami',
    numberedList: 'Oštevilčen seznam',
    removeNumberedList: 'Odstrani oštevilčen seznam',
    checkList: 'Seznam s kljukicami',
    removeCheckList: 'Odstrani seznam s kljukicami',

    link: 'Ustvari povezavo',
    image: 'Vstavi sliko',
    table: 'Vstavi tabelo',

    codeBlock: 'Vstavi blok kode',
    sandpack: 'Vstavi Sandpack',
    admonition: 'Vstavi opozorilo',
    insertFrontmatter: 'Vstavi predmaterijo',
    editFrontmatter: 'Uredi predmaterijo',
    thematicBreak: 'Vstavi tematski prelom',

    richText: 'Obogateni besedilni način',
    diffMode: 'Način razlike',
    source: 'Vir',
    sourceMode: 'Virni način'
  },

  codeBlock: {
    selectLanguage: 'Izberi jezik bloka kode',
    language: 'Jezik bloka kode',
    text: 'besedilo'
  },

  createLink: {
    url: 'URL',
    urlPlaceholder: 'Vnesi URL',
    saveTooltip: 'Shrani povezavo',
    cancelTooltip: 'Prekliči povezavo',
    title: 'Naslov'
  },

  linkPreview: {
    open: 'Odpri $url v novem oknu',
    edit: 'Uredi povezavo',
    copyToClipboard: 'Kopiraj povezavo',
    copied: 'Kopirano!',
    remove: 'Odstrani povezavo'
  },

  uploadImage: {
    uploadInstructions: 'Naloži sliko iz svoje naprave',
    addViaUrlInstructions: 'Ali dodaj sliko prek URL-ja:',
    autocompletePlaceholder: 'Izberi ali prilepi povezavo slike',
    alt: 'Alternativno besedilo',
    title: 'Naslov',
    editImage: 'Uredi sliko'
  },

  table: {
    insertRowAbove: 'Vstavi vrstico nad to',
    insertRowBelow: 'Vstavi vrstico pod to',
    deleteRow: 'Izbriši to vrstico',

    insertColumnLeft: 'Vstavi stolpec levo od tega',
    insertColumnRight: 'Vstavi stolpec desno od tega',
    deleteColumn: 'Izbriši ta stolpec',

    textAlignment: 'Poravnava besedila',
    alignLeft: 'Poravnaj levo',
    alignCenter: 'Poravnaj na sredino',
    alignRight: 'Poravnaj desno',

    deleteTable: 'Izbriši tabelo',
    columnMenu: 'Meni stolpca',
    rowMenu: 'Meni vrstice'
  },

  editor: {
    placeholder: 'Začnite tipkati svojo vsebino tukaj'
  },

  sandpack: {
    deleteCodeBlock: 'Izbriši blok kode'
  },

  frontmatterEditor: {
    title: 'Uredi predmaterijo',
    key: 'Ključ',
    value: 'Vrednost',
    addEntry: 'Dodaj vnos'
  },

  admonitions: {
    note: 'Opomba',
    tip: 'Namig',
    danger: 'Nevarnost',
    info: 'Informacija',
    caution: 'Previdnost',

    changeType: 'Spremeni vrsto opozorila',
    placeholder: 'Vrsta opozorila'
  },

  dialogControls: {
    save: 'Shrani',
    cancel: 'Prekliči'
  }
}

export const SlovenianLocale = () => {
  return <MDXEditor markdown={i18nExampleMarkdown} plugins={ALL_PLUGINS} i18n={slovenianLocale} />
}
