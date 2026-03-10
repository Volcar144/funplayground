import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/auth', () => ({
  auth: { __test: true },
}));

const handlerMock = vi.fn(() => ({
  GET: () => new Response('ok'),
  POST: () => new Response('ok'),
}));

vi.mock('better-auth/next-js', () => ({
  toNextJsHandler: (...args: any[]) => handlerMock(...args),
}));

describe('app/api/auth/[...all]/route', () => {
  it('exports GET and POST handlers using toNextJsHandler(auth)', async () => {
    const mod = await import('../../app/api/auth/[...all]/route');

    expect(handlerMock).toHaveBeenCalledTimes(1);
    expect(mod.GET).toBeTypeOf('function');
    expect(mod.POST).toBeTypeOf('function');
  });
});
