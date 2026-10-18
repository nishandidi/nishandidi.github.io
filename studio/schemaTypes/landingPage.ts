import {defineArrayMember, defineField, defineType} from 'sanity'

const MARK_HINT = 'Mit *Sternchen* markierte Wörter bekommen den grünen Marker, z. B. „Deine Website soll *Kunden bringen.*“'

const text = (name: string, title: string, rows = 3) =>
  defineField({name, title, type: 'text', rows})

const heading = (name = 'title', title = 'Überschrift') =>
  defineField({name, title, type: 'string', description: MARK_HINT})

const eyebrow = () => defineField({name: 'eyebrow', title: 'Kleine Zeile über der Überschrift', type: 'string'})

const bullets = (name = 'bullets', title = 'Häkchen-Liste') =>
  defineField({name, title, type: 'array', of: [defineArrayMember({type: 'string'})]})

// Kept hidden: holds the image URL from the old Onepage site until a new image is uploaded.
const legacyUrl = (name: string) => defineField({name, type: 'url', hidden: true})

export const landingPage = defineType({
  name: 'landingPage',
  title: 'Startseite',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'problem', title: 'Problem'},
    {name: 'stats', title: 'Zahlen'},
    {name: 'services', title: 'Leistungen'},
    {name: 'process', title: 'Ablauf'},
    {name: 'cases', title: 'Fallstudien'},
    {name: 'about', title: 'Über mich'},
    {name: 'testimonials', title: 'Kundenstimmen'},
    {name: 'contact', title: 'Kontakt'},
    {name: 'faq', title: 'FAQ'},
    {name: 'footer', title: 'Footer & SEO'},
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'hero',
      fields: [
        eyebrow(),
        heading(),
        text('lede', 'Einleitung'),
        defineField({name: 'ctaPrimary', title: 'Button (Haupt)', type: 'string'}),
        defineField({name: 'ctaSecondary', title: 'Button (Zweit)', type: 'string'}),
        defineField({name: 'portrait', title: 'Portrait', type: 'image', options: {hotspot: true}}),
        legacyUrl('portraitLegacyUrl'),
      ],
    }),

    defineField({
      name: 'problem',
      title: 'Problem',
      type: 'object',
      group: 'problem',
      fields: [
        eyebrow(),
        heading(),
        text('intro', 'Einleitung'),
        defineField({
          name: 'cards',
          title: 'Karten',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({name: 'title', title: 'Titel', type: 'string'}),
                text('text', 'Text'),
              ],
            }),
          ],
        }),
        defineField({name: 'solutionTitle', title: 'Lösung – Titel', type: 'string'}),
        text('solutionText', 'Lösung – Text', 2),
      ],
    }),

    defineField({
      name: 'stats',
      title: 'Zahlen',
      type: 'object',
      group: 'stats',
      fields: [
        eyebrow(),
        heading(),
        defineField({
          name: 'items',
          title: 'Kennzahlen',
          type: 'array',
          validation: (r) => r.max(3),
          of: [
            defineArrayMember({
              type: 'object',
              preview: {select: {title: 'label', v: 'value', s: 'suffix'}, prepare: ({title, v, s}) => ({title: `${v ?? ''}${s ?? ''}`, subtitle: title})},
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
    }),

    defineField({
      name: 'services',
      title: 'Leistungen',
      type: 'object',
      group: 'services',
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
    }),

    defineField({
      name: 'process',
      title: 'Ablauf',
      type: 'object',
      group: 'process',
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
    }),

    defineField({
      name: 'cases',
      title: 'Fallstudien',
      type: 'object',
      group: 'cases',
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
                defineField({name: 'image', title: 'Bild', type: 'image', options: {hotspot: true}}),
                text('quote', 'Zitat'),
                defineField({name: 'name', title: 'Name', type: 'string'}),
                defineField({name: 'role', title: 'Funktion · Firma · Ort', type: 'string'}),
                defineField({name: 'avatar', title: 'Foto der Person', type: 'image', options: {hotspot: true}}),
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
    }),

    defineField({
      name: 'about',
      title: 'Über mich',
      type: 'object',
      group: 'about',
      fields: [
        eyebrow(),
        heading(),
        defineField({name: 'greeting', title: 'Begrüssung', type: 'string'}),
        text('text', 'Text', 4),
        bullets(),
        defineField({name: 'photo', title: 'Foto', type: 'image', options: {hotspot: true}}),
        defineField({name: 'videoUrl', title: 'Video-Link (YouTube)', type: 'url'}),
        legacyUrl('photoLegacyUrl'),
      ],
    }),

    defineField({
      name: 'testimonials',
      title: 'Kundenstimmen',
      type: 'object',
      group: 'testimonials',
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
                defineField({name: 'avatar', title: 'Foto', type: 'image', options: {hotspot: true}}),
                defineField({name: 'wide', title: 'Breite Karte', type: 'boolean', initialValue: false}),
                legacyUrl('avatarLegacyUrl'),
              ],
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'contact',
      title: 'Kontakt',
      type: 'object',
      group: 'contact',
      fields: [
        eyebrow(),
        heading(),
        text('text', 'Text', 4),
        bullets(),
        defineField({name: 'email', title: 'Anfragen gehen an (E-Mail)', type: 'string'}),
        defineField({name: 'whatsapp', title: 'WhatsApp-Nummer (nur Ziffern, z. B. 41795226224)', type: 'string'}),
      ],
    }),

    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'object',
      group: 'faq',
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
              fields: [
                defineField({name: 'question', title: 'Frage', type: 'string'}),
                text('answer', 'Antwort (Leerzeile = neuer Absatz)', 5),
              ],
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'footer',
      title: 'Footer & SEO',
      type: 'object',
      group: 'footer',
      fields: [
        heading('title', 'Footer-Überschrift'),
        text('text', 'Footer-Text', 2),
        defineField({name: 'responseTime', title: 'Antwortzeit', type: 'string'}),
        defineField({name: 'location', title: 'Standort', type: 'string'}),
        defineField({name: 'seoTitle', title: 'SEO-Titel', type: 'string'}),
        text('seoDescription', 'SEO-Beschreibung', 2),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Startseite'})},
})
