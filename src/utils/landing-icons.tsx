// Lazy-loaded icons for LandingPage to reduce initial bundle size
import type { LucideProps } from 'lucide-react';
import { Suspense, lazy } from 'react';

// Lazy load critical icons
const ClockIcon = lazy(() => import('lucide-react/dist/esm/icons/clock').then(m => ({ default: m.Clock })));
const ShieldIcon = lazy(() => import('lucide-react/dist/esm/icons/shield').then(m => ({ default: m.Shield })));
const TruckIcon = lazy(() => import('lucide-react/dist/esm/icons/truck').then(m => ({ default: m.Truck })));
const BarChart3Icon = lazy(() => import('lucide-react/dist/esm/icons/bar-chart-3').then(m => ({ default: m.BarChart3 })));
const UsersIcon = lazy(() => import('lucide-react/dist/esm/icons/users').then(m => ({ default: m.Users })));
const CalendarIcon = lazy(() => import('lucide-react/dist/esm/icons/calendar').then(m => ({ default: m.Calendar })));
const CheckCircleIcon = lazy(() => import('lucide-react/dist/esm/icons/check-circle').then(m => ({ default: m.CheckCircle })));
const StarIcon = lazy(() => import('lucide-react/dist/esm/icons/star').then(m => ({ default: m.Star })));
const ArrowRightIcon = lazy(() => import('lucide-react/dist/esm/icons/arrow-right').then(m => ({ default: m.ArrowRight })));
const MountainIcon = lazy(() => import('lucide-react/dist/esm/icons/mountain').then(m => ({ default: m.Mountain })));
const FactoryIcon = lazy(() => import('lucide-react/dist/esm/icons/factory').then(m => ({ default: m.Factory })));
const ZapIcon = lazy(() => import('lucide-react/dist/esm/icons/zap').then(m => ({ default: m.Zap })));
const TargetIcon = lazy(() => import('lucide-react/dist/esm/icons/target').then(m => ({ default: m.Target })));
const AwardIcon = lazy(() => import('lucide-react/dist/esm/icons/award').then(m => ({ default: m.Award })));
const PhoneIcon = lazy(() => import('lucide-react/dist/esm/icons/phone').then(m => ({ default: m.Phone })));
const MailIcon = lazy(() => import('lucide-react/dist/esm/icons/mail').then(m => ({ default: m.Mail })));
const MapPinIcon = lazy(() => import('lucide-react/dist/esm/icons/map-pin').then(m => ({ default: m.MapPin })));
const MenuIcon = lazy(() => import('lucide-react/dist/esm/icons/menu').then(m => ({ default: m.Menu })));
const XIcon = lazy(() => import('lucide-react/dist/esm/icons/x').then(m => ({ default: m.X })));

// Icon fallback component
const IconFallback = () => <div className="w-6 h-6" />;

// Wrapper component with Suspense
interface LazyLucideProps {
  children: React.ReactNode;
  className?: string;
}

// eslint-disable-next-line unused-imports/no-unused-vars
const LazyIcon: React.FC<LazyLucideProps> = ({ children, className }) => (
  <Suspense fallback={<IconFallback />}>
    <div className={className}>
      {children}
    </div>
  </Suspense>
);

// Export icons with Suspense wrapper
export const Clock = (props: LucideProps) => (
  <Suspense fallback={<IconFallback />}>
    <ClockIcon {...props} />
  </Suspense>
);

export const Shield = (props: LucideProps) => (
  <Suspense fallback={<IconFallback />}>
    <ShieldIcon {...props} />
  </Suspense>
);

export const Truck = (props: LucideProps) => (
  <Suspense fallback={<IconFallback />}>
    <TruckIcon {...props} />
  </Suspense>
);

export const BarChart3 = (props: LucideProps) => (
  <Suspense fallback={<IconFallback />}>
    <BarChart3Icon {...props} />
  </Suspense>
);

export const Users = (props: LucideProps) => (
  <Suspense fallback={<IconFallback />}>
    <UsersIcon {...props} />
  </Suspense>
);

export const Calendar = (props: LucideProps) => (
  <Suspense fallback={<IconFallback />}>
    <CalendarIcon {...props} />
  </Suspense>
);

export const CheckCircle = (props: LucideProps) => (
  <Suspense fallback={<IconFallback />}>
    <CheckCircleIcon {...props} />
  </Suspense>
);

export const Star = (props: LucideProps) => (
  <Suspense fallback={<IconFallback />}>
    <StarIcon {...props} />
  </Suspense>
);

export const ArrowRight = (props: LucideProps) => (
  <Suspense fallback={<IconFallback />}>
    <ArrowRightIcon {...props} />
  </Suspense>
);

export const Mountain = (props: LucideProps) => (
  <Suspense fallback={<IconFallback />}>
    <MountainIcon {...props} />
  </Suspense>
);

export const Factory = (props: LucideProps) => (
  <Suspense fallback={<IconFallback />}>
    <FactoryIcon {...props} />
  </Suspense>
);

export const Zap = (props: LucideProps) => (
  <Suspense fallback={<IconFallback />}>
    <ZapIcon {...props} />
  </Suspense>
);

export const Target = (props: LucideProps) => (
  <Suspense fallback={<IconFallback />}>
    <TargetIcon {...props} />
  </Suspense>
);

export const Award = (props: LucideProps) => (
  <Suspense fallback={<IconFallback />}>
    <AwardIcon {...props} />
  </Suspense>
);

export const Phone = (props: LucideProps) => (
  <Suspense fallback={<IconFallback />}>
    <PhoneIcon {...props} />
  </Suspense>
);

export const Mail = (props: LucideProps) => (
  <Suspense fallback={<IconFallback />}>
    <MailIcon {...props} />
  </Suspense>
);

export const MapPin = (props: LucideProps) => (
  <Suspense fallback={<IconFallback />}>
    <MapPinIcon {...props} />
  </Suspense>
);

export const Menu = (props: LucideProps) => (
  <Suspense fallback={<IconFallback />}>
    <MenuIcon {...props} />
  </Suspense>
);

export const X = (props: LucideProps) => (
  <Suspense fallback={<IconFallback />}>
    <XIcon {...props} />
  </Suspense>
);
