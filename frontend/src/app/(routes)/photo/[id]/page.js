//photo/[id]/page.js
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, MapPin, Calendar } from 'lucide-react'

// This would typically come from a database or API
const getPhoto = async (id) => {
  const photos = {
    '1': { id: '1', src: '/placeholder.webp', alt: 'Beach sunset', date: '2023-07-15', location: 'Malibu, CA', albumId: '1' },
    '2': { id: '2', src: '/placeholder.webp', alt: 'Mountain hike', date: '2023-07-16', location: 'Yosemite, CA', albumId: '1' },
    '3': { id: '3', src: '/placeholder.webp', alt: 'City skyline', date: '2023-07-17', location: 'San Francisco, CA', albumId: '1' },
  }
  return photos[id] || null
}

export default async function PhotoPage({ params }) {
  const photo = await getPhoto(params.id)

  if (!photo) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href={`/album/${photo.albumId}`}>
        <Button variant="outline" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Album
        </Button>
      </Link>
      <div className="flex flex-col items-center">
        <div className="relative">
          <Image
            src={photo.src || "/placeholder.webp"}
            alt={photo.alt}
            width={1200}
            height={800}
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
          <Button variant="outline" className="absolute top-1/2 left-4 transform -translate-y-1/2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <Button variant="outline" className="absolute top-1/2 right-4 transform -translate-y-1/2">
            <ArrowRight className="h-6 w-6" />
          </Button>
        </div>
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-semibold mb-2">{photo.alt}</h2>
          <p className="flex items-center justify-center text-gray-600 mb-1">
            <Calendar className="mr-2 h-4 w-4" /> {photo.date}
          </p>
          <p className="flex items-center justify-center text-gray-600">
            <MapPin className="mr-2 h-4 w-4" /> {photo.location}
          </p>
        </div>
      </div>
    </div>
  )
}

