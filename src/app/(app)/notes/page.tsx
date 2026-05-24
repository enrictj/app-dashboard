import { PageHeader } from "@/components/layout/page-header";
import { NotesView } from "@/features/notes/notes-view";
import { getNotes } from "@/services/notes.service";
import { t } from "@/lib/i18n/ca";

export default async function NotesPage() {
  const notes = await getNotes();

  return (
    <div>
      <PageHeader
        title={t.notes.title}
        description={t.notes.description}
      />
      <NotesView
        notes={notes.map((n) => ({
          id: n.id,
          title: n.title,
          content: n.content,
          tags: n.tags,
          pinned: n.pinned,
          favorite: n.favorite,
          updatedAt: n.updatedAt,
        }))}
      />
    </div>
  );
}
