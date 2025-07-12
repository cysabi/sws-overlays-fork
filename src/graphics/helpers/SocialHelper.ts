export function isBluesky(tag: string): boolean {
    return tag.includes('.');
}

// '@inkfarer.com' -> ['@inkfarer.com']
// '@popgun.bsky.social' -> ['@popgun', '.bsky.social']
export function splitSignificantSocialTagPart(tag: string): [string, string | null] {
    const split = tag.split('.');
    if (split.length <= 2) {
        return [tag, null];
    } else {
        const significantPart = split.shift()!;
        return [significantPart, '.' + split.join('.')];
    }
}
