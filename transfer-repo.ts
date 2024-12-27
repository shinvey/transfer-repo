#!/usr/bin/env -S deno run --allow-run --allow-env --allow-sys --allow-read --allow-write

import { $, fs, cd, echo, retry } from "npm:zx@^8.3.0";
import { parseArgs } from "jsr:@std/cli@^1.0.9/parse-args";

const flags = parseArgs(Deno.args, {
  boolean: ["create-repo", "cache"],
  default: { cache: true },
  negatable: ["cache"],
});

const retryCount = 3;

const repoListJSON: Array<{
  path: string;
  http_url_to_repo: string;
  visibility: string;
  description: string;
}> = await retry(retryCount, () => $`glab repo list -F json -P 100`.json());

console.info("All you have", repoListJSON.length, "repos.");

const githubUsername = await retry(
  retryCount,
  () => $`gh api user -q ".login"`
);

for await (const repo of repoListJSON) {
  console.info("Transferring the", repo.visibility, "repo", repo.path, "...");

  flags["create-repo"] &&
    (await retry(retryCount, () => $`gh repo view ${repo.path}`).catch(
      async () => {
        console.info("Trying to create repo", repo.path);
        const optionalFlags: Array<string> = [];
        repo.description &&
          optionalFlags.push("--description", repo.description);
        await retry(
          retryCount,
          () =>
            $`gh repo create ${repo.path} --${repo.visibility} ${optionalFlags}`
        );
      }
    ));

  flags.cache || (await fs.rm(repo.path, { recursive: true, force: true }));
  fs.existsSync(repo.path) ||
    (await retry(
      retryCount,
      () => $`git clone --bare ${repo.http_url_to_repo} ${repo.path}`
    ));

  const workingDir = Deno.cwd();

  cd(repo.path);
  await retry(
    retryCount,
    () => $`git push --mirror https://github.com/${githubUsername}/${repo.path}`
  );

  cd(workingDir);

  echo("");
}
