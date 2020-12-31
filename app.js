require("dotenv/config");
const { Octokit } = require("@octokit/rest");
const { Webhooks } = require("@octokit/webhooks");
const secret = "600736c9d73473b781d0ffbdca6d24b092351c3f";
const webhooks = new Webhooks({ secret });
const PORT = 5001;
const cp = require("child_process");

const octokit = new Octokit({
  auth: process.env.PAT,
  userAgent: process.env.userAgent,
  timeZone: process.env.tZone,
});

const owner = process.env.owner;
const repo = process.env.repo;
const environment_url = process.env.env_url;

webhooks.on("push", ({ id, name, payload }) => {
  console.log(name, "event received");
  const result = webhooks.verify(payload, webhooks.sign(payload));
  console.log(result);
  if (result) {
    octokit.repos
      .createDeployment({owner,repo,ref:"master"})
      .then((res) => {
        const deployment_id = res.data.id;
        octokit.repos.createDeploymentStatus({owner,repo,deployment_id,state: "in_progress", mediaType: {previews: ['flash','ant-man']},})
          .then((data) => console.log(data))
          .catch((err) => console.log(err));

        cp.exec("bash deploy.sh", (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
          octokit.repos.createDeploymentStatus({owner,repo,deployment_id,environment_url,state: "success", auto_inactive:"true",
              mediaType: {previews: ['flash','ant-man']},
            })
            .then((data) => console.log(data))
            .catch((err) => console.log(err));
        });
      });
}
});


require("http").createServer(webhooks.middleware).listen(PORT);
