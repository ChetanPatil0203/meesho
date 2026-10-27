import { useState, useEffect, useMemo, useCallback } from 'react';
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
import adminService from '../services/adminService';

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
      <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans relative selection:bg-[#F43397] selection:text-white">
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        {/* Top Minimal Brand Bar */}
        <header className="relative z-10 w-full border-b border-[#27354A] bg-[#161F30]/60 backdrop-blur-md py-4 px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#9F2089] via-[#D81B80] to-[#F43397] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-pink-500/25">
                S
              </div>
              <div>
                <span className="font-black text-xl tracking-tight text-white flex items-center gap-1.5">
                  Shopio <span className="w-1.5 h-1.5 rounded-full bg-[#F43397] inline-block mr-1"></span><span className="text-xs px-2 py-0.5 rounded-md bg-[#F43397]/20 text-[#F43397] border border-[#F43397]/30 uppercase tracking-wider font-extrabold">Admin</span>
                </span>
                <p className="text-[10px] text-slate-400 font-medium">Enterprise Management Portal</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate?.('home')}
              className="text-xs font-bold text-slate-400 hover:text-white py-1.5 px-3 rounded-xl hover:bg-[#1E293B] transition-colors flex items-center gap-1.5"
            >
              <span>← Customer Store</span>
            </button>
          </div>
        </header>

        {/* Center Admin Login Card */}
        <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md bg-[#161F30]/90 rounded-3xl border border-[#27354A] shadow-2xl shadow-pink-950/40 p-6 sm:p-8 backdrop-blur-xl">
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#9F2089] via-[#D81B80] to-[#F43397] flex items-center justify-center text-2xl shadow-xl shadow-pink-600/30 mb-3">
                🛡️
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-1">
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
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
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
                  className="w-full bg-[#0B0F19] border border-[#334155] rounded-2xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#F43397] transition-colors font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300">
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
                    className="w-full bg-[#0B0F19] border border-[#334155] rounded-2xl px-4 py-3 pr-11 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#F43397] transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-white text-xs cursor-pointer p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '👁️' : '🙈'}
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
                  className="rounded border-[#334155] bg-[#0B0F19] text-[#F43397] focus:ring-[#F43397] h-4 w-4 cursor-pointer"
                />
                <label htmlFor="rememberMe" className="text-xs text-slate-300 cursor-pointer select-none">
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
            <div className="mt-6 pt-5 border-t border-[#27354A]">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
                Quick Demo Accounts (1-Click Fill)
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin@shopio.com', 'Super Admin')}
                  className="p-2 rounded-xl bg-[#1E293B]/80 hover:bg-[#1E293B] border border-[#334155] text-left text-pink-300 font-semibold transition-colors cursor-pointer"
                >
                  <p className="font-bold text-white">👑 Super Admin</p>
                  <p className="text-[10px] text-slate-400">admin@shopio.com</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('orderadmin@shopio.com', 'Order Admin')}
                  className="p-2 rounded-xl bg-[#1E293B]/80 hover:bg-[#1E293B] border border-[#334155] text-left text-emerald-300 font-semibold transition-colors cursor-pointer"
                >
                  <p className="font-bold text-white">📦 Order Admin</p>
                  <p className="text-[10px] text-slate-400">orderadmin@shopio.com</p>
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Forgot Password Helper Modal */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#161F30] border border-[#27354A] rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#F43397]/20 text-[#F43397] flex items-center justify-center text-xl">
                🔑
              </div>
              <h3 className="font-black text-lg text-white">Admin Credentials Reset</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
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
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥', badge: users.length },
    { id: 'sellers', label: 'Sellers', icon: '💼', badge: sellers.length },
    { id: 'products', label: 'Products', icon: '📦', badge: '3.6k' },
    { id: 'categories', label: 'Categories', icon: '🏷️' },
    { id: 'orders', label: 'Orders', icon: '🛍️', badge: '1.4k' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'returns', label: 'Returns & Refunds', icon: '🔄', badge: '3' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
    { id: 'coupons', label: 'Coupons & Offers', icon: '🎁' },
    { id: 'kyc', label: 'KYC Verification', icon: '🛡️', badge: '14' },
    { id: 'complaints', label: 'Complaints', icon: '⚠️', badge: '7' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-[#F43397] selection:text-white">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-40 bg-[#161F30]/95 backdrop-blur-md border-b border-[#27354A] shadow-md">
        <div className="w-full px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          {/* Mobile Hamburger + Logo & Portal Title */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Hamburger button for Mobile / Small screens */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-slate-200 border border-[#334155] transition-colors"
              title="Toggle Navigation Menu"
            >
              <span className="text-lg leading-none">☰</span>
            </button>

            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#9F2089] via-[#D81B80] to-[#F43397] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-pink-500/25">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight flex items-center">
                  <span>Shopio</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F43397] ml-1 mr-2 inline-block"></span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-[#F43397]/20 text-[#F43397] border border-[#F43397]/30">
                  {adminUser.role || 'Super Admin'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Master Web Dashboard · Real-Time Control
              </p>
            </div>
          </div>

          {/* Top Search Input */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users, sellers, products, order IDs..."
                className="w-full bg-[#0B0F19]/80 border border-[#334155]/80 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#F43397]"
              />
              <span className="absolute left-3.5 top-2.5 text-xs text-slate-400">🔍</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Top Actions: Back to Store, Notifications, Profile, Logout */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Quick Customer Store Link */}
            <button
              onClick={() => onNavigate?.('home')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-[#334155] transition-colors"
              title="Go to Customer Store"
            >
              <span>🛍️</span>
              <span>Customer Store</span>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUnreadNotifications(0);
                }}
                className="p-2.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-slate-200 border border-[#334155] transition-colors relative cursor-pointer"
                title="Notifications"
              >
                <span>🔔</span>
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#161F30] border border-[#334155] rounded-2xl shadow-2xl p-4 z-50 animate-fade-in text-xs">
                  <div className="flex items-center justify-between mb-3 border-b border-[#27354A] pb-2">
                    <span className="font-bold text-white">System Notifications</span>
                    <span className="text-[10px] text-[#F43397] font-bold">Mark all read</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-2 rounded-xl bg-[#1E293B]/80 border border-[#334155]">
                      <p className="font-bold text-pink-300">📦 New Bulk Order Received</p>
                      <p className="text-[11px] text-slate-300">ORD-789124 from Sneha Patil (₹1,499)</p>
                      <span className="text-[9px] text-slate-500">2 mins ago</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#1E293B]/80 border border-[#334155]">
                      <p className="font-bold text-emerald-300">🛡️ Seller KYC Submitted</p>
                      <p className="text-[11px] text-slate-300">Nexus Tech Accessories uploaded GST & PAN</p>
                      <span className="text-[9px] text-slate-500">15 mins ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Pill */}
            <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-[#27354A]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#9F2089] to-[#F43397] flex items-center justify-center text-xs font-black text-white">
                AD
              </div>
              <div className="text-left text-xs">
                <p className="font-bold text-white leading-none">{adminUser.name}</p>
                <p className="text-[10px] text-slate-400 leading-none mt-0.5">{adminUser.role}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold shadow-md border border-rose-500/50 transition-all active:scale-95 cursor-pointer"
              title="Logout from Admin Portal"
            >
              <span>🚪</span>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Layout: Left Side Navigation Bar + Content Canvas ── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Backdrop Overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
          />
        )}

        {/* ── LEFT-SIDE NAVIGATION BAR (SIDEBAR) ── */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#161F30] border-r border-[#27354A] flex flex-col shrink-0 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-[#27354A]/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-black text-[#F43397] uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#F43397] animate-pulse" />
                NAVIGATION MENU
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B]"
            >
              ✕
            </button>
          </div>

          {/* Sidebar Menu Items List with Dashboard at the Top */}
          <div className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
            {/* Topmost Primary Item: DASHBOARD */}
            <button
              onClick={() => {
                setActiveSection('dashboard');
                setSearchQuery('');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer mb-2.5 ${
                activeSection === 'dashboard'
                  ? 'bg-gradient-to-r from-[#9F2089] via-[#D81B80] to-[#F43397] text-white shadow-xl shadow-pink-900/40 ring-1 ring-white/20'
                  : 'bg-[#1E293B]/60 text-slate-200 hover:bg-[#1E293B] hover:text-white border border-[#334155]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">📊</span>
                <span className="text-sm font-black tracking-tight">Dashboard</span>
              </div>
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                  activeSection === 'dashboard' ? 'bg-white/25 text-white' : 'bg-purple-500/20 text-purple-300'
                }`}
              >
                Overview
              </span>
            </button>

            {/* Separator */}
            <div className="px-3 pt-2 pb-1 text-[10px] font-black text-slate-500 uppercase tracking-wider">
              Management Modules
            </div>

            {/* All remaining options below Dashboard */}
            {sidebarItems
              .filter((item) => item.id !== 'dashboard')
              .map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setSearchQuery('');
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white shadow-lg shadow-pink-900/30 ring-1 ring-white/10'
                        : 'text-slate-400 hover:text-white hover:bg-[#1E293B]/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{item.icon}</span>
                      <span className="tracking-wide">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                          isActive ? 'bg-white/20 text-white' : 'bg-[#1E293B] text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-[#27354A]/80 bg-[#0B0F19]/60 space-y-2">
            <button
              onClick={() => onNavigate?.('home')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#1E293B]/90 hover:bg-slate-700 text-white text-xs font-bold border border-[#334155]/80 transition-all cursor-pointer shadow-sm"
            >
              <span>🛍️</span>
              <span>Customer Shopping Store</span>
            </button>
            <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Session: {adminUser.role || 'Super Admin'}</span>
            </div>
          </div>
        </aside>

        {/* Dynamic Section Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
          {/* ============================================================== */}
          {/* 1. DASHBOARD OVERVIEW                                          */}
          {/* ============================================================== */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-white">Dashboard Overview</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time pulse across users, sellers, revenue, and active orders.
                </p>
              </div>

              {/* 8 Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
                {[
                  { label: 'Total Users', value: metrics.totalUsers, change: '+12.4%', color: 'from-[#9F2089]/25 to-[#F43397]/15', border: 'border-[#F43397]/30', icon: '👥' },
                  { label: 'Total Sellers', value: metrics.totalSellers, change: '+8.1%', color: 'from-purple-900/35 to-pink-900/25', border: 'border-purple-500/30', icon: '💼' },
                  { label: 'Total Products', value: metrics.totalProducts, change: '+18.2%', color: 'from-emerald-950/40 to-teal-900/25', border: 'border-[#038D63]/30', icon: '📦' },
                  { label: 'Total Orders', value: metrics.totalOrders, change: '+24.5%', color: 'from-amber-950/40 to-orange-900/25', border: 'border-amber-500/30', icon: '🛍️' },
                  { label: 'Total Revenue', value: metrics.totalRevenue, change: '+31.8%', color: 'from-[#F43397]/25 to-[#FF8A00]/20', border: 'border-[#F43397]/40', icon: '💳' },
                  { label: 'Pending Orders', value: metrics.pendingOrders, change: 'Action Required', color: 'from-rose-950/40 to-red-900/25', border: 'border-rose-500/30', icon: '⏳' },
                  { label: 'Pending KYC', value: metrics.pendingKyc, change: 'Requires Approval', color: 'from-cyan-950/40 to-blue-900/25', border: 'border-cyan-500/30', icon: '🛡️' },
                  { label: 'Pending Complaints', value: metrics.pendingComplaints, change: 'Needs Resolution', color: 'from-yellow-950/40 to-amber-900/25', border: 'border-yellow-500/30', icon: '⚠️' },
                ].map((card, i) => (
                  <div
                    key={i}
                    className={`bg-gradient-to-br ${card.color} border ${card.border} rounded-2xl p-4 flex flex-col justify-between`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-2">
                      <span>{card.label}</span>
                      <span className="text-base">{card.icon}</span>
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-black text-white">{card.value}</p>
                      <p className="text-[10px] text-emerald-400 font-bold mt-1">{card.change}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Overview AreaChart */}
                <div className="lg:col-span-2 bg-[#161F30] border border-[#27354A] rounded-3xl p-5 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-extrabold text-sm text-white">Sales & Revenue Overview</h3>
                      <p className="text-[11px] text-slate-400">Monthly Gross Revenue vs Net Profit</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-xl bg-pink-500/10 text-[#F43397] border border-pink-500/20 font-bold">
                      2026 Live
                    </span>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesOverviewData}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F43397" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#9F2089" stopOpacity={0.05} />
                          </linearGradient>
                          <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#038D63" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#038D63" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27354A" />
                        <XAxis dataKey="month" stroke="#64748b" textAnchor="end" fontSize={11} />
                        <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#161F30', borderColor: '#27354A', borderRadius: '1rem', fontSize: '12px' }}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="revenue" stroke="#F43397" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" name="Revenue (₹)" />
                        <Area type="monotone" dataKey="profit" stroke="#038D63" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" name="Profit (₹)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Top Categories PieChart */}
                <div className="bg-[#161F30] border border-[#27354A] rounded-3xl p-5 shadow-lg flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Top Sales Categories</h3>
                    <p className="text-[11px] text-slate-400">Distribution of orders by catalog</p>
                  </div>
                  <div className="h-48 w-full my-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={categoryDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                          {categoryDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#161F30', borderColor: '#27354A', borderRadius: '0.75rem', fontSize: '11px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {categoryDistribution.map((cat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-slate-300 font-medium truncate">{cat.name}: {cat.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* User Growth BarChart */}
              <div className="bg-[#161F30] border border-[#27354A] rounded-3xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Customer & Seller Onboarding Growth</h3>
                    <p className="text-[11px] text-slate-400">Total registered customers vs verified merchants</p>
                  </div>
                </div>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27354A" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#161F30', borderColor: '#27354A', borderRadius: '0.75rem', fontSize: '12px' }} />
                      <Legend />
                      <Bar dataKey="customers" fill="#9F2089" radius={[6, 6, 0, 0]} name="Customers" />
                      <Bar dataKey="sellers" fill="#F43397" radius={[6, 6, 0, 0]} name="Sellers" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Orders Table */}
              <div className="bg-[#161F30] border border-[#27354A] rounded-3xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Recent Orders Stream</h3>
                    <p className="text-[11px] text-slate-400">Latest transactions requiring fulfillment</p>
                  </div>
                  <button
                    onClick={() => setActiveSection('orders')}
                    className="text-xs font-bold text-[#F43397] hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#27354A] text-slate-400">
                        <th className="pb-3 font-bold">Order ID</th>
                        <th className="pb-3 font-bold">Customer</th>
                        <th className="pb-3 font-bold">Product</th>
                        <th className="pb-3 font-bold">Seller</th>
                        <th className="pb-3 font-bold">Amount</th>
                        <th className="pb-3 font-bold">Status</th>
                        <th className="pb-3 font-bold">Date</th>
                        <th className="pb-3 font-bold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27354A]/60 font-medium">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#1E293B]/60 transition-colors">
                          <td className="py-3 font-mono font-bold text-[#F43397]">{ord.id}</td>
                          <td className="py-3 text-white">{ord.customer}</td>
                          <td className="py-3 text-slate-300 max-w-[200px] truncate">{ord.product}</td>
                          <td className="py-3 text-slate-400">{ord.seller}</td>
                          <td className="py-3 font-bold text-white">₹{ord.amount}</td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                ord.orderStatus === 'Delivered'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : ord.orderStatus === 'Shipped'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : ord.orderStatus === 'Returned'
                                  ? 'bg-rose-500/20 text-rose-400'
                                  : 'bg-amber-500/20 text-amber-400'
                              }`}
                            >
                              {ord.orderStatus}
                            </span>
                          </td>
                          <td className="py-3 text-slate-400 text-[11px]">{ord.date}</td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => setSelectedItemModal({ type: 'order', item: ord })}
                              className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#9F2089] to-[#F43397] hover:opacity-95 text-white font-bold text-[10px] transition-colors"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                  <h1 className="text-2xl font-black text-white">User Management</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    View user directory, order records, block or suspend access.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                    className="bg-[#161F30] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active Only</option>
                    <option value="blocked">Blocked Only</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-[#161F30] border border-[#27354A] rounded-3xl p-5 shadow-lg overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#27354A] text-slate-400">
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
                  <tbody className="divide-y divide-[#27354A]/60 font-medium">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-[#1E293B]/60 transition-colors">
                        <td className="py-3 font-mono font-bold text-[#F43397]">{user.id}</td>
                        <td className="py-3 text-white font-bold">{user.name}</td>
                        <td className="py-3 text-slate-300">{user.phone}</td>
                        <td className="py-3 text-slate-400">{user.email}</td>
                        <td className="py-3 text-slate-200 font-bold">{user.ordersCount || 0}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              user.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : user.status === 'blocked'
                                ? 'bg-rose-500/20 text-rose-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {user.status || 'active'}
                          </span>
                        </td>
                        <td className="py-3 text-slate-400 text-[11px]">{user.joinedDate || '2026'}</td>
                        <td className="py-3 text-right space-x-1.5">
                          <button
                            onClick={() => setSelectedItemModal({ type: 'user', item: user })}
                            className="px-2 py-1 rounded-lg bg-[#1E293B] hover:bg-slate-700 text-slate-200 text-[10px] font-bold"
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
                  <h1 className="text-2xl font-black text-white">Seller Management</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Approve merchants, inspect catalog sizes, review payouts and KYC.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={sellerStatusFilter}
                    onChange={(e) => setSellerStatusFilter(e.target.value)}
                    className="bg-[#161F30] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="all">All Seller Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="bg-[#161F30] border border-[#27354A] rounded-3xl p-5 shadow-lg overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#27354A] text-slate-400">
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
                  <tbody className="divide-y divide-[#27354A]/60 font-medium">
                    {filteredSellers.map((seller) => (
                      <tr key={seller.id} className="hover:bg-[#1E293B]/60 transition-colors">
                        <td className="py-3 font-mono font-bold text-[#F43397]">{seller.id}</td>
                        <td className="py-3 text-white font-bold">{seller.businessName}</td>
                        <td className="py-3 text-slate-300">
                          {seller.contactPerson} ({seller.phone})
                        </td>
                        <td className="py-3 text-slate-200">{seller.productsCount} items</td>
                        <td className="py-3 text-amber-400 font-bold">⭐ {seller.rating}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              seller.kycStatus === 'Verified'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : seller.kycStatus === 'Pending'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {seller.kycStatus}
                          </span>
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              seller.status === 'Approved'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : seller.status === 'Pending'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {seller.status}
                          </span>
                        </td>
                        <td className="py-3 text-right space-x-1.5">
                          <button
                            onClick={() => setSelectedItemModal({ type: 'seller', item: seller })}
                            className="px-2 py-1 rounded-lg bg-[#1E293B] hover:bg-slate-700 text-slate-200 text-[10px] font-bold"
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
                  <h1 className="text-2xl font-black text-white">Product Catalog Management</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
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

              <div className="bg-[#161F30] border border-[#27354A] rounded-3xl p-5 shadow-lg overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#27354A] text-slate-400">
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
                  <tbody className="divide-y divide-[#27354A]/60 font-medium">
                    {[
                      { id: 'p1', name: 'Kanjivaram Soft Silk Saree with Blouse', cat: 'Women Ethnic', price: '₹1,499', stock: 120, rating: 4.8, status: 'Approved' },
                      { id: 'p2', name: 'Cotton Printed Anarkali Kurti', cat: 'Women Western', price: '₹599', stock: 85, rating: 4.5, status: 'Approved' },
                      { id: 'p3', name: 'Men Regular Fit Cotton Shirt', cat: 'Men', price: '₹649', stock: 40, rating: 4.3, status: 'Approved' },
                      { id: 'p4', name: 'boAt Rockerz Wireless Headphones', cat: 'Electronics', price: '₹1,299', stock: 15, rating: 4.7, status: 'Approved' },
                      { id: 'p5', name: 'Non-stick Granite Cookware Set', cat: 'Home & Kitchen', price: '₹2,199', stock: 8, rating: 4.2, status: 'Pending' },
                    ].map((prod) => (
                      <tr key={prod.id} className="hover:bg-[#1E293B]/60 transition-colors">
                        <td className="py-3 font-mono font-bold text-[#F43397]">{prod.id}</td>
                        <td className="py-3 text-white font-bold">{prod.name}</td>
                        <td className="py-3 text-slate-300">{prod.cat}</td>
                        <td className="py-3 font-bold text-white">{prod.price}</td>
                        <td className="py-3 text-slate-200">{prod.stock} units</td>
                        <td className="py-3 text-amber-400">⭐ {prod.rating}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
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
                  <h1 className="text-2xl font-black text-white">Categories Management</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Organize shopping taxology and catalog divisions.</p>
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
                  <div key={i} className="p-4 rounded-2xl bg-[#161F30] border border-[#27354A] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cat.icon}</span>
                      <div>
                        <p className="font-bold text-white text-xs">{cat.name}</p>
                        <p className="text-[10px] text-slate-400">{cat.count} products</p>
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
                  <h1 className="text-2xl font-black text-white">Order Management</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Track fulfillment status from placement to delivery.</p>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto">
                  {['all', 'Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        orderStatusFilter === st
                          ? 'bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white shadow-md shadow-pink-500/20'
                          : 'bg-[#161F30] text-slate-400 hover:text-white border border-[#27354A]'
                      }`}
                    >
                      {st === 'all' ? 'All Orders' : st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#161F30] border border-[#27354A] rounded-3xl p-5 shadow-lg overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#27354A] text-slate-400">
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
                  <tbody className="divide-y divide-[#27354A]/60 font-medium">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#1E293B]/60 transition-colors">
                        <td className="py-3 font-mono font-bold text-[#F43397]">{ord.id}</td>
                        <td className="py-3 text-white font-bold">{ord.customer}</td>
                        <td className="py-3 text-slate-400">{ord.seller}</td>
                        <td className="py-3 text-slate-300 max-w-[180px] truncate">{ord.product}</td>
                        <td className="py-3 font-bold text-white">₹{ord.amount}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ord.paymentStatus === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
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
                            className="bg-[#0B0F19] border border-[#334155] text-white rounded-lg px-2 py-1 text-[11px] outline-none"
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
                <h1 className="text-2xl font-black text-white">Payments & Settlements</h1>
                <p className="text-xs text-slate-400 mt-0.5">UPI, Card gateways, Cash on Delivery settlement tracking.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#161F30] border border-[#27354A]">
                  <p className="text-xs text-slate-400">Gateway Success Rate</p>
                  <p className="text-2xl font-black text-emerald-400 mt-1">98.4%</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#161F30] border border-[#27354A]">
                  <p className="text-xs text-slate-400">Total Settled to Merchants</p>
                  <p className="text-2xl font-black text-white mt-1">₹34,18,000</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#161F30] border border-[#27354A]">
                  <p className="text-xs text-slate-400">Escrow Balance</p>
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
                <h1 className="text-2xl font-black text-white">Returns & Refunds</h1>
                <p className="text-xs text-slate-400 mt-0.5">Customer return requests, inspection audits, and refund triggers.</p>
              </div>

              <div className="bg-[#161F30] border border-[#27354A] rounded-3xl p-5 shadow-lg overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#27354A] text-slate-400">
                      <th className="pb-3 font-bold">Return ID</th>
                      <th className="pb-3 font-bold">Order ID</th>
                      <th className="pb-3 font-bold">Customer</th>
                      <th className="pb-3 font-bold">Reason</th>
                      <th className="pb-3 font-bold">Amount</th>
                      <th className="pb-3 font-bold">Status</th>
                      <th className="pb-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#27354A]/60 font-medium">
                    {[
                      { id: 'RET-301', ord: 'ORD-789127', cust: 'Aniket Kulkarni', reason: 'Size M too small for fit', amt: '₹899', st: 'Approved' },
                      { id: 'RET-302', ord: 'ORD-789045', cust: 'Deepak Varma', reason: 'Defective audio cable', amt: '₹1,299', st: 'Requested' },
                    ].map((ret) => (
                      <tr key={ret.id} className="hover:bg-[#1E293B]/60 transition-colors">
                        <td className="py-3 font-mono font-bold text-[#F43397]">{ret.id}</td>
                        <td className="py-3 text-slate-300">{ret.ord}</td>
                        <td className="py-3 text-white font-bold">{ret.cust}</td>
                        <td className="py-3 text-slate-300">{ret.reason}</td>
                        <td className="py-3 font-bold text-white">{ret.amt}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400">
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
                <h1 className="text-2xl font-black text-white">Reviews Moderation</h1>
                <p className="text-xs text-slate-400 mt-0.5">Filter fake reviews, inspect ratings, verify buyer badges.</p>
              </div>

              <div className="space-y-3">
                {[
                  { prod: 'Kanjivaram Silk Saree', user: 'Priya Sharma', stars: 5, comment: 'Absolutely stunning quality! The blouse piece is gorgeous.', status: 'Approved' },
                  { prod: 'boAt Rockerz 450', user: 'Amit K.', stars: 1, comment: 'Spam review with non-working link', status: 'Flagged' },
                ].map((rev, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#161F30] border border-[#27354A] flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{rev.prod} · <span className="text-amber-400">{'★'.repeat(rev.stars)}</span></p>
                      <p className="text-slate-300 mt-1">"{rev.comment}"</p>
                      <p className="text-[10px] text-slate-500 mt-1">By {rev.user} · Status: {rev.status}</p>
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
                  <h1 className="text-2xl font-black text-white">Coupons & Promotional Offers</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Create discount codes, flash sales and cashback campaigns.</p>
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
                  <div key={idx} className="p-5 rounded-3xl bg-[#161F30] border border-[#27354A] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-sm text-[#F43397] px-2.5 py-1 bg-[#F43397]/10 rounded-xl border border-[#F43397]/20">
                        {cpn.code}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                        {cpn.status}
                      </span>
                    </div>
                    <p className="font-extrabold text-base text-white">{cpn.discount}</p>
                    <div className="text-[11px] text-slate-400 space-y-0.5">
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
                <h1 className="text-2xl font-black text-white">KYC Verification Center</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verify merchant PAN, GST, business registration and bank accounts.
                </p>
              </div>

              <div className="space-y-4">
                {sellers.map((s) => (
                  <div key={s.id} className="p-5 rounded-3xl bg-[#161F30] border border-[#27354A] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#27354A] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-white text-base">{s.businessName}</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1E293B] text-slate-300 font-mono">
                            {s.id}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">Contact: {s.contactPerson} ({s.phone})</p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-extrabold self-start sm:self-center ${
                          s.kycStatus === 'Verified'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : s.kycStatus === 'Pending'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {s.kycStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-[#0B0F19]/80 border border-[#27354A]">
                        <span className="text-[10px] text-slate-500 block">PAN Number</span>
                        <span className="font-mono font-bold text-slate-200">{s.pan}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#0B0F19]/80 border border-[#27354A]">
                        <span className="text-[10px] text-slate-500 block">GST Certificate</span>
                        <span className="font-mono font-bold text-slate-200">{s.gst}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#0B0F19]/80 border border-[#27354A]">
                        <span className="text-[10px] text-slate-500 block">Bank Account Details</span>
                        <span className="font-mono font-bold text-slate-200 truncate block">{s.bank}</span>
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
                        className="px-3.5 py-1.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-slate-300 font-bold text-xs"
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
                <h1 className="text-2xl font-black text-white">Complaint Management</h1>
                <p className="text-xs text-slate-400 mt-0.5">Manage customer and seller disputes with assigned administrators.</p>
              </div>

              <div className="bg-[#161F30] border border-[#27354A] rounded-3xl p-5 shadow-lg overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#27354A] text-slate-400">
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
                  <tbody className="divide-y divide-[#27354A]/60 font-medium">
                    {complaints.map((cmp) => (
                      <tr key={cmp.id} className="hover:bg-[#1E293B]/60 transition-colors">
                        <td className="py-3 font-mono font-bold text-rose-400">{cmp.id}</td>
                        <td className="py-3 text-white font-bold">{cmp.user}</td>
                        <td className="py-3 text-slate-300 font-mono">{cmp.orderId}</td>
                        <td className="py-3 text-slate-300 max-w-[220px] truncate">{cmp.issue}</td>
                        <td className="py-3 text-slate-400 text-[11px]">{cmp.date}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            cmp.priority === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {cmp.priority}
                          </span>
                        </td>
                        <td className="py-3">
                          <select
                            value={cmp.status}
                            onChange={(e) => handleComplaintStatus(cmp.id, e.target.value)}
                            className="bg-[#0B0F19] border border-[#334155] text-white rounded-lg px-2 py-1 text-[11px] outline-none"
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
                <h1 className="text-2xl font-black text-white">Notification Broadcast Center</h1>
                <p className="text-xs text-slate-400 mt-0.5">Send targeted push alerts and announcements to users & sellers.</p>
              </div>

              <div className="bg-[#161F30] border border-[#27354A] rounded-3xl p-6 shadow-lg max-w-2xl space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Target Audience</label>
                  <select
                    value={broadcastMessage.target}
                    onChange={(e) => setBroadcastMessage({ ...broadcastMessage, target: e.target.value })}
                    className="w-full bg-[#0B0F19] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="All Users">All Registered Users (14,892)</option>
                    <option value="All Sellers">All Active Sellers (842)</option>
                    <option value="Order Updates">Pending Orders Only (28)</option>
                    <option value="Promotional">Promotional Blast</option>
                    <option value="System">System Announcements</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Broadcast Title</label>
                  <input
                    type="text"
                    value={broadcastMessage.title}
                    onChange={(e) => setBroadcastMessage({ ...broadcastMessage, title: e.target.value })}
                    placeholder="e.g. Mega Festive Sale Live Now!"
                    className="w-full bg-[#0B0F19] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Message Text</label>
                  <textarea
                    rows={3}
                    value={broadcastMessage.text}
                    onChange={(e) => setBroadcastMessage({ ...broadcastMessage, text: e.target.value })}
                    placeholder="Enter the push notification message body..."
                    className="w-full bg-[#0B0F19] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white outline-none"
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
                <h1 className="text-2xl font-black text-white">Advanced Analytics & Reports</h1>
                <p className="text-xs text-slate-400 mt-0.5">In-depth breakdown of conversion funnels, AOV and geography.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-[#161F30] border border-[#27354A]">
                  <p className="text-xs text-slate-400">Average Order Value (AOV)</p>
                  <p className="text-2xl font-black text-white mt-1">₹895</p>
                  <span className="text-[10px] text-emerald-400 font-bold">+5.2% vs last month</span>
                </div>
                <div className="p-5 rounded-2xl bg-[#161F30] border border-[#27354A]">
                  <p className="text-xs text-slate-400">Checkout Conversion Rate</p>
                  <p className="text-2xl font-black text-emerald-400 mt-1">4.2%</p>
                  <span className="text-[10px] text-emerald-400 font-bold">Above e-commerce benchmark</span>
                </div>
                <div className="p-5 rounded-2xl bg-[#161F30] border border-[#27354A]">
                  <p className="text-xs text-slate-400">Top State by Volume</p>
                  <p className="text-2xl font-black text-[#F43397] mt-1">Maharashtra (34%)</p>
                  <span className="text-[10px] text-slate-400">Followed by Gujarat & Delhi</span>
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
                <h1 className="text-2xl font-black text-white">Settings & Role Permissions</h1>
                <p className="text-xs text-slate-400 mt-0.5">Configure platform security, roles matrix and maintenance modes.</p>
              </div>

              {/* Roles & Permissions Matrix */}
              <div className="bg-[#161F30] border border-[#27354A] rounded-3xl p-5 shadow-lg overflow-x-auto space-y-4">
                <h3 className="font-bold text-sm text-white">Admin Roles & Permissions System</h3>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#27354A] text-slate-400">
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
                  <tbody className="divide-y divide-[#27354A]/60 font-medium">
                    {Object.entries(ROLE_PERMISSIONS_MATRIX).map(([rName, perms]) => (
                      <tr key={rName} className="hover:bg-[#1E293B]/60 transition-colors">
                        <td className="py-3 font-bold text-white">{rName}</td>
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
                <div className="p-5 rounded-2xl bg-[#161F30] border border-[#27354A] space-y-2">
                  <h4 className="font-bold text-white text-xs">Emergency Maintenance Mode</h4>
                  <p className="text-[11px] text-slate-400">Only administrators can browse platform when activated.</p>
                  <button
                    onClick={() => onShowToast?.('Maintenance mode toggled', 'info')}
                    className="px-3 py-1.5 bg-[#1E293B] hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl border border-[#334155]"
                  >
                    Toggle Maintenance Mode
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-[#161F30] border border-[#27354A] space-y-2">
                  <h4 className="font-bold text-white text-xs">Admin Session Security</h4>
                  <p className="text-[11px] text-slate-400">JWT Token Expiry: 12 Hours with Idle Auto-lock.</p>
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
          <div className="bg-[#161F30] border border-[#27354A] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in text-xs">
            <div className="flex items-center justify-between border-b border-[#27354A] pb-3">
              <span className="font-black text-white text-sm">
                {selectedItemModal.type === 'order' ? `Order Details #${selectedItemModal.item.id}` : `${selectedItemModal.type.toUpperCase()} Record`}
              </span>
              <button
                onClick={() => setSelectedItemModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <pre className="bg-[#0B0F19] p-3 rounded-2xl text-[11px] font-mono text-pink-300 overflow-x-auto">
              {JSON.stringify(selectedItemModal.item, null, 2)}
            </pre>
            <button
              onClick={() => setSelectedItemModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-white font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
