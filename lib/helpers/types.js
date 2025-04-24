
export function Bool(value) {
    try {
        return Boolean(JSON.parse(value));
    } catch (e) {
        return false;
    };
};

