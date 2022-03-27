export const JSS_HASHER = class {
    private static AvailableCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    
    private static rollMax(value: number, max: number): {result: number, count: number} {
        var count = 0;
        while (value >= max) {
            value -= max;
            count++;
        }
        if (value < 0)
            value += max;
        return {result: value, count: count};
    }

    public static hash(input: string, length: number): string {
        var result = "";

        for (var i = 0; i < length; i++) {
            var r = this.rollMax(i, input.length);
            var _ = input.charCodeAt(r.result) + r.count * 3 + i * length;
            var char = this.AvailableCharacters[this.rollMax(_, this.AvailableCharacters.length - 1).result];
            result += char;
        }

        return result;
    }

    public static hashWithSalt(input: string, salt: string, length: number): string {
        return this.hash(input + salt, length);
    }
}