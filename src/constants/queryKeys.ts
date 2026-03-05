/**
 * @file React Query key factory.
 * Centralised keys prevent cache collisions and make invalidation predictable.
 *
 * PATTERN: Use a factory function so keys are composable:
 *   queryKey: queryKeys.users.detail(userId)
 */
export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },

  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },

  // Add more domains as the app grows:
  // posts: { ... },
  // comments: { ... },
} as const;
