'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AddBook() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [cover, setCover] = useState(null)
  const [images, setImages] = useState([])

  async function handleSubmit() {

    // Upload cover
    const { data: coverUpload } = await supabase.storage
      .from('book-covers')
      .upload(`${Date.now()}-${cover.name}`, cover)

    const coverUrl = supabase.storage
      .from('book-covers')
      .getPublicUrl(coverUpload.path).data.publicUrl

    // Insert book
    const { data: book } = await supabase
      .from('books')
      .insert([{ title, author, cover_url: coverUrl }])
      .select()

    const bookId = book[0].id

    // Upload images
    for (let img of images) {

      const { data: upload } = await supabase.storage
        .from('book-images')
        .upload(`${Date.now()}-${img.file.name}`, img.file)

      const imageUrl = supabase.storage
        .from('book-images')
        .getPublicUrl(upload.path).data.publicUrl

      await supabase.from('images').insert([{
        book_id: bookId,
        image_url: imageUrl,
        descriptors: img.descriptors.split(',')
      }])
    }

    alert("Book Added")
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

      <input type="file" onChange={(e) => setCover(e.target.files[0])} />

      <input
        type="file"
        multiple
        className="mt-4"
        onChange={(e) => {
          const files = Array.from(e.target.files).map(file => ({
            file,
            descriptors: ''
          }))
          setImages(files)
        }}
      />

      {images.map((img, i) => (
        <input
          key={i}
          placeholder="Descriptors (comma separated)"
          className="border p-2 w-full mt-2"
          onChange={(e) => {
            const updated = [...images]
            updated[i].descriptors = e.target.value
            setImages(updated)
          }}
        />
      ))}

      <button
        onClick={handleSubmit}
        className="mt-6 border px-6 py-2"
      >
        Save Book
      </button>

    </div>
  )
}
