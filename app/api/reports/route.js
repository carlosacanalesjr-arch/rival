import { getRedis, REPORTS_KEY } from "@/app/lib/kv";
import { isTrainerEmail } from "@/app/lib/trainerAccess";

export const dynamic = "force-dynamic";

const VALID_KINDS = new Set(["event", "deal", "app_feedback"]);

// Reports are stored as a Redis hash (id -> report JSON) rather than one big array blob, so
// concurrent submissions (POST) never race on a read-modify-write of the whole list — each
// submission just sets its own field.
export async function GET(request) {
  const email = request.headers.get("x-user-email");
  if (!isTrainerEmail(email)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const reportsMap = (await getRedis().hgetall(REPORTS_KEY)) || {};
  return Response.json(Object.values(reportsMap));
}

// Open to any user — submitting a report/feedback item has never required being logged in as
// a trainer, and there's no real auth in this app to gate it behind anyway (see trainerAccess.js).
export async function POST(request) {
  const body = await request.json();
  const { kind, itemId = null, itemLabel = null, reason = null, details = null, screenshotUrl = null, reporterEmail = null } = body || {};

  if (!VALID_KINDS.has(kind)) {
    return Response.json({ error: "Invalid kind" }, { status: 400 });
  }

  const report = {
    id: `rp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    kind,
    itemId,
    itemLabel,
    reason,
    details,
    screenshotUrl,
    reporterEmail,
    reviewed: false,
    createdAt: new Date().toISOString(),
  };

  await getRedis().hset(REPORTS_KEY, { [report.id]: report });
  return Response.json(report, { status: 201 });
}
