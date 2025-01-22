'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function CreateAlbum() {
  const [title, setTitle] = useState('')
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, you'd send this data to your backend
    console.log('Creating album:', title)
    // Redirect to home page after creation
    router.push('/')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Album</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <Label htmlFor="title">Album Title</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Create Album</Button>
      </form>
    </div>
  )
}

