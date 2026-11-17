import fs from "fs/promises";
import path from "path";

const CONTENT_FILE_PATH = path.join(process.cwd(), "data", "content.json");

export interface CMSContent {
  admin: {
    username: string;
    password: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  about: {
    title: string;
    subtitle: string;
    story: string;
    conservation: {
      title: string;
      description: string;
      stats: Array<{ label: string; value: string }>;
    };
  };
  facilities: Array<{
    id: string;
    title: string;
    category: string;
    description: string;
    image: string;
  }>;
  experiences: Array<{
    id: string;
    title: string;
    duration: string;
    description: string;
    image: string;
    price: string;
  }>;
  gallery: Array<{
    id: string;
    title: string;
    category: string;
    image: string;
  }>;
  contact: {
    address: string;
    whatsapp: string;
    phone: string;
    email: string;
    checkin: string;
    checkout: string;
    instagram: string;
    maps_embed: string;
  };
}

export async function getCMSContent(): Promise<CMSContent> {
  try {
    const raw = await fs.readFile(CONTENT_FILE_PATH, "utf-8");
    return JSON.parse(raw) as CMSContent;
  } catch (error) {
    console.error("[CMS] Error reading content.json, falling back:", error);
    throw error;
  }
}

export async function updateCMSContent(updated: Partial<CMSContent>): Promise<CMSContent> {
  const current = await getCMSContent();
  const merged: CMSContent = {
    ...current,
    ...updated,
    admin: updated.admin ? { ...current.admin, ...updated.admin } : current.admin,
  };

  await fs.writeFile(CONTENT_FILE_PATH, JSON.stringify(merged, null, 2), "utf-8");
  return merged;
}
