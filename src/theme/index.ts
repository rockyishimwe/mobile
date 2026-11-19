export const Colors = {
  light: {
    primary: "#123D32",       // Deep Forest Green
    primaryLight: "#E9F2EC",  // Sage Green
    secondary: "#397A61",     // Muted Emerald
    accent: "#D5A85A",        // Warm Gold
    background: "#F8F7F2",    // Warm Ivory
    surface: "#FFFFFF",       // White
    text: "#202923",          // Charcoal
    textSecondary: "#737D77", // Muted Slate
    border: "#E5E9E5",        // Soft Gray
    success: "#23845B",
    warning: "#B7791F",
    danger: "#C2413B",
    info: "#2563EB",
    cardMuted: "#F4F7F4",
  },
  dark: {
    primary: "#77B89A",
    primaryLight: "#203C32",
    secondary: "#8BC6A8",
    accent: "#D5B36F",
    background: "#101B17",
    surface: "#192720",
    text: "#F0F4F0",
    textSecondary: "#A0AEA5",
    border: "#304137",
    success: "#55B98A",
    warning: "#E5B75F",
    danger: "#F07870",
    info: "#76A9F5",
    cardMuted: "#1E2F27",
  },
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const Typography = {
  fontFamily: {
    heading: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  fontSize: {
    screenTitle: 24,
    sectionHeading: 18,
    cardTitle: 16,
    body: 14,
    caption: 12,
    tiny: 11,
    badge: 10,
  },
};

export const Shadows = {
  card: {
    shadowColor: "#123D32",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  elevated: {
    shadowColor: "#123D32",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
};

export const StatusPalette = {
  draft: { bg: "#F1F5F2", text: "#737D77", border: "#E5E9E5", label: "Draft" },
  in_review: { bg: "#EFF6FF", text: "#2563EB", border: "#BFDBFE", label: "In Review" },
  awaiting_confirmation: { bg: "#FEF9EE", text: "#B7791F", border: "#F6E0B5", label: "Awaiting Signatures" },
  active: { bg: "#E9F2EC", text: "#123D32", border: "#C8DFD0", label: "Active" },
  awaiting_acceptance: { bg: "#F0FDF4", text: "#397A61", border: "#BBF7D0", label: "Awaiting Acceptance" },
  completed: { bg: "#ECFDF5", text: "#23845B", border: "#A7F3D0", label: "Completed" },
  disputed: { bg: "#FEF2F2", text: "#C2413B", border: "#FECACA", label: "Disputed" },
  overdue: { bg: "#FFF1F2", text: "#BE123C", border: "#FECDD3", label: "Overdue" },
  expired: { bg: "#F3F4F6", text: "#6B7280", border: "#E5E7EB", label: "Expired" },
};

