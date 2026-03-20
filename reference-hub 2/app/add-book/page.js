'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function BookPage({ params }) {
  const [images, setImages] = useState([])

  useEffect(() => {
    fetchImages()
  }, [])

  async function fetchImages() {
    const { data } = await supabase
      .from('images')
      .select('*')
      .eq('book_id', params.id)

    setImages(data || [])
  }

  return (
    <div className="p-10">
      <div className="grid grid-cols-4 gap-8">
        {images.map(img => (
          <div key={img.id}>
            <img src={img.image_url} />
            <p className="text-xs mt-2">
              {img.descriptors?.join(', ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
