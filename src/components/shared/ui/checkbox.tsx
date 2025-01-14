import React from "react";
import tw, { styled } from "twin.macro";

type Props = {
    isChecked: boolean;
    className?: string;
    onToggle: (checked: boolean) => void;
};

const CheckboxContainer = styled.div`
    ${tw`flex cursor-pointer items-center`}
`;

const HiddenCheckbox = styled.input`
    ${tw`hidden`}
`;

const StyledCheckbox = styled.div<{ checked: boolean }>`
    ${tw`relative flex h-8 w-8 items-center justify-center border-4`}
    border-color: var(--border-color);

    &:after {
        content: "";
        ${tw`absolute inset-0`}
        background-color: ${({ checked }) => (checked ? "var(--accent)" : "#0d0d0d")};
    }
`;

export const Checkbox: React.FC<Props> = ({ isChecked, className, onToggle }) => {
    const handleToggle = () => {
        onToggle(!isChecked);
    };

    return (
        <CheckboxContainer className={className} onClick={handleToggle}>
            <HiddenCheckbox type="checkbox" checked={isChecked} readOnly />
            <StyledCheckbox checked={isChecked} />
        </CheckboxContainer>
    );
};
