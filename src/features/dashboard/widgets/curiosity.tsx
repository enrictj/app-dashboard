import { Lightbulb } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { WidgetHeader } from "@/components/widgets/widget-header";
import { t } from "@/lib/i18n/ca";

export function CuriosityWidget({ fact }: { fact: string }) {
  return (
    <GlassCard className="col-span-4 lg:col-span-3" hover={false}>
      <WidgetHeader title={t.dashboard.dailyCuriosity} subtitle={t.dashboard.didYouKnow} />
      <div className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
          <Lightbulb className="h-4 w-4" />
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {fact}
        </p>
      </div>
    </GlassCard>
  );
}
