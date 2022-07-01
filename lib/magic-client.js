import { Magic } from "magic-sdk";

export const createMagic = (key) => {
    return (
        typeof window !== "undefined" &&
            new Magic(key)
    );
}