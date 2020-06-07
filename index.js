/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
const fs = require('fs');

module.exports = app => {
  // Your code here
  app.log('Yay, the app was loaded!')

  app.on(['pull_request'], check)

  async function check (context) {
    const timeStart = new Date()

    // const versionLabels = ['version:major', 'version:minor', 'version:patch']
    // const categoryLabels = ['category:feature', 'category:bugfix', 'category:maintenance', 'category:security', 'category:deprecated', 'category:removed']

    app.log(context.payload)
    // const conclusion = is_a_verb ? 'success' : 'failure'

    // var title = ""

    // if (is_a_verb) {
    //   title = "Pull request title is valid"
    // } else {
    //   title = 'Use the imperative mood in the pull request title'
    // }
    const conclusion = 'success'
    const title = 'OK'

    return context.github.checks.create(context.repo({
      name: 'Label Checker',
      head_branch: context.payload.pull_request.head.ref,
      head_sha: context.payload.pull_request.head.sha,
      status: 'completed',
      started_at: timeStart,
      conclusion: conclusion,
      completed_at: new Date(),
      output: {
        title: title,
        summary: title
      }
    }))
  }
}

function arrayContains(needle, arrhaystack) { return (arrhaystack.indexOf(needle) > -1); }