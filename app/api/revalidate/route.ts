import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * On-demand cache refresh. The admin dashboard calls this after saving so
 * public pages pick up content changes immediately instead of waiting for the
 * ISR window. `revalidatePath("/", "layout")` refreshes every route under the
 * root layout.
 *
 * Optional protection: set REVALIDATE_SECRET (server) and the admin sends it
 * as ?secret=… (NEXT_PUBLIC_REVALIDATE_SECRET). If unset, the endpoint is open
 * — it only busts caches, so the risk is minimal.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (secret) {
    const provided = new URL(request.url).searchParams.get("secret");
    if (provided !== secret) {
      return NextResponse.json({ revalidated: false, message: "Invalid secret." }, { status: 401 });
    }
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: true });
}
