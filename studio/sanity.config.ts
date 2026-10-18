import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {LoadContentAction} from './loadContentAction'

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
    actions: (actions, context) => {
      if (context.schemaType !== SINGLETON) return actions
      const allowed = actions.filter(({action}) => action && ['publish', 'discardChanges', 'restore', 'delete'].includes(action))
      // "Website-Inhalt laden" only shows (as the main button) while the page is still empty.
      return [LoadContentAction, ...allowed]
    },
  },
})
