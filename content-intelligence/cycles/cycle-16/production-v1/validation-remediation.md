# Repository validation investigation

Initial default15-worker runs timed out in two media-heavy checks that hash durable payloads. Their13assertions passed in an isolated one-worker run (7.35seconds total); no assertion failed in isolation. Vitest now bounds file concurrency to4workers, retaining the original test timeouts and assertions.

The frozen Cycles4–7compatibility test also timed out at60seconds because it replayed the entire growing project backlog before filtering to those four journals. It now replays those exact four journals directly, preserving every existing assertion. This is a scope/performance correction, not a timeout increase or semantic exemption. Separately, the full live13-cycleproject backlog was replayed by `verify-voyager-handoff.ts`, along with exact media/source bindings,1,247preserved historical catalog records and440protected Flytrap evidence files.

Earlier experimental edits to WORKFLOW-V3 and PROJECT-STATE were not retained: historical discovery evidence binds their exact current bytes. Those files were restored exactly; the owner-selected intake capability is documented in a separate scoped addendum. No historical hash was regenerated, transferred or waived. Current machine metadata and the new independent journal report the new owner queue.
