import 'dotenv/config';

export const setAuthRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const setAuthAccessCookie = (res, token) => {
  res.cookie('accessToken', token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 15 * 60 * 1000 // 15 minutes
  });
};
