const buckets = new Map();

export function rateLimitKey(ip, route) {
  return `${ip}:${route}`;
}

export function checkRateLimit(key, { limit, windowMs }) {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    const next = { count: 1, resetAt: now + windowMs };
    buckets.set(key, next);
    return { ok: true, retryAfterSec: 0 };
  }

  if (current.count >= limit) {
    const retryAfterSec = Math.ceil((current.resetAt - now) / 1000);
    return { ok: false, retryAfterSec };
  }

  current.count += 1;
  return { ok: true, retryAfterSec: 0 };
}
