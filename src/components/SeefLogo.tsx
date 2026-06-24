type LogoVariant = 'full' | 'mark';
type LogoSize = 'sm' | 'md' | 'lg' | 'xl' | 'header' | 'display';

/** Mark logos scale by height; full wordmark scales by width so text stays legible without a tall header. */
const MARK_HEIGHT: Record<Exclude<LogoSize, 'header' | 'display'>, string> = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-12',
  xl: 'h-14',
};

const FULL_WIDTH: Record<Exclude<LogoSize, 'header' | 'display'>, string> = {
  sm: 'w-28',
  md: 'w-36 sm:w-40',
  lg: 'w-44 sm:w-48',
  xl: 'w-52 sm:w-56',
};

/** Sticky header — readable wordmark in a compact row (not full 300px layout height). */
const HEADER_FULL = {
  box: 'inline-flex h-20 w-[12rem] sm:w-[13rem] items-center overflow-hidden',
  image: 'block w-full h-auto shrink-0',
};

/** Prominent mark (login, hero) — fixed 300px height (readable, less than 400px test). */
const DISPLAY_MARK = 'block w-auto h-[300px] max-w-full object-contain object-left';

interface Props {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  alt?: string;
  /** @deprecated use variant="mark" */
  showText?: boolean;
  /** @deprecated ignored — logos are transparent PNGs */
  onDark?: boolean;
  /** @deprecated ignored */
  theme?: 'light' | 'dark';
}

export default function SeefLogo({
  variant,
  size = 'md',
  className = '',
  alt = 'Sindh Education Endowment Foundation',
  showText,
}: Props) {
  const resolvedVariant = variant ?? (showText === false ? 'mark' : 'full');
  const src = resolvedVariant === 'full' ? '/seef-logo-full.png' : '/seef-logo-mark.png';

  if (size === 'header' && resolvedVariant === 'full') {
    return (
      <span className={`${HEADER_FULL.box} ${className}`}>
        <img src={src} alt={alt} className={HEADER_FULL.image} />
      </span>
    );
  }

  if (size === 'display' && resolvedVariant === 'mark') {
    return (
      <img src={src} alt={alt} className={`${DISPLAY_MARK} ${className}`} />
    );
  }

  const resolvedSize = size === 'header' || size === 'display' ? 'md' : size;
  const imgClass = resolvedVariant === 'full'
    ? `block ${FULL_WIDTH[resolvedSize]} h-auto object-contain object-left`
    : `block w-auto object-contain object-left ${MARK_HEIGHT[resolvedSize]}`;

  return (
    <img
      src={src}
      alt={alt}
      className={`${imgClass} ${className}`}
    />
  );
}
