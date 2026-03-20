'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    fetchBooks()
  }, [])

  async function fetchBooks() {
    const { data } = await supabase.from('books').select('*')
    setBooks(data || [])
  }

  async function handleSearch() {
    const { data } = await supabase
      .from('images')
      .select('*')
      .contains('descriptors', [search])

    setResults(data || [])
  }

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <div className="w-72 border-r p-6">
        <h2 className="text-sm font-bold mb-4">BOOKS</h2>
        {books.map(book => (
          <Link key={book.id} href={`/book/${book.id}`}>
            <div className="mb-2 cursor-pointer hover:opacity-60">
              {book.title}
            </div>
          </Link>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 p-10">

        <div className="flex justify-between mb-8">
          <h1 className="text-2xl font-bold">REFERENCE HUB</h1>
          <Link href="/add-book">ADD BOOK</Link>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search keyword..."
            className="border p-2 w-64"
          />
          <button
            onClick={handleSearch}
            className="ml-2 border px-4 py-2"
          >
            Search
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 gap-10">
          {books.map(book => (
            <Link key={book.id} href={`/book/${book.id}`}>
              <div>
                <img src={book.cover_url} />
                <p className="mt-2 text-sm">{book.title}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 font-bold">Results</h2>
            <div className="grid grid-cols-4 gap-6">
              {results.map(img => (
                <img key={img.id} src={img.image_url} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
