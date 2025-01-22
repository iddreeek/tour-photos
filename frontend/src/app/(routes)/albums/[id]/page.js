//albums/[id]/page.js
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload } from 'lucide-react';
import UploadModal from "@/components/uploadModal";
import ModMod from "@/components/modmod";

// This would typically come from a database or API
async function getAlbum({ id }) {
  try {
    const response = await fetch(`${process.env.BASE_URL}/api/albums/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch album");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching album:", error);
  }
}

export default async function AlbumPage({ params }) {
  const id = (await params).id;
  const album = await getAlbum({id});

  if (!album) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className=" h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{album.title}</h1>
        <ModMod id={id}/>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {album.photos.map((photo) => (
          <Link href={`/photo/${photo.id}`} key={photo.id}>
            <div className="relative group">
              <Image
                src={photo.file_url || "/placeholder.svg"}
                alt={photo.alt || "Photo"}
                width={600}
                height={400}
                className="w-full h-64 object-cover rounded-md transition-opacity duration-300 group-hover:opacity-75"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-sm">{photo.date}</p>
                <p className="text-xs">{photo.location}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

