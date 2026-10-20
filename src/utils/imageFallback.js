// Medical image fallback utility

export function createDoctorFallbackSvg(name, specialty = 'Doctor') {
  const initials = name
    .replace('Dr. ', '')
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f766e" />
        <stop offset="50%" stop-color="#0d9488" />
        <stop offset="100%" stop-color="#0891b2" />
      </linearGradient>
    </defs>
    <rect width="200" height="200" rx="40" fill="url(#grad)" />
    <!-- Medical cross icon -->
    <path d="M100 45 v40 M80 65 h40" stroke="#a7f3d0" stroke-width="6" stroke-linecap="round" />
    <!-- Doctor Initials -->
    <text x="100" y="135" font-family="system-ui, sans-serif" font-size="42" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">
      ${initials}
    </text>
    <!-- Specialty label -->
    <text x="100" y="165" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#ccfbf1" text-anchor="middle" letter-spacing="0.5">
      ${specialty.toUpperCase()}
    </text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function createClinicFallbackSvg(name) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <defs>
      <linearGradient id="cgrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#134e4a" />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#cgrad)" />
    <!-- Building graphic -->
    <rect x="120" y="80" width="160" height="180" rx="8" fill="#1e293b" stroke="#0ea5e9" stroke-width="2" />
    <!-- Hospital Cross -->
    <circle cx="200" cy="130" r="26" fill="#0ea5e9" />
    <path d="M200 116 v28 M186 130 h28" stroke="#ffffff" stroke-width="6" stroke-linecap="round" />
    <!-- Windows -->
    <rect x="140" y="175" width="25" height="20" rx="3" fill="#38bdf8" opacity="0.8" />
    <rect x="187" y="175" width="25" height="20" rx="3" fill="#38bdf8" opacity="0.8" />
    <rect x="235" y="175" width="25" height="20" rx="3" fill="#38bdf8" opacity="0.8" />
    <!-- Name text -->
    <text x="200" y="240" font-family="system-ui, sans-serif" font-size="14" font-weight="800" fill="#ffffff" text-anchor="middle">
      SHIFOXONA
    </text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function createProductFallbackSvg(name, category = 'medicine') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
    <defs>
      <linearGradient id="pgrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f0fdfa" />
        <stop offset="100%" stop-color="#ccfbf1" />
      </linearGradient>
    </defs>
    <rect width="300" height="300" fill="url(#pgrad)" />
    <circle cx="150" cy="135" r="60" fill="#0d9488" opacity="0.1" />
    <!-- Capsule / Pill -->
    <g transform="translate(150, 135) rotate(-35)">
      <rect x="-35" y="-18" width="35" height="36" rx="18" fill="#0d9488" />
      <rect x="0" y="-18" width="35" height="36" rx="18" fill="#38bdf8" />
    </g>
    <!-- Label -->
    <text x="150" y="230" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#0f766e" text-anchor="middle">
      TIBBIY DORI VOSITASI
    </text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
