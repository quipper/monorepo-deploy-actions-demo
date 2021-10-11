module.exports = ({ github, context, core }) => {
  core.info(`Received event ${context.eventName} at ref ${context.ref}`)
  const outputs = determineConfig(context)
  core.info(`Set outputs to ${JSON.stringify(outputs, undefined, 2)}`)
  core.setOutput('environments', JSON.stringify(outputs.environments))
}

const determineConfig = (context) => {
  const { eventName, ref } = context

  if (eventName === 'pull_request') {
    return {
      environments: [
        {
          overlay: `pr`,
          namespace: `pr-${context.issue.number}`,
        },
      ],
    }
  }

  if (eventName === 'push' && ref === 'refs/heads/main') {
    return {
      environments: [
        {
          overlay: `development`,
          namespace: `development`,
        },
        {
          overlay: `pr`,
          namespace: '${NAMESPACE}', // will be replaced on pull-request--deploy workflow
          prebuilt: true,
        },
      ],
    }
  }

  throw new Error(`could not determine deploy config from event=${eventName}, ref=${ref}`)
}
