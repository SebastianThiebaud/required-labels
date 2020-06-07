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

    const skipLabels = ['skip-changelog']
    const versionLabels = ['major', 'minor', 'patch']
    const categoryLabels = ['feature', 'bugfix', 'maintenance', 'security', 'deprecated', 'removed']

    const labels = context.payload.pull_request.labels.map(label => label.name)
    
    const skipLabelsCount = labels.filter(label => skipLabels.includes(label)).length
    const versionLabelsCount = labels.filter(label => versionLabels.includes(label)).length
    const categoryLabelsCount = labels.filter(label => categoryLabels.includes(label)).length

    var warnings = []

    if (versionLabelsCount == 0) {
      warnings.push('Missing version label.')
    } else if (versionLabelsCount > 1) {
      warnings.push('More than one version label detected.')
    }

    if (categoryLabelsCount == 0) {
      warnings.push('Missing category label.')
    } else if (categoryLabelsCount > 1) {
      warnings.push('More than one category label detected.')
    }

    var title = 'This pull request is properly labeled.'

    if (skipLabelsCount > 0) {
      title = 'Check is ignored for this pull request.'
      warnings = [] 
    } else if (warnings.length > 0) {
      title = warnings.join(' ')
    }

    const conclusion = warnings.length == 0 ? 'success' : 'failure'

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