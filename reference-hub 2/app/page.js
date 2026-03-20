'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [books, setBooks] = useState([])

  useEffect(() => {
    fetchBooks()
  }, [])

  async function fetchBooks() {
    const { data } = await supabase.from('books').select('*')
    setBooks(data || [])
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-64 border-r p-6">
        <h2 className="font-bold mb-4">BOOKS</h2>
        {books.map(book => (
          <Link key={book.id} href={`/book/${book.id}`}>
            <div className="mb-2 cursor-pointer">{book.title}</div>
          </Link>
        ))}
      </div>

      <div className="flex-1 p-10">
        <div className="flex justify-between mb-8">
          <h1 className="text-2xl font-bold">REFERENCE HUB</h1>
          <Link href="/add-book">ADD BOOK</Link>
        </div>

        <div className="grid grid-cols-4 gap-8">
          {books.map(book => (
            <Link key={book.id} href={`/book/${book.id}`}>
              <div>
                <img src={book.cover_url} />
                <p className="mt-2">{book.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
