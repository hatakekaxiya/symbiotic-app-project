import { useReducer } from "react";

export const useForceUpdate = () => {
    const [, fU] = useReducer((x) => x + 1, 0);
    return fU;
};
