"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Pin,
  Star,
  Plus,
  Trash2,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { parseTags } from "@/types";
import {
  createNote,
  updateNote,
  deleteNote,
} from "@/features/notes/actions";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export type NoteItem = {
  id: string;
  title: string;
  content: string;
  tags: string;
  pinned: boolean;
  favorite: boolean;
  updatedAt: Date;
};

export function NotesView({ notes: initialNotes }: { notes: NoteItem[] }) {
  const router = useRouter();
  const notes = initialNotes;
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    initialNotes[0]?.id ?? null
  );
  const [filter, setFilter] = useState<"all" | "pinned" | "favorite">("all");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return notes.filter((n) => {
      if (filter === "pinned" && !n.pinned) return false;
      if (filter === "favorite" && !n.favorite) return false;
      if (!q) return true;
      const tags = parseTags(n.tags);
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [notes, query, filter]);

  const selected = filtered.find((n) => n.id === selectedId) ?? filtered[0];
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    if (selected) {
      setEditTitle(selected.title);
      setEditContent(selected.content);
    }
  }, [selected?.id, selected?.title, selected?.content]);

  function handleCreate() {
    startTransition(async () => {
      await createNote({
        title: "Untitled",
        content: "",
        tags: ["inbox"],
      });
      router.refresh();
    });
  }

  function handleSave() {
    if (!selected) return;
    startTransition(async () => {
      await updateNote(selected.id, {
        title: editTitle,
        content: editContent,
      });
      router.refresh();
    });
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      <GlassCard className="flex w-80 shrink-0 flex-col p-0" hover={false}>
        <div className="border-b border-border/50 p-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 bg-muted/30 pl-8 text-sm"
            />
          </div>
          <div className="mt-2 flex gap-1">
            {(["all", "pinned", "favorite"] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "secondary" : "ghost"}
                size="xs"
                onClick={() => setFilter(f)}
                className="capitalize"
              >
                {f}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-auto p-2">
          <AnimatePresence>
            {filtered.map((note) => (
              <motion.button
                key={note.id}
                layout
                onClick={() => setSelectedId(note.id)}
                className={cn(
                  "mb-1 flex w-full flex-col rounded-lg px-3 py-2 text-left transition-colors",
                  selected?.id === note.id
                    ? "bg-primary/10"
                    : "hover:bg-muted/40"
                )}
              >
                <div className="flex items-center gap-1">
                  {note.pinned && (
                    <Pin className="h-3 w-3 text-muted-foreground" />
                  )}
                  {note.favorite && (
                    <Star className="h-3 w-3 text-amber-500" />
                  )}
                  <span className="truncate text-sm font-medium">
                    {note.title}
                  </span>
                </div>
                <span className="truncate text-xs text-muted-foreground">
                  {note.content.slice(0, 60) || "Empty note"}
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
        <div className="border-t border-border/50 p-3">
          <Button
            size="sm"
            className="w-full gap-1.5"
            onClick={handleCreate}
            disabled={pending}
          >
            <Plus className="h-4 w-4" />
            New note
          </Button>
        </div>
      </GlassCard>

      <GlassCard className="min-w-0 flex-1 p-4" hover={false}>
        {selected ? (
          <>
            <div className="mb-4 flex items-center justify-between gap-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleSave}
                className="border-0 bg-transparent text-lg font-semibold shadow-none focus-visible:ring-0"
              />
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() =>
                    updateNote(selected.id, { pinned: !selected.pinned })
                  }
                >
                  <Pin
                    className={cn(
                      "h-4 w-4",
                      selected.pinned && "fill-current text-primary"
                    )}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() =>
                    updateNote(selected.id, {
                      favorite: !selected.favorite,
                    })
                  }
                >
                  <Star
                    className={cn(
                      "h-4 w-4",
                      selected.favorite && "fill-amber-500 text-amber-500"
                    )}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive"
                  onClick={() => deleteNote(selected.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mb-3 flex flex-wrap gap-1">
              {parseTags(selected.tags).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
            </div>
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onBlur={handleSave}
              placeholder="Write in markdown..."
              className="min-h-[400px] resize-none border-0 bg-transparent font-mono text-sm shadow-none focus-visible:ring-0"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Updated {format(new Date(selected.updatedAt), "MMM d, yyyy")}
            </p>
          </>
        ) : (
          <p className="text-muted-foreground">Select or create a note.</p>
        )}
      </GlassCard>
    </div>
  );
}
