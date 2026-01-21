// utils/cookieOptions.js
export const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production'

  return {
    httpOnly: true,
    secure: true,                 // HTTPS required in prod
    sameSite: 'none',
    path: '/',
  }
}