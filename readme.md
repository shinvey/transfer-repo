# Repository transfer cli tool

Help you transfer all repositories from gitlab to github.

## Prerequisites

### On windows os

```shell
# https://github.com/hickford/git-credential-oauth
winget install hickford.git-credential-oauth
git credential-oauth configure

winget install GLab.GLab
glab auth login

winget install GitHub.cli
gh auth login

winget install DenoLand.Deno
```

### On macos

```bash
brew install git-credential-oauth
git credential-oauth configure

brew install glab
glab auth login

brew install gh
gh auth login

brew install deno
```

## Usages

Executes script file in bash. You may use `git bash` on windows.

```bash
chmod +x ./transfer-repo.ts
./transfer-repo.ts --create-repo
```
