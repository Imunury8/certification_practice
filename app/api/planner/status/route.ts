import { isPlannerCloudConfigured } from "../../../../lib/plannerCloudStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(): Response {
  return Response.json(
    { configured: isPlannerCloudConfigured() },
    { headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } },
  );
}
