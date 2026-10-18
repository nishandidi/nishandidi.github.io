import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'emuhnqj1',
    dataset: 'production',
  },
  project: {
    // Studio is served from https://nishandidi.github.io/admin/
    basePath: '/admin',
  },
  deployment: {
    autoUpdates: false,
  },
})
