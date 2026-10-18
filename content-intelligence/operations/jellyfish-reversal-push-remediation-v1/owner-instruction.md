# MAGNIVIS — CYCLE #21 PUSH-PROTECTION REMEDIATION

**OWNER APPROVAL GRANTED — IMPLEMENT.**

You are authorized to sanitize the flagged archived research content, amend provenance records, replace the unpublished local Cycle #21 commit, revalidate, and retry the normal push.

## Scope

- Repository: existing Magnivis repository.
- Branch: `content/cycle-11-discovery`.
- Unpublished local commit: `34d00ca74d953d3fd5d52e76f1e4aeda98fc58c3`.
- Last synchronized remote commit: `bd3f5ee33516cf8b4ad6501a7453c03b3571c642`.
- Flagged file: `research/smithsonian.html`, line 800, within the archived Cycle #21 research.
- Proposed remediation: `/tmp/cycle21-push-remediation-proposal.json`.

## Instructions

1. Read AGENTS.md and the relevant repository security, provenance, research, and artifact documentation.

2. Inspect the prepared remediation proposal. Verify that it addresses the actual GitHub push-protection finding and introduces no unrelated changes.

3. Replace the exposed token with an explicit redaction marker. Preserve the scientifically relevant research content.

4. Update the necessary provenance, integrity hashes, manifests, and artifact records to reflect the sanitized archive. Do not misrepresent sanitized evidence as byte-identical to the original.

5. Check whether the same token appears elsewhere in the pending commit or its reachable local history. Do not print the token in logs, reports, or responses.

6. Verify that the sanitized archive remains usable for the existing research and scientific claims.

7. Revalidate the affected research, artifact durability, journal replay, media identity, delivery packages, typecheck, lint, and tests.

8. Replace only the unpublished local Cycle #21 commit using the smallest safe Git operation permitted by this explicit authorization. Do not rewrite shared or previously pushed history.

9. Confirm the new commit does not contain the flagged secret in the content being pushed.

10. Push normally to the existing branch. **Do not force-push, bypass push protection, or use GitHub secret allowlisting.**

11. Verify that local HEAD, remote-tracking HEAD, and remote HEAD match and that the working tree is clean.

## Preservation requirements

- Preserve the approved Cycle #21 V2 video and SHA-256.
- Preserve all four delivery packages.
- Preserve the October 21, 2026, 20:00 CEST scheduled records.
- Preserve historical cycles and unrelated research.
- Do not alter narration, captions, covers, or publication metadata.
- Do not perform live-platform actions.

## Stop conditions

Stop and report before proceeding if:

- The remediation requires rewriting already-pushed history.
- The token cannot be removed without destroying material scientific evidence.
- The proposed changes extend materially beyond the flagged archive and necessary provenance updates.
- GitHub reports another unresolved secret.

## Final report

Return the replacement commit SHA, sanitized-file summary, validation results, GitHub push result, and local/remote synchronization status.

Do not reveal the token.
