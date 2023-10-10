import { NextResponse } from "next/server";

const BASE_URL = "https://api.mapbox.com/search/searchbox/v1/suggest?q=";
const GEO_CODING = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
export async function POST(req) {
  const { source } = await req.json();
  const res = await fetch(
    BASE_URL +
      source +
      "&language=en&limit=6&session_token=" +
      process.env.MAPBOX_SESSION_TOKEN +
      "&access_token=" +
      process.env.MAPBOX_ACCESS_TOKEN,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const searchResult = await res.json();
  return NextResponse.json({ data: searchResult });
}
