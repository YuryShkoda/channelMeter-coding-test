import { RequestHandler } from 'express'
import { authorize } from './authorize'

/* istanbul ignore file */
// INFO: authentication was beyond the scope of test exercise. So this is just a dummy implementation that always authenticates the request.
export const authenticate: RequestHandler = async (req, res, next) => {
  const isAuthenticated = true

  if (isAuthenticated) return authorize(req, res, next)

  // INFO: response with unauthorized status code
  return res.sendStatus(401)
}
