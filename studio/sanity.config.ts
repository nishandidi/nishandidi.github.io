import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

const SINGLETON = 'landingPage'

export default defineConfig({
  name: 'default',
  title: 'Nishan Didi – Website',
  basePath: '/admin',

  projectId: 'emuhnqj1',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Inhalt')
          .items([
            S.listItem()
              .title('Startseite')
              .id(SINGLETON)
              .child(S.document().schemaType(SINGLETON).documentId(SINGLETON).title('Startseite')),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // The landing page is a singleton: hide it from "create new document".
    templates: (templates) => templates.filter(({schemaType}) => schemaType !== SINGLETON),
  },

  document: {
    actions: (actions, {schemaType}) =>
      schemaType === SINGLETON
        ? actions.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : actions,
  },
})
