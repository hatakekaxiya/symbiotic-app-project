import React, { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { ConnectModal } from "./ui/connect-modal";

type State = {
    show: boolean;
};

type StateWithSetter = State & {
    openConnectModal: () => void;
    closeConnectModal: (_?: React.MutableRefObject<HTMLDialogElement | null> | null) => void;
};

const initialState: StateWithSetter = {
    show: false,
    openConnectModal: () => undefined,
    closeConnectModal: (_ = null) => undefined,
};

const connectModalContext = createContext<StateWithSetter>(initialState);
const { Provider } = connectModalContext;

const ConnectModalProvider: React.FC<React.PropsWithChildren<State>> = ({ children, ...state }) => {
    const [current, setState] = useState<State>(state);

    const openConnectModal = () => {
        setState({ show: true });
    };

    const closeConnectModal = (
        ref: React.MutableRefObject<HTMLDialogElement | null> | null = null,
    ) => {
        ref?.current?.close();
        if (ref == null) {
            setState({ show: false });
        } else {
            setTimeout(() => {
                setState({ show: false });
            }, 300);
        }

        setTimeout(() => {
            setState({ show: false });
        }, 300);
    };

    return (
        <Provider value={{ ...current, openConnectModal, closeConnectModal }}>{children}</Provider>
    );
};

const useConnectModalContext = (): StateWithSetter => {
    const context = useContext(connectModalContext);

    if (context === undefined)
        throw new Error("useConnectModalContext must be used within a ConnectModalProvider");

    return context;
};

export { ConnectModalProvider, useConnectModalContext };

export const ConnectModalContainer: React.FC = () => {
    const { address } = useAccount();

    const { show, closeConnectModal } = useConnectModalContext();

    useEffect(() => {
        if (address) {
            closeConnectModal();
        }
    }, [address]);

    return <>{show && <ConnectModal />}</>;
};
