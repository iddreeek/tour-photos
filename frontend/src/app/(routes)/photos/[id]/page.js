//photos/[id]/page.js
'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { useToast } from '@/hooks/use-toast'
import { Share2, Download, Trash } from 'lucide-react'

export default function PhotoDetailPage({ params }) {
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [caption, setCaption] = useState('')
  const { toast } = useToast()

  const handleSave = () => {
    // In a real app, you'd send the edited photo data to your backend
    console.log('Saving edited photo:', { brightness, contrast, caption })
    toast({
      title: 'Photo Saved',
      description: 'Your edited photo has been saved successfully.',
    })
  }

  const handleShare = () => {
    // Implement sharing functionality
    toast({
      title: 'Photo Shared',
      description: 'Your photo has been shared successfully.',
    })
  }

  const handleDownload = () => {
    // Implement download functionality
    toast({
      title: 'Photo Downloaded',
      description: 'Your photo has been downloaded successfully.',
    })
  }

  const handleDelete = () => {
    // Implement delete functionality
    toast({
      title: 'Photo Deleted',
      description: 'Your photo has been deleted successfully.',
      variant: 'destructive',
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Photo Details</h1>
      <div className="mb-6">
        <Image
          src={`/placeholder.webp`}
          alt={`Photo`}
          width={600}
          height={400}
          className="rounded-lg"
          style={{
            filter: `brightness(${brightness}%) contrast(${contrast}%)`,
          }}
        />
      </div>
      <div className="space-y-4 mb-6">
        <div>
          <Label htmlFor="brightness">Brightness</Label>
          <Slider
            id="brightness"
            min={0}
            max={200}
            step={1}
            value={[brightness]}
            onValueChange={(value) => setBrightness(value[0])}
          />
        </div>
        <div>
          <Label htmlFor="contrast">Contrast</Label>
          <Slider
            id="contrast"
            min={0}
            max={200}
            step={1}
            value={[contrast]}
            onValueChange={(value) => setContrast(value[0])}
          />
        </div>
        <div>
          <Label htmlFor="caption">Caption</Label>
          <Input
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add a caption to your photo"
          />
        </div>
      </div>
      <div className="flex justify-between">
        <Button onClick={handleSave}>Save Changes</Button>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

