// utils/generateTokens.js
import jwt from 'jsonwebtoken'

export const generateTokens = (id, role) => {
  const accessToken = jwt.sign(
    { id, role, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: '1m' }
  )

  const refreshToken = jwt.sign(
    { id, role, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '5m' }
  )

  return { accessToken, refreshToken }
}