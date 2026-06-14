export interface Team {
  name: string;
  flag: string;
  code: string;
  primary: string;
  secondary: string;
  shortName: string;
}

const teams: Team[] = [
  // ── GROUP A ──
  { name: "Mexico",          flag: "🇲🇽", code: "mx", primary: "#006847", secondary: "#CE1126", shortName: "MEX" },
  { name: "South Africa",    flag: "🇿🇦", code: "za", primary: "#007A4D", secondary: "#FFB81C", shortName: "RSA" },
  { name: "South Korea",     flag: "🇰🇷", code: "kr", primary: "#003478", secondary: "#CD2E3A", shortName: "KOR" },
  { name: "Czechia",         flag: "🇨🇿", code: "cz", primary: "#D7141A", secondary: "#11457E", shortName: "CZE" },

  // ── GROUP B ──
  { name: "Canada",                flag: "🇨🇦", code: "ca", primary: "#FF0000",  secondary: "#FFFFFF", shortName: "CAN" },
  { name: "Bosnia & Herzegovina",  flag: "🇧🇦", code: "ba", primary: "#002395",  secondary: "#FECC02", shortName: "BIH" },
  { name: "Qatar",                 flag: "🇶🇦", code: "qa", primary: "#8D1B3D",  secondary: "#FFFFFF", shortName: "QAT" },
  { name: "Switzerland",           flag: "🇨🇭", code: "ch", primary: "#FF0000",  secondary: "#FFFFFF", shortName: "SUI" },

  // ── GROUP C ──
  { name: "Brazil",    flag: "🇧🇷", code: "br", primary: "#009C3B", secondary: "#FFDF00", shortName: "BRA" },
  { name: "Morocco",   flag: "🇲🇦", code: "ma", primary: "#C1272D", secondary: "#006233", shortName: "MAR" },
  { name: "Haiti",     flag: "🇭🇹", code: "ht", primary: "#00209F", secondary: "#D21034", shortName: "HAI" },
  { name: "Scotland",  flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", code: "gb-sct", primary: "#003380", secondary: "#FFFFFF", shortName: "SCO" },

  // ── GROUP D ──
  { name: "United States", flag: "🇺🇸", code: "us", primary: "#002868", secondary: "#BF0A30", shortName: "USA" },
  { name: "Paraguay",      flag: "🇵🇾", code: "py", primary: "#D52B1E", secondary: "#FFFFFF", shortName: "PAR" },
  { name: "Australia",     flag: "🇦🇺", code: "au", primary: "#00843D", secondary: "#FFCD00", shortName: "AUS" },
  { name: "Turkey",        flag: "🇹🇷", code: "tr", primary: "#E30A17", secondary: "#FFFFFF", shortName: "TUR" },

  // ── GROUP E ──
  { name: "Germany",      flag: "🇩🇪", code: "de", primary: "#000000", secondary: "#FFCE00", shortName: "GER" },
  { name: "Curacao",      flag: "🇨🇼", code: "cw", primary: "#002B7F", secondary: "#F9E300", shortName: "CUR" },
  { name: "Ivory Coast",  flag: "🇨🇮", code: "ci", primary: "#F77F00", secondary: "#FFFFFF", shortName: "CIV" },
  { name: "Ecuador",      flag: "🇪🇨", code: "ec", primary: "#FFD100", secondary: "#003087", shortName: "ECU" },

  // ── GROUP F ──
  { name: "Netherlands",  flag: "🇳🇱", code: "nl", primary: "#FF6600", secondary: "#FFFFFF", shortName: "NED" },
  { name: "Japan",        flag: "🇯🇵", code: "jp", primary: "#BC002D", secondary: "#FFFFFF", shortName: "JPN" },
  { name: "Sweden",       flag: "🇸🇪", code: "se", primary: "#006AA7", secondary: "#FECC02", shortName: "SWE" },
  { name: "Tunisia",      flag: "🇹🇳", code: "tn", primary: "#E70013", secondary: "#FFFFFF", shortName: "TUN" },

  // ── GROUP G ──
  { name: "Belgium",     flag: "🇧🇪", code: "be", primary: "#000000", secondary: "#FAE042", shortName: "BEL" },
  { name: "Egypt",       flag: "🇪🇬", code: "eg", primary: "#CE1126", secondary: "#FFFFFF", shortName: "EGY" },
  { name: "Iran",        flag: "🇮🇷", code: "ir", primary: "#239F40", secondary: "#DA0000", shortName: "IRN" },
  { name: "New Zealand", flag: "🇳🇿", code: "nz", primary: "#00247D", secondary: "#FFFFFF", shortName: "NZL" },

  // ── GROUP H ──
  { name: "Spain",       flag: "🇪🇸", code: "es", primary: "#AA151B", secondary: "#F1BF00", shortName: "ESP" },
  { name: "Cape Verde",  flag: "🇨🇻", code: "cv", primary: "#003893", secondary: "#CF2027", shortName: "CPV" },
  { name: "Saudi Arabia", flag: "🇸🇦", code: "sa", primary: "#006C35", secondary: "#FFFFFF", shortName: "KSA" },
  { name: "Uruguay",     flag: "🇺🇾", code: "uy", primary: "#5EB6E4", secondary: "#FFFFFF", shortName: "URU" },

  // ── GROUP I ──
  { name: "France",   flag: "🇫🇷", code: "fr", primary: "#002395", secondary: "#ED2939", shortName: "FRA" },
  { name: "Senegal",  flag: "🇸🇳", code: "sn", primary: "#00853F", secondary: "#FDEF42", shortName: "SEN" },
  { name: "Iraq",     flag: "🇮🇶", code: "iq", primary: "#007A3D", secondary: "#FFFFFF", shortName: "IRQ" },
  { name: "Norway",   flag: "🇳🇴", code: "no", primary: "#EF2B2D", secondary: "#FFFFFF", shortName: "NOR" },

  // ── GROUP J ──
  { name: "Argentina", flag: "🇦🇷", code: "ar", primary: "#74ACDF", secondary: "#F6B40E", shortName: "ARG" },
  { name: "Algeria",   flag: "🇩🇿", code: "dz", primary: "#006233", secondary: "#D21034", shortName: "ALG" },
  { name: "Austria",   flag: "🇦🇹", code: "at", primary: "#ED2939", secondary: "#FFFFFF", shortName: "AUT" },
  { name: "Jordan",    flag: "🇯🇴", code: "jo", primary: "#007A3D", secondary: "#FFFFFF", shortName: "JOR" },

  // ── GROUP K ──
  { name: "Portugal",    flag: "🇵🇹", code: "pt", primary: "#006600", secondary: "#FF0000", shortName: "POR" },
  { name: "DR Congo",    flag: "🇨🇩", code: "cd", primary: "#007FFF", secondary: "#F7D618", shortName: "COD" },
  { name: "Uzbekistan",  flag: "🇺🇿", code: "uz", primary: "#1EB53A", secondary: "#0099B5", shortName: "UZB" },
  { name: "Colombia",    flag: "🇨🇴", code: "co", primary: "#FCD116", secondary: "#003087", shortName: "COL" },

  // ── GROUP L ──
  { name: "England",  flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", code: "gb-eng", primary: "#012169", secondary: "#FFFFFF", shortName: "ENG" },
  { name: "Croatia",  flag: "🇭🇷", code: "hr", primary: "#FF0000",  secondary: "#FFFFFF", shortName: "CRO" },
  { name: "Ghana",    flag: "🇬🇭", code: "gh", primary: "#006B3F",  secondary: "#FCD116", shortName: "GHA" },
  { name: "Panama",   flag: "🇵🇦", code: "pa", primary: "#DA121A",  secondary: "#002B7F", shortName: "PAN" },

  // ── OTHER / DROPDOWN ──
  { name: "Denmark",    flag: "🇩🇰", code: "dk", primary: "#C60C30", secondary: "#FFFFFF", shortName: "DEN" },
  { name: "Poland",     flag: "🇵🇱", code: "pl", primary: "#DC143C", secondary: "#FFFFFF", shortName: "POL" },
  { name: "Serbia",     flag: "🇷🇸", code: "rs", primary: "#C6363C", secondary: "#0C4076", shortName: "SRB" },
  { name: "Ukraine",    flag: "🇺🇦", code: "ua", primary: "#005BBB", secondary: "#FFD500", shortName: "UKR" },
  { name: "Nigeria",    flag: "🇳🇬", code: "ng", primary: "#008751", secondary: "#FFFFFF", shortName: "NGA" },
  { name: "Chile",      flag: "🇨🇱", code: "cl", primary: "#D52B1E", secondary: "#FFFFFF", shortName: "CHI" },
  { name: "Indonesia",  flag: "🇮🇩", code: "id", primary: "#CE1126", secondary: "#FFFFFF", shortName: "IDN" },
  { name: "Jamaica",    flag: "🇯🇲", code: "jm", primary: "#000000", secondary: "#FED100", shortName: "JAM" },
  { name: "Honduras",   flag: "🇭🇳", code: "hn", primary: "#0073CF", secondary: "#FFFFFF", shortName: "HON" },
];

export default teams;

export const getTeam = (name: string): Team | undefined =>
  teams.find((t) => t.name === name);

export const getFlagUrl = (code: string, size: number = 160): string =>
  `https://flagcdn.com/w${size}/${code}.png`;
