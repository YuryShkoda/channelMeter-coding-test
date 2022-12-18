import { RequestHandler } from 'express'

/* istanbul ignore file */
// INFO: authorization was beyond the scope of test exercise. So this is just a dummy implementation that always authorizes the request.
export const authorize: RequestHandler = async (req, res, next) => {
  const isAuthorized = true

  if (isAuthorized) return next()

  // INFO: response with unauthorized status code
  return res.sendStatus(401)
}
