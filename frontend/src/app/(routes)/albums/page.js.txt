"use client";

import { useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload } from "lucide-react";
import { useEffect, useState } from "react";

export default function AlbumPage() {
  const searchParams = useSearchParams();

  const albumId = searchParams.get("album");

  const [album, setAlbum] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlbum = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const response = await fetch(`/api/albums/${albumId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch album");
        }
        const data = await response.json();
        setAlbum(data);
      } catch (error) {
        console.error("Error fetching album:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbum();
  }, [albumId]);

  console.log(album);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Albums
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{album ? album.title : <p>loading</p>}</h1>
        <Button>
          <Upload className="mr-2 h-4 w-4" /> Upload Photos
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {album ? album.photos.map((photo) => (
          <Link href={`/photos/${photo.id}`} key={photo.id}>
            <div className="relative group">
              <Image
                src={photo.file_url || "/placeholder.svg"}
                alt={photo.title}
                width={600}
                height={400}
                className="w-full h-64 object-cover rounded-md transition-opacity duration-300 group-hover:opacity-75"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-sm">
                  {new Date(photo.created_at).toLocaleDateString()}
                </p>
                <p className="text-xs">{photo.title}</p>
              </div>
            </div>
          </Link>
        )) : null}
      </div>
    </div>
  );
}
