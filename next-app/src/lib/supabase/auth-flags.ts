export function isEmailVerificationEnabled() {
  return process.env.NEXT_PUBLIC_AUTH_EMAIL_VERIFICATION_ENABLED !== 'false'
}