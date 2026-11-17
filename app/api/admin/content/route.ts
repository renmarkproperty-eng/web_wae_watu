import { NextResponse } from "next/server";
import { getCMSContent, updateCMSContent } from "@/lib/cms";
import { verifyAdminSession } from "@/lib/auth";

export async function GET() {
  const isAuth = await verifyAdminSession();
  const cms = await getCMSContent();

  // If not admin, hide password
  if (!isAuth) {
    const { admin, ...publicContent } = cms;
    return NextResponse.json({ ...publicContent, admin: { username: admin.username } });
  }

  return NextResponse.json(cms);
}

export async function POST(request: Request) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json(
      { success: false, message: "Akses ditolak. Silakan login terlebih dahulu." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const updated = await updateCMSContent(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[CMS API] Error updating content:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menyimpan konten" },
      { status: 500 }
    );
  }
}
