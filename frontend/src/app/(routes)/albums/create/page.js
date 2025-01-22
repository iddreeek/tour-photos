//albums/create/page.js
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'

export default function CreateAlbum() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/albums/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, is_public: isPublic }),
      })

      if (response.ok) {
        toast({
          title: 'Album Created',
          description: 'Your new album has been created successfully.',
        })
        router.push('/albums')
      } else {
        throw new Error('Failed to create album')
      }
    } catch (error) {
      console.error('Error creating album:', error)
      toast({
        title: 'Error',
        description: 'Failed to create album. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">Create New Album</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Album Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="isPublic"
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
          <Label htmlFor="isPublic">Make this album public</Label>
        </div>
        <Button type="submit" className="w-full">Create Album</Button>
      </form>
    </div>
  )
}

