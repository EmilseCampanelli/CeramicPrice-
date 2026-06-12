import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline, Ellipse } from 'react-native-svg';
import { colors } from '../theme';

export type IconName =
  | 'mail' | 'lock' | 'eye' | 'eye-off'
  | 'home' | 'calculator' | 'settings'
  | 'user' | 'box' | 'flame' | 'beaker' | 'jar'
  | 'chevron-right' | 'chevron-left' | 'chevron-down'
  | 'plus' | 'trash' | 'clock' | 'check' | 'x'
  | 'layers' | 'spark' | 'drop' | 'temp'
  | 'cup' | 'bowl' | 'plate' | 'vase' | 'mug' | 'other'
  | 'arrow-right' | 'arrow-left' | 'save'
  | 'info' | 'percent' | 'edit';

interface Props {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const STROKE = 1.8;

export default function Icon({ name, size = 20, color = colors.ink, strokeWidth = STROKE }: Props) {
  const props = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  const vb = `0 0 24 24`;

  const paths: Record<IconName, React.ReactNode> = {
    mail: (
      <>
        <Rect x="2" y="4" width="20" height="16" rx="2" {...props} />
        <Path d="M2 8l10 6 10-6" {...props} />
      </>
    ),
    lock: (
      <>
        <Rect x="5" y="11" width="14" height="10" rx="2" {...props} />
        <Path d="M8 11V7a4 4 0 018 0v4" {...props} />
      </>
    ),
    eye: (
      <>
        <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" {...props} />
        <Circle cx="12" cy="12" r="3" {...props} />
      </>
    ),
    'eye-off': (
      <>
        <Path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" {...props} />
        <Path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" {...props} />
        <Path d="M1 1l22 22" {...props} />
      </>
    ),
    home: (
      <>
        <Path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" {...props} />
        <Path d="M9 21V12h6v9" {...props} />
      </>
    ),
    calculator: (
      <>
        <Rect x="4" y="2" width="16" height="20" rx="3" {...props} />
        <Path d="M8 7h8M8 12h2M12 12h2M16 12h0M8 16h2M12 16h2M16 16h0" {...props} />
      </>
    ),
    settings: (
      <>
        <Circle cx="12" cy="12" r="3" {...props} />
        <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" {...props} />
      </>
    ),
    user: (
      <>
        <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" {...props} />
        <Circle cx="12" cy="7" r="4" {...props} />
      </>
    ),
    box: (
      <>
        <Path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" {...props} />
        <Path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" {...props} />
      </>
    ),
    flame: (
      <>
        <Path d="M12 2c0 6-6 8-6 14a6 6 0 0012 0c0-6-6-8-6-14z" {...props} />
        <Path d="M12 2c0 4 3 5.5 3 9a3 3 0 01-6 0c0-3.5 3-5 3-9z" {...props} />
      </>
    ),
    beaker: (
      <>
        <Path d="M9 3h6v7l4 9a1 1 0 01-.9 1.5H5.9A1 1 0 015 19l4-9V3z" {...props} />
        <Path d="M6.5 14h11" {...props} />
      </>
    ),
    jar: (
      <>
        <Path d="M8 3h8M7 7h10l1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L7 7z" {...props} />
        <Path d="M9 3v4M15 3v4" {...props} />
      </>
    ),
    'chevron-right': <Path d="M9 18l6-6-6-6" {...props} />,
    'chevron-left': <Path d="M15 18l-6-6 6-6" {...props} />,
    'chevron-down': <Path d="M6 9l6 6 6-6" {...props} />,
    plus: (
      <>
        <Line x1="12" y1="5" x2="12" y2="19" {...props} />
        <Line x1="5" y1="12" x2="19" y2="12" {...props} />
      </>
    ),
    trash: (
      <>
        <Polyline points="3 6 5 6 21 6" {...props} />
        <Path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" {...props} />
        <Path d="M10 11v6M14 11v6" {...props} />
        <Path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" {...props} />
      </>
    ),
    clock: (
      <>
        <Circle cx="12" cy="12" r="10" {...props} />
        <Path d="M12 6v6l4 2" {...props} />
      </>
    ),
    check: <Polyline points="20 6 9 17 4 12" {...props} />,
    x: (
      <>
        <Line x1="18" y1="6" x2="6" y2="18" {...props} />
        <Line x1="6" y1="6" x2="18" y2="18" {...props} />
      </>
    ),
    layers: (
      <>
        <Polyline points="12 2 2 7 12 12 22 7 12 2" {...props} />
        <Polyline points="2 17 12 22 22 17" {...props} />
        <Polyline points="2 12 12 17 22 12" {...props} />
      </>
    ),
    spark: (
      <>
        <Path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" {...props} />
      </>
    ),
    drop: (
      <>
        <Path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" {...props} />
      </>
    ),
    temp: (
      <>
        <Path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" {...props} />
      </>
    ),
    cup: (
      <>
        <Path d="M6 3h12v10a4 4 0 01-4 4H10a4 4 0 01-4-4V3z" {...props} />
        <Path d="M18 7h2a2 2 0 010 4h-2" {...props} />
        <Path d="M8 21h8M12 17v4" {...props} />
      </>
    ),
    bowl: (
      <>
        <Path d="M3 11h18a9 9 0 01-18 0z" {...props} />
        <Path d="M12 20v1M7 21h10" {...props} />
      </>
    ),
    plate: (
      <>
        <Ellipse cx="12" cy="12" rx="10" ry="3" {...props} />
        <Path d="M2 12c0 4 4.5 7 10 7s10-3 10-7" {...props} />
      </>
    ),
    vase: (
      <>
        <Path d="M8 3h8c1 4 2 6 2 9a6 6 0 01-12 0c0-3 1-5 2-9z" {...props} />
        <Path d="M10 3V2M14 3V2" {...props} />
        <Path d="M9 21h6" {...props} />
      </>
    ),
    mug: (
      <>
        <Path d="M4 4h12v12a3 3 0 01-3 3H7a3 3 0 01-3-3V4z" {...props} />
        <Path d="M16 8h3a2 2 0 010 4h-3" {...props} />
        <Path d="M6 22h8" {...props} />
      </>
    ),
    other: (
      <>
        <Circle cx="12" cy="12" r="1" fill={color} stroke="none" />
        <Circle cx="19" cy="12" r="1" fill={color} stroke="none" />
        <Circle cx="5" cy="12" r="1" fill={color} stroke="none" />
      </>
    ),
    'arrow-right': (
      <>
        <Line x1="5" y1="12" x2="19" y2="12" {...props} />
        <Polyline points="12 5 19 12 12 19" {...props} />
      </>
    ),
    'arrow-left': (
      <>
        <Line x1="19" y1="12" x2="5" y2="12" {...props} />
        <Polyline points="12 19 5 12 12 5" {...props} />
      </>
    ),
    save: (
      <>
        <Path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" {...props} />
        <Polyline points="17 21 17 13 7 13 7 21" {...props} />
        <Polyline points="7 3 7 8 15 8" {...props} />
      </>
    ),
    info: (
      <>
        <Circle cx="12" cy="12" r="10" {...props} />
        <Line x1="12" y1="8" x2="12" y2="12" {...props} />
        <Line x1="12" y1="16" x2="12.01" y2="16" {...props} />
      </>
    ),
    percent: (
      <>
        <Line x1="19" y1="5" x2="5" y2="19" {...props} />
        <Circle cx="6.5" cy="6.5" r="2.5" {...props} />
        <Circle cx="17.5" cy="17.5" r="2.5" {...props} />
      </>
    ),
    edit: (
      <>
        <Path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" {...props} />
        <Path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" {...props} />
      </>
    ),
  };

  return (
    <Svg width={size} height={size} viewBox={vb}>
      {paths[name]}
    </Svg>
  );
}
