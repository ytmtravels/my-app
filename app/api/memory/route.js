import { connectMongoDB } from "@/lib/mongodb";
import myMemories from "@/models/myMemories";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { ...data } = await req.json();
    await connectMongoDB();
    await myMemories.create({
      userId: data.userId,
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
    return NextResponse.json({ message: "memory saved." }, { status: 200 });
  } catch (error) {
    console.log("memory: ", error);
    return NextResponse.json(
      { message: "An error occurred while memory saved." },
      { status: 500 },
    );
  }
}

// get all memories

export async function GET(req) {
  await connectMongoDB();
  try {
    const { searchParams } = new URL(req.url);
    const userID = searchParams.get("userId");
    console.log("memory by user id: ", userID);
    const memories = await myMemories
      .find({ userId: userID })
      .sort({ _id: -1 });

    const uniqueCountries = await myMemories
      .find({ userId: userID })
      .distinct("country");

    const CountryCount = uniqueCountries.length;

    const uniqueCity = await myMemories
      .find({ userId: userID })
      .distinct("city");

    const cityCount = uniqueCity.length;

    console.log("server myMemories count: ", {
      CountryCount,
      uniqueCountries,
      cityCount,
      uniqueCity,
    });
    console.log("server myMemories: ", memories);
    return NextResponse.json({ memories, CountryCount, cityCount });
  } catch (error) {
    console.log("error: ", error);
    NextResponse.json({ error: error }, { status: 500 }, { success: false });
  }
}

// delete memories
export async function DELETE(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    await connectMongoDB();
    await myMemories.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "your memory deleted" },
      { status: 200 },
    );
  } catch (error) {
    NextResponse.json({ message: "something went wrong" }, { status: 500 });
  }
}
