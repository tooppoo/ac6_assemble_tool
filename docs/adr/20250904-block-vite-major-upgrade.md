# ADR: Block Vite major upgrades until Svelte 5 migration

- Date: 2025-09-04

## Status
Accepted

## Context

Renovate opened a PR to update `vite` to `7.x`. Our `packages/web` relies on `@sveltejs/vite-plugin-svelte@3.x`, which supports `vite ^5` and `svelte ^4`. 

Compatibility matrix:

- `@sveltejs/vite-plugin-svelte@3.x`: vite ^5, svelte ^4
- `@sveltejs/vite-plugin-svelte@5.x`: vite ^6, svelte ^5
- `@sveltejs/vite-plugin-svelte@6.x`: vite ^6 || ^7, svelte ^5

Therefore, upgrading Vite to `^6` or `^7` requires migrating to Svelte 5 and upgrading the Svelte Vite plugin (and potentially adjusting code for Svelte 5 changes). We already have work in `feature/#566/upgrade-svelte-to-5`.

## Decision

- Pin/allow Vite upgrades only within `<6.0.0` via Renovate configuration until the Svelte 5 migration is completed.
- Keep the renovate PR for `vite 7.x` green by reverting Vite to the latest `5.x` compatible version if necessary, and document the block in the PR description.

## Consequences

- CI remains stable without forcing an early Svelte 5 migration.
- Security/performance: Vite `5.4.19` remains maintained; no known blocking CVEs in our usage. We continue to receive `5.x` patches. Major performance features from Vite 6/7 will arrive after Svelte 5 migration.
- UX/Accessibility: No behavioral change for users; avoids regressions from premature framework upgrades.
- Traceability: Renovate config encodes the constraint; this ADR documents rationale and links to the Svelte 5 migration task.

## Alternatives considered

- Proceed with Svelte 5 migration in this PR: Rejected for scope creep and risk; requires code changes and thorough testing beyond a dependency bump.
- Force install with `--legacy-peer-deps`: Rejected due to potential runtime incompatibility and hidden breakages in CI vs production.

