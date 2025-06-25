import { SignJWT, jwtVerify } from 'jose';

const encoder = new TextEncoder();
const ACCESS_SECRET = encoder.encode(process.env.JWT_ACCESS_SECRET);
const REFRESH_SECRET = encoder.encode(process.env.JWT_REFRESH_SECRET);

export async function signAccessToken(payload, expiresIn = '15m') {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(ACCESS_SECRET);
}


export async function signRefreshToken(payload, expiresIn = '7d') {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(REFRESH_SECRET);
}


export async function verifyAccessToken(token) {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    return payload;
  } catch (err) {
    console.error('Access JWT verification error:', err.message);
    return null;
  }
}

export async function verifyRefreshToken(token) {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    return payload;
  } catch (err) {
    console.error('Refresh JWT verification error:', err.message);
    return null;
  }
}
