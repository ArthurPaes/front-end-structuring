/**
 * @file Auth feature public API.
 *
 * BARREL EXPORT DECISION:
 *   Use barrel files at the feature boundary (this file) so that
 *   consumers import from `@/features/auth`, not deep paths.
 *   Internal sub-folders also have barrels for internal convenience.
 *
 *   WHEN NOT to barrel: deeply nested utility folders where tree-shaking
 *   matters — barrels can defeat tree-shaking in some bundlers.
 */
export { useAuth } from './hooks/useAuth';
export { useLogin } from './hooks/useLogin';
export { useRegister } from './hooks/useRegister';
export { useAuthStore } from './store/auth.store';
export type { AuthenticatedUser, AuthState, Permission } from './types/auth.types';
export { ROLE_PERMISSIONS } from './types/auth.types';
