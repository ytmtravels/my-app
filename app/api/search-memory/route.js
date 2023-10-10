import { connectMongoDB } from "@/lib/mongodb";
import myMemories from "@/models/myMemories";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectMongoDB();
  try {
    const { searchParams } = new URL(req.url);
    const userID = searchParams.get("userId");
    const query = searchParams.get("q");
    console.log("memory by user id: ", userID);
    console.log("memory by user query: ", query);
    const memories = await myMemories.find({
      userId: userID,
      $or: [
        { address: { $regex: query, $options: "i" } },
        { full_address: { $regex: query, $options: "i" } },
      ],
    });

    // const uniqueCountries = await myMemories
    //   .find({ userId: userID })
    //   .distinct("country");

    // const CountryCount = uniqueCountries.length;

    // const uniqueCity = await myMemories
    //   .find({ userId: userID })
    //   .distinct("city");

    // const cityCount = uniqueCity.length;

    // console.log("server myMemories count: ", {
    //   CountryCount,
    //   uniqueCountries,
    //   cityCount,
    //   uniqueCity,
    // });
    // console.log("server myMemories: ", memories);
    return NextResponse.json({ memories });
  } catch (error) {
    console.log("error: ", error);
    NextResponse.json({ error: error }, { status: 500 }, { success: false });
  }
}
