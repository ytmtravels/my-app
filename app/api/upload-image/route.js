// pages/api/upload-image.js
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");
    if (!file) {
      return NextResponse.json(
        { message: "no image found" },
        { success: false },
      );
    }
    const byteData = await file.arrayBuffer();
    const buffer = Buffer.from(byteData);
    const path = `./public/assets/memories/${file.name}`;
    await writeFile(path, buffer);
    return NextResponse.json(
      { message: file.name },
      { success: true },
      { fileName: file.name },
    );
  } catch (error) {
    console.log("server side iumage: ", error);
    NextResponse.json({ error: error }, { status: 500 });
  }
}
