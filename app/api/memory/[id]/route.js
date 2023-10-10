import { connectMongoDB } from "@/lib/mongodb";
import myMemories from "@/models/myMemories";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { ...data } = await request.json();
    await connectMongoDB();
    await myMemories.findByIdAndUpdate(id, {
      imgUrl: data.imgUrl,
      address: data.address,
      full_address: data.full_address,
      city: data.city,
      country: data.country,
      latitude: data.latitude,
      longitude: data.longitude,
      sDate: data.sDate,
      eDate: data.eDate,
      mod: data.mod,
      description: data.description,
    });
    return NextResponse.json(
      { message: "Your memory updated" },
      { status: 200 },
    );
  } catch (error) {
    console.log("update memory:", error);
  }
}

export async function GET(request, { params }) {
  const { id } = params;
  await connectMongoDB();
  const memory = await myMemories.find({ _id: id });
  return NextResponse.json({ memory }, { status: 200 });
}
