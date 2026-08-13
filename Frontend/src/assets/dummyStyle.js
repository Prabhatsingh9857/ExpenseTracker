// ======================================================
// SIDEBAR STYLES
// ======================================================

export const sidebarStyles = {
  sidebarContainer:
    "hidden lg:flex flex-col fixed top-16 bottom-0 left-0 z-30",

  sidebarInner:
    "bg-white border-r border-gray-200 h-full flex flex-col",

  userProfileContainer: {
    base: "p-4 border-b border-gray-100",
    collapsed: "px-3 py-4",
    expanded: "px-4 py-4",
  },

  userInitials: {
    base:
      "w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0",
  },

  menuList: {
    base: "space-y-1 px-3",
  },

  menuItem: {
    base:
      "relative flex items-center gap-3 py-3 rounded-lg font-medium transition-all duration-200",
    active: "text-teal-700 bg-teal-50",
    inactive:
      "text-gray-600 hover:text-teal-700 hover:bg-gray-50",
    collapsed: "justify-center px-0 mx-1",
    expanded: "px-3",
  },

  menuIcon: {
    active: "text-teal-600",
    inactive: "text-gray-500",
  },

  activeIndicator:
    "absolute right-3 w-2 h-2 bg-teal-400 rounded-full",

  toggleButton:
    "absolute -right-3 top-12 z-20 w-7 h-7 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-500 hover:text-teal-600 hover:border-teal-400 hover:bg-teal-50 transition-all shadow-sm",

  footerContainer: {
    base: "border-t border-gray-100 p-4",
    collapsed: "px-3 py-4",
    expanded: "px-4 py-4",
  },

  logoutButton:
    "flex items-center gap-3 py-3 px-3 rounded-lg font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 w-full mt-1 transition-colors",

  mobileOverlay:
    "fixed inset-0 z-40 lg:hidden",

  mobileBackdrop:
    "absolute inset-0 bg-black/30 backdrop-blur-sm",

  mobileSidebar: {
    base:
      "absolute left-0 top-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl rounded-r-2xl overflow-hidden flex flex-col",
  },

  mobileHeader:
    "p-6 flex justify-between items-center border-b border-gray-100",

  mobileUserContainer:
    "flex items-center gap-3",

  mobileCloseButton:
    "p-2 rounded-lg hover:bg-gray-100",

  mobileMenuList:
    "space-y-1 px-2",

  mobileMenuItem: {
    base:
      "flex items-center gap-4 px-6 py-4 font-medium rounded-lg",
    active: "text-teal-600 bg-teal-50",
    inactive:
      "text-gray-600 hover:bg-gray-50",
  },

  mobileFooter:
    "border-t border-gray-100 p-6",

  mobileLogoutButton:
    "flex items-center gap-4 py-2 font-medium text-gray-600 hover:text-red-600 w-full",

  mobileMenuButton:
    "lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-cyan-500 to-teal-600 text-white rounded-full flex items-center justify-center shadow-xl",
};


// ======================================================
// NAVBAR STYLES
// ======================================================

export const navbarStyles = {
  header:
    "fixed top-0 left-0 right-0 z-50 h-[70px] bg-white border-b border-gray-200 shadow-sm",

  container:
    "h-full flex items-center justify-between px-4 md:px-8",

  logoContainer:
    "flex items-center gap-3 cursor-pointer",

  logoImage:
    "w-12 h-12 object-contain",

  logoText:
    "text-2xl md:text-3xl text-gray-900 font-semibold",

  userContainer:
    "relative",

  userButton:
    "flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors",

  userAvatar:
    "w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-cyan-500 text-white font-bold text-lg",

  statusIndicator:
    "absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white",

  userTextContainer:
    "text-left hidden md:block",

  userName:
    "text-sm font-medium text-gray-800 truncate max-w-[120px]",

  userEmail:
    "text-xs text-gray-500 truncate max-w-[120px]",

  chevronIcon: (isOpen) =>
    `w-4 h-4 text-gray-500 transition-transform ${
      isOpen ? "rotate-180" : ""
    }`,

  dropdownMenu:
    "absolute top-14 right-0 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50",

  dropdownHeader:
    "px-4 py-3 border-b border-gray-100",

  dropdownAvatar:
    "w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg",

  dropdownName:
    "text-sm text-gray-800",

  dropdownEmail:
    "text-xs text-gray-500",

  menuItemContainer:
    "p-1.5",

  menuItem:
    "w-full px-4 py-3 text-left hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-3 rounded-lg",

  menuItemBorder:
    "p-1.5 border-t border-gray-100",

  logoutButton:
    "flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-red-50 text-red-600 rounded-lg",
};


// ======================================================
// MODAL STYLES
// ======================================================

export const modalStyles = {
  overlay:
    "fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4",

  modal:
    "w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl",

  header:
    "flex items-center justify-between border-b border-gray-100 px-6 py-4",

  title:
    "text-xl font-semibold text-gray-800",

  closeButton:
    "rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors",

  form:
    "space-y-5 p-6",

  label:
    "mb-2 block text-sm font-medium text-gray-700",

  input: (ring = "focus:ring-teal-500") =>
    `w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none transition-all focus:border-transparent focus:ring-2 ${ring}`,

  typeButtonContainer:
    "grid grid-cols-2 gap-3",

  typeButton: (selected, selectedClass) =>
    `rounded-lg border px-4 py-3 font-medium transition-all ${
      selected
        ? selectedClass
        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
    }`,

  submitButton: (buttonClass) =>
    `w-full rounded-lg px-4 py-3 font-semibold text-white transition-all ${buttonClass}`,

  colorClasses: {
    teal: {
      ring: "focus:ring-teal-500",
      button:
        "bg-teal-600 hover:bg-teal-700",
      typeButtonSelected:
        "border-teal-500 bg-teal-50 text-teal-700",
    },

    orange: {
      ring: "focus:ring-orange-500",
      button:
        "bg-orange-500 hover:bg-orange-600",
      typeButtonSelected:
        "border-orange-500 bg-orange-50 text-orange-700",
    },

    blue: {
      ring: "focus:ring-blue-500",
      button:
        "bg-blue-600 hover:bg-blue-700",
      typeButtonSelected:
        "border-blue-500 bg-blue-50 text-blue-700",
    },

    red: {
      ring: "focus:ring-red-500",
      button:
        "bg-red-600 hover:bg-red-700",
      typeButtonSelected:
        "border-red-500 bg-red-50 text-red-700",
    },
  },
};


// ======================================================
// EXPENSE PAGE STYLES
// ======================================================

export const expensePageStyles = {
  container:
    "min-h-[calc(100vh-70px)] w-full bg-[#f5f7f9] px-4 py-5 sm:px-6 lg:px-7",

  headerCard:
    "mb-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm",

  headerContainer:
    "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",

  headerTitle:
    "text-2xl font-bold tracking-tight text-[#172033]",

  headerSubtitle:
    "mt-1 text-sm text-gray-500",

  addButton:
    "flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60",

  timeframePositioning:
    "mt-5 flex justify-end",

  cardsGrid:
    "mb-5 grid grid-cols-1 gap-4 md:grid-cols-3",

  iconOrange:
    "flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50",

  textOrange:
    "text-orange-500",

  iconAmber:
    "flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50",

  textAmber:
    "text-amber-500",

  iconYellow:
    "flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50",

  textYellow:
    "text-yellow-500",

  borderOrange:
    "border-orange-200",

  borderAmber:
    "border-amber-200",

  borderYellow:
    "border-yellow-200",

  chartContainer:
    "mb-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm",

  chartHeader:
    "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",

  chartTitle:
    "flex items-center gap-2 text-lg font-bold text-[#172033]",

  chartExportButton:
    "flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-orange-600",

  chartHeight:
    "h-[320px] w-full pt-4",

  tooltipContent: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
  },

  transactionsContainer:
    "rounded-2xl border border-gray-200 bg-white shadow-sm",

  transactionsHeader:
    "flex flex-col gap-4 border-b border-gray-100 p-5 md:flex-row md:items-center md:justify-between",

  transactionsTitle:
    "flex items-center gap-2 text-lg font-bold text-[#172033]",

  transactionsList:
    "divide-y divide-gray-100",

  filterSelect:
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 sm:w-auto",

  exportButton:
    "flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600",

  transactionItemContainer:
    "p-4 transition hover:bg-gray-50",

  transactionAmount:
    "font-semibold text-orange-600",

  transactionIcon:
    "bg-orange-50 text-orange-500",

  viewAllButton:
    "flex w-full items-center justify-center gap-2 border-t border-gray-100 p-4 text-sm font-semibold text-orange-600 transition hover:bg-orange-50",

  emptyState:
    "flex min-h-[300px] flex-col items-center justify-center px-5 py-10 text-center",

  emptyStateIcon:
    "mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50",

  emptyStateText:
    "text-base font-semibold text-gray-700",

  emptyStateSubtext:
    "mt-1 text-sm text-gray-400",

  emptyStateButton:
    "mt-5 flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600",
};


// ======================================================
// INCOME PAGE STYLES
// ======================================================

export const incomeStyles = {
  wrapper:
    "min-h-[calc(100vh-70px)] w-full bg-[#f5f7f9] px-4 py-5 sm:px-6 lg:px-7",

  headerContainer:
    "mb-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm",

  header:
    "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",

  headerTitle:
    "text-2xl font-bold tracking-tight text-[#172033]",

  headerSubtitle:
    "mt-1 text-sm text-gray-500",

  addButton:
    "flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60",

  timeFrameContainer:
    "mt-5 flex justify-end",

  summaryGrid:
    "mb-5 grid grid-cols-1 gap-4 md:grid-cols-3",

  iconGreen:
    "flex h-10 w-10 items-center justify-center rounded-lg bg-green-50",

  textGreen:
    "text-green-600",

  iconBlue:
    "flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50",

  textBlue:
    "text-blue-600",

  iconPurple:
    "flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50",

  textPurple:
    "text-purple-600",

  chartContainer:
    "mb-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm",

  chartHeaderContainer:
    "flex items-center justify-between",

  chartTitle:
    "flex items-center gap-2 text-lg font-bold text-[#172033]",

  chartHeight:
    "h-[320px] w-full pt-4",

  tooltipContent: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
  },

  filterContainer:
    "flex w-full flex-col gap-2 sm:w-auto sm:flex-row",

  filterSelect:
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 sm:w-auto",

  filterIcon:
    "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400",

  exportButton:
    "flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700",

  listContainer:
    "rounded-2xl border border-gray-200 bg-white shadow-sm",

  sectionTitle:
    "flex items-center gap-2 text-lg font-bold text-[#172033]",

  transactionList:
    "divide-y divide-gray-100",

  viewAllButton:
    "flex w-full items-center justify-center gap-2 border-t border-gray-100 p-4 text-sm font-semibold text-teal-600 transition hover:bg-teal-50",

  emptyStateContainer:
    "flex min-h-[300px] flex-col items-center justify-center px-5 py-10 text-center",

  emptyStateIcon:
    "mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50",

  emptyStateText:
    "text-base font-semibold text-gray-700",

  emptyStateSubtext:
    "mt-1 text-sm text-gray-400",

  emptyStateButton:
    "mt-5 flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700",
};


// ======================================================
// PROFILE PAGE STYLES
// ======================================================

export const profileStyles = {
  container:
    "min-h-[calc(100vh-70px)] w-full bg-[#f5f7f9] px-4 py-5 sm:px-6 lg:px-7",

  wrapper:
    "mx-auto w-full max-w-5xl",

  headerCard:
    "mb-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm",

  header:
    "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",

  headerTitle:
    "text-2xl font-bold tracking-tight text-[#172033]",

  headerSubtitle:
    "mt-1 text-sm text-gray-500",

  profileCard:
    "rounded-2xl border border-gray-200 bg-white shadow-sm",

  profileHeader:
    "border-b border-gray-100 px-5 py-4",

  profileTitle:
    "text-lg font-bold text-[#172033]",

  profileSubtitle:
    "mt-1 text-sm text-gray-500",

  content:
    "p-5",

  avatarSection:
    "mb-6 flex flex-col items-center gap-4 sm:flex-row",

  avatar:
    "flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 text-3xl font-bold text-white shadow-md",

  avatarInfo:
    "text-center sm:text-left",

  avatarName:
    "text-xl font-semibold text-gray-800",

  avatarEmail:
    "mt-1 text-sm text-gray-500",

  form:
    "grid grid-cols-1 gap-5 md:grid-cols-2",

  field:
    "flex flex-col",

  label:
    "mb-2 text-sm font-medium text-gray-700",

  input:
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20",

  disabledInput:
    "w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500 outline-none",

  buttonContainer:
    "mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end",

  saveButton:
    "rounded-lg bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50",

  cancelButton:
    "rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50",

  logoutButton:
    "rounded-lg bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100",

  successMessage:
    "mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700",

  errorMessage:
    "mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700",
};


// ======================================================
// HELPER
// ======================================================

export const cn = (...classes) => {
  return classes
    .filter(Boolean)
    .join(" ");
};