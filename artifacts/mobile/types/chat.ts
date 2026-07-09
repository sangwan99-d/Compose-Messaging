/**
 * Domain types for SecureChat's mock messaging layer.
 *
 * `encryptedPayload` simulates the ciphertext that would normally be
 * produced by an E2E encryption layer (e.g. Signal protocol). The UI
 * never "decrypts" it for real — `plaintext` is stored alongside it so
 * the mock ViewModel can render bubbles without pretending to implement
 * real cryptography.
 */
export interface Message {
  id: string;
  senderId: string;
  encryptedPayload: string;
  plaintext: string;
  timestamp: number;
  isRead: boolean;
}

export interface Contact {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  online: boolean;
  about: string;
}

export interface Chat {
  id: string;
  contact: Contact;
  messages: Message[];
  pinned: boolean;
}

export const CURRENT_USER_ID = 'me';

/** Non-crypto UUID generator — safe on iOS/Android (avoids the 'uuid' package). */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

/** Produces a short, believable base64-looking string to stand in for ciphertext. */
export function mockEncrypt(plaintext: string): string {
  const noise = Math.random().toString(36).slice(2, 10);
  const encoded =
    typeof btoa === 'function'
      ? btoa(unescape(encodeURIComponent(plaintext)))
      : Buffer.from(plaintext, 'utf-8').toString('base64');
  return `${encoded}.${noise}`;
}
