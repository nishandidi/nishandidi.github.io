import {defineArrayMember, defineField, defineType} from 'sanity'
import {blockTypes} from './blocks'
import {initialContent} from './initialContent'

export const landingPage = defineType({
  name: 'landingPage',
  title: 'Startseite',
  type: 'document',
  groups: [
    {name: 'page', title: 'Seite (Bausteine)', default: true},
    {name: 'settings', title: 'Kontakt, Footer & SEO'},
  ],
  // Pre-fills the page with the current website content the first time it is opened.
  initialValue: initialContent,
  fields: [
    defineField({
      name: 'sections',
      title: 'Abschnitte',
      description: 'Abschnitte hinzufügen, löschen, duplizieren oder per Drag & Drop verschieben. Klick auf einen Abschnitt, um die Texte zu bearbeiten.',
      type: 'array',
      group: 'page',
      of: blockTypes.map((b) => defineArrayMember({type: b.name})),
      options: {insertMenu: {views: [{name: 'list'}]}},
    }),
    defineField({
      name: 'settings',
      title: 'Kontakt, Footer & SEO',
      type: 'object',
      group: 'settings',
      fields: [
        defineField({name: 'email', title: 'Anfragen gehen an (E-Mail)', type: 'string'}),
        defineField({name: 'whatsapp', title: 'WhatsApp-Nummer (nur Ziffern, z. B. 41795226224)', type: 'string'}),
        defineField({name: 'footerTitle', title: 'Footer-Überschrift', type: 'string', description: 'Wörter in *Sternchen* werden hervorgehoben.'}),
        defineField({name: 'footerText', title: 'Footer-Text', type: 'text', rows: 2}),
        defineField({name: 'responseTime', title: 'Antwortzeit', type: 'string'}),
        defineField({name: 'location', title: 'Standort', type: 'string'}),
        defineField({name: 'seoTitle', title: 'SEO-Titel (Browser-Tab & Google)', type: 'string'}),
        defineField({name: 'seoDescription', title: 'SEO-Beschreibung (Google)', type: 'text', rows: 2}),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Startseite'})},
})
