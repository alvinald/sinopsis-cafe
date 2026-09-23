import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateUserSchema } from "@/lib/user-types";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session) {
        return NextResponse.json({ error: "Harap login ulang" }, { status: 401 })
    }

    try {
        const user = await prisma.user.findFirst({
            where: { id },
        })

        console.log(user)
        return NextResponse.json(user)
    } catch {
        return NextResponse.json(
            { error: "Gagal mengambil daftar user" },
            { status: 500 }
        )
    }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: request.headers })

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 })
  }

  // 2. Verifikasi Role Admin (RBAC)
  if (session.user.role !== "admin") {
    console.log("masuk sini")
    return NextResponse.json(
      { message: "Anda tidak diperbolehkan delete user" },
      { status: 403 }
    )
  }

  if (!id) {
    return NextResponse.json(
      { error: "ID user tidak ditemukan" },
      { status: 400 }
    )
  }

  const body = await request.json().catch(() => null)
  const parsed = updateUserSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Input tidak valid" },
      { status: 400 }
    )
  }

  const { name, email, role } = parsed.data

  try {
    const data = await auth.api.adminUpdateUser({
        body: {
            userId: id, // required, The user id which you want to update.
            data: { 
              name,
              email,
              role,
            }, // required, The data to update.
        },
        // This endpoint requires session cookies.
        headers: request.headers,
    });

    
    return NextResponse.json({ message: "User berhasil diupdate", data: data }, { status: 200 })

  } catch (error: any) {
    // 🔍 Tangkap log lengkap di terminal server untuk debugging
    console.error("Detail error dari Better Auth:", error)


    // 1. Ekstrak pesan error dari Better Auth / Database
    const errorMessage = 
      error?.message || 
      error?.body?.message || 
      "Terjadi kesalahan saat mengupdate user"

    // 2. Ekstrak HTTP Status Code (biasanya 400, 404, atau 500)
    const statusCode = typeof error?.status === "number" ? error.status : 500

    // 3. Kembalikan error JSON ke Frontend
    return NextResponse.json(
      {
        error: "Gagal update user",
        message: errorMessage, // 📍 Frontend akan menerima pesan spesifik ini
      },
      { status: statusCode }
    )
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // 1. Verifikasi Session
  const session = await auth.api.getSession({ headers: request.headers })

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 })
  }

  // 2. Verifikasi Role Admin (RBAC)
  if (session.user.role !== "admin") {
    console.log("masuk sini")
    return NextResponse.json(
      { message: "Anda tidak diperbolehkan delete user" },
      { status: 403 }
    )
  }

  // 3. Cegah Admin Menghapus Akun Sendiri
  if (session.user.id === id) {
    return NextResponse.json(
      { message: "Anda tidak dapat menghapus akun Anda sendiri" },
      { status: 400 }
    )
  }

  if (!id) {
    return NextResponse.json(
      { error: "ID user tidak ditemukan" },
      { status: 400 }
    )
  }

  try {
    // 4. Eksekusi Hapus User via Better Auth API
    const res = await auth.api.removeUser({
      body: {
        userId: id,
      },
      headers: request.headers,
    })

    return NextResponse.json(
      { message: "User berhasil dihapus", data: res },
      { status: 200 }
    )
  } catch (error: any) {
    // 🔍 Print error secara detail di Terminal Server
    console.error("❌ Detail Error Delete Server:", error)

    const errorMessage =
      error?.message ||
      (typeof error === "string"
        ? error
        : "Terjadi kesalahan internal pada server")

    const statusCode = typeof error?.status === "number" ? error.status : 500

    return NextResponse.json(
      {
        error: "Gagal delete user",
        message: errorMessage,
      },
      { status: statusCode }
    )
  }
}