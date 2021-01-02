# cd-pipeline

This repository contains a simple Node.js application to receive push event webhooks from GitHub and using [github/octokit/webhooks.js](https://github.com/octokit/webhooks.js) to validate the authenticity of the received webhook.
Custom deployment instructions are stored in the bash script named `deploy.sh` which can be modified as per requirements. 

The Deployment status on the repository is updated from `pending` to `in_progress` to `success`, as and when `deploy.sh` is executed. This is done using [github/octokit/rest.js](https://github.com/octokit/rest.js/)

These are the environment variables required to be saved in a `.env` file in the same directory as app.js to make sure that the application can be successfully started.

These are the parameters that need to be set in your environment file ->

```
PAT= // Personal Access Token obtained from GitHub with the repo scope
userAgent= pipeline // or any other name that you can use to identify the application 
tZone= Asia/Kolkata // Set a Timezone according to your system's timezone . Refer this [list](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) for the list of timezones ad the format.
owner= // owner of the repository
repo= // the name of the repository to be deployed
env_url=http://www.example.com // The url for your deployment
hook_secret= The secret you set when configuring your Webhooks. Use the following links to [set your Webhooks](https://docs.github.com/en/free-pro-team@latest/developers/webhooks-and-events/about-webhooks) and [secure them](https://docs.github.com/en/free-pro-team@latest/developers/webhooks-and-events/securing-your-webhooks)
PORT=5001 // Or set any other port number that you can open on your system.

```
