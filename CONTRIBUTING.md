# Contributing

Mid-Atlantic CRE Intelligence is a source-first research project. Contributions should improve traceability, clarity, accessibility, or maintainability without overstating what public evidence supports.

## Data and research standards

- Do not add confidential, proprietary, paywalled-extracted, or internship information.
- Do not present fictional or placeholder records as real transactions.
- Attach credible public sources and record publication and access dates when available.
- Distinguish reported, calculated, estimated, and unavailable values.
- Preserve missing values instead of filling them with unsupported assumptions.
- Treat changes to calculations, classifications, or verification status as material review items.

## Development workflow

1. Create a focused branch and keep unrelated changes out of the same pull request.
2. Update or add tests for domain logic and validation changes.
3. Run `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build`.
4. Describe the reader-facing effect, data effect, and verification performed in the pull request.
5. Add a changelog entry when a public change affects evidence, definitions, calculations, or interpretation.

## Security and privacy

Never commit `.env.local`, database passwords, service-role keys, private personal information, or unpublished source material. Public Supabase credentials may be used only with the repository's Row Level Security policies applied.
