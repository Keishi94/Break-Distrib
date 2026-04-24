import { describe, it, expect } from 'bun:test';
import { testClient } from '../src/test-utils/client';

describe('Health Check', () => {
  it('should return 200 OK on GET /', async () => {
    const client = await testClient({ anonymous: true });
    // In hono testing, the root route can be accessed if it's typed, or we can use app.request
    // But since the client is typed with `typeof app`, we can try to call index
    const res = await client.index.$get();
    
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(body.service).toBe("Break'Distrib API");
  });
});
