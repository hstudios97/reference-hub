'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AddBook() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [cover, setCover] = useState(null)

  async function handleSubmit() {
    const { data: coverUpload } = await supabase.storage
      .from('book-covers')
      .upload(`${Date.now()}-${cover.name}`, cover)

    const coverUrl = supabase.storage
      .from('book-covers')
      .getPublicUrl(coverUpload.path).data.publicUrl

    await supabase.from('books').insert([{
      title,
      author,
      cover_url: coverUrl
    }])

    alert('Book Added')
  }

  return (
    <div className="p-10 max-w-xl">
      <h1 className="text-2xl mb-6">Add Book</h1>

      <input
        placeholder="Title"
        className="border p-2 w-full mb-4"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Author"
        className="border p-2 w-full mb-4"
        onChange={(e) => setAuthor(e.target.value)}
      />

      <input
        type="file"
        onChange={(e) => setCover(e.target.files[0])}
      />

      <button
        onClick={handleSubmit}
        className="mt-6 border px-6 py-2"
      >
        Save Book
      </button>
    </div>
  )
}
