import { Mark, mergeAttributes } from '@tiptap/core'

const FontSize = Mark.create({
  name: 'fontSize',
  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },
  addAttributes() {
    return {
      size: {
        default: '16px',
        parseHTML: element => element.style.fontSize,
        renderHTML: attributes => {
          return {
            style: `font-size: ${attributes.size}`,
          }
        },
      },
    }
  },
  parseHTML() {
    return [{ style: 'font-size' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
  addCommands() {
    return {
      setFontSize:
        size =>
        ({ chain }) => {
          return chain().setMark(this.name, { size }).run()
        },
    }
  },
})

export default FontSize
