export function formatRelativeDate(date: string | Date): string {
  const now = new Date();
  const d = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {
    return 'Prave ted';
  }

  if (diffMinutes < 60) {
    if (diffMinutes === 1) return 'Pred 1 minutou';
    if (diffMinutes >= 2 && diffMinutes <= 4) return `Pred ${diffMinutes} minutami`;
    return `Pred ${diffMinutes} minutami`;
  }

  if (diffHours < 24) {
    if (diffHours === 1) return 'Pred 1 hodinou';
    if (diffHours >= 2 && diffHours <= 4) return `Pred ${diffHours} hodinami`;
    return `Pred ${diffHours} hodinami`;
  }

  if (diffDays < 7) {
    if (diffDays === 1) return 'Pred 1 dnem';
    if (diffDays >= 2 && diffDays <= 4) return `Pred ${diffDays} dny`;
    return `Pred ${diffDays} dny`;
  }

  return formatDateTime(d);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}
