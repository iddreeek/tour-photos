'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useEffect } from 'react'

const RecentPhotos = () => {
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) {
      const onWheel = (e) => {
        if (e.deltaY == 0) return
        e.preventDefault()
        el.scrollTo({
          left: el.scrollLeft + e.deltaY,
          behavior: 'smooth'
        })
      }
      el.addEventListener('wheel', onWheel)
      return () => el.removeEventListener('wheel', onWheel)
    }
  }, [])

  return (
    <div ref={scrollRef} className="flex overflow-x-auto space-x-4 pb-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
        <Link href={`/photos/${id}`} key={id} className="flex-shrink-0">
          <Image
            src={`/placeholder.webp`}
            alt={`Recent photo ${id}`}
            width={150}
            height={150}
            className="rounded-md"
          />
        </Link>
      ))}
    </div>
  )
}

export default RecentPhotos

