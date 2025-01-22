//map/page.js
"use client";
import { useState } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";

// Mock data for geotagged photos
const geotaggedPhotos = [
  { id: 1, lat: 40.7128, lng: -74.006, thumbnail: "/placeholder.webp" },
  { id: 2, lat: 34.0522, lng: -118.2437, thumbnail: "/placeholder.webp" },
  { id: 3, lat: 51.5074, lng: -0.1278, thumbnail: "/placeholder.webp" },
];

export default function MapView() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <div className="h-fit">
      <h1 className="text-3xl font-bold mb-4">Photo Map</h1>
      <div className="relative w-full h-[calc(100vh-40vh)] bg-gray-200 rounded-lg overflow-hidden">
        {/* In a real app, you'd integrate with a map library like Mapbox or Google Maps here */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-lg text-gray-500">Map placeholder</p>
        </div>
        {geotaggedPhotos.map((photo) => (
          <div
            key={photo.id}
            className="absolute cursor-pointer"
            style={{
              left: `${((photo.lng + 180) * 100) / 360}%`,
              top: `${((90 - photo.lat) * 100) / 180}%`,
            }}
            onClick={() => setSelectedPhoto(photo.id)}
          >
            <MapPin className="text-blue-500" />
          </div>
        ))}
      </div>
      {selectedPhoto && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg">
          <Image
            src={
              geotaggedPhotos.find((p) => p.id === selectedPhoto)?.thumbnail ||
              "/placeholder.webp"
            }
            alt={`Photo ${selectedPhoto}`}
            width={100}
            height={100}
            className="rounded-md"
          />
        </div>
      )}
    </div>
  );
}
