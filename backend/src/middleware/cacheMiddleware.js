const cache = new Map();

const cacheResponse = (ttlMs = 60_000) => (req, res, next) => {
  if (req.method !== 'GET') return next();

  const key = req.originalUrl;
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    res.set('Cache-Control', `public, max-age=${Math.floor(ttlMs / 1000)}`);
    res.set('X-Cache', 'HIT');
    return res.status(cached.status).json(cached.body);
  }

  if (cached) cache.delete(key);
  const json = res.json.bind(res);
  res.json = (body) => {
    cache.set(key, { body, status: res.statusCode, expiresAt: Date.now() + ttlMs });
    res.set('Cache-Control', `public, max-age=${Math.floor(ttlMs / 1000)}`);
    res.set('X-Cache', 'MISS');
    return json(body);
  };
  next();
};

const clearCache = () => cache.clear();

module.exports = { cacheResponse, clearCache };
