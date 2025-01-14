import { MutableRefObject, useEffect, useRef } from "react";

export const useClickOutside = <T>(
    handler?: (event: Event) => void,
    enabled: boolean = false,
): MutableRefObject<T | null> => {
    const ref = useRef<T | null>(null);
    const handlerRef = useRef<typeof handler>();
    handlerRef.current = handler;

    const enabledRef = useRef(enabled);
    enabledRef.current = enabled;

    useEffect(() => {
        const cb = (event: Event) => {
            const handler = handlerRef.current;
            const parent = ref.current;

            if (
                typeof handler === "function" &&
                event?.target instanceof Node &&
                parent instanceof Node &&
                !parent.contains(event?.target) &&
                enabledRef.current
            ) {
                handler(event);
            }
        };

        document.addEventListener("mousedown", cb);

        return () => {
            document.removeEventListener("mousedown", cb);
        };
    }, []);

    return ref;
};
