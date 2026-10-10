"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock, Info } from "lucide-react";
import { gym } from "@/data/gym";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const weekdayToIndex: Record<string, number> = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
};

function toMinutes(time: string | null): number | null {
  if (!time) return null;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

type NowInfo = { dayIndex: number; minutes: number; label: string };

function getNowInTimeZone(timeZone: string): NowInfo {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(new Date());
  const weekday =
    parts.find((part) => part.type === "weekday")?.value ?? "Mon";
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(
    parts.find((part) => part.type === "minute")?.value ?? "0",
  );
  const dayIndex = weekdayToIndex[weekday] ?? 0;
  const minutes = (hour % 24) * 60 + minute;
  const label = `${String(hour % 24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  return { dayIndex, minutes, label };
}

export function Schedule() {
  const { schedule } = gym;
  const [now, setNow] = useState<NowInfo | null>(null);

  const liveStatusEnabled = schedule.openStatusEnabled && !schedule.provisional;

  useEffect(() => {
    if (!liveStatusEnabled) return;
    const update = () => setNow(getNowInTimeZone(schedule.timeZone));
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, [liveStatusEnabled, schedule.timeZone]);

  const isOpenNow = useMemo(() => {
    if (!liveStatusEnabled || !now) return null;
    const today = schedule.days[now.dayIndex];
    if (!today || today.closed) return false;
    const open = toMinutes(today.open);
    const close = toMinutes(today.close);
    if (open === null || close === null) return false;
    return now.minutes >= open && now.minutes < close;
  }, [liveStatusEnabled, now, schedule.days]);

  return (
    <section id="horarios" className="border-b border-white/5 bg-ink py-24">
      <div className="container-page">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <SectionHeading
              eyebrow={schedule.eyebrow}
              title={schedule.title}
              className="max-w-none"
            />
          </Reveal>

          <Reveal delay={0.1}>
            {liveStatusEnabled && isOpenNow !== null ? (
              <Badge
                className={cn(
                  "h-8 gap-2 border-0 px-3 text-sm font-semibold",
                  isOpenNow ? "bg-brand text-white" : "bg-white/10 text-fog",
                )}
              >
                <span
                  className={cn(
                    "size-2 rounded-full",
                    isOpenNow ? "bg-white" : "bg-fog",
                  )}
                  aria-hidden="true"
                />
                {isOpenNow ? "Abierto ahora" : "Cerrado ahora"}
              </Badge>
            ) : (
              <Badge className="h-8 gap-2 border-0 bg-white/10 px-3 text-sm font-medium text-fog">
                <Info className="size-3.5" aria-hidden="true" />
                Horario provisional
              </Badge>
            )}
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-10">
          <div className="overflow-hidden rounded-2xl border border-white/5 bg-carbon">
            <ul>
              {schedule.days.map((day, index) => {
                const isToday = liveStatusEnabled && now?.dayIndex === index;
                return (
                  <li
                    key={day.day}
                    className={cn(
                      "flex items-center justify-between gap-4 px-5 py-4 sm:px-7",
                      index !== schedule.days.length - 1 &&
                        "border-b border-white/5",
                      isToday && "bg-brand/5",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <Clock
                        className={cn(
                          "size-4",
                          isToday ? "text-brand" : "text-fog",
                        )}
                        aria-hidden="true"
                      />
                      <span
                        className={cn(
                          "font-heading text-base font-semibold uppercase tracking-wide",
                          isToday ? "text-foreground" : "text-foreground/85",
                        )}
                      >
                        {day.day}
                      </span>
                      {isToday ? (
                        <span className="text-xs font-medium uppercase tracking-wider text-brand">
                          Hoy
                        </span>
                      ) : null}
                    </span>

                    <span className="text-right">
                      {day.closed ? (
                        <span className="text-sm font-semibold uppercase tracking-wide text-brand">
                          Cerrado
                        </span>
                      ) : (
                        <span className="font-mono text-sm text-foreground/90 sm:text-base">
                          {day.open} – {day.close}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
            {schedule.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
