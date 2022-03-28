export function replaceAll(value: string, search: string, replace: string): string {
    if (replace === undefined) {
        return value.toString();
    }
    return value.split(search).join(replace);
}