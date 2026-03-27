export default function normalizeServerErrors(
    errors: Record<string, string[]>
): Record<string, string[]> {
    const normalized: Record<string, string[]> = {};

    for (const key in errors) {
        const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
        normalized[camelKey] = errors[key];
    }

    return normalized;
}