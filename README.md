# Check PR Action

This GitHub Action checks if the current branch has an associated Pull Request (PR) and takes appropriate actions if no PR is found.

## Features
- Validates if a branch has an open PR.
- Comments on the commit if no PR is found.
- Cancels the workflow if no PR exists.

## Usage
Add the following to your GitHub workflow file:

```yaml
name: Check PR Workflow

on: [push, pull_request]

jobs:
  check-pr-job:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Use Check PR Action
        uses: devsecops-net/check-pr-action@v1.0.0
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

## Inputs
| Name          | Description                           | Required |
|--------------|---------------------------------------|---------|
| github_token | GitHub token for authentication        | Yes     |

## Outputs
| Name    | Description                            |
|--------|----------------------------------------|
| pr_found | Whether a PR was found (true/false)       |
| pr_id    | The ID of the PR if found               |

## Example
In a workflow, you can use the outputs as follows:

```yaml
- name: Show PR ID
  if: ${{ steps.check-pr.outputs.pr_found == 'true' }}
  run: echo "PR ID: ${{ steps.check-pr.outputs.pr_id }}"
```

## License
MIT License
