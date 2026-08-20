import { getRedis, REPORTS_KEY } from "@/app/lib/kv";
import { isTrainerEmail } from "@/app/lib/trainerAccess";

export const dynamic = "force-dynamic";

// Only "mark as reviewed" today, but PATCH (not PUT) since it's a partial update of one field.
export async function PATCH(request, { params }) {
  const email = request.headers.get("x-user-email");
  if (!isTrainerEmail(email)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const redis = getRedis();
  const existing = await redis.hget(REPORTS_KEY, id);
  if (!existing) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const updated = { ...existing, reviewed: true };
  await redis.hset(REPORTS_KEY, { [id]: updated });
  return Response.json(updated);
}
