"use client";

import useSWR from "swr";
import { useMemo } from "react";
import { StationMap } from "@/components/StationMap";
import { api } from "@/lib/api";
import { readingIssues, STANDARD_RANGES } from "@/lib/status";
import type { Reading } from "@/lib/types";

export default function HomePage() {
  const stationsQuery = useSWR("stations", () => api.stations());
  const readingsQuery = useSWR("latest-readings", () => api.latestReadings(), {
    refreshInterval: 60_000,
  });

  const readingsByStation = useMemo(() => {
    const map = new Map<number, { reading: Reading; issueCount: number }>();
    for (const reading of readingsQuery.data ?? []) {
      map.set(reading.station_id, { reading, issueCount: readingIssues(reading).length });
    }
    return map;
  }, [readingsQuery.data]);

  if (stationsQuery.isLoading) {
    return <div className="flex-1 grid place-items-center text-slate-500 text-sm">Loading stations…</div>;
  }
  if (stationsQuery.error) {
    return (
      <div className="flex-1 grid place-items-center text-red-400 text-sm">
        Failed to load stations. Is the backend running?
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col relative">
      <div className="absolute top-3 left-3 z-10 rounded-md bg-slate-950/90 border border-slate-800 px-3 py-2 text-xs text-slate-300 space-y-1">
        <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" /> Normal</div>
        <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#eab308]" /> 1 issue</div>
        <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" /> 2+ issues</div>
      </div>
      <div className="absolute top-3 right-3 z-10 rounded-md bg-slate-950/90 border border-slate-800 px-3 py-2 text-xs text-slate-300 space-y-1">
        <p className="font-medium text-slate-100 mb-1.5">Standard ranges</p>
        {STANDARD_RANGES.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-4">
            <span>{r.label}</span>
            <span className="text-slate-400">{r.range}</span>
          </div>
        ))}
      </div>
      <StationMap stations={stationsQuery.data ?? []} readingsByStation={readingsByStation} />
    </div>
  );
}
