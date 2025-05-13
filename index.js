const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        const token = core.getInput('github_token');
        const octokit = github.getOctokit(token);
        const branch = github.context.ref.replace('refs/heads/', '');

        console.log(`Branch: ${branch}`);

        // Obtener lista de PRs abiertos
        const { data: pulls } = await octokit.rest.pulls.list({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            state: 'open'
        });

        // Verificar si hay un PR asociado a la rama actual
        const pr = pulls.find(pr => pr.head.ref === branch);

        if (pr) {
            console.log(`✅ PR found: ${pr.number}`);
            core.setOutput('pr_found', 'true');
            core.setOutput('pr_id', pr.number);
        } else {
            console.log(`❌ No PR found for branch: ${branch}`);
            core.setOutput('pr_found', 'false');

            // Comentar en el commit
            const commitSha = github.context.sha;
            const commentBody = `🛑 No PR is associated with the branch \`${branch}\`.

            @${github.context.actor}, please open a pull request to trigger this workflow.`;

            await octokit.rest.repos.createCommitComment({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                commit_sha: commitSha,
                body: commentBody
            });

            core.setFailed('Workflow cancelled because no PR is associated with the branch.');
        }
    } catch (error) {
        core.setFailed(`Action failed with error: ${error.message}`);
    }
}

run();
