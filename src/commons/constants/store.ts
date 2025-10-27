export const CACHE_STORE_KEY = {
  SESSION: (user_id: string | number) => `user:${user_id}:session`,
};

export const CACHE_STORE_TIME: Record<keyof typeof CACHE_STORE_KEY, number> = {
  SESSION: 1000 * 60 * 60 * 24,
};
