const { Octokit } = require("@octokit/rest");
const { Webhooks } = require("@octokit/webhooks");
const webhooks = new Webhooks({ secret: process.env.hook_secret });
const PORT = 5001;

const rest = new Octokit({
  auth: process.env.PAT,
  userAgent: process.env.userAgent,
  timeZone: process.env.tZone,
});

const owner = process.env.owner;
const repo = process.env.repo;
const environment_url = process.env.env_url;

webhooks.on("push", ({ id, name, payload }) => {
  console.log(name, "event received");
  webhooks.verify(payload, webhooks.sign(payload)).then((result) => {
    if (result) {
      octokit.repos
        .createDeployment({
          owner,
          repo,
          ref: "master",
        })
        .then((res) => {
            const deployment_id=res.id;
            octokit.repos.createDeploymentStatus({
                    owner,
                    repo,
                    deployment_id,
                    environment_url,
                    state:"in-progress",
                    mediaType: {
                        format: "flash-preview+json",
                    },
                }).then((data)=>console.log(data)).catch(err=>console.log(err));
        })
        .catch((err) => console.log(err));
    }
  
});
}

require("http").createServer(webhooks.middleware).listen(PORT)
