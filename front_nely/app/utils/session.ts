// utils/session.ts
export function getOrCreateSessionId(): string | null {
    if (typeof window === 'undefined') return null;
  
    let sid = localStorage.getItem('session_id');
    if (!sid) {
      // you can use crypto.randomUUID if supported
      sid = crypto.randomUUID();
      localStorage.setItem('session_id', sid);
    }
    return sid;
  }
  