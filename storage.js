export function read(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
export function write(key, value) { try { localStorage.setItem(key,JSON.stringify(value)); return true; } catch { return false; } }
