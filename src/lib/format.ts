export function formatPrice(value: number): string {
  const rounded = Number.isInteger(value) ? value : Number(value.toFixed(2));
  return `$${rounded.toLocaleString("en-US")}`;
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("ar-SY", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}
