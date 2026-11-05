/** Pedagogical finish-to-start CPM, continuous working-day offsets.
 * Durations include simulated overruns; no calendars, resource levelling or
 * constraints other than FS links. These are not the real product's engine.
 */
export type ScheduleTask = {
  id: string;
  duration: number;
  predecessors: readonly string[];
};
export type ScheduledTask = ScheduleTask & {
  start: number;
  finish: number;
  float: number;
};
export function scheduleProject(
  tasks: readonly ScheduleTask[],
  delays: Record<string, number> = {},
): { tasks: ScheduledTask[]; finish: number } {
  const byId = new Map(tasks.map((t) => [t.id, t]));
  if (byId.size !== tasks.length) throw new Error("Identifiants dupliqués");
  for (const [id, delay] of Object.entries(delays)) {
    if (!byId.has(id) || !Number.isFinite(delay) || delay < 0)
      throw new Error("Retard invalide");
  }
  for (const t of tasks) {
    if (
      !t.id ||
      !Number.isFinite(t.duration) ||
      t.duration < 0 ||
      t.predecessors.some((p) => !byId.has(p))
    )
      throw new Error("Tâche invalide");
  }
  const order: string[] = [];
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (id: string) => {
    if (visiting.has(id)) throw new Error("Cycle de dépendances");
    if (visited.has(id)) return;
    visiting.add(id);
    byId.get(id)!.predecessors.forEach(visit);
    visiting.delete(id);
    visited.add(id);
    order.push(id);
  };
  tasks.forEach((t) => visit(t.id));
  const results = new Map<string, ScheduledTask>();
  for (const id of order) {
    const t = byId.get(id)!;
    const start = Math.max(
      0,
      ...t.predecessors.map((p) => results.get(p)!.finish),
    );
    const duration = t.duration + (delays[id] ?? 0);
    results.set(id, {
      ...t,
      duration,
      start,
      finish: start + duration,
      float: 0,
    });
  }
  const finish = Math.max(0, ...Array.from(results.values(), (t) => t.finish));
  const latestStart = new Map<string, number>();
  for (const id of [...order].reverse()) {
    const t = results.get(id)!;
    const successors = tasks.filter((s) => s.predecessors.includes(id));
    const latestFinish = successors.length
      ? Math.min(...successors.map((s) => latestStart.get(s.id)!))
      : finish;
    latestStart.set(id, latestFinish - t.duration);
    t.float = Math.max(0, latestFinish - t.finish);
  }
  return { tasks: tasks.map((t) => results.get(t.id)!), finish };
}
