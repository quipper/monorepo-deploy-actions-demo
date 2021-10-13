module.exports = ({ github, context, core }) => {
  core.info(`Received event ${context.eventName} at ref ${context.ref}`)
  const outputs = determineConfig(context)
  for (const [k, v] of Object.entries(outputs)) {
    core.info(`Set output ${k} = ${v}`)
    core.setOutput(k, v)
  }
}

const determineConfig = (context) => {
  const { eventName, ref } = context

  if (eventName === 'pull_request') {
    return {
      overlay: `pr`,
      namespace: `pr-${context.issue.number}`,
    }
  }

  if (eventName === 'push' && ref === 'refs/heads/main') {
    return {
      overlay: `development`,
      namespace: `development`,
    }
  }

  throw new Error(`could not determine deploy config from event=${eventName}, ref=${ref}`)
}
