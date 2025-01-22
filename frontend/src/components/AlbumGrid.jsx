"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function AlbumGrid() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    // In a real app, you'd fetch this data from an API
    setAlbums([
      {
        id: "1",
        title: "Summer Vacation 2023",
        coverImage: "/placeholder.webp",
        photoCount: 42,
      },
      {
        id: "2",
        title: "City Tour",
        coverImage: "/placeholder.webp",
        photoCount: 28,
      },
      {
        id: "3",
        title: "Romantic Date Night",
        coverImage: "/placeholder.webp",
        photoCount: 15,
      },
    ]);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {albums.map((album) => (
        <Link href={`/album/${album.id}`} key={album.id}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-4">
              <Image
                src={album.coverImage || "/placeholder.svg"}
                alt={album.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <h2 className="text-lg font-semibold mb-1">{album.title}</h2>
              <p className="text-sm text-gray-600">{album.photoCount} photos</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
