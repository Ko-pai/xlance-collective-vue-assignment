export function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const dayMs = 1000 * 60 * 60 * 24;
  const days = Math.floor(diffMs / dayMs);

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  // < 1 minute
  if (seconds < 5) {
    return "Just now";
  }

  if (seconds < 60) {
    return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
  }

  // < 1 hour
  if (minutes < 60) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  }

  // < 1 day
  if (hours < 24) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }

  if (days < 1) {
    return "Just now";
  }

  if (days < 7) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }

  const weeks = Math.floor(days / 7);
  if (days < 30) {
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }

  const months = Math.floor(days / 30);
  if (days < 365) {
    return months === 1 ? "1 month ago" : `${months} months ago`;
  }

  const years = Math.floor(days / 365);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}
