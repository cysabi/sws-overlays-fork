export function getContrastingTextColor<T>(backgroundColor: string, lightColor: T, darkColor: T): T {
    const yiq = getYiq(backgroundColor);
    return (yiq >= 128) ? darkColor : lightColor;
}

export function darkenColorIfNeeded(color: string): string {
    const yiq = getYiq(color);
    return (yiq >= 128) ? darkenColor(color) : color;
}

function darkenColor(color: string) {
    const rgb = hexToRbg(color);
    rgb.r = Math.pow(rgb.r, 0.9);
    rgb.g = Math.pow(rgb.g, 0.9);
    rgb.b = Math.pow(rgb.b, 0.9);
    return `#${Math.min(Math.round(rgb.r), 255).toString(16)}${Math.min(Math.round(rgb.g), 255).toString(16)}${Math.min(Math.round(rgb.b), 255).toString(16)}`;
}

function getYiq(color: string) {
    const { r, g, b } = hexToRbg(color);
    return ((r * 299) + (g * 587) + (b * 114)) / 1000;
}

export function hexToRbg(color: string): { r: number, g: number, b: number } {
    color = color.replace('#', '');
    return {
        r: parseInt(color.substr(0, 2), 16),
        g: parseInt(color.substr(2, 2), 16),
        b: parseInt(color.substr(4, 2), 16)
    };
}
