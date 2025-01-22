//page.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Album } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RecentPhotos from "@/components/RecentPhotos";

export default function Home() {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAlbums = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/albums/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAlbums(data);
        } else {
          throw new Error("Failed to fetch albums");
        }
      } catch (error) {
        console.error("Error fetching albums:", error);
        toast({
          title: "Error",
          description: "Failed to load albums. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbums();
  }, [toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8 pb-16">
      <h1 className="text-3xl font-bold">Welcome to PhotoAdventure</h1>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Recent Photos</h2>
          <Link href="/upload">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Upload Photo
            </Button>
          </Link>
        </div>
        <RecentPhotos />
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Your Albums</h2>
          <Link href="/albums/create">
            <Button variant="outline">
              <Album className="mr-2 h-4 w-4" /> Create Album
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {albums.map((album) => (
            <Link href={`/albums/${album.id}`} key={album.id}>
              <Card>
                <CardContent className="p-4">
                  <Image
                    src={album.cover_photo_url || `/placeholder.webp`}
                    alt={album.title}
                    width={150}
                    height={150}
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                  <h3 className="font-semibold">{album.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(album.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
