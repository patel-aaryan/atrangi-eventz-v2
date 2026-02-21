import { r2 } from "@atrangi/infra/r2";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import type { GalleryImage } from "@atrangi/types";

const BUCKET_NAME = "atrangi-eventz";
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

if (!R2_PUBLIC_URL) {
  throw new Error("R2_PUBLIC_URL environment variable is not set");
}

/**
 * R2 Storage Service - Handles all Cloudflare R2 operations
 *
 * Expected bucket structure per event:
 * event-slug/
 *   ├── title.jpg     (Hero/banner image - displayed at top)
 *   ├── image1.jpg    (Gallery image 1)
 *   ├── image2.jpg    (Gallery image 2)
 *   └── imageX.jpg    (Gallery image X)
 */
class R2Service {
  /**
   * List all images in a folder (event slug)
   * Returns array of image URLs for the event gallery
   * Images are sorted numerically (image1, image2, ..., image10, image11)
   */
  async listEventImages(eventSlug: string): Promise<GalleryImage[]> {
    try {
      console.log(`🗂️ [R2] Listing images for event: ${eventSlug}`);

      const command = new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: `${eventSlug}/`,
      });

      const response = await r2.send(command);

      if (!response.Contents || response.Contents.length === 0) {
        console.log(`📭 [R2] No images found for event: ${eventSlug}`);
        return [];
      }

      // Filter for image files and map to public URLs
      const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".gif",
        ".avif",
      ];

      const images: GalleryImage[] = response.Contents.filter((object) => {
        if (!object.Key) return false;
        const lowerKey = object.Key.toLowerCase();
        // Filter out banner images
        if (lowerKey.includes("banner")) return false;
        return imageExtensions.some((ext) => lowerKey.endsWith(ext));
      }).map((object) => {
        const key = object.Key!;
        const name = key.split("/").pop() || key;
        return {
          key,
          url: `${R2_PUBLIC_URL}/${key}`,
          name: name.replace(/\.[^/.]+$/, ""), // Remove extension for display name
        };
      });

      console.log(
        `✅ [R2] Found ${images.length} images for event: ${eventSlug}`,
      );
      return images;
    } catch (error) {
      console.error(`❌ [R2] Error listing images for ${eventSlug}:`, error);
      throw error;
    }
  }

  /**
   * Get the banner image for an event
   * Looks for a file named 'title' in the event folder
   */
  async getEventBanner(eventSlug: string): Promise<string | null> {
    try {
      const images = await this.listEventImages(eventSlug);
      const banner = images.find((img) =>
        img.name.toLowerCase().includes("title"),
      );
      return banner?.url || null;
    } catch (error) {
      console.error(`❌ [R2] Error getting banner for ${eventSlug}:`, error);
      return null;
    }
  }
}

export const r2Service = new R2Service();
