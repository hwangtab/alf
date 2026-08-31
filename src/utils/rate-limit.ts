/**
 * 메모리 기반 슬라이딩 윈도우 레이트리밋.
 *
 * 서버 인스턴스마다 카운터가 독립이고 콜드스타트에 초기화되므로 완전한 방어는 아니다.
 * 그래도 /api/support는 요청 한 건이 곧 실제 메일 발송이라, 한 발신자의 반복 호출만 끊어도
 * 스팸 릴레이와 Resend 쿼터 소진을 실질적으로 막는다.
 * 엄격한 보장이 필요해지면 Upstash Redis 같은 공유 저장소로 교체할 것.
 */

const MAX_TRACKED_KEYS = 5_000;

const hitsByKey = new Map<string, number[]>();

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSeconds: number };

/**
 * 호출 즉시 한 건을 소비한다. 허용되면 ok, 아니면 재시도까지 남은 초를 돌려준다.
 * `now`는 테스트에서 시계를 고정하기 위한 주입점이다.
 */
export function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now()
): RateLimitResult {
  const cutoff = now - windowMs;
  const recentHits = (hitsByKey.get(key) ?? []).filter((at) => at > cutoff);

  if (recentHits.length >= limit) {
    hitsByKey.set(key, recentHits);
    const retryAfterMs = recentHits[0] + windowMs - now;
    return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)) };
  }

  recentHits.push(now);
  hitsByKey.set(key, recentHits);

  if (hitsByKey.size > MAX_TRACKED_KEYS) {
    evictExpired(cutoff);
  }

  return { ok: true };
}

/** 창이 지난 키를 걷어내 Map이 무한히 자라지 않게 한다. */
function evictExpired(cutoff: number) {
  for (const [key, hits] of hitsByKey) {
    const live = hits.filter((at) => at > cutoff);
    if (live.length === 0) {
      hitsByKey.delete(key);
    } else {
      hitsByKey.set(key, live);
    }
  }
}

/**
 * 프록시 뒤의 클라이언트 IP. Vercel은 x-forwarded-for를 항상 채우므로
 * 'unknown' 폴백까지 내려가는 경우는 사실상 로컬 개발뿐이다.
 */
export function getClientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const firstHop = forwarded?.split(',')[0]?.trim();
  if (firstHop) return firstHop;

  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

/** 테스트 격리용. 프로덕션 코드에서는 호출하지 않는다. */
export function resetRateLimitStore() {
  hitsByKey.clear();
}
