export interface TerraProperty {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  photos: string[];
}

export interface TerraVilla {
  id: number;
  name: string;
  slug: string;
  status: "available" | "sold_out" | string;
  capacity: number;
  price_per_night: number;
  description: string;
  features: string[];
  image_url: string;
  photos: string[];
  available_units: number;
  total_units: number;
}

export interface TerraPropertyResponse {
  status: string;
  property: TerraProperty;
  villas: TerraVilla[];
}

export interface TerraAdditionalProduct {
  id: number;
  property_id: number;
  name: string;
  description: string;
  price: string | number;
  status: string;
  image_url: string;
  unit: string;
  includes_breakfast?: boolean;
}

export interface TerraGalleryItem {
  url: string;
  title: string;
  category: string;
}

const DEFAULT_TERRA_URL = "https://terraprime.id";
const DEFAULT_SLUG = "wae-watu-hotel-resort";

export function getTerraBaseUrl(): string {
  return process.env.NEXT_PUBLIC_TERRA_API_URL || DEFAULT_TERRA_URL;
}

export function getWaeWatuSlug(): string {
  return process.env.NEXT_PUBLIC_TERRA_PROPERTY_SLUG || DEFAULT_SLUG;
}

export function cleanHtmlText(raw: string | null | undefined): string {
  if (!raw) return "";
  return raw
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/<[^>]*>/g, "")
    .trim();
}

/**
 * Build direct booking URL to Terra Web
 * Directs directly to Wae Watu detail page where Terra Prime automatically
 * defaults check-in to today and check-out to tomorrow.
 */
export function getTerraBookingUrl(slug: string = getWaeWatuSlug()): string {
  const baseUrl = getTerraBaseUrl();
  return `${baseUrl}/detail/hotel/${slug}`;
}

/**
 * Enriches villas with exact per-room photos, descriptions, and facilities from Terra's live inventory
 */
async function enrichVillasWithRoomDetails(
  slug: string,
  villas: TerraVilla[]
): Promise<TerraVilla[]> {
  try {
    const bookingUrl = getTerraBookingUrl(slug);
    const pageRes = await fetch(bookingUrl, {
      next: { revalidate: 60 },
    });

    if (!pageRes.ok) return villas;

    const html = await pageRes.text();
    const regex = /data-images='(\[.*?\])'/g;
    let match;
    const roomGalleries: Array<
      Array<{
        url: string;
        unit_name: string;
        desc: string;
        facilities: string[];
      }>
    > = [];

    while ((match = regex.exec(html)) !== null) {
      try {
        const parsed = JSON.parse(match[1]);
        if (Array.isArray(parsed) && parsed.length > 0) {
          roomGalleries.push(parsed);
        }
      } catch {
        // ignore JSON parse error
      }
    }

    if (roomGalleries.length === 0) return villas;

    return villas.map((villa) => {
      // Find matching room gallery by unit ID in URL path (e.g. /galleries/270/)
      const matchedSet =
        roomGalleries.find((set) =>
          set.some(
            (item) => item.url && item.url.includes(`/galleries/${villa.id}/`)
          )
        ) ||
        roomGalleries.find((set) =>
          set.some((item) => item.unit_name === villa.name)
        );

      if (matchedSet && matchedSet.length > 0) {
        const first = matchedSet[0];
        const allUrls = matchedSet.map((m) => m.url).filter(Boolean);
        return {
          ...villa,
          image_url: first.url || villa.image_url,
          photos: allUrls.length > 0 ? allUrls : villa.photos,
          description: cleanHtmlText(first.desc) || villa.description,
          features:
            first.facilities && first.facilities.length > 0
              ? first.facilities
              : villa.features,
        };
      }

      return villa;
    });
  } catch (error) {
    console.error("[Terra API] Error enriching per-room details:", error);
    return villas;
  }
}

/**
 * Fetch property data & villas for Wae Watu from Terra PMS
 */
export async function getWaeWatuPropertyData(
  slug: string = getWaeWatuSlug()
): Promise<TerraPropertyResponse | null> {
  const baseUrl = getTerraBaseUrl();
  const url = `${baseUrl}/api/property-data/${encodeURIComponent(slug)}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 }, // Revalidate cache every 60 seconds (ISR)
    });

    if (!res.ok) {
      console.error(`[Terra API] Failed to fetch property (${res.status}): ${url}`);
      return null;
    }

    const data: TerraPropertyResponse = await res.json();

    if (data && data.villas && data.villas.length > 0) {
      // Enrich with per-room photos and specific room descriptions
      data.villas = await enrichVillasWithRoomDetails(slug, data.villas);
    }

    return data;
  } catch (error) {
    console.error("[Terra API] Error connecting to Terra PMS backend:", error);
    return null;
  }
}

/**
 * Fetch additional products (experiences/activities/rentals) for Wae Watu from Terra PMS
 */
export async function getTerraAdditionalProducts(
  propertyId: number = 17
): Promise<TerraAdditionalProduct[]> {
  const baseUrl = getTerraBaseUrl();
  const url = `${baseUrl}/booking/additional-products/${propertyId}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`[Terra API] Failed to fetch additional products (${res.status}): ${url}`);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("[Terra API] Error fetching additional products from Terra:", error);
    return [];
  }
}

/**
 * Fetch all gallery photos from Terra Prime (property header mosaic & room galleries)
 */
export async function getTerraGallery(
  slug: string = getWaeWatuSlug()
): Promise<{
  mosaic: string[];
  items: TerraGalleryItem[];
}> {
  const propertyData = await getWaeWatuPropertyData(slug);
  const items: TerraGalleryItem[] = [];
  const seenUrls = new Set<string>();

  // 1. Property mosaic photos from Terra Prime detail header
  const mosaicPhotos: string[] = propertyData?.property?.photos || [];
  const propertyTitles = [
    "Overwater Villas & Phinisi at Twilight",
    "Grand Open-Air Lobby & Fountain",
    "Sunset Ocean Boardwalk",
    "Aerial Sanctuary & Coral Reef Panorama",
  ];

  mosaicPhotos.forEach((url, i) => {
    if (url && !seenUrls.has(url)) {
      seenUrls.add(url);
      items.push({
        url,
        title: propertyTitles[i] || `Resort View #${i + 1}`,
        category: "Resort & Landscape",
      });
    }
  });

  // 2. Per-room gallery photos from Terra Prime availability data
  if (propertyData?.villas) {
    propertyData.villas.forEach((villa) => {
      if (Array.isArray(villa.photos)) {
        villa.photos.forEach((photoUrl, pIdx) => {
          if (photoUrl && !seenUrls.has(photoUrl)) {
            seenUrls.add(photoUrl);
            items.push({
              url: photoUrl,
              title: `${villa.name} — Photo #${pIdx + 1}`,
              category: "Rooms & Suites",
            });
          }
        });
      }
    });
  }

  return {
    mosaic: mosaicPhotos,
    items,
  };
}
