"use client";

import { useState, useTransition } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { WidgetHeader } from "@/components/widgets/widget-header";
import { Input } from "@/components/ui/input";
import { createQuickNote } from "@/features/notes/actions";
import { formatDateCa } from "@/lib/i18n/dates";
import { t } from "@/lib/i18n/ca";

export function QuickNotesWidget({
  notes,
}: {
  notes: { id: string; content: string; createdAt: Date }[];
}) {
  const [value, setValue] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    startTransition(async () => {
      await createQuickNote(value);
      setValue("");
    });
  }

  return (
    <GlassCard className="col-span-4 row-span-2 lg:col-span-4">
      <WidgetHeader title={t.dashboard.quickNotes} subtitle={t.dashboard.captureFast} />
      <form onSubmit={handleSubmit} className="mb-3">
        <Input
          placeholder={t.dashboard.quickNotesPlaceholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={pending}
          className="h-8 bg-muted/30 text-sm"
        />
      </form>
      <div className="max-h-40 space-y-2 overflow-auto">
        {notes.map((note) => (
          <div
            key={note.id}
            className="rounded-lg border border-border/30 bg-muted/20 px-3 py-2"
          >
            <p className="text-sm">{note.content}</p>
            <p className="mt-1 text-[10px] text-muted-foreground">
              {formatDateCa(new Date(note.createdAt), "d MMM, HH:mm")}
            </p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
