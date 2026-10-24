# Publishing buildr-stack

The npm package and GitHub repository have separate release steps. Pushing to
GitHub does not update the npm package. Published package versions cannot be
replaced, so every new npm release needs a new version.

## Prepare the release

Start from a reviewed checkout with passing CI. Use Node.js 22 or later and npm.

1. Review the changes in CHANGELOG.md. Move the Unreleased entries into the new
   version's section and add the release date.
2. Update the package and lockfile versions together. For a patch release:

   ```bash
   npm version patch --no-git-tag-version
   ```

   Use `minor` for a release with new features or `major` for breaking changes.
   `--no-git-tag-version` leaves committing and tagging to the maintainer.
3. Check the package:

   ```bash
   npm ci --ignore-scripts
   npm run check
   npm test
   npm pack --dry-run
   ```

   The tarball should include the CLI, templates, skills, documentation, and
   license. Tests, local artifacts, and credentials should not be included.
4. Commit the intended release changes and push them to GitHub. Use the repository's
   commit-message sequence in AGENTS.md, independently of the npm package version.

Changing a package version also changes the version in generated
`.buildr-stack.json` files. The checker expects the matching buildr-stack version.
An existing installation may contain edited documents and skills; a release
does not authorize overwriting them.

## Publish to npm

The publishing account needs a verified email address and publish access to
`buildr-stack`. For an interactive release, enable two-factor authentication and
sign in through npm:

```bash
npm login
npm whoami
npm publish
```

The `prepublishOnly` script runs source checks and tests before publishing from
the checkout. See npm's [publishing guide](https://docs.npmjs.com/creating-and-publishing-unscoped-public-packages/)
and [authentication requirements](https://docs.npmjs.com/about-two-factor-authentication/).

If using [staged publishing](https://docs.npmjs.com/staged-publishing/), review and
approve the release in npm's Staged Packages tab with two-factor authentication.
For a new package, `0.0.0-stage` is a temporary placeholder without the CLI.
If npm shows **Validating**, wait for its automated review to finish. Confirm that
the actual package version is published before announcing it.

## Verify the public release

Check the registry and run the downloaded CLI:

```bash
npm view buildr-stack@latest version bin --prefer-online
npx --prefer-online buildr-stack@latest --version
npx --prefer-online buildr-stack@latest init release-check --dry-run
```

Confirm that `latest` resolves to the intended version and that `bin` maps
`buildr-stack` to `bin/buildr-stack.js`. Then test a real installation in a
temporary directory outside the checkout and run `check` on it.

If npm reports `ETARGET` just after publishing, `--prefer-online` forces a
[refresh of cached package information](https://docs.npmjs.com/cli/v11/using-npm/config/#prefer-online).
If the CLI is still unavailable, check the npm release status before retrying.

Once verified, create a GitHub release from the reviewed release commit with
the matching package version, and link to the npm package. Keep npm versions
and the repository's commit-message sequence separate.
