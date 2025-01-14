import { useNotificationContext } from "../notification-context";

export const useCopyText = ({
    text,
    title,
    description,
}: {
    text: string;
    title: string;
    description: string;
}): { copyText: () => void } => {
    const { setState: setNotification } = useNotificationContext();

    return {
        copyText: () => {
            navigator.clipboard.writeText(text);
            setNotification({
                show: true,
                title: title,
                description: description,
                actions: [
                    {
                        title: "Close",
                        onAction() {
                            setNotification({ show: false });
                        },
                    },
                ],
            });

            setTimeout(() => {
                setNotification({ show: false });
            }, 5000);
        },
    };
};
