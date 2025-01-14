import React, { createContext, useContext, useState } from "react";

import { Notification, NotificationProps } from "./ui/notification";

type State = {
    show: boolean;
} & Partial<NotificationProps>;

type StateWithSetter = State & { setState: (state: State) => void };

const initialState: StateWithSetter = {
    show: false,
    setState: () => undefined,
};

const notificationContext = createContext<StateWithSetter>(initialState);
const { Provider } = notificationContext;

const NotificationProvider: React.FC<React.PropsWithChildren<State>> = ({ children, ...state }) => {
    const [current, setState] = useState<State>(state);

    return <Provider value={{ ...current, setState }}>{children}</Provider>;
};

const useNotificationContext = (): StateWithSetter => {
    const context = useContext(notificationContext);

    if (context === undefined)
        throw new Error("useNotificationContext must be used within a NotificationProvider");

    return context;
};

export { NotificationProvider, useNotificationContext };

export const NotificationContainer: React.FC = () => {
    const state = useNotificationContext();

    return (
        <>
            {state.show && (
                <Notification
                    type="alert"
                    title={state.title}
                    actions={state.actions}
                    description={state.description || ""}
                />
            )}
        </>
    );
};
