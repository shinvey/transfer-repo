# Repository transfer cli tool

Help you transfer all repositories from gitlab to github

## Preparation

```shell
# https://github.com/hickford/git-credential-oauth
winget install hickford.git-credential-oauth

scoop install glab
glab auth login

scoop install gh
gh auth login

scoop install deno
```

## Usage

executes script file in bash

```shell
./transfer-repo.ts --create-repo
```
