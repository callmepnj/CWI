const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function optionalUuid(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return uuidPattern.test(trimmed) ? trimmed : null;
}

export function requireUuid(value: unknown, label: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} is required.`);
  }

  const id = optionalUuid(value);

  if (!id) {
    throw new Error(`${label} must be a valid UUID.`);
  }

  return id;
}
