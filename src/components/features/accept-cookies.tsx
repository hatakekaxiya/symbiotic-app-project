import React, { useEffect, useMemo, useState } from "react";

import { Notification } from "@/components/shared/ui/notification";

export const AcceptCookies: React.FC = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        const hasAcceptedCookies = localStorage.getItem("hasAcceptedCookies");
        if (!hasAcceptedCookies) {
            setIsVisible(true);
        }
    }, []);

    const { handleOnlyRequired, handleAll } = useMemo(
        () => ({
            handleOnlyRequired: () => {
                localStorage.setItem("hasAcceptedCookies", "true");
                setIsVisible(false);
            },
            handleAll: () => {
                localStorage.setItem("hasAcceptedCookies", "true");
                setIsVisible(false);
            },
        }),
        [],
    );

    if (!isVisible) {
        return null;
    }

    return (
        <Notification
            title="PRIVACY NOTICE"
            description="We may store or retrieve information in the form of cookies, to ensure the site works as intended."
            actions={[
                {
                    title: "Only required",
                    variant: "secondary",
                    onAction: handleOnlyRequired,
                },
                {
                    title: "Allow all",
                    onAction: handleAll,
                },
            ]}
        />
    );
};
