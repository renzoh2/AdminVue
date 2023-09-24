<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Heading from '@tiptap/extension-heading';
import Placeholder from '@tiptap/extension-placeholder';

const editor = useEditor({
  extensions: [
    Document,
    Paragraph,
    Text,
    Heading.configure({
      levels: [1, 2, 3]
    }),
    Placeholder.configure({
      placeholder: 'Write Product Description'
    })
  ],
  editorProps: {
    attributes: {
      class: 'border border-gray-300 rounded p-2'
    }
  }
});
</script>

<template>
  <editor-content :editor="editor" />
</template>
