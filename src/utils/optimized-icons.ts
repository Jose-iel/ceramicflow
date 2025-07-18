// Optimized icon imports to reduce bundle size
// Instead of importing all icons from lucide-react, we import only what we need

import { lazy } from 'react';

// Lazy load individual icons
export const Plus = lazy(() => import('lucide-react/dist/esm/icons/plus').then(m => ({ default: m.Plus })));
export const Edit = lazy(() => import('lucide-react/dist/esm/icons/edit').then(m => ({ default: m.Edit })));
export const Trash2 = lazy(() => import('lucide-react/dist/esm/icons/trash-2').then(m => ({ default: m.Trash2 })));
export const Search = lazy(() => import('lucide-react/dist/esm/icons/search').then(m => ({ default: m.Search })));
export const Filter = lazy(() => import('lucide-react/dist/esm/icons/filter').then(m => ({ default: m.Filter })));
export const Calendar = lazy(() => import('lucide-react/dist/esm/icons/calendar').then(m => ({ default: m.Calendar })));
export const User = lazy(() => import('lucide-react/dist/esm/icons/user').then(m => ({ default: m.User })));
export const Car = lazy(() => import('lucide-react/dist/esm/icons/car').then(m => ({ default: m.Car })));
export const Truck = lazy(() => import('lucide-react/dist/esm/icons/truck').then(m => ({ default: m.Truck })));
export const Settings = lazy(() => import('lucide-react/dist/esm/icons/settings').then(m => ({ default: m.Settings })));
export const Wrench = lazy(() => import('lucide-react/dist/esm/icons/wrench').then(m => ({ default: m.Wrench })));
export const AlertTriangle = lazy(() =>
  import('lucide-react/dist/esm/icons/alert-triangle').then(m => ({ default: m.AlertTriangle }))
);
export const Clock = lazy(() => import('lucide-react/dist/esm/icons/clock').then(m => ({ default: m.Clock })));
export const MapPin = lazy(() => import('lucide-react/dist/esm/icons/map-pin').then(m => ({ default: m.MapPin })));
export const Users = lazy(() => import('lucide-react/dist/esm/icons/users').then(m => ({ default: m.Users })));
export const UserCheck = lazy(() => import('lucide-react/dist/esm/icons/user-check').then(m => ({ default: m.UserCheck })));
export const Mountain = lazy(() => import('lucide-react/dist/esm/icons/mountain').then(m => ({ default: m.Mountain })));
export const TreePine = lazy(() => import('lucide-react/dist/esm/icons/tree-pine').then(m => ({ default: m.TreePine })));
export const ShoppingCart = lazy(() =>
  import('lucide-react/dist/esm/icons/shopping-cart').then(m => ({ default: m.ShoppingCart }))
);
export const Flame = lazy(() => import('lucide-react/dist/esm/icons/flame').then(m => ({ default: m.Flame })));
export const CalendarDays = lazy(() =>
  import('lucide-react/dist/esm/icons/calendar-days').then(m => ({ default: m.CalendarDays }))
);
export const ChevronDown = lazy(() => import('lucide-react/dist/esm/icons/chevron-down').then(m => ({ default: m.ChevronDown })));
export const Download = lazy(() => import('lucide-react/dist/esm/icons/download').then(m => ({ default: m.Download })));
export const FileBarChart = lazy(() =>
  import('lucide-react/dist/esm/icons/file-bar-chart').then(m => ({ default: m.FileBarChart }))
);
export const Eye = lazy(() => import('lucide-react/dist/esm/icons/eye').then(m => ({ default: m.Eye })));
export const EyeOff = lazy(() => import('lucide-react/dist/esm/icons/eye-off').then(m => ({ default: m.EyeOff })));
export const Home = lazy(() => import('lucide-react/dist/esm/icons/home').then(m => ({ default: m.Home })));

// Common icons for dashboard/landing
export const Shield = lazy(() => import('lucide-react/dist/esm/icons/shield').then(m => ({ default: m.Shield })));
export const BarChart3 = lazy(() => import('lucide-react/dist/esm/icons/bar-chart-3').then(m => ({ default: m.BarChart3 })));
export const CheckCircle = lazy(() => import('lucide-react/dist/esm/icons/check-circle').then(m => ({ default: m.CheckCircle })));
export const Star = lazy(() => import('lucide-react/dist/esm/icons/star').then(m => ({ default: m.Star })));
export const ArrowRight = lazy(() => import('lucide-react/dist/esm/icons/arrow-right').then(m => ({ default: m.ArrowRight })));
export const Factory = lazy(() => import('lucide-react/dist/esm/icons/factory').then(m => ({ default: m.Factory })));
export const Zap = lazy(() => import('lucide-react/dist/esm/icons/zap').then(m => ({ default: m.Zap })));
export const Target = lazy(() => import('lucide-react/dist/esm/icons/target').then(m => ({ default: m.Target })));
export const Award = lazy(() => import('lucide-react/dist/esm/icons/award').then(m => ({ default: m.Award })));
export const Phone = lazy(() => import('lucide-react/dist/esm/icons/phone').then(m => ({ default: m.Phone })));
export const Mail = lazy(() => import('lucide-react/dist/esm/icons/mail').then(m => ({ default: m.Mail })));
export const Menu = lazy(() => import('lucide-react/dist/esm/icons/menu').then(m => ({ default: m.Menu })));
export const X = lazy(() => import('lucide-react/dist/esm/icons/x').then(m => ({ default: m.X })));

// Admin icons
export const Building2 = lazy(() => import('lucide-react/dist/esm/icons/building-2').then(m => ({ default: m.Building2 })));
export const RouteIcon = lazy(() => import('lucide-react/dist/esm/icons/route').then(m => ({ default: m.Route })));

// UI component icons
export const ChevronRight = lazy(() =>
  import('lucide-react/dist/esm/icons/chevron-right').then(m => ({ default: m.ChevronRight }))
);
export const ChevronLeft = lazy(() => import('lucide-react/dist/esm/icons/chevron-left').then(m => ({ default: m.ChevronLeft })));
export const MoreHorizontal = lazy(() =>
  import('lucide-react/dist/esm/icons/more-horizontal').then(m => ({ default: m.MoreHorizontal }))
);
export const ArrowLeft = lazy(() => import('lucide-react/dist/esm/icons/arrow-left').then(m => ({ default: m.ArrowLeft })));
export const Check = lazy(() => import('lucide-react/dist/esm/icons/check').then(m => ({ default: m.Check })));

// Operational icons
export const Gauge = lazy(() => import('lucide-react/dist/esm/icons/gauge').then(m => ({ default: m.Gauge })));
export const Info = lazy(() => import('lucide-react/dist/esm/icons/info').then(m => ({ default: m.Info })));
export const CalendarIcon = lazy(() => import('lucide-react/dist/esm/icons/calendar').then(m => ({ default: m.Calendar })));
