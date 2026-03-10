import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock nodemailer before importing the module under test.
const sendMailMock = vi.fn();

vi.mock('nodemailer', () => {
  return {
    default: {
      createTransport: () => ({
        sendMail: sendMailMock,
      }),
    },
  };
});

describe('lib/email', () => {
  beforeEach(() => {
    sendMailMock.mockReset();
    sendMailMock.mockResolvedValue({ messageId: 'test' });
  });

  it('sendEmailVerification sends a verification email', async () => {
    const { sendEmailVerification } = await import('../../lib/email');

    await sendEmailVerification('user@example.com', 'https://example.com/verify', 'token');

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    const mail = sendMailMock.mock.calls[0][0];
    expect(mail.to).toBe('user@example.com');
    expect(mail.subject).toMatch(/verify your email/i);
    expect(String(mail.html)).toContain('https://example.com/verify');
  });

  it('sendPasswordReset sends a reset password email', async () => {
    const { sendPasswordReset } = await import('../../lib/email');

    await sendPasswordReset('user@example.com', 'https://example.com/reset', 'token');

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    const mail = sendMailMock.mock.calls[0][0];
    expect(mail.to).toBe('user@example.com');
    expect(mail.subject).toMatch(/reset your password/i);
    expect(String(mail.html)).toContain('https://example.com/reset');
  });
});
