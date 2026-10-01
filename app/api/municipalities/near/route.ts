import { data } from "@/data/data";
import { NextResponse } from "next/server";
import { haversineDistance } from "@/lib/utils";

function badRequest(message: string) {
  return NextResponse.json({ error: "Bad request", message }, { status: 400 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");
  const radiusParam = searchParams.get("radius");

  if (latParam === null || lngParam === null || radiusParam === null) {
    return badRequest("lat, lng and radius are all required.");
  }

  const userLat = Number(latParam);
  const userLng = Number(lngParam);
  const radius = Number(radiusParam);

  if (latParam === "" || !Number.isFinite(userLat) || Math.abs(userLat) > 90) {
    return badRequest("lat must be a number between -90 and 90.");
  }
  if (lngParam === "" || !Number.isFinite(userLng) || Math.abs(userLng) > 180) {
    return badRequest("lng must be a number between -180 and 180.");
  }
  if (radiusParam === "" || !Number.isFinite(radius) || radius <= 0) {
    return badRequest("radius must be a number greater than 0 (in km).");
  }

  const results = data
    .map((item) => ({
      ...item,
      Delegations: item.Delegations.filter(
        (delegation) =>
          haversineDistance(
            userLat,
            userLng,
            delegation.Latitude,
            delegation.Longitude,
          ) <= radius,
      ),
    }))
    .filter((item) => item.Delegations.length > 0);

  return NextResponse.json(results);
}
