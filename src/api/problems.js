const problemUrl = 'https://hella-problem-service.herokuapp.com'
const problemCodeUrl = 'https://hella-problem-code-service.herokuapp.com'

export const getProblems = (tenantId, toiletId) => {
  return fetch(`${problemUrl}?toiletId=${toiletId}`, {
    method: 'GET',
    headers: {
      Authorization: tenantId,
      'Content-Type': 'application/json'
    }
  })
}

export const getDistributionOfProblemTypes = tenantId => {
  return fetch(`${problemUrl}/report/countGroupByProblemCode`, {
    method: 'GET',
    headers: {
      Authorization: tenantId,
      'Content-Type': 'application/json'
    }
  })
}

export const getProblemCodes = tenantId => {
  return fetch(`${problemCodeUrl}`, {
    method: 'GET',
    headers: {
      Authorization: tenantId,
      'Content-Type': 'application/json'
    }
  })
}
