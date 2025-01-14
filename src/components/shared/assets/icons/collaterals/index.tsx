import React from "react";
import { css, styled } from "twin.macro";

import ankrETH from "./ankrETH.svg?url";
import cbETH from "./cbETH.svg?url";
import ENA from "./ENA.svg?url";
import ETHFI from "./ETHFI.svg?url";
import ETHx from "./ETHx.svg?url";
import FXS from "./FXS.svg?url";
import LBTC from "./LBTC.svg?url";
import LsETH from "./LsETH.svg?url";
import MANTA from "./MANTA.svg?url";
import mETH from "./mETH.svg?url";
import OETH from "./OETH.svg?url";
import osETH from "./osETH.svg?url";
import rETH from "./rETH.svg?url";
import sfrxETH from "./sfrxETH.svg?url";
import stETH from "./stETH.svg?url";
import sUSDe from "./sUSDe.svg?url";
import SWELL from "./SWELL.svg?url";
import swETH from "./swETH.svg?url";
import tBTC from "./tBTC.svg?url";
import wBETH from "./wBETH.svg?url";
import WBTC from "./WBTC.svg?url";
import wOETH from "./wOETH.svg?url";
import wstETH from "./wstETH.svg?url";

export const collateralIcons: Record<string, React.FC> = {
    ankrETH: (props) => <SvgDiv bg={ankrETH} {...props} />,
    cbETH: (props) => <SvgDiv bg={cbETH} {...props} />,
    ETHx: (props) => <SvgDiv bg={ETHx} {...props} />,
    LsETH: (props) => <SvgDiv bg={LsETH} {...props} />,
    mETH: (props) => <SvgDiv bg={mETH} {...props} />,
    OETH: (props) => <SvgDiv bg={OETH} {...props} />,
    osETH: (props) => <SvgDiv bg={osETH} {...props} />,
    rETH: (props) => <SvgDiv bg={rETH} {...props} />,
    sfrxETH: (props) => <SvgDiv bg={sfrxETH} {...props} />,
    stETH: (props) => <SvgDiv bg={stETH} {...props} />,
    swETH: (props) => <SvgDiv bg={swETH} {...props} />,
    wBETH: (props) => <SvgDiv bg={wBETH} {...props} />,
    wOETH: (props) => <SvgDiv bg={wOETH} {...props} />,
    wstETH: (props) => <SvgDiv bg={wstETH} {...props} />,
    ENA: (props) => <SvgDiv bg={ENA} {...props} />,
    sUSDe: (props) => <SvgDiv bg={sUSDe} {...props} />,
    tBTC: (props) => <SvgDiv bg={tBTC} {...props} />,
    WBTC: (props) => <SvgDiv bg={WBTC} {...props} />,
    ETHFI: (props) => <SvgDiv bg={ETHFI} {...props} />,
    FXS: (props) => <SvgDiv bg={FXS} {...props} />,
    LBTC: (props) => <SvgDiv bg={LBTC} {...props} />,
    SWELL: (props) => <SvgDiv bg={SWELL} {...props} />,
    MANTA: (props) => <SvgDiv bg={MANTA} {...props} />,
};

const SvgDiv = styled.div<{ bg: string }>`
    ${(props) => css`
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-size: cover;
        background-image: url("${props.bg}");
    `}
`;
