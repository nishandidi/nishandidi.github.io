import {useDocumentOperation, type DocumentActionComponent, type SanityDocument} from 'sanity'
import {initialContent} from './schemaTypes/initialContent'

// True when the page has no usable content yet (e.g. created before the fields were pre-filled).
function isEmptyPage(doc?: SanityDocument | null): boolean {
  const sections = (doc?.sections as Array<{title?: string}> | undefined) || []
  return !sections.some((s) => s && s.title)
}

// Fills every field with the content the website shipped with. The editor then clicks "Publish".
export const LoadContentAction: DocumentActionComponent = (props) => {
  const {patch} = useDocumentOperation(props.id, props.type)
  if (!isEmptyPage(props.draft || props.published)) return null

  return {
    label: 'Website-Inhalt laden',
    tone: 'primary',
    onHandle: () => {
      patch.execute([{set: initialContent}])
      props.onComplete()
    },
  }
}
