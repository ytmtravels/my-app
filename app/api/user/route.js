import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, image, provider } = await req.json();
    await connectMongoDB();
    await User.create({
      name: name,
      email: email,
      image: image,
      provider: provider,
    });
    return NextResponse.json({ message: "User Registered." }, { status: 200 });
  } catch (error) {
    console.log(error);
  }
}
