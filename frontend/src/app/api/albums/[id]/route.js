import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request, { params }) {
  const id = (await params).id;

  try {
    const sql = neon(process.env.DATABASE_URL);

    // Fetch the album details, including the cover photo
    const [album] = await sql`
      SELECT id, title, description, is_public, created_at, user_id, cover_photo_id
      FROM albums
      WHERE id = ${id}
    `;

    // If the album doesn't exist
    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    // Fetch the photos associated with the album through the junction table
    const photos = await sql`
      SELECT p.id, p.title, p.description, p.file_url, p.created_at, p.thumbnail_url, p.original_filename, p.file_size, p.width, p.height, p.content_type
      FROM photos p
      JOIN album_photos ap ON p.id = ap.photo_id
      WHERE ap.album_id = ${id}
      ORDER BY p.created_at DESC
    `;

    // Fetch tags for each photo
    const tags = await sql`
      SELECT pt.photo_id, t.name
      FROM photo_tags pt
      JOIN tags t ON pt.tag_id = t.id
      WHERE pt.photo_id IN (SELECT p.id FROM photos p JOIN album_photos ap ON p.id = ap.photo_id WHERE ap.album_id = ${id})
    `;

    // Fetch locations for each photo
    const locations = await sql`
      SELECT pl.photo_id, l.name, l.latitude, l.longitude
      FROM photo_locations pl
      JOIN locations l ON pl.location_id = l.id
      WHERE pl.photo_id IN (SELECT p.id FROM photos p JOIN album_photos ap ON p.id = ap.photo_id WHERE ap.album_id = ${id})
    `;

    // Attach the tags and locations to photos
    const photosWithDetails = photos.map(photo => {
      // Fetch associated tags
      const photoTags = tags.filter(tag => tag.photo_id === photo.id).map(tag => tag.name);
      const photoLocations = locations.filter(location => location.photo_id === photo.id).map(location => ({
        name: location.name,
        latitude: location.latitude,
        longitude: location.longitude,
      }));

      return {
        ...photo,
        tags: photoTags,
        locations: photoLocations,
      };
    });

    // Return the album and associated photos
    return NextResponse.json({ ...album, photos: photosWithDetails });
  } catch (error) {
    console.error("Error fetching album:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
