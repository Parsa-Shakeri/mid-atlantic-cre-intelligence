import { NextResponse } from "next/server";
import { dashboardDataToCsv } from "@/lib/dashboard-export";
import { parseDashboardFilters } from "@/lib/dashboard-utils";
import { getDashboardData } from "@/lib/data/dashboard";

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const rawParams = Object.fromEntries(searchParams.entries());
  const filters = parseDashboardFilters(rawParams);
  const data = await getDashboardData(filters);
  const csv = dashboardDataToCsv(data);
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, { headers: { "Content-Disposition": `attachment; filename="mid-atlantic-cre-dashboard-${date}.csv"`, "Content-Type": "text/csv; charset=utf-8", "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } });
}
