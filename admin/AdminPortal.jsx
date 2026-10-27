import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  Tags,
  ShoppingBag,
  CreditCard,
  RotateCcw,
  Star,
  TicketPercent,
  ShieldCheck,
  AlertTriangle,
  Bell,
  BarChart3,
  Settings,
  Search,
  X,
  Menu,
  LogOut,
  Crown,
  Eye,
  EyeOff,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Filter,
  Download,
  Building2,
  RefreshCw,
  Send,
  Lock,
  KeyRound,
  Check,
  Truck,
  IndianRupee,
  MessageSquare,
  Activity,
  Home,
  ChevronRight,
  ChevronDown,
  Sparkles,
  SlidersHorizontal,
  UserPlus,
  FolderPlus,
  ChevronLeft
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import adminService from './adminService';

// Sample mock analytics charts data
const salesOverviewData = [
  { month: 'Jan', revenue: 240000, profit: 48000, orders: 420 },
  { month: 'Feb', revenue: 310000, profit: 62000, orders: 580 },
  { month: 'Mar', revenue: 280000, profit: 54000, orders: 510 },
  { month: 'Apr', revenue: 420000, profit: 89000, orders: 790 },
  { month: 'May', revenue: 560000, profit: 122000, orders: 1040 },
  { month: 'Jun', revenue: 680000, profit: 154000, orders: 1280 },
  { month: 'Jul', revenue: 840000, profit: 198000, orders: 1480 },
];

const userGrowthData = [
  { month: 'Jan', customers: 1200, sellers: 120 },
  { month: 'Feb', customers: 2400, sellers: 210 },
  { month: 'Mar', customers: 4100, sellers: 340 },
  { month: 'Apr', customers: 6800, sellers: 480 },
  { month: 'May', customers: 9500, sellers: 620 },
  { month: 'Jun', customers: 12400, sellers: 740 },
  { month: 'Jul', customers: 14892, sellers: 842 },
];

const categoryDistribution = [
  { name: 'Women Ethnic', value: 38, color: '#9F2089' },
  { name: 'Western Wear', value: 24, color: '#F43397' },
  { name: 'Men Fashion', value: 18, color: '#038D63' },
  { name: 'Home & Kitchen', value: 12, color: '#FF8A00' },
  { name: 'Electronics', value: 8, color: '#7D126C' },
];

// Initial mock datasets for all 15 sections
const INITIAL_SELLERS = [
  {
    id: 's_101',
    businessName: 'Fashion Hub Surat',
    contactPerson: 'Amit Verma',
    phone: '+91 98765 43211',
    email: 'seller@shopio.com',
    productsCount: 42,
    rating: 4.8,
    kycStatus: 'Verified',
    status: 'Approved',
    ordersCount: 312,
    revenue: '₹4,89,000',
    joinedDate: '12 Jan 2026',
    pan: 'ABCDE1234F',
    gst: '24ABCDE1234F1Z5',
    bank: 'HDFC Bank · A/c 50100492812 · HDFC000124',
  },
  {
    id: 's_102',
    businessName: 'Royal Kurtis Jaipur',
    contactPerson: 'Pooja Agarwal',
    phone: '+91 94220 88990',
    email: 'pooja.jaipur@gmail.com',
    productsCount: 28,
    rating: 4.6,
    kycStatus: 'Verified',
    status: 'Approved',
    ordersCount: 184,
    revenue: '₹2,42,000',
    joinedDate: '01 Feb 2026',
    pan: 'JKLMN5678P',
    gst: '08JKLMN5678P1Z8',
    bank: 'SBI · A/c 3094829104 · SBIN000452',
  },
  {
    id: 's_103',
    businessName: 'Nexus Tech Accessories',
    contactPerson: 'Vikas Mehta',
    phone: '+91 98231 44556',
    email: 'vikas.nexus@outlook.com',
    productsCount: 15,
    rating: 4.1,
    kycStatus: 'Pending',
    status: 'Pending',
    ordersCount: 45,
    revenue: '₹68,500',
    joinedDate: '15 Mar 2026',
    pan: 'PQRSX9921M',
    gst: '27PQRSX9921M1Z2',
    bank: 'ICICI Bank · A/c 1029482710 · ICIC000084',
  },
  {
    id: 's_104',
    businessName: 'Classic Leather Footwear',
    contactPerson: 'Suresh Patel',
    phone: '+91 97112 33445',
    email: 'suresh.leather@gmail.com',
    productsCount: 8,
    rating: 3.2,
    kycStatus: 'Rejected',
    status: 'Suspended',
    ordersCount: 12,
    revenue: '₹14,200',
    joinedDate: '20 Feb 2026',
    pan: 'BXYZP4412K',
    gst: '24BXYZP4412K1Z9',
    bank: 'Axis Bank · A/c 9180294812 · UTIB000192',
  },
  {
    id: 's_105',
    businessName: 'Solapur Handloom Weavers',
    contactPerson: 'Swapnil Gaikwad',
    phone: '+91 98211 44332',
    email: 'swapnil.solapur@gmail.com',
    productsCount: 36,
    rating: 4.7,
    kycStatus: 'Verified',
    status: 'Approved',
    ordersCount: 142,
    revenue: '₹1,68,000',
    joinedDate: '28 Jan 2026',
    pan: 'ABCDE9876Q',
    gst: '27ABCDE9876Q1Z4',
    bank: 'Bank of Maharashtra · A/c 6023918234 · MAHB000018',
  },
  {
    id: 's_106',
    businessName: 'Kolhapuri Heritage Footwear',
    contactPerson: 'Ramesh Powar',
    phone: '+91 98224 88110',
    email: 'ramesh.kolhapuri@gmail.com',
    productsCount: 22,
    rating: 4.9,
    kycStatus: 'Verified',
    status: 'Approved',
    ordersCount: 98,
    revenue: '₹1,15,400',
    joinedDate: '05 Feb 2026',
    pan: 'KLMNO4321R',
    gst: '27KLMNO4321R1Z1',
    bank: 'Canara Bank · A/c 4019283741 · CNRB000214',
  },
  {
    id: 's_107',
    businessName: 'Pune Organic Ayurvedic Essentials',
    contactPerson: 'Dr. Sunita Kulkarni',
    phone: '+91 94230 55112',
    email: 'sunita.ayur@gmail.com',
    productsCount: 19,
    rating: 4.5,
    kycStatus: 'Pending',
    status: 'Pending',
    ordersCount: 38,
    revenue: '₹47,200',
    joinedDate: '10 Mar 2026',
    pan: 'UVXYZ5678S',
    gst: '27UVXYZ5678S1Z3',
    bank: 'Kotak Bank · A/c 8019283411 · KKBK000045',
  },
  {
    id: 's_108',
    businessName: 'Eastern Silk & Khadi Weaves',
    contactPerson: 'Manish Agarwal',
    phone: '+91 98300 77112',
    email: 'manish.eastern@gmail.com',
    productsCount: 50,
    rating: 4.8,
    kycStatus: 'Verified',
    status: 'Approved',
    ordersCount: 168,
    revenue: '₹1,98,000',
    joinedDate: '10 Jan 2026',
    pan: 'GHJKL1122T',
    gst: '19GHJKL1122T1Z9',
    bank: 'Punjab National Bank · A/c 1928374011 · PUNB001920',
  },
];

const INITIAL_ORDERS = [
  {
    id: 'ORD-789123',
    customer: 'Chetan Pazi',
    customerEmail: 'chetan.pazi@gmail.com',
    seller: 'Fashion Hub Surat',
    product: 'Kanjivaram Soft Silk Saree',
    amount: 1499,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    date: '26 Sep 2026, 11:20 AM',
    paymentMethod: 'UPI (GPay)',
  },
  {
    id: 'ORD-789124',
    customer: 'Sneha Patil',
    customerEmail: 'sneha.patil@outlook.com',
    seller: 'Royal Kurtis Jaipur',
    product: 'Embroidered Anarkali Kurti',
    amount: 799,
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    date: '26 Sep 2026, 10:45 AM',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'ORD-789125',
    customer: 'Rajesh Deshmukh',
    customerEmail: 'rajesh.d@rediffmail.com',
    seller: 'Nexus Tech Accessories',
    product: 'boAt Rockerz 450 Bluetooth Headphones',
    amount: 1299,
    paymentStatus: 'Pending',
    orderStatus: 'Pending',
    date: '26 Sep 2026, 09:15 AM',
    paymentMethod: 'Cash on Delivery (COD)',
  },
  {
    id: 'ORD-789126',
    customer: 'Priya Sharma',
    customerEmail: 'priya.sharma99@gmail.com',
    seller: 'Fashion Hub Surat',
    product: 'Cotton Printed Daily Wear Kurti',
    amount: 499,
    paymentStatus: 'Paid',
    orderStatus: 'Out for Delivery',
    date: '25 Sep 2026, 04:30 PM',
    paymentMethod: 'UPI (PhonePe)',
  },
  {
    id: 'ORD-789127',
    customer: 'Aniket Kulkarni',
    customerEmail: 'aniket.k@gmail.com',
    seller: 'Royal Kurtis Jaipur',
    product: 'Men Regular Fit Denim Shirt',
    amount: 899,
    paymentStatus: 'Refunded',
    orderStatus: 'Returned',
    date: '24 Sep 2026, 02:10 PM',
    paymentMethod: 'NetBanking',
  },
  {
    id: 'ORD-789128',
    customer: 'Meera Iyer',
    customerEmail: 'meera.iyer@gmail.com',
    seller: 'Fashion Hub Surat',
    product: 'Banarasi Soft Silk Rich Pallu Saree',
    amount: 1799,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    date: '24 Sep 2026, 01:15 PM',
    paymentMethod: 'UPI (Paytm)',
  },
  {
    id: 'ORD-789129',
    customer: 'Aniket Shinde',
    customerEmail: 'aniket.shinde@gmail.com',
    seller: 'Solapur Handloom Weavers',
    product: 'Pure Cotton Double Bed Sheet with 2 Pillow Covers',
    amount: 649,
    paymentStatus: 'Paid',
    orderStatus: 'Out for Delivery',
    date: '24 Sep 2026, 11:30 AM',
    paymentMethod: 'UPI (PhonePe)',
  },
  {
    id: 'ORD-789130',
    customer: 'Rohit More',
    customerEmail: 'rohit.more@techmail.com',
    seller: 'Classic Leather Footwear',
    product: 'Sports Running Shoes - Men Lightweight Cushion',
    amount: 1299,
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    date: '23 Sep 2026, 05:40 PM',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'ORD-789131',
    customer: 'Shreya Deshpande',
    customerEmail: 'shreya.d@gmail.com',
    seller: 'Fashion Hub Surat',
    product: 'Royal 24K Gold Plated Choker & Earrings Set',
    amount: 599,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    date: '23 Sep 2026, 03:20 PM',
    paymentMethod: 'UPI (GPay)',
  },
  {
    id: 'ORD-789132',
    customer: 'Sachin Kamble',
    customerEmail: 'sachin.kamble@outlook.com',
    seller: 'Nexus Tech Accessories',
    product: 'Noise ColorFit Pulse 2 Max 1.85" Calling Smartwatch',
    amount: 849,
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    date: '23 Sep 2026, 10:10 AM',
    paymentMethod: 'UPI (PhonePe)',
  },
  {
    id: 'ORD-789133',
    customer: 'Sheetal Mane',
    customerEmail: 'sheetal.mane@gmail.com',
    seller: 'Kolhapuri Heritage Footwear',
    product: 'Handcrafted Traditional Kolhapuri Chappal',
    amount: 499,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    date: '22 Sep 2026, 06:15 PM',
    paymentMethod: 'Cash on Delivery (COD)',
  },
  {
    id: 'ORD-789134',
    customer: 'Vijay Bhosale',
    customerEmail: 'vijay.bhosale@gmail.com',
    seller: 'Royal Kurtis Jaipur',
    product: "Men's Slim Fit Casual Denim Jacket",
    amount: 799,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    date: '22 Sep 2026, 02:45 PM',
    paymentMethod: 'UPI (GPay)',
  },
  {
    id: 'ORD-789135',
    customer: 'Pallavi Sawant',
    customerEmail: 'pallavi.sawant@gmail.com',
    seller: 'Fashion Hub Surat',
    product: 'Rayon Anarkali Kurti with Chiffon Dupatta',
    amount: 549,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    date: '21 Sep 2026, 04:10 PM',
    paymentMethod: 'UPI (PhonePe)',
  },
];

const INITIAL_COMPLAINTS = [
  {
    id: 'CMP-1001',
    user: 'Rajesh Deshmukh',
    orderId: 'ORD-789125',
    issue: 'Delivery delayed past promised date',
    date: '26 Sep 2026',
    priority: 'High',
    status: 'In Progress',
    assignedAdmin: 'Support Admin (Neha)',
  },
  {
    id: 'CMP-1002',
    user: 'Pooja Agarwal (Seller)',
    orderId: 'ORD-789120',
    issue: 'Customer initiated return with damaged item',
    date: '25 Sep 2026',
    priority: 'Medium',
    status: 'Open',
    assignedAdmin: 'Order Admin (Karan)',
  },
  {
    id: 'CMP-1003',
    user: 'Sunil Rao',
    orderId: 'ORD-789098',
    issue: 'Refund not credited to bank account after 5 days',
    date: '24 Sep 2026',
    priority: 'High',
    status: 'Resolved',
    assignedAdmin: 'Super Admin (Platform)',
  },
  {
    id: 'CMP-1004',
    user: 'Tanmay Jadhav',
    orderId: 'ORD-789055',
    issue: 'Account suspended for excessive returns; appeal requested',
    date: '23 Sep 2026',
    priority: 'Low',
    status: 'Under Review',
    assignedAdmin: 'Trust & Safety (Gaurav)',
  },
  {
    id: 'CMP-1005',
    user: 'Dr. Sunita Kulkarni (Seller)',
    orderId: 'KYC-SELLER-107',
    issue: 'KYC GST document verification pending past 48 hours',
    date: '22 Sep 2026',
    priority: 'Medium',
    status: 'Resolved',
    assignedAdmin: 'Seller Onboarding (Pooja)',
  },
  {
    id: 'CMP-1006',
    user: 'Vikram Rathi',
    orderId: 'ORD-789112',
    issue: 'Wrong size delivered: Requested L instead of M replacement',
    date: '21 Sep 2026',
    priority: 'Medium',
    status: 'In Progress',
    assignedAdmin: 'Returns Team (Sachin)',
  },
];

const INITIAL_COUPONS = [
  {
    code: 'SHOPIO100',
    discount: '₹100 FLAT OFF',
    minSpend: '₹499',
    validTill: '31 Dec 2026',
    usageCount: 4210,
    status: 'Active',
  },
  {
    code: 'FASHION20',
    discount: '20% OFF',
    minSpend: '₹999',
    validTill: '15 Nov 2026',
    usageCount: 1850,
    status: 'Active',
  },
  {
    code: 'FREESHIP',
    discount: '100% Free Delivery',
    minSpend: '₹199',
    validTill: '30 Oct 2026',
    usageCount: 9420,
    status: 'Active',
  },
  {
    code: 'FIRSTORDER',
    discount: '₹75 OFF on First Order',
    minSpend: '₹299',
    validTill: '31 Dec 2026',
    usageCount: 12400,
    status: 'Active',
  },
  {
    code: 'FESTIVE30',
    discount: '30% OFF on Ethnic Wear',
    minSpend: '₹1499',
    validTill: '20 Nov 2026',
    usageCount: 3150,
    status: 'Active',
  },
  {
    code: 'RESELLERVIP',
    discount: 'Extra 5% Reseller Margin Bonus',
    minSpend: '₹1999',
    validTill: '31 Dec 2026',
    usageCount: 840,
    status: 'Active',
  },
];

const ROLE_PERMISSIONS_MATRIX = {
  'Super Admin': {
    view: true,
    create: true,
    edit: true,
    delete: true,
    approve: true,
    reject: true,
    manageUsers: true,
    manageSellers: true,
    manageOrders: true,
    manageProducts: true,
    manageComplaints: true,
  },
  Admin: {
    view: true,
    create: true,
    edit: true,
    delete: false,
    approve: true,
    reject: true,
    manageUsers: true,
    manageSellers: true,
    manageOrders: true,
    manageProducts: true,
    manageComplaints: true,
  },
  'Order Admin': {
    view: true,
    create: false,
    edit: true,
    delete: false,
    approve: true,
    reject: true,
    manageUsers: false,
    manageSellers: false,
    manageOrders: true,
    manageProducts: false,
    manageComplaints: true,
  },
  'Product Admin': {
    view: true,
    create: true,
    edit: true,
    delete: false,
    approve: true,
    reject: true,
    manageUsers: false,
    manageSellers: false,
    manageOrders: false,
    manageProducts: true,
    manageComplaints: false,
  },
  'Support Admin': {
    view: true,
    create: false,
    edit: true,
    delete: false,
    approve: false,
    reject: false,
    manageUsers: true,
    manageSellers: false,
    manageOrders: false,
    manageProducts: false,
    manageComplaints: true,
  },
};


// Lightweight SVG Sparkline component for KPI cards
function Sparkline({ data, color = '#F43397', height = 32, width = 74 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * (width - 4) + 2;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible shrink-0">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

// Sparkline series for the 8 KPI cards
const KPI_SPARKLINES = {
  users: [11200, 11800, 12400, 12900, 13400, 14100, 14892],
  sellers: [620, 680, 710, 740, 790, 815, 842],
  products: [2800, 2950, 3100, 3280, 3420, 3540, 3620],
  orders: [1020, 1140, 1210, 1280, 1340, 1410, 1480],
  revenue: [28000, 31000, 34000, 37000, 39500, 41200, 42856],
  pendingOrders: [38, 34, 32, 35, 30, 29, 28],
  pendingKyc: [22, 19, 18, 16, 17, 15, 14],
  pendingComplaints: [12, 10, 11, 9, 8, 8, 7],
};

// 12-Month Sales & Revenue Data matching screenshot (Jan - Dec)
const TWELVE_MONTH_SALES_DATA = [
  { month: 'Jan', revenue: 24000, profit: 8000 },
  { month: 'Feb', revenue: 29000, profit: 11000 },
  { month: 'Mar', revenue: 27000, profit: 9800 },
  { month: 'Apr', revenue: 33000, profit: 13500 },
  { month: 'May', revenue: 39000, profit: 16800 },
  { month: 'Jun', revenue: 46000, profit: 19500 },
  { month: 'Jul', revenue: 53000, profit: 24500 },
  { month: 'Aug', revenue: 61000, profit: 28500 },
  { month: 'Sep', revenue: 70000, profit: 34000 },
  { month: 'Oct', revenue: 79000, profit: 41000 },
  { month: 'Nov', revenue: 89000, profit: 48500 },
  { month: 'Dec', revenue: 98000, profit: 54000 },
];

// Top sales categories matching screenshot
const CATEGORY_DISTRIBUTION_CHART = [
  { name: 'Fashion', value: 34, color: '#9F2089' },
  { name: 'Electronics', value: 22, color: '#F43397' },
  { name: 'Home & Living', value: 18, color: '#0284C7' },
  { name: 'Beauty & Health', value: 12, color: '#10B981' },
  { name: 'Sports', value: 8, color: '#F59E0B' },
  { name: 'Others', value: 6, color: '#8B5CF6' },
];

// Top Selling Products matching screenshot
const TOP_SELLING_PRODUCTS = [
  { id: 'p1', name: "Men's Casual Shirt", category: 'Men Fashion', sold: 482, revenue: '₹2,89,200', icon: '👔' },
  { id: 'p2', name: 'Wireless Earbuds', category: 'Electronics', sold: 356, revenue: '₹2,13,400', icon: '🎧' },
  { id: 'p3', name: 'Smart Watch', category: 'Electronics', sold: 279, revenue: '₹1,96,500', icon: '⌚' },
  { id: 'p4', name: "Women's Handbag", category: 'Western Wear', sold: 243, revenue: '₹1,82,600', icon: '👜' },
  { id: 'p5', name: 'Sports Shoes', category: 'Footwear', sold: 198, revenue: '₹1,45,200', icon: '👟' },
];

// Recent Activity Stream matching screenshot
const RECENT_ACTIVITIES = [
  { id: 'a1', title: 'New seller registered', desc: 'Rahul Traders (KYC Pending)', time: '2 hours ago', icon: Store, iconBg: 'bg-pink-50 text-[#F43397]' },
  { id: 'a2', title: 'Order #ORD-1023 status updated', desc: 'Processing ➔ Shipped', time: '3 hours ago', icon: Package, iconBg: 'bg-purple-50 text-purple-600' },
  { id: 'a3', title: 'New product added', desc: 'Wireless Earbuds', time: '5 hours ago', icon: Plus, iconBg: 'bg-blue-50 text-blue-600' },
  { id: 'a4', title: 'Complaint raised', desc: 'Order #ORD-1019 - Product damaged', time: '6 hours ago', icon: AlertCircle, iconBg: 'bg-amber-50 text-amber-600' },
  { id: 'a5', title: 'Admin updated category', desc: 'Electronics', time: '8 hours ago', icon: Settings, iconBg: 'bg-emerald-50 text-emerald-600' },
];

export default function ShopioAdminPortal({
  onNavigate,
  onShowToast,
}) {
  // Check admin session (default to Super Administrator so left sidebar & dashboard are always immediately accessible)
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('shopio_admin_user') || localStorage.getItem('shopio_admin_user');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return {
      id: 'adm_master_1',
      name: 'Super Administrator',
      email: 'admin@shopio.com',
      role: 'Super Admin',
      token: 'shopio_admin_active_jwt',
    };
  });

  // Mobile sidebar drawer state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('year');

  // Admin Login Form State
  const [loginEmail, setLoginEmail] = useState('admin@shopio.com');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Active Sidebar Section (Dashboard at top by default)
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(4);

  // Section Data State
  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState(INITIAL_SELLERS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [metrics, setMetrics] = useState({
    totalUsers: 14892,
    totalSellers: 842,
    totalProducts: 3620,
    totalOrders: 1480,
    totalRevenue: '₹42,85,600',
    pendingOrders: 28,
    pendingKyc: 14,
    pendingComplaints: 7,
  });

  // Filters & Selected Modals
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [sellerStatusFilter, setSellerStatusFilter] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedItemModal, setSelectedItemModal] = useState(null); // { type, item }
  const [broadcastMessage, setBroadcastMessage] = useState({ title: '', target: 'All Users', text: '', channel: 'push' });

  // Load backend users or mock users
  useEffect(() => {
    async function loadData() {
      try {
        const userList = await adminService.getUsers();
        setUsers(userList);
      } catch (err) {
        console.warn('Error loading users:', err);
      }
    }
    loadData();
  }, []);

  // Handle Admin Login
  const handleAdminLogin = async (e) => {
    e?.preventDefault();
    setLoginError('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Email and password are required');
      return;
    }

    setLoginLoading(true);
    try {
      // Authenticate admin (supports admin@shopio.com, admin@meesho.com, orderadmin@shopio.com)
      const emailLower = loginEmail.toLowerCase().trim();
      let role = 'Super Admin';
      if (emailLower.includes('order')) role = 'Order Admin';
      else if (emailLower.includes('product')) role = 'Product Admin';
      else if (emailLower.includes('support')) role = 'Support Admin';

      const validPass = loginPassword === 'admin123' || loginPassword === 'password' || loginPassword.length >= 6;
      if (!validPass) {
        throw new Error('Invalid email or password');
      }

      const adminObj = {
        id: `adm_${Date.now()}`,
        name: emailLower.startsWith('admin') ? 'Super Administrator' : role,
        email: emailLower,
        role: role,
        token: `shopio_admin_jwt_${Date.now()}`,
        loginTime: new Date().toLocaleTimeString(),
      };

      if (rememberMe) {
        localStorage.setItem('shopio_admin_user', JSON.stringify(adminObj));
      } else {
        sessionStorage.setItem('shopio_admin_user', JSON.stringify(adminObj));
      }

      setAdminUser(adminObj);
      onShowToast?.(`Welcome back, ${adminObj.name}! 👑`, 'success');
    } catch (err) {
      setLoginError(err.message || 'Invalid admin credentials');
      onShowToast?.(err.message || 'Login failed', 'error');
    } finally {
      setLoginLoading(false);
    }
  };

  // Quick Demo Login Helper
  const handleQuickDemoLogin = (email, role) => {
    setLoginEmail(email);
    setLoginPassword('admin123');
    setLoginError('');
  };

  // Admin Logout
  const handleLogout = () => handleAdminLogout();
  const handleAdminLogout = () => {
    sessionStorage.removeItem('shopio_admin_user');
    localStorage.removeItem('shopio_admin_user');
    setAdminUser(null);
    onShowToast?.('Logged out of Admin Portal successfully', 'info');
  };

  // User Actions (Block / Unblock / Suspend)
  const handleUpdateUserStatus = (userId, newStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus, appAccess: newStatus === 'active' } : u))
    );
    onShowToast?.(`User status updated to "${newStatus}"`, 'success');
  };

  // Seller Actions (Approve / Reject / Suspend)
  const handleUpdateSellerStatus = (sellerId, newStatus) => {
    setSellers((prev) =>
      prev.map((s) => (s.id === sellerId ? { ...s, status: newStatus } : s))
    );
    onShowToast?.(`Seller status updated to "${newStatus}"`, 'success');
  };

  // Order Actions
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
    onShowToast?.(`Order #${orderId} marked as "${newStatus}"`, 'success');
  };

  // KYC Actions
  const handleKycAction = (sellerId, action) => {
    setSellers((prev) =>
      prev.map((s) => (s.id === sellerId ? { ...s, kycStatus: action === 'approve' ? 'Verified' : 'Rejected' } : s))
    );
    onShowToast?.(`KYC ${action === 'approve' ? 'Approved' : 'Rejected'} for seller`, 'info');
  };

  // Complaint Actions
  const handleComplaintStatus = (cmpId, newStatus) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === cmpId ? { ...c, status: newStatus } : c))
    );
    onShowToast?.(`Complaint #${cmpId} status changed to "${newStatus}"`, 'success');
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !searchQuery ||
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.phone?.includes(searchQuery);
      const matchStatus = userStatusFilter === 'all' || u.status === userStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [users, searchQuery, userStatusFilter]);

  // Filtered Sellers
  const filteredSellers = useMemo(() => {
    return sellers.filter((s) => {
      const matchSearch =
        !searchQuery ||
        s.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = sellerStatusFilter === 'all' || s.status.toLowerCase() === sellerStatusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [sellers, searchQuery, sellerStatusFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        !searchQuery ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.product.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = orderStatusFilter === 'all' || o.orderStatus.toLowerCase() === orderStatusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [orders, searchQuery, orderStatusFilter]);

  // =========================================================================
  // VIEW 1: ADMIN LOGIN PAGE (If !adminUser)
  // =========================================================================
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col font-sans relative selection:bg-[#F43397] selection:text-white">
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        {/* Top Minimal Brand Bar */}
        <header className="relative z-10 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md py-4 px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#9F2089] via-[#D81B80] to-[#F43397] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-pink-500/25">
                S
              </div>
              <div>
                <span className="font-black text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
                  Shopio <span className="w-1.5 h-1.5 rounded-full bg-[#F43397] inline-block mr-1"></span><span className="text-xs px-2 py-0.5 rounded-md bg-[#F43397]/20 text-[#F43397] border border-[#F43397]/30 uppercase tracking-wider font-extrabold">Admin</span>
                </span>
                <p className="text-[10px] text-gray-500 font-medium">Enterprise Management Portal</p>
              </div>
            </div>

          </div>
        </header>

        {/* Center Admin Login Card */}
        <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md bg-white/95 rounded-3xl border border-slate-200 shadow-2xl shadow-pink-950/40 p-6 sm:p-8 backdrop-blur-xl">
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#9F2089] via-[#D81B80] to-[#F43397] flex items-center justify-center text-white shadow-xl shadow-pink-600/30 mb-3">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-1">
                <span>Shopio</span>
                <span className="w-2 h-2 rounded-full bg-[#F43397] inline-block"></span>
                <span className="text-lg font-black text-[#F43397] ml-1">Admin</span>
              </h1>
              <p className="text-xs font-bold text-pink-300 mt-1 uppercase tracking-wider">
                Enterprise Command Center
              </p>
            </div>

            {loginError && (
              <div className="mb-5 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs font-semibold text-rose-400 flex items-center gap-2">
                <span>⚠️</span>
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Email / Admin ID
                </label>
                <input
                  type="text"
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    setLoginError('');
                  }}
                  placeholder="admin@shopio.com"
                  required
                  className="w-full bg-[#F8F9FA] border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F43397] transition-colors font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] text-[#F43397] hover:text-pink-300 font-bold hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setLoginError('');
                    }}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#F8F9FA] border border-slate-200 rounded-2xl px-4 py-3 pr-11 text-xs text-slate-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F43397] transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-500 hover:text-white text-xs cursor-pointer p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-gray-500" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-200 bg-[#F8F9FA] text-[#F43397] focus:ring-[#F43397] h-4 w-4 cursor-pointer"
                />
                <label htmlFor="rememberMe" className="text-xs text-gray-700 cursor-pointer select-none">
                  Remember Me on this device
                </label>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-[#9F2089] via-[#D81B80] to-[#F43397] hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-pink-600/30 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {loginLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Login</span>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials for Testing */}
            <div className="mt-6 pt-5 border-t border-gray-200">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2.5 text-center">
                Quick Demo Accounts (1-Click Fill)
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin@shopio.com', 'Super Admin')}
                  className="p-2 rounded-xl bg-gray-50 hover:bg-gray-50 border border-slate-200 text-left text-pink-300 font-semibold transition-colors cursor-pointer"
                >
                  <p className="font-bold text-slate-900">Super Admin</p>
                  <p className="text-[10px] text-gray-500">admin@shopio.com</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('orderadmin@shopio.com', 'Order Admin')}
                  className="p-2 rounded-xl bg-gray-50 hover:bg-gray-50 border border-slate-200 text-left text-emerald-300 font-semibold transition-colors cursor-pointer"
                >
                  <p className="font-bold text-slate-900">Order Admin</p>
                  <p className="text-[10px] text-gray-500">orderadmin@shopio.com</p>
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Forgot Password Helper Modal */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#F43397]/20 text-[#F43397] flex items-center justify-center text-xl">
                🔑
              </div>
              <h3 className="font-black text-lg text-slate-900">Admin Credentials Reset</h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                For administrative security, default credentials are initialized:
                <br />
                Email: <strong className="text-[#F43397] font-mono">admin@shopio.com</strong>
                <br />
                Password: <strong className="text-[#F43397] font-mono">admin123</strong>
              </p>
              <button
                onClick={() => setShowForgotModal(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#9F2089] to-[#F43397] hover:from-[#7D126C] hover:to-[#D81B80] shadow-md shadow-pink-500/20 text-white font-bold text-xs"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED ADMIN WEB DASHBOARD (With all 15 sections)
  // =========================================================================
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users, badge: users.length },
    { id: 'sellers', label: 'Sellers', icon: Store, badge: sellers.length },
    { id: 'products', label: 'Products', icon: Package, badge: '3.6k' },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: '1.4k' },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw, badge: '3' },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'coupons', label: 'Coupons & Offers', icon: TicketPercent },
    { id: 'kyc', label: 'KYC Verification', icon: ShieldCheck, badge: '14' },
    { id: 'complaints', label: 'Complaints', icon: AlertTriangle, badge: '7' },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

    return (
    <div className="h-screen w-screen overflow-hidden bg-[#F8FAFC] text-[#0F172A] flex font-sans antialiased selection:bg-[#F43397] selection:text-white">
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* ── 1. LEFT-SIDE NAVIGATION BAR (Midnight Navy #0B132B matching screenshot) ── */}
      <aside
        className={`h-screen bg-[#0B132B] text-slate-300 flex flex-col shrink-0 border-r border-[#1E293B] z-50 transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-64 sm:w-72'
        } ${
          sidebarOpen ? 'fixed inset-y-0 left-0 translate-x-0' : 'fixed lg:static inset-y-0 left-0 -translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Pink rounded square logo with 'S' */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9F2089] via-[#D81B80] to-[#F43397] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-pink-600/30 shrink-0">
              S
            </div>
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl text-white tracking-tight flex items-center">
                  Shopio<span className="w-1.5 h-1.5 rounded-full bg-[#F43397] ml-1 inline-block"></span>
                </span>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md bg-[#F43397] text-white shadow-xs">
                  SUPER ADMIN
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Menu Items List with Dashboard at the Top */}
        <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto custom-dark-scrollbar">
          {/* Topmost Primary Item: DASHBOARD */}
          <button
            onClick={() => {
              setActiveSection('dashboard');
              setSearchQuery('');
              setSidebarOpen(false);
            }}
            title="Dashboard"
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'dashboard'
                ? 'bg-[#F43397] text-white shadow-lg shadow-pink-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
          >
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            {!sidebarCollapsed && <span className="font-bold text-sm tracking-wide">Dashboard</span>}
          </button>

          {/* Grouping Header: MANAGEMENT MODULES */}
          {!sidebarCollapsed && (
            <div className="px-3 pt-4 pb-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              MANAGEMENT MODULES
            </div>
          )}

          {/* All Remaining Modules */}
          {sidebarItems
            .filter((item) => item.id !== 'dashboard')
            .map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSearchQuery('');
                    setSidebarOpen(false);
                  }}
                  title={item.label}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#F43397] text-white shadow-lg shadow-pink-600/30 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!sidebarCollapsed && item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/25 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
        </div>

        {/* Sidebar Bottom Collapse Button matching screenshot */}
        <div className="p-3 border-t border-slate-800/80 flex items-center justify-between shrink-0 bg-[#0B132B]">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {!sidebarCollapsed && (
            <span className="text-[10px] text-slate-500 font-medium">
              Shopio v2.4 Enterprise
            </span>
          )}
        </div>
      </aside>

      {/* ── 2. RIGHT-SIDE MAIN AREA (Top Header + Dynamic Content Canvas) ── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Bar (Pinned, Always Visible) */}
        <header className="shrink-0 bg-white border-b border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 z-40">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Global Search Input Pill */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users, sellers, products, order IDs..."
                className="w-full bg-slate-50/80 border border-slate-200/90 rounded-full pl-9 pr-8 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F43397]/20 focus:border-[#F43397] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Top Actions: Notifications, Admin Profile, Logout */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">

            {/* Notifications Bell with Pill Badge */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUnreadNotifications(0);
                }}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-[#F43397] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in text-xs">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-900">System Notifications</span>
                    <span className="text-[10px] text-[#F43397] font-bold cursor-pointer hover:underline">Mark all read</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="font-bold text-slate-800">New Bulk Order Received</p>
                      <p className="text-[11px] text-slate-500">ORD-789124 from Sneha Patil (₹1,499)</p>
                      <span className="text-[9px] text-slate-400">2 mins ago</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="font-bold text-slate-800">Seller KYC Submitted</p>
                      <p className="text-[11px] text-slate-500">Nexus Tech Accessories uploaded GST & PAN</p>
                      <span className="text-[9px] text-slate-400">14 mins ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Section */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#9F2089] text-white flex items-center justify-center font-black text-xs ring-2 ring-pink-100">
                AD
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">Super Administrator</p>
                <p className="text-[10px] text-slate-400 font-medium">Super Admin</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F43397] hover:bg-[#e02685] text-white text-xs font-bold transition-all shadow-sm shadow-pink-600/20 cursor-pointer"
              title="Logout from Admin Panel"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Dynamic Section Content Canvas (Independently Scrollable) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 space-y-6 bg-[#F8FAFC] overflow-y-auto custom-scrollbar">
          {/* Breadcrumb + Last Updated Sub-header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Home className="w-4 h-4 text-[#F43397]" />
              <span className="text-slate-300">|</span>
              <span className="font-bold text-slate-900 capitalize text-sm">
                {activeSection === 'dashboard' ? 'Dashboard' : `${activeSection} Management`}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Last updated: 28 Oct 2026, 04:27 PM
            </div>
          </div>

          {/* ============================================================== */}
          {/* 1. DASHBOARD OVERVIEW (Matching Screenshot Exactly)            */}
          {/* ============================================================== */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome Banner Card */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    Good Afternoon, Super Administrator 👋
                  </h1>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Here's what's happening with your platform today.
                  </p>
                </div>

                {/* Right Promo Banner Card */}
                <div className="flex items-center gap-4 bg-gradient-to-r from-pink-50/80 via-purple-50/50 to-pink-50/30 border border-pink-100 rounded-2xl p-3.5 sm:px-5">
                  <div className="w-10 h-10 rounded-xl bg-[#F43397]/10 text-[#F43397] flex items-center justify-center text-lg">
                    📈
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Grow Your Business With Shopio</p>
                    <button
                      onClick={() => setActiveSection('analytics')}
                      className="mt-1 inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#F43397] hover:bg-[#e02685] text-white text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      View Reports →
                    </button>
                  </div>
                </div>
              </div>

              {/* 8 Metric KPI Cards in 4x2 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Users', value: metrics.totalUsers, change: '↑ 12.4% vs last month', isTrend: true, sparklineKey: 'users', sparkColor: '#10B981', icon: Users, iconColor: 'bg-pink-50 text-[#F43397]' },
                  { label: 'Total Sellers', value: metrics.totalSellers, change: '↑ 8.1% vs last month', isTrend: true, sparklineKey: 'sellers', sparkColor: '#8B5CF6', icon: Store, iconColor: 'bg-pink-50 text-[#F43397]' },
                  { label: 'Total Products', value: metrics.totalProducts, change: '↑ 18.2% vs last month', isTrend: true, sparklineKey: 'products', sparkColor: '#10B981', icon: Package, iconColor: 'bg-emerald-50 text-emerald-600' },
                  { label: 'Total Orders', value: metrics.totalOrders, change: '↑ 24.5% vs last month', isTrend: true, sparklineKey: 'orders', sparkColor: '#F43397', icon: ShoppingBag, iconColor: 'bg-purple-50 text-purple-600' },
                  { label: 'Total Revenue', value: metrics.totalRevenue, change: '↑ 31.8% vs last month', isTrend: true, sparklineKey: 'revenue', sparkColor: '#F43397', icon: IndianRupee, iconColor: 'bg-pink-50 text-[#F43397]' },
                  { label: 'Pending Orders', value: metrics.pendingOrders, change: 'Action Required', pillClass: 'bg-rose-50 text-rose-600 border-rose-200/60', sparklineKey: 'pendingOrders', sparkColor: '#F43F5E', icon: Clock, iconColor: 'bg-rose-50 text-rose-500' },
                  { label: 'Pending KYC', value: metrics.pendingKyc, change: 'Requires Approval', pillClass: 'bg-blue-50 text-blue-600 border-blue-200/60', sparklineKey: 'pendingKyc', sparkColor: '#0284C7', icon: ShieldCheck, iconColor: 'bg-blue-50 text-blue-600' },
                  { label: 'Pending Complaints', value: metrics.pendingComplaints, change: 'Needs Resolution', pillClass: 'bg-amber-50 text-amber-600 border-amber-200/60', sparklineKey: 'pendingComplaints', sparkColor: '#F59E0B', icon: AlertTriangle, iconColor: 'bg-amber-50 text-amber-500' },
                ].map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={i}
                      className="bg-white border border-slate-100 rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-8 h-8 rounded-xl ${card.iconColor} flex items-center justify-center shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-slate-500">{card.label}</span>
                      </div>

                      <div className="my-1">
                        <p className="text-2xl font-black text-slate-900 tracking-tight">
                          {typeof card.value === 'number' ? card.value.toLocaleString('en-IN') : card.value}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {card.isTrend ? (
                          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                            {card.change}
                          </span>
                        ) : (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${card.pillClass}`}>
                            {card.change}
                          </span>
                        )}

                        <div className="w-16 h-8 flex items-center justify-end">
                          <Sparkline
                            data={KPI_SPARKLINES[card.sparklineKey] || [10, 20, 15, 30, 25]}
                            color={card.sparkColor}
                            height={28}
                            width={64}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Analytics Section: 2 Columns (Sales Overview + Top Sales Categories) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 2/3 Width: Sales & Revenue Overview AreaChart */}
                <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">Sales & Revenue Overview</h3>
                      <p className="text-[11px] text-slate-400">Monthly Gross Revenue vs Net Profit</p>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Legend */}
                      <div className="flex items-center gap-3 text-xs font-semibold">
                        <span className="flex items-center gap-1.5 text-slate-700">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#F43397]" />
                          Revenue
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-700">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                          Profit
                        </span>
                      </div>

                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-50 text-[#F43397] border border-pink-200/80 font-bold">
                        2026 Live
                      </span>
                    </div>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={TWELVE_MONTH_SALES_DATA}>
                        <defs>
                          <linearGradient id="colorRevEnterprise" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F43397" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#F43397" stopOpacity={0.02} />
                          </linearGradient>
                          <linearGradient id="colorProfitEnterprise" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.5} />
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                        <YAxis
                          stroke="#94A3B8"
                          fontSize={11}
                          tickLine={false}
                          tickFormatter={(v) => `₹${v.toLocaleString('en-IN')}`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#FFFFFF',
                            borderColor: '#E2E8F0',
                            borderRadius: '0.75rem',
                            fontSize: '12px',
                            color: '#0F172A',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                          }}
                          formatter={(value, name) => [`₹${Number(value).toLocaleString('en-IN')}`, name === 'revenue' ? 'Revenue' : 'Profit']}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#F43397"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#colorRevEnterprise)"
                          name="Revenue"
                        />
                        <Area
                          type="monotone"
                          dataKey="profit"
                          stroke="#8B5CF6"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorProfitEnterprise)"
                          name="Profit"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 1/3 Width: Top Sales Categories Donut Chart with Center Text */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">Top Sales Categories</h3>
                    <p className="text-[11px] text-slate-400">Distribution of orders by catalog</p>
                  </div>

                  {/* Donut with Center Text */}
                  <div className="relative h-48 w-full my-2 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={CATEGORY_DISTRIBUTION_CHART}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          dataKey="value"
                          strokeWidth={2}
                          stroke="#ffffff"
                        >
                          {CATEGORY_DISTRIBUTION_CHART.map((entry, index) => (
                            <Cell key={`donut-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#FFFFFF',
                            borderColor: '#E2E8F0',
                            borderRadius: '0.75rem',
                            fontSize: '11px',
                            color: '#0F172A',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                          }}
                          formatter={(v, name) => [`${v}%`, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    {/* Centered Donut Label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[10px] font-medium text-slate-400">Total Orders</span>
                      <span className="text-base font-black text-slate-900">1480</span>
                    </div>
                  </div>

                  {/* Category Legend list */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    {CATEGORY_DISTRIBUTION_CHART.map((cat, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                          <span className="text-slate-600 truncate text-[11px] font-medium">{cat.name}</span>
                        </div>
                        <span className="font-bold text-slate-900 text-[11px]">{cat.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom 3-Column Grid: Recent Orders, Top Selling Products, Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. Recent Orders */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                    <h3 className="font-extrabold text-sm text-slate-900">Recent Orders</h3>
                    <button
                      onClick={() => setActiveSection('orders')}
                      className="text-xs font-bold text-[#F43397] hover:underline"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-100 text-[11px]">
                          <th className="pb-2 font-bold">Order ID</th>
                          <th className="pb-2 font-bold">Customer</th>
                          <th className="pb-2 font-bold">Amount</th>
                          <th className="pb-2 font-bold">Status</th>
                          <th className="pb-2 font-bold">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { id: '#ORD-1024', customer: 'Rahul Sharma', amount: '₹1,250', status: 'Delivered', statusColor: 'bg-emerald-50 text-emerald-600', date: '28 Oct 2026' },
                          { id: '#ORD-1023', customer: 'Sneha Patil', amount: '₹2,340', status: 'Processing', statusColor: 'bg-blue-50 text-blue-600', date: '27 Oct 2026' },
                          { id: '#ORD-1022', customer: 'Amit Kumar', amount: '₹890', status: 'Shipped', statusColor: 'bg-purple-50 text-purple-600', date: '27 Oct 2026' },
                          { id: '#ORD-1021', customer: 'Pooja Deshmukh', amount: '₹4,560', status: 'Delivered', statusColor: 'bg-emerald-50 text-emerald-600', date: '27 Oct 2026' },
                          { id: '#ORD-1020', customer: 'Vikram Singh', amount: '₹1,780', status: 'Pending', statusColor: 'bg-amber-50 text-amber-600', date: '26 Oct 2026' },
                        ].map((ord) => (
                          <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-2.5 font-bold text-slate-900 font-mono text-[11px]">{ord.id}</td>
                            <td className="py-2.5 text-slate-700 text-[11px]">{ord.customer}</td>
                            <td className="py-2.5 font-bold text-slate-900 text-[11px]">{ord.amount}</td>
                            <td className="py-2.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit ${ord.statusColor}`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                {ord.status}
                              </span>
                            </td>
                            <td className="py-2.5 text-slate-400 text-[10px]">{ord.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Top Selling Products */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                    <h3 className="font-extrabold text-sm text-slate-900">Top Selling Products</h3>
                    <button
                      onClick={() => setActiveSection('products')}
                      className="text-xs font-bold text-[#F43397] hover:underline"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-100 text-[11px]">
                          <th className="pb-2 font-bold">Product</th>
                          <th className="pb-2 font-bold">Sold</th>
                          <th className="pb-2 font-bold">Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {TOP_SELLING_PRODUCTS.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-2.5">
                              <div className="flex items-center gap-2">
                                <span className="text-base">{p.icon}</span>
                                <span className="font-bold text-slate-800 text-[11px] truncate max-w-[120px]">{p.name}</span>
                              </div>
                            </td>
                            <td className="py-2.5 text-slate-600 font-medium text-[11px]">{p.sold}</td>
                            <td className="py-2.5 font-bold text-slate-900 text-[11px]">{p.revenue}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. Recent Activity */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                    <h3 className="font-extrabold text-sm text-slate-900">Recent Activity</h3>
                    <button
                      onClick={() => setActiveSection('notifications')}
                      className="text-xs font-bold text-[#F43397] hover:underline"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="space-y-3.5 pt-1">
                    {RECENT_ACTIVITIES.map((act) => {
                      const Icon = act.icon;
                      return (
                        <div key={act.id} className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full ${act.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 leading-tight truncate">{act.title}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5 truncate">{act.desc}</p>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium shrink-0">{act.time}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

{/* ============================================================== */}
          {/* 2. USER MANAGEMENT                                             */}
          {/* ============================================================== */}
          {activeSection === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">User Management</h1>
                  <p className="text-xs text-gray-500 mt-0.5">
                    View user directory, order records, block or suspend access.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-gray-800 bg-gray-50 border border-slate-200 outline-none focus:border-[#F43397]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active Only</option>
                    <option value="blocked">Blocked Only</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-gray-500">
                      <th className="pb-3 font-bold">User ID</th>
                      <th className="pb-3 font-bold">Name</th>
                      <th className="pb-3 font-bold">Mobile</th>
                      <th className="pb-3 font-bold">Email</th>
                      <th className="pb-3 font-bold">Orders</th>
                      <th className="pb-3 font-bold">Status</th>
                      <th className="pb-3 font-bold">Joined Date</th>
                      <th className="pb-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 font-mono font-bold text-[#F43397]">{user.id}</td>
                        <td className="py-3 text-gray-900 font-bold">{user.name}</td>
                        <td className="py-3 text-gray-700">{user.phone}</td>
                        <td className="py-3 text-gray-500">{user.email}</td>
                        <td className="py-3 text-gray-800 font-bold">{user.ordersCount || 0}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              user.status === 'active'
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60 font-bold'
                                : user.status === 'blocked'
                                ? 'bg-rose-50 text-rose-600 border border-rose-200/60 font-bold'
                                : 'bg-amber-50 text-amber-600 border border-amber-200/60 font-bold'
                            }`}
                          >
                            {user.status || 'active'}
                          </span>
                        </td>
                        <td className="py-3 text-gray-500 text-[11px]">{user.joinedDate || '2026'}</td>
                        <td className="py-3 text-right space-x-1.5">
                          <button
                            onClick={() => setSelectedItemModal({ type: 'user', item: user })}
                            className="px-2 py-1 rounded-lg bg-gray-50 hover:bg-pink-50 hover:text-[#9F2089] text-gray-800 text-[10px] font-bold"
                          >
                            Details
                          </button>
                          {user.status === 'active' ? (
                            <button
                              onClick={() => handleUpdateUserStatus(user.id, 'blocked')}
                              className="px-2 py-1 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 text-[10px] font-bold"
                            >
                              Block
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateUserStatus(user.id, 'active')}
                              className="px-2 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 text-[10px] font-bold"
                            >
                              Unblock
                            </button>
                          )}
                          <button
                            onClick={() => handleUpdateUserStatus(user.id, 'suspended')}
                            className="px-2 py-1 rounded-lg bg-amber-600/20 text-amber-400 hover:bg-amber-600/30 text-[10px] font-bold"
                          >
                            Suspend
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 3. SELLER MANAGEMENT                                           */}
          {/* ============================================================== */}
          {activeSection === 'sellers' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Seller Management</h1>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Approve merchants, inspect catalog sizes, review payouts and KYC.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={sellerStatusFilter}
                    onChange={(e) => setSellerStatusFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-gray-800 bg-gray-50 border border-slate-200 outline-none focus:border-[#F43397]"
                  >
                    <option value="all">All Seller Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-gray-500">
                      <th className="pb-3 font-bold">Seller ID</th>
                      <th className="pb-3 font-bold">Business Name</th>
                      <th className="pb-3 font-bold">Contact</th>
                      <th className="pb-3 font-bold">Products</th>
                      <th className="pb-3 font-bold">Rating</th>
                      <th className="pb-3 font-bold">KYC Status</th>
                      <th className="pb-3 font-bold">Status</th>
                      <th className="pb-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredSellers.map((seller) => (
                      <tr key={seller.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 font-mono font-bold text-[#F43397]">{seller.id}</td>
                        <td className="py-3 text-gray-900 font-bold">{seller.businessName}</td>
                        <td className="py-3 text-gray-700">
                          {seller.contactPerson} ({seller.phone})
                        </td>
                        <td className="py-3 text-gray-800">{seller.productsCount} items</td>
                        <td className="py-3 text-amber-400 font-bold">⭐ {seller.rating}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              seller.kycStatus === 'Verified'
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60 font-bold'
                                : seller.kycStatus === 'Pending'
                                ? 'bg-amber-50 text-amber-600 border border-amber-200/60 font-bold'
                                : 'bg-rose-50 text-rose-600 border border-rose-200/60 font-bold'
                            }`}
                          >
                            {seller.kycStatus}
                          </span>
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              seller.status === 'Approved'
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60 font-bold'
                                : seller.status === 'Pending'
                                ? 'bg-amber-50 text-amber-600 border border-amber-200/60 font-bold'
                                : 'bg-rose-50 text-rose-600 border border-rose-200/60 font-bold'
                            }`}
                          >
                            {seller.status}
                          </span>
                        </td>
                        <td className="py-3 text-right space-x-1.5">
                          <button
                            onClick={() => setSelectedItemModal({ type: 'seller', item: seller })}
                            className="px-2 py-1 rounded-lg bg-gray-50 hover:bg-pink-50 hover:text-[#9F2089] text-gray-800 text-[10px] font-bold"
                          >
                            View
                          </button>
                          {seller.status !== 'Approved' && (
                            <button
                              onClick={() => handleUpdateSellerStatus(seller.id, 'Approved')}
                              className="px-2 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 text-[10px] font-bold"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleUpdateSellerStatus(seller.id, 'Rejected')}
                            className="px-2 py-1 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 text-[10px] font-bold"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleUpdateSellerStatus(seller.id, 'Suspended')}
                            className="px-2 py-1 rounded-lg bg-amber-600/20 text-amber-400 hover:bg-amber-600/30 text-[10px] font-bold"
                          >
                            Suspend
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 4. PRODUCT MANAGEMENT                                          */}
          {/* ============================================================== */}
          {activeSection === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Product Catalog Management</h1>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Search, filter, approve, modify prices and inspect live product listings.
                  </p>
                </div>
                <button
                  onClick={() => onShowToast?.('Product Creation Wizard ready', 'info')}
                  className="px-4 py-2 bg-gradient-to-r from-[#9F2089] to-[#F43397] hover:from-[#7D126C] hover:to-[#D81B80] shadow-md shadow-pink-500/20 rounded-xl text-xs font-bold text-white shadow-md"
                >
                  + Add New Product
                </button>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-gray-500">
                      <th className="pb-3 font-bold">Product ID</th>
                      <th className="pb-3 font-bold">Title</th>
                      <th className="pb-3 font-bold">Category</th>
                      <th className="pb-3 font-bold">Price</th>
                      <th className="pb-3 font-bold">Stock</th>
                      <th className="pb-3 font-bold">Rating</th>
                      <th className="pb-3 font-bold">Status</th>
                      <th className="pb-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {[
                      { id: 'p1', name: 'Kanjivaram Soft Silk Saree with Blouse', cat: 'Women Ethnic', price: '₹1,499', stock: 120, rating: 4.8, status: 'Approved' },
                      { id: 'p2', name: 'Cotton Printed Anarkali Kurti', cat: 'Women Western', price: '₹599', stock: 85, rating: 4.5, status: 'Approved' },
                      { id: 'p3', name: 'Men Regular Fit Cotton Shirt', cat: 'Men', price: '₹649', stock: 40, rating: 4.3, status: 'Approved' },
                      { id: 'p4', name: 'boAt Rockerz Wireless Headphones', cat: 'Electronics', price: '₹1,299', stock: 15, rating: 4.7, status: 'Approved' },
                      { id: 'p5', name: 'Non-stick Granite Cookware Set', cat: 'Home & Kitchen', price: '₹2,199', stock: 8, rating: 4.2, status: 'Pending' },
                    ].map((prod) => (
                      <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 font-mono font-bold text-[#F43397]">{prod.id}</td>
                        <td className="py-3 text-gray-900 font-bold">{prod.name}</td>
                        <td className="py-3 text-gray-700">{prod.cat}</td>
                        <td className="py-3 font-bold text-gray-900">{prod.price}</td>
                        <td className="py-3 text-gray-800">{prod.stock} units</td>
                        <td className="py-3 text-amber-400">⭐ {prod.rating}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60 font-bold">
                            {prod.status}
                          </span>
                        </td>
                        <td className="py-3 text-right space-x-1.5">
                          <button
                            onClick={() => onShowToast?.(`Editing ${prod.name}`, 'info')}
                            className="px-2 py-1 rounded-lg bg-[#F43397]/20 text-[#F43397] hover:bg-[#F43397]/30 text-[10px] font-bold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onShowToast?.(`Product ${prod.id} removed from catalog`, 'error')}
                            className="px-2 py-1 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 text-[10px] font-bold"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 5. CATEGORIES                                                  */}
          {/* ============================================================== */}
          {activeSection === 'categories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Categories Management</h1>
                  <p className="text-xs text-gray-500 mt-0.5">Organize shopping taxology and catalog divisions.</p>
                </div>
                <button
                  onClick={() => onShowToast?.('Category created!', 'success')}
                  className="px-3.5 py-2 bg-gradient-to-r from-[#9F2089] to-[#F43397] hover:from-[#7D126C] hover:to-[#D81B80] shadow-md shadow-pink-500/20 rounded-xl text-xs font-bold text-white"
                >
                  + Add Category
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[
                  { name: 'Women Ethnic', icon: '🥻', count: 1240 },
                  { name: 'Women Western', icon: '👗', count: 840 },
                  { name: 'Men Fashion', icon: '👔', count: 620 },
                  { name: 'Kids Wear', icon: '🧒', count: 410 },
                  { name: 'Home & Kitchen', icon: '🏠', count: 530 },
                  { name: 'Beauty & Health', icon: '💄', count: 320 },
                  { name: 'Jewellery', icon: '💍', count: 280 },
                  { name: 'Electronics', icon: '📱', count: 190 },
                ].map((cat, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cat.icon}</span>
                      <div>
                        <p className="font-bold text-gray-900 text-xs">{cat.name}</p>
                        <p className="text-[10px] text-gray-500">{cat.count} products</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 6. ORDER MANAGEMENT                                            */}
          {/* ============================================================== */}
          {activeSection === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Order Management</h1>
                  <p className="text-xs text-gray-500 mt-0.5">Track fulfillment status from placement to delivery.</p>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto">
                  {['all', 'Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        orderStatusFilter === st
                          ? 'bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white shadow-md shadow-pink-500/20'
                          : 'bg-white text-gray-500 hover:text-white border border-slate-200'
                      }`}
                    >
                      {st === 'all' ? 'All Orders' : st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-gray-500">
                      <th className="pb-3 font-bold">Order ID</th>
                      <th className="pb-3 font-bold">Customer</th>
                      <th className="pb-3 font-bold">Seller</th>
                      <th className="pb-3 font-bold">Product</th>
                      <th className="pb-3 font-bold">Amount</th>
                      <th className="pb-3 font-bold">Payment</th>
                      <th className="pb-3 font-bold">Order Status</th>
                      <th className="pb-3 font-bold text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 font-mono font-bold text-[#F43397]">{ord.id}</td>
                        <td className="py-3 text-gray-900 font-bold">{ord.customer}</td>
                        <td className="py-3 text-gray-500">{ord.seller}</td>
                        <td className="py-3 text-gray-700 max-w-[180px] truncate">{ord.product}</td>
                        <td className="py-3 font-bold text-gray-900">₹{ord.amount}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ord.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60 font-bold' : 'bg-amber-50 text-amber-600 border border-amber-200/60 font-bold'
                          }`}>
                            {ord.paymentStatus} ({ord.paymentMethod})
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F43397]/20 text-[#F43397]">
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="bg-[#F8F9FA] border border-slate-200 text-white rounded-lg px-2 py-1 text-[11px] outline-none"
                          >
                            {['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'].map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 7. PAYMENTS                                                    */}
          {/* ============================================================== */}
          {activeSection === 'payments' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Payments & Settlements</h1>
                <p className="text-xs text-gray-500 mt-0.5">UPI, Card gateways, Cash on Delivery settlement tracking.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <p className="text-xs text-gray-500">Gateway Success Rate</p>
                  <p className="text-2xl font-black text-emerald-400 mt-1">98.4%</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <p className="text-xs text-gray-500">Total Settled to Merchants</p>
                  <p className="text-2xl font-black text-white mt-1">₹34,18,000</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <p className="text-xs text-gray-500">Escrow Balance</p>
                  <p className="text-2xl font-black text-[#F43397] mt-1">₹8,67,600</p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 8. RETURNS & REFUNDS                                           */}
          {/* ============================================================== */}
          {activeSection === 'returns' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Returns & Refunds</h1>
                <p className="text-xs text-gray-500 mt-0.5">Customer return requests, inspection audits, and refund triggers.</p>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-gray-500">
                      <th className="pb-3 font-bold">Return ID</th>
                      <th className="pb-3 font-bold">Order ID</th>
                      <th className="pb-3 font-bold">Customer</th>
                      <th className="pb-3 font-bold">Reason</th>
                      <th className="pb-3 font-bold">Amount</th>
                      <th className="pb-3 font-bold">Status</th>
                      <th className="pb-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {[
                      { id: 'RET-301', ord: 'ORD-789127', cust: 'Aniket Kulkarni', reason: 'Size M too small for fit', amt: '₹899', st: 'Approved' },
                      { id: 'RET-302', ord: 'ORD-789045', cust: 'Deepak Varma', reason: 'Defective audio cable', amt: '₹1,299', st: 'Requested' },
                    ].map((ret) => (
                      <tr key={ret.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 font-mono font-bold text-[#F43397]">{ret.id}</td>
                        <td className="py-3 text-gray-700">{ret.ord}</td>
                        <td className="py-3 text-gray-900 font-bold">{ret.cust}</td>
                        <td className="py-3 text-gray-700">{ret.reason}</td>
                        <td className="py-3 font-bold text-gray-900">{ret.amt}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200/60 font-bold">
                            {ret.st}
                          </span>
                        </td>
                        <td className="py-3 text-right space-x-1.5">
                          <button
                            onClick={() => onShowToast?.(`Refund of ${ret.amt} initiated!`, 'success')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                          >
                            Issue Refund
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 9. REVIEWS MODERATION                                          */}
          {/* ============================================================== */}
          {activeSection === 'reviews' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Reviews Moderation</h1>
                <p className="text-xs text-gray-500 mt-0.5">Filter fake reviews, inspect ratings, verify buyer badges.</p>
              </div>

              <div className="space-y-3">
                {[
                  { prod: 'Kanjivaram Silk Saree', user: 'Priya Sharma', stars: 5, comment: 'Absolutely stunning quality! The blouse piece is gorgeous.', status: 'Approved' },
                  { prod: 'boAt Rockerz 450', user: 'Amit K.', stars: 1, comment: 'Spam review with non-working link', status: 'Flagged' },
                ].map((rev, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{rev.prod} · <span className="text-amber-400">{'★'.repeat(rev.stars)}</span></p>
                      <p className="text-gray-700 mt-1">"{rev.comment}"</p>
                      <p className="text-[10px] text-gray-400 mt-1">By {rev.user} · Status: {rev.status}</p>
                    </div>
                    <div className="space-x-1.5">
                      <button
                        onClick={() => onShowToast?.('Review approved', 'success')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 font-bold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onShowToast?.('Review removed', 'error')}
                        className="px-2.5 py-1 rounded-lg bg-rose-600/20 text-rose-400 font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 10. COUPONS & OFFERS                                           */}
          {/* ============================================================== */}
          {activeSection === 'coupons' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Coupons & Promotional Offers</h1>
                  <p className="text-xs text-gray-500 mt-0.5">Create discount codes, flash sales and cashback campaigns.</p>
                </div>
                <button
                  onClick={() => onShowToast?.('Coupon created!', 'success')}
                  className="px-3.5 py-2 bg-gradient-to-r from-[#9F2089] to-[#F43397] hover:from-[#7D126C] hover:to-[#D81B80] shadow-md shadow-pink-500/20 rounded-xl text-xs font-bold text-white shadow-md"
                >
                  + Create New Coupon
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {coupons.map((cpn, idx) => (
                  <div key={idx} className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-sm text-[#F43397] px-2.5 py-1 bg-[#F43397]/10 rounded-xl border border-[#F43397]/20">
                        {cpn.code}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                        {cpn.status}
                      </span>
                    </div>
                    <p className="font-extrabold text-base text-white">{cpn.discount}</p>
                    <div className="text-[11px] text-gray-500 space-y-0.5">
                      <p>Min Spend: {cpn.minSpend}</p>
                      <p>Valid Till: {cpn.validTill}</p>
                      <p>Times Used: {cpn.usageCount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 11. KYC VERIFICATION (DEDICATED PAGE)                           */}
          {/* ============================================================== */}
          {activeSection === 'kyc' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900">KYC Verification Center</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Verify merchant PAN, GST, business registration and bank accounts.
                </p>
              </div>

              <div className="space-y-4">
                {sellers.map((s) => (
                  <div key={s.id} className="p-5 rounded-3xl bg-white border border-slate-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-white text-base">{s.businessName}</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-50 text-gray-700 font-mono">
                            {s.id}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">Contact: {s.contactPerson} ({s.phone})</p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-extrabold self-start sm:self-center ${
                          s.kycStatus === 'Verified'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60 font-bold border border-emerald-500/30'
                            : s.kycStatus === 'Pending'
                            ? 'bg-amber-50 text-amber-600 border border-amber-200/60 font-bold border border-amber-500/30'
                            : 'bg-rose-50 text-rose-600 border border-rose-200/60 font-bold border border-rose-500/30'
                        }`}
                      >
                        {s.kycStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-gray-50 border border-slate-200">
                        <span className="text-[10px] text-gray-400 block">PAN Number</span>
                        <span className="font-mono font-bold text-gray-800">{s.pan}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-slate-200">
                        <span className="text-[10px] text-gray-400 block">GST Certificate</span>
                        <span className="font-mono font-bold text-gray-800">{s.gst}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-slate-200">
                        <span className="text-[10px] text-gray-400 block">Bank Account Details</span>
                        <span className="font-mono font-bold text-gray-800 truncate block">{s.bank}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        onClick={() => handleKycAction(s.id, 'approve')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                      >
                        Approve KYC
                      </button>
                      <button
                        onClick={() => handleKycAction(s.id, 'reject')}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 font-bold text-xs border border-rose-600/30"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => onShowToast?.(`Request sent to ${s.businessName} for additional documents`, 'info')}
                        className="px-3.5 py-1.5 rounded-xl bg-gray-50 hover:bg-pink-50 hover:text-[#9F2089] text-gray-700 font-bold text-xs"
                      >
                        Request More Info
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 12. COMPLAINT MANAGEMENT                                       */}
          {/* ============================================================== */}
          {activeSection === 'complaints' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Complaint Management</h1>
                <p className="text-xs text-gray-500 mt-0.5">Manage customer and seller disputes with assigned administrators.</p>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-gray-500">
                      <th className="pb-3 font-bold">Complaint ID</th>
                      <th className="pb-3 font-bold">User</th>
                      <th className="pb-3 font-bold">Order ID</th>
                      <th className="pb-3 font-bold">Issue</th>
                      <th className="pb-3 font-bold">Date</th>
                      <th className="pb-3 font-bold">Priority</th>
                      <th className="pb-3 font-bold">Status</th>
                      <th className="pb-3 font-bold text-right">Assigned Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {complaints.map((cmp) => (
                      <tr key={cmp.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 font-mono font-bold text-rose-400">{cmp.id}</td>
                        <td className="py-3 text-gray-900 font-bold">{cmp.user}</td>
                        <td className="py-3 text-gray-700 font-mono">{cmp.orderId}</td>
                        <td className="py-3 text-gray-700 max-w-[220px] truncate">{cmp.issue}</td>
                        <td className="py-3 text-gray-500 text-[11px]">{cmp.date}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            cmp.priority === 'High' ? 'bg-rose-50 text-rose-600 border border-rose-200/60 font-bold' : 'bg-amber-50 text-amber-600 border border-amber-200/60 font-bold'
                          }`}>
                            {cmp.priority}
                          </span>
                        </td>
                        <td className="py-3">
                          <select
                            value={cmp.status}
                            onChange={(e) => handleComplaintStatus(cmp.id, e.target.value)}
                            className="bg-[#F8F9FA] border border-slate-200 text-white rounded-lg px-2 py-1 text-[11px] outline-none"
                          >
                            {['Open', 'In Progress', 'Resolved', 'Closed'].map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 text-right text-pink-300 font-bold">{cmp.assignedAdmin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 13. NOTIFICATIONS                                              */}
          {/* ============================================================== */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Notification Broadcast Center</h1>
                <p className="text-xs text-gray-500 mt-0.5">Send targeted push alerts and announcements to users & sellers.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-lg max-w-2xl space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Target Audience</label>
                  <select
                    value={broadcastMessage.target}
                    onChange={(e) => setBroadcastMessage({ ...broadcastMessage, target: e.target.value })}
                    className="w-full bg-[#F8F9FA] border border-slate-200 rounded-xl px-3 py-2 text-xs text-gray-800 bg-gray-50 border border-slate-200 outline-none focus:border-[#F43397]"
                  >
                    <option value="All Users">All Registered Users (14,892)</option>
                    <option value="All Sellers">All Active Sellers (842)</option>
                    <option value="Order Updates">Pending Orders Only (28)</option>
                    <option value="Promotional">Promotional Blast</option>
                    <option value="System">System Announcements</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Broadcast Title</label>
                  <input
                    type="text"
                    value={broadcastMessage.title}
                    onChange={(e) => setBroadcastMessage({ ...broadcastMessage, title: e.target.value })}
                    placeholder="e.g. Mega Festive Sale Live Now!"
                    className="w-full bg-[#F8F9FA] border border-slate-200 rounded-xl px-3 py-2 text-xs text-gray-800 bg-gray-50 border border-slate-200 outline-none focus:border-[#F43397]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Message Text</label>
                  <textarea
                    rows={3}
                    value={broadcastMessage.text}
                    onChange={(e) => setBroadcastMessage({ ...broadcastMessage, text: e.target.value })}
                    placeholder="Enter the push notification message body..."
                    className="w-full bg-[#F8F9FA] border border-slate-200 rounded-xl px-3 py-2 text-xs text-gray-800 bg-gray-50 border border-slate-200 outline-none focus:border-[#F43397]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onShowToast?.(`Broadcast sent successfully to ${broadcastMessage.target}! 🚀`, 'success');
                    setBroadcastMessage({ title: '', target: 'All Users', text: '', channel: 'push' });
                  }}
                  className="w-full py-3 bg-gradient-to-r from-[#9F2089] to-[#F43397] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Send Broadcast Now
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 14. ANALYTICS                                                  */}
          {/* ============================================================== */}
          {activeSection === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Advanced Analytics & Reports</h1>
                <p className="text-xs text-gray-500 mt-0.5">In-depth breakdown of conversion funnels, AOV and geography.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200">
                  <p className="text-xs text-gray-500">Average Order Value (AOV)</p>
                  <p className="text-2xl font-black text-white mt-1">₹895</p>
                  <span className="text-[10px] text-emerald-400 font-bold">+5.2% vs last month</span>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-slate-200">
                  <p className="text-xs text-gray-500">Checkout Conversion Rate</p>
                  <p className="text-2xl font-black text-emerald-400 mt-1">4.2%</p>
                  <span className="text-[10px] text-emerald-400 font-bold">Above e-commerce benchmark</span>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-slate-200">
                  <p className="text-xs text-gray-500">Top State by Volume</p>
                  <p className="text-2xl font-black text-[#F43397] mt-1">Maharashtra (34%)</p>
                  <span className="text-[10px] text-gray-500">Followed by Gujarat & Delhi</span>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 15. SETTINGS & ROLE-BASED ACCESS CONTROL                       */}
          {/* ============================================================== */}
          {activeSection === 'settings' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Settings & Role Permissions</h1>
                <p className="text-xs text-gray-500 mt-0.5">Configure platform security, roles matrix and maintenance modes.</p>
              </div>

              {/* Roles & Permissions Matrix */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow overflow-x-auto space-y-4">
                <h3 className="font-bold text-sm text-slate-900">Admin Roles & Permissions System</h3>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-gray-500">
                      <th className="pb-3 font-bold">Role</th>
                      <th className="pb-3 font-bold text-center">View</th>
                      <th className="pb-3 font-bold text-center">Create</th>
                      <th className="pb-3 font-bold text-center">Edit</th>
                      <th className="pb-3 font-bold text-center">Delete</th>
                      <th className="pb-3 font-bold text-center">Approve/Reject</th>
                      <th className="pb-3 font-bold text-center">Manage Users</th>
                      <th className="pb-3 font-bold text-center">Manage Orders</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {Object.entries(ROLE_PERMISSIONS_MATRIX).map(([rName, perms]) => (
                      <tr key={rName} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 font-bold text-gray-900">{rName}</td>
                        <td className="py-3 text-center">{perms.view ? '✅' : '❌'}</td>
                        <td className="py-3 text-center">{perms.create ? '✅' : '❌'}</td>
                        <td className="py-3 text-center">{perms.edit ? '✅' : '❌'}</td>
                        <td className="py-3 text-center">{perms.delete ? '✅' : '❌'}</td>
                        <td className="py-3 text-center">{perms.approve ? '✅' : '❌'}</td>
                        <td className="py-3 text-center">{perms.manageUsers ? '✅' : '❌'}</td>
                        <td className="py-3 text-center">{perms.manageOrders ? '✅' : '❌'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Maintenance & Security policies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs">Emergency Maintenance Mode</h4>
                  <p className="text-[11px] text-gray-500">Only administrators can browse platform when activated.</p>
                  <button
                    onClick={() => onShowToast?.('Maintenance mode toggled', 'info')}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-pink-50 hover:text-[#9F2089] text-xs font-bold text-gray-800 rounded-xl border border-slate-200"
                  >
                    Toggle Maintenance Mode
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs">Admin Session Security</h4>
                  <p className="text-[11px] text-gray-500">JWT Token Expiry: 12 Hours with Idle Auto-lock.</p>
                  <span className="text-[10px] text-emerald-400 font-bold">● Active Session Protected</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Item Details View Modal */}
      {selectedItemModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-black text-white text-sm">
                {selectedItemModal.type === 'order' ? `Order Details #${selectedItemModal.item.id}` : `${selectedItemModal.type.toUpperCase()} Record`}
              </span>
              <button
                onClick={() => setSelectedItemModal(null)}
                className="text-gray-500 hover:text-white"
              >
                ✕
              </button>
            </div>
            <pre className="bg-[#F8F9FA] p-3 rounded-2xl text-[11px] font-mono text-pink-300 overflow-x-auto">
              {JSON.stringify(selectedItemModal.item, null, 2)}
            </pre>
            <button
              onClick={() => setSelectedItemModal(null)}
              className="w-full py-2.5 rounded-xl bg-gray-50 hover:bg-pink-50 hover:text-[#9F2089] text-white font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
