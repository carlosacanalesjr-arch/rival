export function getInitials(nameSource) {
  if (!nameSource) return "";
  const name = nameSource.firstName?.trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (nameSource.email) {
    return nameSource.email.slice(0, 2).toUpperCase();
  }
  return "?";
}
