import { testClient as honoTestClient } from 'hono/testing';
import { app } from '../index';
import { db } from '../db/client';
import { user, session } from '../db/schema';

export async function testClient({ role = 'commercial', anonymous = false }: { role?: 'admin' | 'direction' | 'commercial' | 'technique'; anonymous?: boolean } = {}) {
  let token = '';
  if (!anonymous) {
    const userId = crypto.randomUUID();
    token = crypto.randomUUID();
    
    await db.insert(user).values({
      id: userId,
      name: 'Test User',
      email: `${userId}@test.com`,
      role,
      emailVerified: true
    });
    
    await db.insert(session).values({
      id: crypto.randomUUID(),
      userId,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  // To inject headers into hono testClient, we can pass a custom fetch method.
  const customFetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const request = new Request(input, init);
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }
    return app.fetch(request);
  };

  return honoTestClient<typeof app>(app, {}, customFetch as any);
}
