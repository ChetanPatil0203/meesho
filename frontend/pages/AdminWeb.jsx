import { useState, useEffect, useMemo, useCallback } from 'react';
import adminService from '../services/adminService';

// =========================================================================
// MULTI-LANGUAGE TRANSLATION DICTIONARY (English, मराठी, हिंदी)
// =========================================================================
const I18N = {
  mr: {
    langName: 'मराठी',
    portalTitle: 'Shopio Admin Web',
    portalSubtitle: 'ॲप वापरकर्ते मॉनिटरिंग व परवानगी नियंत्रण पॅनेल',
    liveSync: 'थेट सिंक',
    liveAutoPolling: 'ऑटो-रिफ्रेश सुरू',
    pollingPaused: 'ऑटो-रिफ्रेश बंद',
    testActivity: 'थेट हालचाल टेस्ट',
    shoppingApp: 'शॉपिंग ॲप',
    maintenanceBannerTitle: 'ग्राहक ॲप सध्या मेंटेनन्स मोडमध्ये आहे (Maintenance Mode Active)',
    maintenanceBannerDesc: 'केवळ ॲडमिनला परवानगी आहे. सर्व सामान्य ग्राहक ॲप वापरू शकत नाहीत.',
    maintenanceTurnOff: 'मेंटेनन्स बंद करा',

    // Metrics
    metricOnlineTitle: 'सध्या ॲप वापरणारे (Online)',
    metricOnlineLive: 'थेट सक्रिय (Live)',
    metricOnlineSub: '📱 मोबाईल ॲप्स व ब्राउझर्स',
    metricTotalTitle: 'एकूण वापरकर्ते (Total)',
    metricTotalSub: (c, s) => `${c} ग्राहक · ${s} विक्रेते`,
    metricTotalReg: 'नोंदणीकृत',
    metricGrantedTitle: 'परवानगी मंजूर (Permitted)',
    metricGrantedActive: 'ॲक्सेस सुरू',
    metricGrantedSub: (pct) => `${pct}% ॲप वापरण्यास पात्र`,
    metricBlockedTitle: 'परवानगी नाकारली (Blocked)',
    metricBlockedBadge: 'ॲप बंदी',
    metricBlockedSub: 'लॉगिन व खरेदी करण्यास मनाई',
    metricPendingTitle: 'मंजुरी प्रलंबित (Pending)',
    metricPendingBadge: 'नवीन युझर्स',
    metricPendingSub: 'ॲडमिन मंजुरी आवश्यक',

    // Tabs
    tabUsers: 'वापरकर्ते व परवानग्या',
    tabLive: 'कोण ॲप वापरत आहे (Live)',
    tabLogs: 'लॉगिन इतिहास व ऑडिट',
    tabSettings: 'ग्लोबल सुरक्षा सेटिंग्ज',
    addUserBtn: 'नवीन युझर जोडा',

    // Filter Bar
    searchPlaceholder: 'नाव, ईमेल, फोन नंबर किंवा शहराने शोधा...',
    roleAll: 'सर्व रोल (All Roles)',
    roleCustomer: '👤 ग्राहक (Customer)',
    roleSeller: '💼 विक्रेता (Seller)',
    roleAdmin: '👑 ॲडमिन (Admin)',
    accessAll: 'सर्व परवानग्या (All Access)',
    accessAllowed: '✅ ॲप वापर मंजूर (Permitted)',
    accessBlocked: '🚫 ॲप वापर बंदी (Blocked)',
    accessOnline: '🟢 सध्या सक्रिय (Online Now)',
    accessPending: '⏳ मंजुरी प्रलंबित (Pending)',

    // Table Headers
    thUser: 'वापरकर्ता (User Info)',
    thRole: 'रोल (Role)',
    thActivity: 'सध्याची हालचाल (Current Activity)',
    thDevice: 'डिव्हाइस व ठिकाण (Device & IP)',
    thAccess: 'ॲप वापरण्याची परवानगी',
    thAccessSub: '(Master App Access)',
    thActions: 'कृती (Actions)',

    // Table content
    onlineNow: 'Online (सध्या सक्रिय)',
    offlineAgo: (time) => `Offline · ${time}`,
    noUsersFound: 'कोणताही वापरकर्ता सापडला नाही',
    noUsersSub: 'कृपया सर्च किंवा फिल्टर्स बदलून पुन्हा तपासा.',
    approveBtn: 'मंजूर करा (Approve)',
    allowedLabel: 'परवानगी दिली (Allowed)',
    blockedLabel: 'बंदी घातली (Blocked)',
    managePermsBtn: 'परवानग्या',
    tableShowing: (filtered, total) => `दाखवत आहे: ${filtered} पैकी ${total} वापरकर्ते`,
    tableLegendActive: 'परवानगी सक्रिय',
    tableLegendBlocked: 'परवानगी रद्द (Blocked)',

    // Live Tab
    liveHeading: 'थेट सक्रिय वापरकर्ते मॉनिटर (Live Active Sessions Pulse)',
    liveSub: 'या क्षणी तुमच्या Shopio ॲपमध्ये कोणते युझर्स आहेत, ते काय पाहत आहेत व कोणत्या डिव्हाइसवरून वापरत आहेत ते खाली दाखवले आहे.',
    liveTestBtn: '⚡ नवीन लाइव्ह इव्हेंट टेस्ट करा',
    liveCurrentActLabel: 'सध्याची ॲप हालचाल (Current Activity)',
    liveDeviceLabel: 'डिव्हाइस (Device):',
    liveLocLabel: 'ठिकाण (Location):',
    liveIpLabel: 'IP ॲड्रेस (Network):',
    liveLastActiveLabel: 'शेवटची वेळ (Last Active):',
    liveRevokeBtn: '🚫 ॲप ॲक्सेस बंद करा',
    liveGrantBtn: '✅ ॲप परवानगी द्या',

    // Logs Tab
    logsHeading: 'ॲप लॉगिन व सुरक्षा ऑडिट लॉग (Login Activity & App Access Audit)',
    logsSub: 'कोणी, कधी आणि कोणत्या डिव्हाइसवरून ॲपमध्ये लॉगिन करण्याचा प्रयत्न केला याचा संपूर्ण रेकॉर्ड.',
    logsTotal: 'एकूण नोंदी:',
    statusAllowed: 'सक्रिय (Allowed)',
    statusBlocked: 'परवानगी नाकारली (Blocked)',
    statusFailed: 'अयशस्वी (Failed)',

    // Settings Tab
    setting1Title: 'नवीन युझर ॲप वापर धोरण (New User Access Policy)',
    setting1Desc: 'नवीन नोंदणी केलेल्या युझरला थेट ॲप वापरू द्यायचे की ॲडमिनच्या पूर्वपरवानगीशिवाय ॲप उघडू द्यायचे नाही?',
    setting1Active: "🔒 कडक सुरक्षा: प्रत्येक नवीन युझर 'Pending' राहील. ॲडमिनने परवानगी दिल्यावरच ॲप सुरू होईल.",
    setting1Inactive: "🟢 मुक्त ॲक्सेस: नवीन युझर साइन अप करून लगेच ॲप वापरू शकतो.",
    setting2Title: 'इमर्जन्सी ॲप लॉक / मेंटेनन्स (Emergency App Lockout)',
    setting2Desc: 'काही कारणास्तव किंवा सुरक्षेसाठी संपूर्ण ग्राहक ॲप तात्पुरते बंद करायचे असल्यास हे सुरू करा.',
    setting2Active: "⚠️ मेंटेनन्स सुरू: ग्राहकांना 'App Under Maintenance' स्क्रीन दिसेल.",
    setting2Inactive: "✅ ॲप सामान्यपणे कार्यरत आहे. सर्व युझर्स शॉपिंग करू शकतात.",

    // Permissions Modal
    modalMasterTitle: 'मुख्य ॲप वापर परवानगी (Master App Access)',
    modalMasterAllowed: 'या युझरला ॲप वापरण्याची पूर्ण मुभा आहे.',
    modalMasterBlocked: 'या युझरची ॲप वापरण्याची परवानगी बंद आहे (Blocked).',
    modalGranularTitle: 'तपशीलवार परवानग्या निवडा (Granular App Permissions)',
    modalSaveClose: 'बदल सेव्ह करा व बंद करा',

    // Add User Modal
    addUserModalTitle: 'नवीन वापरकर्ता जोडा',
    addUserModalSub: 'कस्टम परवानग्यांसह नवीन ग्राहक किंवा विक्रेता ॲड करा',
    lblFullName: 'पूर्ण नाव (Full Name)',
    lblEmail: 'ईमेल ॲड्रेस (Email)',
    lblPhone: 'मोबाईल नंबर (Phone)',
    lblRole: 'रोल (Role)',
    lblAccessPrompt: 'ॲप वापर परवानगी',
    optImmediate: '✅ लगेच परवानगी द्या',
    optBlock: '🚫 बंदी ठेवा (Blocked)',
    btnSubmitUser: 'वापरकर्ता सेव्ह करा (Create User)',

    // Granular Permissions
    perms: {
      login_access: { label: 'ॲप लॉगिन व वापर (App Login & Access)', desc: 'वापरकर्त्याला ॲप उघडणे, लॉगिन करणे व वापरण्याची परवानगी', category: 'Core' },
      product_access: { label: 'वस्तू पाहणे व शोधणे (Browse Catalog)', desc: 'प्रॉडक्ट्स, कॅटेगरीज आणि कॅटलॉग शोधण्याची परवानगी', category: 'Customer' },
      view_orders: { label: 'ऑर्डर करणे व ट्रॅक करणे (Place & Track Orders)', desc: 'खरेदी करणे, पेमेंट करणे आणि ऑर्डर ट्रॅक करण्याची परवानगी', category: 'Customer' },
      write_reviews: { label: 'रिव्ह्यू व रेटिंग देणे (Write Reviews)', desc: 'ग्राहकांना रेटिंग, फोटो आणि प्रतिक्रिया देण्याची परवानगी', category: 'Customer' },
      add_product: { label: 'नवीन वस्तू विकायला ठेवणे (Add Products)', desc: 'विक्रेत्यांसाठी नवीन प्रॉडक्ट्स कॅटलॉगमध्ये ॲड करण्याची परवानगी', category: 'Seller' },
      edit_product: { label: 'किंमत व स्टॉक बदलणे (Edit Inventory)', desc: 'किंमत, फोटो, डिस्काउंट आणि स्टॉक उपलब्धता बदलण्याची परवानगी', category: 'Seller' },
      delete_product: { label: 'वस्तू हटवणे (Delete Items)', desc: 'मार्केटप्लेसमधून प्रॉडक्ट कायमचे काढून टाकण्याची परवानगी', category: 'Seller' },
      manage_orders: { label: 'ऑर्डर पॅक करणे व पाठवणे (Manage Orders)', desc: 'आलेल्या ऑर्डर्स प्रोसेस करणे व पाठवण्याची स्थिती अपडेट करणे', category: 'Seller' },
      seller_dashboard: { label: 'विक्रेता व कमिशन डॅशबोर्ड (Reseller Hub)', desc: 'होलसेल मार्जिन, रिसेल कमिशन आणि पेआउट्स पाहण्याची परवानगी', category: 'Seller' },
      reports_access: { label: 'अहवाल व अनालिटिक्स (Reports Access)', desc: 'महसूल, विक्री अहवाल आणि वापरकर्ता विश्लेषण पाहण्याची परवानगी', category: 'Admin' },
    },
  },

  hi: {
    langName: 'हिंदी',
    portalTitle: 'Shopio Admin Web',
    portalSubtitle: 'ऐप उपयोगकर्ता ट्रैकिंग एवं अनुमति नियंत्रण पैनल',
    liveSync: 'लाइव सिंक',
    liveAutoPolling: 'ऑटो-रिफ्रेश चालू',
    pollingPaused: 'ऑटो-रिफ्रेश बंद',
    testActivity: 'लाइव गतिविधि टेस्ट',
    shoppingApp: 'शॉपिंग ऐप',
    maintenanceBannerTitle: 'ग्राहक ऐप वर्तमान में रखरखाव (Maintenance) मोड में है',
    maintenanceBannerDesc: 'केवल एडमिन को अनुमति है। सभी सामान्य ग्राहक ऐप का उपयोग नहीं कर सकते।',
    maintenanceTurnOff: 'मेंटेनेंस बंद करें',

    // Metrics
    metricOnlineTitle: 'अभी ऐप इस्तेमाल करने वाले (Online)',
    metricOnlineLive: 'लाइव सक्रिय (Live)',
    metricOnlineSub: '📱 मोबाइल ऐप्स और ब्राउज़र',
    metricTotalTitle: 'कुल पंजीकृत उपयोगकर्ता (Total)',
    metricTotalSub: (c, s) => `${c} ग्राहक · ${s} विक्रेता`,
    metricTotalReg: 'पंजीकृत',
    metricGrantedTitle: 'अनुमति स्वीकृत (Permitted)',
    metricGrantedActive: 'एक्सेस चालू',
    metricGrantedSub: (pct) => `${pct}% ऐप उपयोग के पात्र`,
    metricBlockedTitle: 'अनुमति रद्द (Blocked)',
    metricBlockedBadge: 'ऐप प्रतिबंधित',
    metricBlockedSub: 'लॉगिन और खरीदारी की अनुमति नहीं',
    metricPendingTitle: 'मंजूरी प्रतीक्षारत (Pending)',
    metricPendingBadge: 'नए उपयोगकर्ता',
    metricPendingSub: 'एडमिन अनुमोदन आवश्यक',

    // Tabs
    tabUsers: 'उपयोगकर्ता और अनुमतियाँ',
    tabLive: 'कौन ऐप इस्तेमाल कर रहा है (Live)',
    tabLogs: 'लॉगिन इतिहास और ऑडिट',
    tabSettings: 'ग्लोबल सुरक्षा सेटिंग्स',
    addUserBtn: 'नया उपयोगकर्ता जोड़ें',

    // Filter Bar
    searchPlaceholder: 'नाम, ईमेल, फ़ोन नंबर या शहर से खोजें...',
    roleAll: 'सभी भूमिकाएं (All Roles)',
    roleCustomer: '👤 ग्राहक (Customer)',
    roleSeller: '💼 विक्रेता (Seller)',
    roleAdmin: '👑 एडमिन (Admin)',
    accessAll: 'सभी अनुमतियाँ (All Access)',
    accessAllowed: '✅ ऐप उपयोग स्वीकृत (Permitted)',
    accessBlocked: '🚫 ऐप उपयोग प्रतिबंधित (Blocked)',
    accessOnline: '🟢 अभी सक्रिय (Online Now)',
    accessPending: '⏳ मंजूरी प्रतीक्षारत (Pending)',

    // Table Headers
    thUser: 'उपयोगकर्ता (User Info)',
    thRole: 'भूमिका (Role)',
    thActivity: 'वर्तमान गतिविधि (Current Activity)',
    thDevice: 'डिवाइस व स्थान (Device & IP)',
    thAccess: 'ऐप उपयोग की अनुमति',
    thAccessSub: '(Master App Access)',
    thActions: 'कार्रवाई (Actions)',

    // Table content
    onlineNow: 'Online (अभी सक्रिय)',
    offlineAgo: (time) => `Offline · ${time}`,
    noUsersFound: 'कोई उपयोगकर्ता नहीं मिला',
    noUsersSub: 'कृपया खोज या फ़िल्टर बदलकर दोबारा जांचें।',
    approveBtn: 'मंज़ूर करें (Approve)',
    allowedLabel: 'अनुमति दी गई (Allowed)',
    blockedLabel: 'प्रतिबंधित (Blocked)',
    managePermsBtn: 'अनुमतियाँ',
    tableShowing: (filtered, total) => `प्रदर्शित: ${total} में से ${filtered} उपयोगकर्ता`,
    tableLegendActive: 'अनुमति सक्रिय',
    tableLegendBlocked: 'अनुमति रद्द (Blocked)',

    // Live Tab
    liveHeading: 'लाइव सक्रिय उपयोगकर्ता मॉनिटर (Live Active Sessions Pulse)',
    liveSub: 'इस समय आपके Shopio ऐप में कौन से उपयोगकर्ता हैं, वे क्या देख रहे हैं और किस डिवाइस से उपयोग कर रहे हैं, नीचे प्रदर्शित है।',
    liveTestBtn: '⚡ नया लाइव इवेंट टेस्ट करें',
    liveCurrentActLabel: 'वर्तमान ऐप गतिविधि (Current Activity)',
    liveDeviceLabel: 'डिवाइस (Device):',
    liveLocLabel: 'स्थान (Location):',
    liveIpLabel: 'IP पता (Network):',
    liveLastActiveLabel: 'अंतिम सक्रिय (Last Active):',
    liveRevokeBtn: '🚫 ऐप एक्सेस बंद करें',
    liveGrantBtn: '✅ ऐप अनुमति दें',

    // Logs Tab
    logsHeading: 'ऐप लॉगिन एवं सुरक्षा ऑडिट लॉग (Login Activity & App Access Audit)',
    logsSub: 'किसने, कब और किस डिवाइस से ऐप में लॉगिन करने का प्रयास किया, इसका पूरा रिकॉर्ड।',
    logsTotal: 'कुल प्रविष्टियां:',
    statusAllowed: 'सक्रिय (Allowed)',
    statusBlocked: 'अनुमति रद्द (Blocked)',
    statusFailed: 'असफल (Failed)',

    // Settings Tab
    setting1Title: 'नया उपयोगकर्ता ऐप एक्सेस नीति (New User Access Policy)',
    setting1Desc: 'क्या नए पंजीकृत उपयोगकर्ताओं को तुरंत ऐप इस्तेमाल करने देना है या एडमिन की पूर्व स्वीकृति अनिवार्य करनी है?',
    setting1Active: "🔒 सख्त सुरक्षा: हर नया यूजर 'Pending' रहेगा। एडमिन द्वारा अनुमति मिलने पर ही ऐप शुरू होगा।",
    setting1Inactive: "🟢 खुला एक्सेस: नया यूजर साइन अप करके तुरंत ऐप का उपयोग कर सकता है।",
    setting2Title: 'आपातकालीन ऐप लॉक / मेंटेनेंस (Emergency App Lockout)',
    setting2Desc: 'किसी कारणवश या सुरक्षा के लिए पूरे ग्राहक ऐप को अस्थायी रूप से बंद करने के लिए इसे चालू करें।',
    setting2Active: "⚠️ मेंटेनेंस चालू: ग्राहकों को 'App Under Maintenance' स्क्रीन दिखेगी।",
    setting2Inactive: "✅ ऐप सामान्य रूप से कार्य कर रहा है। सभी उपयोगकर्ता खरीदारी कर सकते हैं।",

    // Permissions Modal
    modalMasterTitle: 'मुख्य ऐप उपयोग अनुमति (Master App Access)',
    modalMasterAllowed: 'इस उपयोगकर्ता को ऐप का उपयोग करने की पूर्ण अनुमति है।',
    modalMasterBlocked: 'इस उपयोगकर्ता की ऐप उपयोग अनुमति बंद (Blocked) है।',
    modalGranularTitle: 'विस्तृत अनुमतियाँ चुनें (Granular App Permissions)',
    modalSaveClose: 'परिवर्तन सहेजें और बंद करें',

    // Add User Modal
    addUserModalTitle: 'नया उपयोगकर्ता जोड़ें',
    addUserModalSub: 'कस्टम अनुमतियों के साथ नया ग्राहक या विक्रेता जोड़ें',
    lblFullName: 'पूरा नाम (Full Name)',
    lblEmail: 'ईमेल पता (Email)',
    lblPhone: 'मोबाइल नंबर (Phone)',
    lblRole: 'भूमिका (Role)',
    lblAccessPrompt: 'ऐप उपयोग अनुमति',
    optImmediate: '✅ तुरंत अनुमति दें',
    optBlock: '🚫 प्रतिबंधित रखें (Blocked)',
    btnSubmitUser: 'उपयोगकर्ता बनाएं (Create User)',

    // Granular Permissions
    perms: {
      login_access: { label: 'ऐप लॉगिन और उपयोग (App Login & Access)', desc: 'उपयोगकर्ता को ऐप खोलने, लॉगिन करने और उपयोग की अनुमति', category: 'Core' },
      product_access: { label: 'सामग्री देखें और खोजें (Browse Catalog)', desc: 'उत्पाद, श्रेणियां और कैटलॉग खोजने की अनुमति', category: 'Customer' },
      view_orders: { label: 'ऑर्डर करना और ट्रैक करना (Place & Track Orders)', desc: 'खरीदारी करना, भुगतान करना और ऑर्डर ट्रैक करने की अनुमति', category: 'Customer' },
      write_reviews: { label: 'रिव्यू और रेटिंग देना (Write Reviews)', desc: 'ग्राहकों को रेटिंग, फ़ोटो और प्रतिक्रिया देने की अनुमति', category: 'Customer' },
      add_product: { label: 'बेचने के लिए उत्पाद जोड़ें (Add Products)', desc: 'विक्रेताओं के लिए नए उत्पाद कैटलॉग में जोड़ने की अनुमति', category: 'Seller' },
      edit_product: { label: 'कीमत और स्टॉक संपादित करें (Edit Inventory)', desc: 'कीमत, फ़ोटो, छूट और स्टॉक उपलब्धता बदलने की अनुमति', category: 'Seller' },
      delete_product: { label: 'उत्पाद हटाएं (Delete Items)', desc: 'मार्केटप्लेस से उत्पाद को स्थायी रूप से हटाने की अनुमति', category: 'Seller' },
      manage_orders: { label: 'ऑर्डर प्रबंधित करें और भेजें (Manage Orders)', desc: 'प्राप्त ऑर्डर प्रोसेस करना और शिपिंग स्थिति अपडेट करने की अनुमति', category: 'Seller' },
      seller_dashboard: { label: 'विक्रेता और रीसेलर हब (Reseller Hub)', desc: 'थोक मार्जिन, रीसेल कमीशन और भुगतान देखने की अनुमति', category: 'Seller' },
      reports_access: { label: 'बिक्री और वित्तीय रिपोर्ट (Reports Access)', desc: 'राजस्व मेट्रिक्स, उपयोगकर्ता विश्लेषण और टैक्स रिपोर्ट देखने की अनुमति', category: 'Admin' },
    },
  },

  en: {
    langName: 'English',
    portalTitle: 'Shopio Admin Web',
    portalSubtitle: 'Real-Time App Usage & Permission Control System',
    liveSync: 'Live Sync',
    liveAutoPolling: 'Live Auto-Polling',
    pollingPaused: 'Polling Paused',
    testActivity: 'Live Activity Test',
    shoppingApp: 'Shopping App',
    maintenanceBannerTitle: 'Customer App is Currently in Maintenance Mode',
    maintenanceBannerDesc: 'Only Administrators have access. Regular customers cannot use the app right now.',
    maintenanceTurnOff: 'Turn Off Maintenance',

    // Metrics
    metricOnlineTitle: 'Active Users Now (Online)',
    metricOnlineLive: 'Live Online',
    metricOnlineSub: '📱 Mobile Apps & Browsers',
    metricTotalTitle: 'Total Registered Users',
    metricTotalSub: (c, s) => `${c} Customers · ${s} Sellers`,
    metricTotalReg: 'Registered',
    metricGrantedTitle: 'App Access Permitted',
    metricGrantedActive: 'Access Active',
    metricGrantedSub: (pct) => `${pct}% Allowed to use app`,
    metricBlockedTitle: 'Access Revoked (Blocked)',
    metricBlockedBadge: 'App Blocked',
    metricBlockedSub: 'Login & checkout denied',
    metricPendingTitle: 'Pending Approvals',
    metricPendingBadge: 'New Signups',
    metricPendingSub: 'Awaiting Admin Approval',

    // Tabs
    tabUsers: 'Users & Permissions',
    tabLive: 'Who is using App (Live Monitor)',
    tabLogs: 'Activity & Login Logs',
    tabSettings: 'Global Security Settings',
    addUserBtn: 'Add New User',

    // Filter Bar
    searchPlaceholder: 'Search by name, email, phone or location...',
    roleAll: 'All Roles',
    roleCustomer: '👤 Customer',
    roleSeller: '💼 Seller',
    roleAdmin: '👑 Admin',
    accessAll: 'All Access',
    accessAllowed: '✅ App Access Allowed',
    accessBlocked: '🚫 App Access Blocked',
    accessOnline: '🟢 Active Online Now',
    accessPending: '⏳ Pending Approval',

    // Table Headers
    thUser: 'User Info',
    thRole: 'Role',
    thActivity: 'Current Activity',
    thDevice: 'Device & Location',
    thAccess: 'App Access Permission',
    thAccessSub: '(Master App Access)',
    thActions: 'Actions',

    // Table content
    onlineNow: 'Online (Active Now)',
    offlineAgo: (time) => `Offline · ${time}`,
    noUsersFound: 'No users found',
    noUsersSub: 'Please try searching with different keywords or filter criteria.',
    approveBtn: 'Approve Access',
    allowedLabel: 'Allowed',
    blockedLabel: 'Blocked',
    managePermsBtn: 'Permissions',
    tableShowing: (filtered, total) => `Showing: ${filtered} of ${total} users`,
    tableLegendActive: 'Permission Active',
    tableLegendBlocked: 'Permission Revoked (Blocked)',

    // Live Tab
    liveHeading: 'Live Active Sessions Pulse (Who is using the app now)',
    liveSub: 'Shows real-time connected users, what products they are browsing, and which devices they are on.',
    liveTestBtn: '⚡ Test New Live Event',
    liveCurrentActLabel: 'Current App Activity',
    liveDeviceLabel: 'Device:',
    liveLocLabel: 'Location:',
    liveIpLabel: 'IP Address (Network):',
    liveLastActiveLabel: 'Last Active:',
    liveRevokeBtn: '🚫 Revoke App Access',
    liveGrantBtn: '✅ Grant App Access',

    // Logs Tab
    logsHeading: 'App Login & Access Security Audit Logs',
    logsSub: 'Comprehensive audit log of who logged in, when, from which IP and device.',
    logsTotal: 'Total Entries:',
    statusAllowed: 'Allowed',
    statusBlocked: 'Blocked',
    statusFailed: 'Failed',

    // Settings Tab
    setting1Title: 'New User Access Policy',
    setting1Desc: 'Should newly registered users be allowed immediate app access, or require prior Admin Approval?',
    setting1Active: "🔒 Strict Security: All new signups remain 'Pending' until Admin approves them.",
    setting1Inactive: "🟢 Open Access: New signups can immediately log in and use the app.",
    setting2Title: 'Emergency App Lockout / Maintenance',
    setting2Desc: 'Temporarily lock down the customer app for security or server maintenance.',
    setting2Active: "⚠️ Maintenance Active: Customers see an 'App Under Maintenance' screen.",
    setting2Inactive: "✅ App operating normally. All users can shop freely.",

    // Permissions Modal
    modalMasterTitle: 'Master App Access Permission',
    modalMasterAllowed: 'This user has full permission to open and use the app.',
    modalMasterBlocked: 'This user has been denied permission to use the app (Blocked).',
    modalGranularTitle: 'Select Granular App Permissions',
    modalSaveClose: 'Save Changes & Close',

    // Add User Modal
    addUserModalTitle: 'Add New User',
    addUserModalSub: 'Create customer or seller account with customized permissions',
    lblFullName: 'Full Name',
    lblEmail: 'Email Address',
    lblPhone: 'Phone Number',
    lblRole: 'Role',
    lblAccessPrompt: 'App Access Permission',
    optImmediate: '✅ Allow Immediate Access',
    optBlock: '🚫 Block App Access',
    btnSubmitUser: 'Create User',

    // Granular Permissions
    perms: {
      login_access: { label: 'App Login & Access', desc: 'Allows user to open, log in and use the Shopio app', category: 'Core' },
      product_access: { label: 'Browse Catalog', desc: 'Permission to browse products, categories and search catalog', category: 'Customer' },
      view_orders: { label: 'Place & Track Orders', desc: 'Permission to checkout, make payments and track orders', category: 'Customer' },
      write_reviews: { label: 'Write Reviews & Ratings', desc: 'Permission to post customer ratings, photos and feedback', category: 'Customer' },
      add_product: { label: 'Add Products to Sell', desc: 'Permission for sellers to upload new catalog items', category: 'Seller' },
      edit_product: { label: 'Edit Inventory & Prices', desc: 'Modify pricing, images, discount and stock availability', category: 'Seller' },
      delete_product: { label: 'Delete Catalog Items', desc: 'Permission to permanently remove products from marketplace', category: 'Seller' },
      manage_orders: { label: 'Manage & Ship Orders', desc: 'Process incoming orders, download manifests, update dispatch status', category: 'Seller' },
      seller_dashboard: { label: 'Reseller & Seller Hub', desc: 'Access wholesale margins, resell commissions and payouts', category: 'Seller' },
      reports_access: { label: 'Sales & Financial Reports', desc: 'Access revenue metrics, user analytics and tax invoices', category: 'Admin' },
    },
  },
};

const PERMISSION_KEYS = [
  'login_access',
  'product_access',
  'view_orders',
  'write_reviews',
  'add_product',
  'edit_product',
  'delete_product',
  'manage_orders',
  'seller_dashboard',
  'reports_access',
];

export default function AdminWeb({ onNavigate, onShowToast, onBack }) {
  // 3 Language state: 'mr' (मराठी), 'en' (English), 'hi' (हिंदी)
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('meesho_admin_lang') || 'mr';
  });

  const t = useMemo(() => I18N[lang] || I18N.mr, [lang]);

  // Handle switching language
  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem('meesho_admin_lang', newLang);
    const messages = {
      mr: 'भाषा मराठी निवडली! 🌐',
      hi: 'भाषा बदलकर हिंदी कर दी गई! 🌐',
      en: 'Language switched to English! 🌐',
    };
    onShowToast?.(messages[newLang] || 'Language updated!', 'info');
  };

  // Navigation tabs
  const [activeTab, setActiveTab] = useState('users'); // 'live', 'users', 'logs', 'settings'
  const [users, setUsers] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    onlineNow: 0,
    appAccessGranted: 0,
    appAccessBlocked: 0,
    pendingApproval: 0,
    sellersCount: 0,
    customersCount: 0,
  });
  const [settings, setSettings] = useState({
    maintenance_mode: false,
    require_admin_approval: false,
    allow_guest_browsing: true,
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [accessFilter, setAccessFilter] = useState('all');

  // Modals
  const [selectedUserForPerms, setSelectedUserForPerms] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    appAccess: true,
    location: 'Mumbai, Maharashtra',
  });

  // Auto-refresh pulse timer (simulates real-time live app activity)
  const [lastRefreshed, setLastRefreshed] = useState(new Date().toLocaleTimeString());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Load all data
  const loadDashboardData = useCallback(async () => {
    try {
      const [userList, logs, stats, appSettings] = await Promise.all([
        adminService.getUsers(),
        adminService.getLoginActivity(),
        adminService.getDashboardMetrics(),
        adminService.getSettings(),
      ]);
      setUsers(userList);
      setActivityLogs(logs);
      setMetrics(stats);
      setSettings(appSettings);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Periodic polling for real-time app user status
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      loadDashboardData();
    }, 6000);
    return () => clearInterval(interval);
  }, [autoRefresh, loadDashboardData]);

  // Toggle master app access (Primary requirement: कोणा कोणाला ॲप use करायची permission द्यायची हे admin panel कडे असावे)
  const handleToggleAppAccess = async (userId, currentAccess, userName) => {
    const nextAccess = !currentAccess;

    // Optimistic update
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
            ...u,
            appAccess: nextAccess,
            status: nextAccess ? 'active' : 'blocked',
            isOnline: nextAccess ? u.isOnline : false,
            permissions: { ...u.permissions, login_access: nextAccess },
          }
          : u
      )
    );

    await adminService.toggleAppAccess(userId, nextAccess);

    const toastMsgs = {
      mr: nextAccess ? `${userName} ला ॲप वापरण्याची परवानगी दिली ✅` : `${userName} चा ॲप ॲक्सेस बंद केला (Blocked) 🚫`,
      hi: nextAccess ? `${userName} को ऐप उपयोग की अनुमति दी गई ✅` : `${userName} का ऐप एक्सेस बंद किया गया (Blocked) 🚫`,
      en: nextAccess ? `App Access Granted to ${userName} ✅` : `App Access Revoked for ${userName} (Blocked) 🚫`,
    };

    onShowToast?.(toastMsgs[lang] || toastMsgs.en, nextAccess ? 'success' : 'error');
    loadDashboardData();
  };

  // Toggle specific permission
  const handleTogglePermission = async (userId, permKey, currentValue) => {
    if (!selectedUserForPerms) return;
    const updatedPermissions = {
      ...selectedUserForPerms.permissions,
      [permKey]: !currentValue,
    };

    const nextAppAccess = permKey === 'login_access' ? !currentValue : selectedUserForPerms.appAccess;

    setSelectedUserForPerms((prev) => ({
      ...prev,
      appAccess: nextAppAccess,
      permissions: updatedPermissions,
    }));

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
            ...u,
            appAccess: nextAppAccess,
            status: nextAppAccess ? 'active' : 'blocked',
            permissions: updatedPermissions,
          }
          : u
      )
    );

    await adminService.updatePermissions(userId, updatedPermissions);
    onShowToast?.(`Permission Updated: ${permKey} ⚙️`, 'info');
  };

  // Change Role
  const handleChangeRole = async (userId, newRole, userName) => {
    await adminService.changeUserRole(userId, newRole);
    const toastMsgs = {
      mr: `${userName} चा रोल '${newRole}' केला! 👑`,
      hi: `${userName} की भूमिका बदलकर '${newRole}' कर दी गई! 👑`,
      en: `Role updated to '${newRole}' for ${userName}! 👑`,
    };
    onShowToast?.(toastMsgs[lang] || toastMsgs.en, 'success');
    loadDashboardData();
  };

  // Approve Pending User
  const handleApproveUser = async (userId, userName) => {
    await adminService.approveUser(userId);
    const toastMsgs = {
      mr: `${userName} ची ॲप नोंदणी मंजूर केली! ॲप सुरू झाले ✅`,
      hi: `${userName} का पंजीकरण स्वीकृत किया गया! ऐप एक्सेस चालू ✅`,
      en: `Approved registration for ${userName}! App access active ✅`,
    };
    onShowToast?.(toastMsgs[lang] || toastMsgs.en, 'success');
    loadDashboardData();
  };

  // Create User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) {
      onShowToast?.(lang === 'mr' ? 'नाव व ईमेल प्रविष्ट करा' : lang === 'hi' ? 'नाम और ईमेल दर्ज करें' : 'Please enter name and email', 'error');
      return;
    }
    await adminService.createUser(newUserForm);
    setShowAddUserModal(false);
    setNewUserForm({
      name: '',
      email: '',
      phone: '',
      role: 'customer',
      appAccess: true,
      location: 'Mumbai, Maharashtra',
    });
    const toastMsgs = {
      mr: `नवीन वापरकर्ता ${newUserForm.name} जोडला व सेव्ह केला! 🎉`,
      hi: `नया उपयोगकर्ता ${newUserForm.name} सफलतापूर्वक जोड़ा गया! 🎉`,
      en: `New user ${newUserForm.name} created successfully! 🎉`,
    };
    onShowToast?.(toastMsgs[lang] || toastMsgs.en, 'success');
    loadDashboardData();
  };

  // Toggle Maintenance Mode
  const handleToggleMaintenance = async () => {
    const updated = await adminService.updateSettings({
      maintenance_mode: !settings.maintenance_mode,
    });
    setSettings(updated);
    if (updated.maintenance_mode) {
      onShowToast?.(
        lang === 'mr' ? '⚠️ ॲप मेंटेनन्स मोड सुरू केला! ग्राहक ॲप तात्पुरते बंद आहे.' :
          lang === 'hi' ? '⚠️ ऐप मेंटेनेंस मोड चालू किया गया! ग्राहक ऐप अस्थायी रूप से बंद है।' :
            '⚠️ Maintenance mode activated! Customer app is temporarily locked.',
        'warning'
      );
    } else {
      onShowToast?.(
        lang === 'mr' ? '✅ ॲप मेंटेनन्स मोड बंद केला! सर्व ग्राहकांना ॲप सुरू झाले.' :
          lang === 'hi' ? '✅ ऐप मेंटेनेंस मोड बंद किया गया! सभी ग्राहकों के लिए ऐप सक्रिय है।' :
            '✅ Maintenance mode disabled! All customers can use the app.',
        'success'
      );
    }
  };

  // Toggle Require Admin Approval Policy
  const handleToggleApprovalPolicy = async () => {
    const updated = await adminService.updateSettings({
      require_admin_approval: !settings.require_admin_approval,
    });
    setSettings(updated);
    onShowToast?.(
      updated.require_admin_approval
        ? (lang === 'mr' ? 'सुरक्षा धोरण: नवीन युझर्सना ॲडमिन मंजुरी आवश्यक केली!' : lang === 'hi' ? 'सुरक्षा नीति: नए उपयोगकर्ताओं के लिए एडमिन अनुमोदन अनिवार्य किया गया!' : 'Policy: New signups require Admin Approval!')
        : (lang === 'mr' ? 'सुरक्षा धोरण: नवीन युझर्सना थेट ॲप वापरण्याची परवानगी दिली!' : lang === 'hi' ? 'सुरक्षा नीति: नए उपयोगकर्ताओं को सीधे ऐप उपयोग की अनुमति दी गई!' : 'Policy: New users granted instant open access!'),
      'info'
    );
  };

  // Simulate a live user action
  const handleSimulateAction = () => {
    const sampleActions = {
      mr: [
        '🛒 ॲपमध्ये कार्ट उघडले (Silk Saree ₹1,499)',
        '🔍 सर्च केले: "Women Cotton Kurti"',
        '💳 पेमेंट स्क्रीनवर पोहोचले (₹850)',
        '📦 ऑर्डर ट्रॅकिंग पाहत आहेत (#MEE-789123)',
        '❤️ विशलिस्टमध्ये 2 वस्तू ॲड केल्या',
      ],
      hi: [
        '🛒 ऐप में कार्ट खोला (Silk Saree ₹1,499)',
        '🔍 सर्च किया: "Women Cotton Kurti"',
        '💳 पेमेंट स्क्रीन पर पहुंचे (₹850)',
        '📦 ऑर्डर ट्रैकिंग देख रहे हैं (#MEE-789123)',
        '❤️ विशलिस्ट में 2 उत्पाद जोड़े',
      ],
      en: [
        '🛒 Opened cart with Silk Saree (₹1,499)',
        '🔍 Searched for "Women Cotton Kurti"',
        '💳 Proceeded to Checkout Payment (₹850)',
        '📦 Tracking Live Delivery (#MEE-789123)',
        '❤️ Added 2 items to Wishlist',
      ],
    };

    const randomUser = users[Math.floor(Math.random() * users.length)];
    if (!randomUser) return;

    const list = sampleActions[lang] || sampleActions.mr;
    const actionText = list[Math.floor(Math.random() * list.length)];

    setUsers((prev) =>
      prev.map((u) =>
        u.id === randomUser.id
          ? {
            ...u,
            isOnline: true,
            lastActive: 'Just now',
            currentActivity: actionText,
          }
          : u
      )
    );
    onShowToast?.(`${randomUser.name}: ${actionText}`, 'info');
  };

  // Filtered users list
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !searchQuery ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.phone.includes(searchQuery) ||
        (u.location && u.location.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchRole = roleFilter === 'all' || u.role === roleFilter;

      let matchAccess = true;
      if (accessFilter === 'allowed') matchAccess = u.appAccess === true;
      if (accessFilter === 'blocked') matchAccess = u.appAccess === false;
      if (accessFilter === 'pending') matchAccess = u.status === 'pending';
      if (accessFilter === 'online') matchAccess = u.isOnline === true;

      return matchSearch && matchRole && matchAccess;
    });
  }, [users, searchQuery, roleFilter, accessFilter]);

  // Active / Online Users
  const activeSessions = useMemo(() => {
    return users.filter((u) => u.isOnline || u.appAccess);
  }, [users]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-[#F43397] selection:text-white">
      {/* ── Top Executive Navbar with 3 Language Switcher ── */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Portal Info */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#9F2089] to-[#F43397] flex items-center justify-center shadow-lg shadow-pink-500/20 text-white font-black text-xl tracking-wider">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">{t.portalTitle}</span>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-pink-500/20 text-pink-400 border border-pink-500/30">
                  Admin
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {t.liveSync}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                {t.portalSubtitle}
              </p>
            </div>
          </div>

          {/* Top Actions: 3 Languages Switcher + Auto-refresh + Back to Shopping App */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* 🌐 3 LANGUAGE SWITCHER: English | मराठी | हिंदी */}
            <div className="flex items-center bg-slate-800 border border-slate-700/80 p-1 rounded-2xl shadow-inner">
              <span className="text-xs px-2 text-slate-400 select-none hidden md:inline">🌐</span>
              <button
                onClick={() => handleLanguageChange('mr')}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${lang === 'mr'
                  ? 'bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
                  }`}
                title="मराठी भाषा निवडा"
              >
                मराठी
              </button>
              <button
                onClick={() => handleLanguageChange('hi')}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${lang === 'hi'
                  ? 'bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
                  }`}
                title="हिंदी भाषा चुनें"
              >
                हिंदी
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${lang === 'en'
                  ? 'bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
                  }`}
                title="Switch to English"
              >
                EN
              </button>
            </div>

            {/* Auto refresh badge */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              title="Click to toggle live auto-refresh"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${autoRefresh
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50 hover:bg-emerald-900/60'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
            >
              <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span className="hidden xl:inline">{autoRefresh ? t.liveAutoPolling : t.pollingPaused}</span>
              <span className="text-[10px] text-slate-400 font-mono">({lastRefreshed})</span>
            </button>

            {/* Simulate Live Action Demo Button */}
            <button
              onClick={handleSimulateAction}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 transition-all hover:border-pink-500/40"
              title="Simulates real-time user browsing activity on the app"
            >
              <span>⚡</span> {t.testActivity}
            </button>

            {/* View Customer Shopping App */}
            <button
              onClick={() => onNavigate?.('home')}
              title="ग्राहक शॉपिंग ॲप उघडा"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              <span>🛍️</span>
              <span>{t.shoppingApp}</span>
            </button>

            {/* Logout Admin and Return to Portal Selection */}
            <button
              onClick={() => {
                onShowToast?.('व्यवस्थापक पोर्टल लॉगआउट झाले! (Admin Logged Out)', 'info');
                onNavigate?.('portal');
              }}
              title="Admin Logout & Return to Portal Gateway"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-md border border-rose-500/50 active:scale-95 transition-all cursor-pointer"
            >
              <span>🚪</span>
              <span>लॉगआउट (Logout)</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ── Emergency Maintenance Banner if active ── */}
        {settings.maintenance_mode && (
          <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-4 flex items-center justify-between text-amber-200 animate-pulse">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-bold text-sm">{t.maintenanceBannerTitle}</p>
                <p className="text-xs text-amber-300/80">{t.maintenanceBannerDesc}</p>
              </div>
            </div>
            <button
              onClick={handleToggleMaintenance}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition-all"
            >
              {t.maintenanceTurnOff}
            </button>
          </div>
        )}

        {/* ── Pulse Analytics Metric Cards ── */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {/* 1. Live Online Users (कोण ॲप वापरत आहे) */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 relative overflow-hidden group hover:border-emerald-500/50 transition-all shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">{t.metricOnlineTitle}</span>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-400">{metrics.onlineNow}</span>
              <span className="text-xs text-slate-400 font-bold">{t.metricOnlineLive}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1 font-medium">
              {t.metricOnlineSub}
            </p>
          </div>

          {/* 2. Total Registered Users */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 relative overflow-hidden group hover:border-blue-500/50 transition-all shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all pointer-events-none" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">{t.metricTotalTitle}</span>
              <span className="text-base">👥</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-blue-400">{metrics.totalUsers}</span>
              <span className="text-xs text-slate-400 font-bold">{t.metricTotalReg}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-medium">
              {t.metricTotalSub(metrics.customersCount, metrics.sellersCount)}
            </p>
          </div>

          {/* 3. App Access Permitted Users (कोणा कोणाला permission दिली आहे) */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 relative overflow-hidden group hover:border-teal-500/50 transition-all shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-xl group-hover:bg-teal-500/20 transition-all pointer-events-none" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">{t.metricGrantedTitle}</span>
              <span className="text-base text-emerald-400">🛡️</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-teal-400">{metrics.appAccessGranted}</span>
              <span className="text-xs text-emerald-400 font-bold">{t.metricGrantedActive}</span>
            </div>
            <p className="text-[11px] text-emerald-400/80 mt-2 font-medium">
              {t.metricGrantedSub(Math.round((metrics.appAccessGranted / (metrics.totalUsers || 1)) * 100))}
            </p>
          </div>

          {/* 4. App Access Revoked / Blocked (बंदी घातलेले) */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 relative overflow-hidden group hover:border-red-500/50 transition-all shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition-all pointer-events-none" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">{t.metricBlockedTitle}</span>
              <span className="text-base text-red-400">🚫</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-rose-400">{metrics.appAccessBlocked}</span>
              <span className="text-xs text-rose-400 font-bold">{t.metricBlockedBadge}</span>
            </div>
            <p className="text-[11px] text-rose-400/80 mt-2 font-medium">
              {t.metricBlockedSub}
            </p>
          </div>

          {/* 5. Pending Approval */}
          <div className="col-span-2 lg:col-span-1 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 relative overflow-hidden group hover:border-amber-500/50 transition-all shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">{t.metricPendingTitle}</span>
              <span className="text-base text-amber-400">⏳</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-400">{metrics.pendingApproval}</span>
              <span className="text-xs text-amber-300 font-bold">{t.metricPendingBadge}</span>
            </div>
            <p className="text-[11px] text-amber-300/80 mt-2 font-medium">
              {t.metricPendingSub}
            </p>
          </div>
        </section>

        {/* ── Sub Navigation Tabs ── */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'users', label: t.tabUsers, icon: '🛡️', count: users.length },
              { id: 'live', label: t.tabLive, icon: '🟢', count: metrics.onlineNow, pulse: true },
              { id: 'logs', label: t.tabLogs, icon: '📋', count: activityLogs.length },
              { id: 'settings', label: t.tabSettings, icon: '⚙️' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${isActive
                    ? 'bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white shadow-lg shadow-pink-500/20'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/80 border border-slate-700/60'
                    }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isActive
                        ? 'bg-white/20 text-white'
                        : tab.pulse
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-700 text-slate-300'
                        }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Add User Button */}
          <button
            onClick={() => setShowAddUserModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95"
          >
            <span>➕</span> {t.addUserBtn}
          </button>
        </div>

        {/* ═════════════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: USERS & PERMISSION MANAGEMENT MATRIX                             */}
        {/* ═════════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-3 justify-between">
              {/* Search input */}
              <div className="relative w-full md:w-96">
                <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400 text-sm">🔍</span>
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-white text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filter Dropdowns */}
              <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto">
                {/* Role filter */}
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 rounded-xl px-3 py-2 outline-none focus:border-pink-500"
                >
                  <option value="all">{t.roleAll}</option>
                  <option value="customer">{t.roleCustomer}</option>
                  <option value="seller">{t.roleSeller}</option>
                  <option value="admin">{t.roleAdmin}</option>
                </select>

                {/* Permission / Access status filter */}
                <select
                  value={accessFilter}
                  onChange={(e) => setAccessFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 rounded-xl px-3 py-2 outline-none focus:border-pink-500"
                >
                  <option value="all">{t.accessAll}</option>
                  <option value="allowed">{t.accessAllowed}</option>
                  <option value="blocked">{t.accessBlocked}</option>
                  <option value="online">{t.accessOnline}</option>
                  <option value="pending">{t.accessPending}</option>
                </select>

                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="sm:hidden px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  ➕
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/80 border-b border-slate-700/80 text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                    <tr>
                      <th className="px-5 py-4">{t.thUser}</th>
                      <th className="px-4 py-4">{t.thRole}</th>
                      <th className="px-4 py-4">{t.thActivity}</th>
                      <th className="px-4 py-4">{t.thDevice}</th>
                      <th className="px-5 py-4 text-center">
                        {t.thAccess}
                        <br />
                        <span className="text-[9px] text-pink-400 font-mono lowercase">{t.thAccessSub}</span>
                      </th>
                      <th className="px-5 py-4 text-right">{t.thActions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50 font-medium">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                          <p className="text-3xl mb-2">🔍</p>
                          <p className="text-sm font-bold text-slate-400">{t.noUsersFound}</p>
                          <p className="text-xs text-slate-500 mt-1">{t.noUsersSub}</p>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => {
                        const isBlocked = !user.appAccess || user.status === 'blocked';
                        const isPending = user.status === 'pending';

                        return (
                          <tr
                            key={user.id}
                            className={`hover:bg-slate-750/50 transition-colors ${isBlocked ? 'bg-rose-950/10' : isPending ? 'bg-amber-950/10' : ''
                              }`}
                          >
                            {/* User details */}
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <div
                                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm text-white shadow-md ${user.role === 'admin'
                                      ? 'bg-gradient-to-tr from-amber-500 to-orange-600'
                                      : user.role === 'seller'
                                        ? 'bg-gradient-to-tr from-pink-500 to-purple-600'
                                        : 'bg-gradient-to-tr from-blue-500 to-cyan-600'
                                      }`}
                                  >
                                    {user.name.slice(0, 2).toUpperCase()}
                                  </div>
                                  {user.isOnline && (
                                    <span
                                      title={t.onlineNow}
                                      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-800 rounded-full"
                                    />
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-extrabold text-white text-sm">{user.name}</span>
                                    {user.role === 'admin' && (
                                      <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold">
                                        Admin
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-slate-400 text-xs">{user.email}</p>
                                  <p className="text-[11px] text-slate-500 font-mono">{user.phone}</p>
                                </div>
                              </div>
                            </td>

                            {/* Role selector */}
                            <td className="px-4 py-4">
                              <select
                                value={user.role}
                                onChange={(e) => handleChangeRole(user.id, e.target.value, user.name)}
                                className={`px-2.5 py-1 rounded-xl text-xs font-extrabold border outline-none cursor-pointer transition-colors ${user.role === 'admin'
                                  ? 'bg-amber-950/40 text-amber-300 border-amber-600/50'
                                  : user.role === 'seller'
                                    ? 'bg-pink-950/40 text-pink-300 border-pink-600/50'
                                    : 'bg-blue-950/40 text-blue-300 border-blue-600/50'
                                  }`}
                              >
                                <option value="customer">{t.roleCustomer}</option>
                                <option value="seller">{t.roleSeller}</option>
                                <option value="admin">{t.roleAdmin}</option>
                              </select>
                            </td>

                            {/* Current Activity / Status */}
                            <td className="px-4 py-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                                      }`}
                                  />
                                  <span
                                    className={`text-[11px] font-bold ${user.isOnline ? 'text-emerald-400' : 'text-slate-400'
                                      }`}
                                  >
                                    {user.isOnline ? t.onlineNow : t.offlineAgo(user.lastActive)}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-200 line-clamp-1 bg-slate-900/60 px-2 py-1 rounded-lg border border-slate-700/50 font-mono text-[11px]">
                                  {user.currentActivity || 'Active on app'}
                                </p>
                              </div>
                            </td>

                            {/* Device & Location */}
                            <td className="px-4 py-4">
                              <div className="text-xs">
                                <p className="text-slate-200 font-semibold flex items-center gap-1">
                                  {user.device || 'Android App'}
                                </p>
                                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                  <span>📍</span> {user.location || 'India'}
                                  <span className="font-mono text-slate-500">({user.ip})</span>
                                </p>
                              </div>
                            </td>

                            {/* Master Permission: App Access Switch */}
                            <td className="px-5 py-4 text-center">
                              {isPending ? (
                                <button
                                  onClick={() => handleApproveUser(user.id, user.name)}
                                  className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-95 animate-pulse"
                                >
                                  {t.approveBtn}
                                </button>
                              ) : (
                                <div className="flex flex-col items-center gap-1">
                                  <button
                                    onClick={() => handleToggleAppAccess(user.id, user.appAccess, user.name)}
                                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none shadow-inner ${user.appAccess ? 'bg-emerald-500' : 'bg-rose-600'
                                      }`}
                                  >
                                    <span
                                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md ${user.appAccess ? 'translate-x-8' : 'translate-x-1'
                                        }`}
                                    />
                                  </button>
                                  <span
                                    className={`text-[10px] font-extrabold tracking-tight ${user.appAccess ? 'text-emerald-400' : 'text-rose-400'
                                      }`}
                                  >
                                    {user.appAccess ? t.allowedLabel : t.blockedLabel}
                                  </span>
                                </div>
                              )}
                            </td>

                            {/* Actions / Granular Permissions Drawer */}
                            <td className="px-5 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setSelectedUserForPerms(user)}
                                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold border border-slate-600 transition-all flex items-center gap-1.5 hover:border-pink-500"
                                  title="Manage granular permissions"
                                >
                                  <span>⚙️</span>
                                  <span>{t.managePermsBtn}</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer info */}
              <div className="bg-slate-900/60 px-5 py-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                <span>{t.tableShowing(filteredUsers.length, users.length)}</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> {t.tableLegendActive}
                  <span className="w-2 h-2 rounded-full bg-rose-500 ml-2" /> {t.tableLegendBlocked}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: LIVE MONITOR ("कोण ॲप वापरत आहे" - WHO IS USING THE APP NOW)      */}
        {/* ═════════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'live' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <h3 className="text-base font-extrabold text-white">{t.liveHeading}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">{t.liveSub}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSimulateAction}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-md transition-all active:scale-95"
                >
                  {t.liveTestBtn}
                </button>
              </div>
            </div>

            {/* Grid of active live cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeSessions.map((u) => (
                <div
                  key={u.id}
                  className={`bg-slate-800/90 border rounded-2xl p-4.5 relative overflow-hidden transition-all shadow-lg ${u.isOnline
                    ? 'border-emerald-500/50 shadow-emerald-500/5'
                    : 'border-slate-700/80 opacity-80'
                    }`}
                >
                  {/* Top Bar of card */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9F2089] to-[#F43397] flex items-center justify-center text-white font-black text-sm">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        {u.isOnline && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-white">{u.name}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.role === 'seller'
                            ? 'bg-pink-500/20 text-pink-300'
                            : u.role === 'admin'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-blue-500/20 text-blue-300'
                            }`}
                        >
                          {u.role.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* App Access Status Pill */}
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${u.appAccess
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-600/50'
                        : 'bg-rose-950/60 text-rose-300 border-rose-600/50'
                        }`}
                    >
                      {u.appAccess ? t.allowedLabel : t.blockedLabel}
                    </span>
                  </div>

                  {/* Live Activity Display */}
                  <div className="bg-slate-900/90 border border-slate-700/70 rounded-xl p-3 mb-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      {t.liveCurrentActLabel}
                    </span>
                    <p className="text-xs font-mono text-emerald-300 font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      {u.currentActivity || 'Active on app'}
                    </p>
                  </div>

                  {/* Device, Network & Location */}
                  <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{t.liveDeviceLabel}</span>
                      <span className="font-semibold text-white">{u.device || 'Android'}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{t.liveLocLabel}</span>
                      <span className="font-semibold text-slate-200">📍 {u.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{t.liveIpLabel}</span>
                      <span className="font-mono text-slate-400">{u.ip}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{t.liveLastActiveLabel}</span>
                      <span className="font-semibold text-emerald-400">{u.lastActive}</span>
                    </div>
                  </div>

                  {/* Direct Permission Action from Card */}
                  <div className="pt-2 border-t border-slate-700/60 flex items-center gap-2">
                    <button
                      onClick={() => handleToggleAppAccess(u.id, u.appAccess, u.name)}
                      className={`flex-1 py-2 rounded-xl text-xs font-black transition-all active:scale-95 ${u.appAccess
                        ? 'bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                    >
                      {u.appAccess ? t.liveRevokeBtn : t.liveGrantBtn}
                    </button>
                    <button
                      onClick={() => setSelectedUserForPerms(u)}
                      className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold"
                      title="Open granular permissions"
                    >
                      ⚙️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════════ */}
        {/* TAB 3: ACTIVITY & LOGIN AUDIT LOGS                                      */}
        {/* ═════════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'logs' && (
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-white">{t.logsHeading}</h3>
                <p className="text-xs text-slate-400">{t.logsSub}</p>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {t.logsTotal} <strong className="text-white">{activityLogs.length}</strong>
              </span>
            </div>

            <div className="divide-y divide-slate-700/60 font-mono text-xs">
              {activityLogs.map((log) => {
                const isBlocked = log.status === 'Blocked';
                const isSuccess = log.status === 'Successful';

                return (
                  <div key={log.id} className="py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 hover:bg-slate-750/30 px-2 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${isSuccess
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : isBlocked
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                      >
                        {isSuccess ? '✓' : isBlocked ? '✕' : '!'}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-sans font-extrabold text-white text-sm">{log.userName}</span>
                          <span className="text-slate-400 font-mono text-xs">({log.email})</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${isSuccess
                              ? 'bg-emerald-950 text-emerald-300'
                              : isBlocked
                                ? 'bg-rose-950 text-rose-300'
                                : 'bg-amber-950 text-amber-300'
                              }`}
                          >
                            {isSuccess ? t.statusAllowed : isBlocked ? t.statusBlocked : t.statusFailed}
                          </span>
                        </div>
                        <p className="font-sans text-xs text-slate-300 mt-0.5">{log.details}</p>
                      </div>
                    </div>

                    <div className="text-right text-[11px] text-slate-400">
                      <p className="font-bold text-slate-300">{log.device}</p>
                      <p>
                        IP: <span className="text-slate-400">{log.ip}</span> · <span className="text-pink-400">{log.time}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════════ */}
        {/* TAB 4: GLOBAL SECURITY SETTINGS                                         */}
        {/* ═════════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Setting 1: Require Admin Approval for New Users */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-white">{t.setting1Title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t.setting1Desc}</p>
                </div>
                <button
                  onClick={handleToggleApprovalPolicy}
                  className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${settings.require_admin_approval ? 'bg-pink-500' : 'bg-slate-600'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.require_admin_approval ? 'translate-x-7' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs">
                {settings.require_admin_approval ? (
                  <p className="text-amber-400 font-medium">{t.setting1Active}</p>
                ) : (
                  <p className="text-emerald-400 font-medium">{t.setting1Inactive}</p>
                )}
              </div>
            </div>

            {/* Setting 2: Emergency Maintenance Mode */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-white">{t.setting2Title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t.setting2Desc}</p>
                </div>
                <button
                  onClick={handleToggleMaintenance}
                  className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${settings.maintenance_mode ? 'bg-amber-500' : 'bg-slate-600'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.maintenance_mode ? 'translate-x-7' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs">
                {settings.maintenance_mode ? (
                  <p className="text-amber-400 font-bold">{t.setting2Active}</p>
                ) : (
                  <p className="text-emerald-400 font-bold">{t.setting2Inactive}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {/* MODAL: GRANULAR PERMISSIONS MANAGEMENT DRAWER                           */}
      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {selectedUserForPerms && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedUserForPerms(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 border-b border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#9F2089] to-[#F43397] flex items-center justify-center font-black text-white text-base">
                  {selectedUserForPerms.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{selectedUserForPerms.name}</h3>
                  <p className="text-xs text-slate-400">
                    {selectedUserForPerms.email} ·{' '}
                    <strong className="text-pink-400 uppercase">{selectedUserForPerms.role}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserForPerms(null)}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Quick Master Switch Bar inside modal */}
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-sm text-white block">
                  {t.modalMasterTitle}
                </span>
                <span className="text-xs text-slate-400">
                  {selectedUserForPerms.appAccess ? t.modalMasterAllowed : t.modalMasterBlocked}
                </span>
              </div>
              <button
                onClick={() =>
                  handleToggleAppAccess(
                    selectedUserForPerms.id,
                    selectedUserForPerms.appAccess,
                    selectedUserForPerms.name
                  )
                }
                className={`px-4 py-2 rounded-xl text-xs font-black shadow-md transition-all active:scale-95 ${selectedUserForPerms.appAccess
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
              >
                {selectedUserForPerms.appAccess ? t.liveRevokeBtn : t.liveGrantBtn}
              </button>
            </div>

            {/* Granular Permissions List */}
            <div className="p-6 overflow-y-auto space-y-3.5 flex-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {t.modalGranularTitle}
              </p>

              {PERMISSION_KEYS.map((permKey) => {
                const permMeta = t.perms[permKey] || { label: permKey, desc: '', category: 'Custom' };
                const isAllowed = Boolean(selectedUserForPerms.permissions?.[permKey]);

                return (
                  <div
                    key={permKey}
                    className="p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-2xl flex items-center justify-between gap-4 hover:border-slate-600 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white text-xs sm:text-sm">{permMeta.label}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
                          {permMeta.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{permMeta.desc}</p>
                    </div>

                    <button
                      onClick={() => handleTogglePermission(selectedUserForPerms.id, permKey, isAllowed)}
                      className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors flex-shrink-0 ${isAllowed ? 'bg-emerald-500' : 'bg-slate-700'
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAllowed ? 'translate-x-7' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-900 p-4 border-t border-slate-800 flex items-center justify-end">
              <button
                onClick={() => setSelectedUserForPerms(null)}
                className="px-5 py-2.5 bg-gradient-to-r from-[#9F2089] to-[#F43397] hover:opacity-95 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
              >
                {t.modalSaveClose}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {/* MODAL: CREATE NEW USER                                                  */}
      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {showAddUserModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowAddUserModal(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#9F2089] to-[#F43397] p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg">{t.addUserModalTitle}</h3>
                <p className="text-xs text-pink-100">{t.addUserModalSub}</p>
              </div>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-5 space-y-3.5 text-xs text-slate-300">
              <div>
                <label className="block font-bold mb-1 text-slate-200">{t.lblFullName}</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. राहुल शर्मा / Rahul Sharma"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-200">{t.lblEmail}</label>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-200">{t.lblPhone}</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={newUserForm.phone}
                  onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-200">{t.lblRole}</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white outline-none focus:border-pink-500 font-bold"
                  >
                    <option value="customer">{t.roleCustomer}</option>
                    <option value="seller">{t.roleSeller}</option>
                    <option value="admin">{t.roleAdmin}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-200">{t.lblAccessPrompt}</label>
                  <select
                    value={newUserForm.appAccess ? 'true' : 'false'}
                    onChange={(e) => setNewUserForm({ ...newUserForm, appAccess: e.target.value === 'true' })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white outline-none focus:border-pink-500 font-bold"
                  >
                    <option value="true">{t.optImmediate}</option>
                    <option value="false">{t.optBlock}</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#9F2089] to-[#F43397] hover:opacity-95 text-white font-extrabold rounded-xl shadow-md transition-all active:scale-95"
                >
                  {t.btnSubmitUser}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
