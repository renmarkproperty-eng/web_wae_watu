import { NextResponse } from "next/server";
import { getCMSContent } from "@/lib/cms";
import { setAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const cms = await getCMSContent();

    if (
      username === cms.admin.username &&
      password === cms.admin.password
    ) {
      await setAdminSession(username);
      return NextResponse.json({ success: true, message: "Login berhasil" });
    }

    return NextResponse.json(
      { success: false, message: "Username atau password salah" },
      { status: 401 }
    );
  } catch (error) {
    console.error("[Auth API] Login error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
