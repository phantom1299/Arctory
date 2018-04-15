const url = 'https://hella-solution-service.herokuapp.com'

export const postSolution = (
  tenantId,
  { toiletId, problemId, problemCode, problemDate, details }
) => {
  return fetch(`${url}`, {
    method: 'POST',
    headers: {
      Authorization: tenantId,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ toiletId, problemId, problemCode, problemDate, details })
  })
}

export const getAverageResolutionTime = tenantId => {
  return fetch(`${url}/reports/averageResolutionTime`, {
    method: 'GET',
    headers: {
      Authorization: tenantId,
      'Content-Type': 'application/json'
    }
  })
}
