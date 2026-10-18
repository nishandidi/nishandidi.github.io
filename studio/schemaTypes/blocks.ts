import {defineArrayMember, defineField, defineType} from 'sanity'

const MARK_HINT = 'Tipp: Wörter in *Sternchen* bekommen den grünen Marker, z. B. „Deine Website soll *Kunden bringen.*“'

const text = (name: string, title: string, rows = 3) => defineField({name, title, type: 'text', rows})
const heading = (name = 'title', title = 'Überschrift') => defineField({name, title, type: 'string', description: MARK_HINT})
const eyebrow = () => defineField({name: 'eyebrow', title: 'Kleine Zeile über der Überschrift', type: 'string'})
const bullets = (name = 'bullets', title = 'Häkchen-Liste') =>
  defineField({name, title, type: 'array', of: [defineArrayMember({type: 'string'})]})
const image = (name: string, title: string) => defineField({name, title, type: 'image', options: {hotspot: true}})
// Holds the image URL from the old Onepage site until a new image is uploaded.
const legacyUrl = (name: string) => defineField({name, type: 'url', hidden: true})

// Every block shows its heading in the list, so the page structure reads at a glance.
const blockPreview = (label: string) => ({
  select: {title: 'title'},
  prepare: ({title}: {title?: string}) => ({title: label, subtitle: title ? title.replace(/\*/g, '') : ''}),
})

export const hero = defineType({
  name: 'hero',
  title: 'Hero (Kopfbereich)',
  type: 'object',
  fields: [
    eyebrow(),
    heading(),
    text('lede', 'Einleitung'),
    defineField({name: 'ctaPrimary', title: 'Button (Haupt)', type: 'string'}),
    defineField({name: 'ctaSecondary', title: 'Button (Zweit)', type: 'string'}),
    image('portrait', 'Portrait'),
    legacyUrl('portraitLegacyUrl'),
  ],
  preview: blockPreview('Hero'),
})

export const problem = defineType({
  name: 'problem',
  title: 'Problem + 3 Karten',
  type: 'object',
  fields: [
    eyebrow(),
    heading(),
    text('intro', 'Einleitung'),
    defineField({
      name: 'cards',
      title: 'Karten',
      type: 'array',
      of: [defineArrayMember({type: 'object', fields: [defineField({name: 'title', title: 'Titel', type: 'string'}), text('text', 'Text')]})],
    }),
    defineField({name: 'solutionTitle', title: 'Lösung – Titel', type: 'string'}),
    text('solutionText', 'Lösung – Text', 2),
  ],
  preview: blockPreview('Problem'),
})

export const stats = defineType({
  name: 'stats',
  title: 'Zahlen (dunkles Band)',
  type: 'object',
  fields: [
    eyebrow(),
    heading(),
    defineField({
      name: 'items',
      title: 'Kennzahlen (max. 3)',
      type: 'array',
      validation: (r) => r.max(3),
      of: [
        defineArrayMember({
          type: 'object',
          preview: {
            select: {label: 'label', p: 'prefix', v: 'value', s: 'suffix'},
            prepare: ({label, p, v, s}) => ({title: [p, v, s].filter((x) => x !== undefined && x !== null).join(' '), subtitle: label}),
          },
          fields: [
            defineField({name: 'label', title: 'Beschriftung', type: 'string'}),
            defineField({name: 'prefix', title: 'Vor der Zahl (z. B. CHF)', type: 'string'}),
            defineField({name: 'value', title: 'Zahl', type: 'number'}),
            defineField({name: 'suffix', title: 'Nach der Zahl (z. B. +, k+, h)', type: 'string'}),
            text('text', 'Text', 2),
          ],
        }),
      ],
    }),
  ],
  preview: blockPreview('Zahlen'),
})

export const services = defineType({
  name: 'services',
  title: 'Leistungen',
  type: 'object',
  fields: [
    eyebrow(),
    heading(),
    text('lede', 'Einleitung', 2),
    defineField({
      name: 'items',
      title: 'Leistungen',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'tag', title: 'Kurzer Nutzen', type: 'string'}),
            defineField({name: 'title', title: 'Titel', type: 'string'}),
            text('text', 'Text'),
          ],
        }),
      ],
    }),
  ],
  preview: blockPreview('Leistungen'),
})

export const process = defineType({
  name: 'process',
  title: 'Ablauf (Schritte)',
  type: 'object',
  fields: [
    eyebrow(),
    heading(),
    text('lede', 'Einleitung', 2),
    defineField({
      name: 'steps',
      title: 'Schritte',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'when', title: 'Zeitpunkt (z. B. Woche 1)', type: 'string'}),
            defineField({name: 'title', title: 'Titel', type: 'string'}),
            text('text', 'Text', 2),
            text('result', 'Ergebnis', 2),
          ],
        }),
      ],
    }),
  ],
  preview: blockPreview('Ablauf'),
})

export const cases = defineType({
  name: 'cases',
  title: 'Fallstudien',
  type: 'object',
  fields: [
    eyebrow(),
    heading(),
    defineField({
      name: 'items',
      title: 'Fallstudien',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          preview: {select: {title: 'name', subtitle: 'number', media: 'image'}},
          fields: [
            defineField({
              name: 'category',
              title: 'Kategorie',
              type: 'string',
              options: {list: [{title: 'Mehr Kunden', value: 'kunden'}, {title: 'Mehr Fachkräfte', value: 'fachkraefte'}], layout: 'radio'},
              initialValue: 'kunden',
            }),
            image('image', 'Bild'),
            text('quote', 'Zitat'),
            defineField({name: 'name', title: 'Name', type: 'string'}),
            defineField({name: 'role', title: 'Funktion · Firma · Ort', type: 'string'}),
            image('avatar', 'Foto der Person'),
            defineField({name: 'number', title: 'Grosse Zahl (z. B. CHF 50k+)', type: 'string'}),
            text('numberText', 'Text zur Zahl', 2),
            defineField({name: 'buttonLabel', title: 'Button', type: 'string'}),
            legacyUrl('imageLegacyUrl'),
            legacyUrl('avatarLegacyUrl'),
          ],
        }),
      ],
    }),
  ],
  preview: blockPreview('Fallstudien'),
})

export const about = defineType({
  name: 'about',
  title: 'Über mich',
  type: 'object',
  fields: [
    eyebrow(),
    heading(),
    defineField({name: 'greeting', title: 'Begrüssung', type: 'string'}),
    text('text', 'Text', 4),
    bullets(),
    image('photo', 'Foto'),
    defineField({name: 'videoUrl', title: 'Video-Link (YouTube)', type: 'url'}),
    legacyUrl('photoLegacyUrl'),
  ],
  preview: blockPreview('Über mich'),
})

export const testimonials = defineType({
  name: 'testimonials',
  title: 'Kundenstimmen',
  type: 'object',
  fields: [
    eyebrow(),
    heading(),
    text('lede', 'Einleitung', 2),
    defineField({
      name: 'items',
      title: 'Stimmen',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          preview: {select: {title: 'name', subtitle: 'company', media: 'avatar'}},
          fields: [
            defineField({name: 'kpi', title: 'Kennzahl (z. B. 100+)', type: 'string'}),
            defineField({name: 'kpiLabel', title: 'Kennzahl – Beschriftung', type: 'string'}),
            text('quote', 'Zitat'),
            defineField({name: 'name', title: 'Name', type: 'string'}),
            defineField({name: 'company', title: 'Firma · Quelle', type: 'string'}),
            image('avatar', 'Foto'),
            defineField({name: 'wide', title: 'Breite Karte', type: 'boolean', initialValue: false}),
            legacyUrl('avatarLegacyUrl'),
          ],
        }),
      ],
    }),
  ],
  preview: blockPreview('Kundenstimmen'),
})

export const contact = defineType({
  name: 'contact',
  title: 'Kontakt-Formular',
  type: 'object',
  fields: [eyebrow(), heading(), text('text', 'Text', 4), bullets()],
  preview: blockPreview('Kontakt-Formular'),
})

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'object',
  fields: [
    eyebrow(),
    heading(),
    text('lede', 'Einleitung', 2),
    defineField({
      name: 'items',
      title: 'Fragen',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          preview: {select: {title: 'question'}},
          fields: [defineField({name: 'question', title: 'Frage', type: 'string'}), text('answer', 'Antwort (Leerzeile = neuer Absatz)', 5)],
        }),
      ],
    }),
  ],
  preview: blockPreview('FAQ'),
})

export const textBlock = defineType({
  name: 'textBlock',
  title: 'Freier Textabschnitt',
  type: 'object',
  fields: [
    eyebrow(),
    heading(),
    text('body', 'Text (Leerzeile = neuer Absatz)', 8),
    defineField({name: 'buttonLabel', title: 'Button (optional)', type: 'string'}),
    defineField({name: 'dark', title: 'Dunkler Hintergrund', type: 'boolean', initialValue: false}),
  ],
  preview: blockPreview('Freier Text'),
})

export const blockTypes = [hero, problem, stats, services, process, cases, about, testimonials, contact, faq, textBlock]
