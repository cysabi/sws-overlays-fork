import { isBlank } from 'browser-shared/helpers/StringHelper';

export async function loadAndCheckIfImageExists(src?: string | null): Promise<boolean> {
    return new Promise(resolve => {
        if (isBlank(src)) {
            resolve(false);
            return;
        }

        const img = new Image();
        img.src = String(src);

        img.onload = () => {
            resolve(true);
        };
        img.onerror = () => {
            resolve(false);
        };
    });
}
