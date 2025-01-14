import tw, { styled } from "twin.macro";

export const TextsContainer = tw.div`flex flex-col justify-center gap-1`;
export const TopText = styled.div<{ $noData?: boolean }>`
    ${tw`flex flex-row flex-nowrap items-center gap-2 text-20-24 max-xl:text-16-18`}
    ${({ $noData }) => ($noData ? tw`text-[var(--light-black-color-50)]` : "")}
`;
export const TopTextAccent = styled(TopText)<{ $noData?: boolean }>`
    ${({ $noData }) => (!$noData ? tw`text-[var(--accent)]` : "")}
`;
export const BottomText = tw.div`overflow-hidden truncate text-ellipsis text-14-18 text-[var(--light-black-color-50)] max-xl:text-12-16`;
