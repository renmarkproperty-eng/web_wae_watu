import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json(
      { success: false, message: "Akses ditolak" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Tidak ada file yang dipilih" },
        { status: 400 }
      );
    }

    // Limit maximum upload size to prevent database bloating (e.g. 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Ukuran file terlalu besar. Maksimal 5MB untuk konversi Base64 langsung ke database.",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Opsi B: Konversi file biner langsung menjadi Base64 Data URI (BLOB)
    // Tanpa menyimpan file ke folder uploads di disk.
    const mimeType = file.type || "image/jpeg";
    const base64String = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64String}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      mode: "base64",
      size: file.size,
    });
  } catch (error) {
    console.error("[Upload API] Error converting image to Base64:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memproses gambar ke Base64" },
      { status: 500 }
    );
  }
}
