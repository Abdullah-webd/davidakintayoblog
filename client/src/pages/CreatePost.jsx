import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import FontSize from '../components/FontSize'
import Link from '@tiptap/extension-link'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import TextAlign from '@tiptap/extension-text-align'
import Youtube from '@tiptap/extension-youtube'
import Image from '@tiptap/extension-image'
import './createpost.css'
import { useState } from 'react'
import { TextInput, Select, FileInput, Alert, Button } from 'flowbite-react'
import {
  FaBold, FaItalic, FaListUl, FaListOl, FaQuoteLeft, FaLink, FaTable, FaTrash, FaImage, FaYoutube,
} from 'react-icons/fa'
import {
  TbH1, TbH2, TbH3, TbAlignLeft, TbAlignCenter, TbAlignRight,
} from 'react-icons/tb'
import { RiFontSize } from 'react-icons/ri'
import { supabase } from '../supabase.js'
import { useNavigate } from 'react-router-dom'

const CreatePost = () => {
  const navigate = useNavigate()
  const [rows, setRows] = useState(2)
  const [cols, setCols] = useState(2)
  const [formData, setFormData] = useState({})
  const [imageUrl, setImageUrl] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFormUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const localPreview = URL.createObjectURL(file)
    setImageUrl(localPreview)

    const filePath = `public/${file.name}-${Date.now()}`
    const { data, error } = await supabase.storage
      .from('posts-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: false })

    if (error) {
      setError(error.message)
      console.error('Error uploading image:', error)
    } else {
      const { data: publicUrlData } = supabase.storage.from('posts-images').getPublicUrl(filePath)
      if (publicUrlData?.publicUrl) {
        setImageUrl(publicUrlData.publicUrl)
        setSuccess('Image uploaded successfully!')
        console.log('Uploaded Image URL:', publicUrlData.publicUrl)
      }
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontSize,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell.extend({
        renderHTML({ HTMLAttributes }) {
          return ['td', { ...HTMLAttributes, style: 'min-width:120px; word-wrap:break-word; white-space:normal; max-width:150px; padding:5px; text-align:center; overflow-wrap:break-word;' }, 0]
        },
      }),
      Youtube.configure({ width: 240,
        height: 80, HTMLAttributes: { class: 'mx-auto my-4 rounded shadow-lgr' } }),
      Image.configure({ inline: false, HTMLAttributes: { class: 'mx-auto my-4 rounded shadow-lg' } }),
    ],
    content: '<p>Write your blog content here...</p>',
  })

  const isActive = (action) => editor?.isActive(action)
  const toggleButton = (onClick, icon, isActiveCheck) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded ${isActiveCheck ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`}
    >
      {icon}
    </button>
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    const content = editor?.getHTML() || ''
    const title = formData.title || ''
    const category = formData.category || 'uncategorized'
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') || ''
    const image = imageUrl || 'default-image-url'

    if (!content.trim() || content === '<p></p>') {
      alert('Post content cannot be empty!')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/post/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, content, category, slug, image }),
      })
      const result = await response.json()
      if (response.ok) {
        setSuccess('Post created successfully!')
        navigate(`/posts/${result.slug}`)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-post-container p-3 max-w-5xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput type="text" placeholder="Title" required className="flex-1" onChange={e => setFormData({ ...formData, title: e.target.value })} />
          <Select required onChange={e => setFormData({ ...formData, category: e.target.value })}>
            <option value="uncategorized">Select Category</option>
            <option value="government">Law & Government</option>
            <option value="technology">Technology</option>
            <option value="health">Health</option>
            <option value="lifestyle">Lifestyle</option>
          </Select>
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-6 mt-4">
          <FileInput type="file" accept="image/*" required onChange={handleFormUpload} />
          <Button type="button" color="dark" outline size="sm">Upload Image</Button>
        </div>
        {imageUrl && <img src={imageUrl} alt="Preview" className="w-full mx-auto mt-4 rounded shadow-md" />}

        <div className="flex flex-wrap gap-2 mt-4">
          {toggleButton(() => editor.chain().focus().toggleBold().run(), <FaBold />, isActive('bold'))}
          {toggleButton(() => editor.chain().focus().toggleItalic().run(), <FaItalic />, isActive('italic'))}
          {toggleButton(() => editor.chain().focus().toggleHeading({ level: 1 }).run(), <TbH1 />, isActive('heading', { level: 1 }))}
          {toggleButton(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), <TbH2 />, isActive('heading', { level: 2 }))}
          {toggleButton(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), <TbH3 />, isActive('heading', { level: 3 }))}
          {toggleButton(() => editor.chain().focus().toggleBulletList().run(), <FaListUl />, isActive('bulletList'))}
          {toggleButton(() => editor.chain().focus().toggleOrderedList().run(), <FaListOl />, isActive('orderedList'))}
          {toggleButton(() => editor.chain().focus().toggleBlockquote().run(), <FaQuoteLeft />, isActive('blockquote'))}
          {toggleButton(() => editor.chain().focus().setTextAlign('left').run(), <TbAlignLeft />, isActive({ textAlign: 'left' }))}
          {toggleButton(() => editor.chain().focus().setTextAlign('center').run(), <TbAlignCenter />, isActive({ textAlign: 'center' }))}
          {toggleButton(() => editor.chain().focus().setTextAlign('right').run(), <TbAlignRight />, isActive({ textAlign: 'right' }))}
          {toggleButton(() => {
            const url = prompt('Paste image URL')
            if (url) editor.chain().focus().setImage({ src: url }).run()
          }, <FaImage />, false)}
          {toggleButton(() => {
            const url = prompt('Paste YouTube URL')
            if (url) editor.chain().focus().setYoutubeVideo({ src: url, width:310, height:250,alignItem:'center' }).run()
          }, <FaYoutube />, false)}
          {toggleButton(() => editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run(), <FaTable />, false)}
          {toggleButton(() => editor.chain().focus().deleteTable().run(), <FaTrash />, false)}
        </div>

        <div className="border border-gray-300 rounded-md p-3 mt-2 min-h-[300px] dark:border-gray-600">
          <EditorContent editor={editor} />
        </div>

        <Button type="submit" disabled={loading} className="bg-[#0A3150] text-white hover:bg-gradient-to-l w-full">
          {loading ? 'Publishing...' : 'Publish'}
        </Button>
        {error && <Alert color="failure" className="mt-5">{error}</Alert>}
        {success && <Alert color="success" className="mt-5">{success}</Alert>}
      </form>
    </div>
  )
}

export default CreatePost
