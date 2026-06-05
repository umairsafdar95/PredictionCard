export interface Team {
  name: string;
  flag: string;
  code: string;
  primary: string;
  secondary: string;
  shortName: string;
}

const teams: Team[] = [
  { name: "United States", flag: "🇺🇸", code: "us", primary: "#002868", secondary: "#BF0A30", shortName: "USA" },
  { name: "Mexico", flag: "🇲🇽", code: "mx", primary: "#006847", secondary: "#CE1126", shortName: "MEX" },
  { name: "Canada", flag: "🇨🇦", code: "ca", primary: "#FF0000", secondary: "#FFFFFF", shortName: "CAN" },
  { name: "Argentina", flag: "🇦🇷", code: "ar", primary: "#74ACDF", secondary: "#F6B40E", shortName: "ARG" },
  { name: "Brazil", flag: "🇧🇷", code: "br", primary: "#009C3B", secondary: "#FFDF00", shortName: "BRA" },
  { name: "France", flag: "🇫🇷", code: "fr", primary: "#002395", secondary: "#ED2939", shortName: "FRA" },
  { name: "Spain", flag: "🇪🇸", code: "es", primary: "#AA151B", secondary: "#F1BF00", shortName: "ESP" },
  { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", code: "gb-eng", primary: "#012169", secondary: "#FFFFFF", shortName: "ENG" },
  { name: "Germany", flag: "🇩🇪", code: "de", primary: "#000000", secondary: "#FFCE00", shortName: "GER" },
  { name: "Portugal", flag: "🇵🇹", code: "pt", primary: "#006600", secondary: "#FF0000", shortName: "POR" },
  { name: "Netherlands", flag: "🇳🇱", code: "nl", primary: "#FF6600", secondary: "#FFFFFF", shortName: "NED" },
  { name: "Belgium", flag: "🇧🇪", code: "be", primary: "#000000", secondary: "#FAE042", shortName: "BEL" },
  { name: "Morocco", flag: "🇲🇦", code: "ma", primary: "#C1272D", secondary: "#006233", shortName: "MAR" },
  { name: "Japan", flag: "🇯🇵", code: "jp", primary: "#BC002D", secondary: "#FFFFFF", shortName: "JPN" },
  { name: "South Korea", flag: "🇰🇷", code: "kr", primary: "#003478", secondary: "#CD2E3A", shortName: "KOR" },
  { name: "Saudi Arabia", flag: "🇸🇦", code: "sa", primary: "#006C35", secondary: "#FFFFFF", shortName: "KSA" },
  { name: "Colombia", flag: "🇨🇴", code: "co", primary: "#FCD116", secondary: "#003087", shortName: "COL" },
  { name: "Uruguay", flag: "🇺🇾", code: "uy", primary: "#5EB6E4", secondary: "#FFFFFF", shortName: "URU" },
  { name: "Switzerland", flag: "🇨🇭", code: "ch", primary: "#FF0000", secondary: "#FFFFFF", shortName: "SUI" },
  { name: "Denmark", flag: "🇩🇰", code: "dk", primary: "#C60C30", secondary: "#FFFFFF", shortName: "DEN" },
  { name: "Austria", flag: "🇦🇹", code: "at", primary: "#ED2939", secondary: "#FFFFFF", shortName: "AUT" },
  { name: "Poland", flag: "🇵🇱", code: "pl", primary: "#DC143C", secondary: "#FFFFFF", shortName: "POL" },
  { name: "Ukraine", flag: "🇺🇦", code: "ua", primary: "#005BBB", secondary: "#FFD500", shortName: "UKR" },
  { name: "Turkey", flag: "🇹🇷", code: "tr", primary: "#E30A17", secondary: "#FFFFFF", shortName: "TUR" },
  { name: "Australia", flag: "🇦🇺", code: "au", primary: "#00843D", secondary: "#FFCD00", shortName: "AUS" },
  { name: "Serbia", flag: "🇷🇸", code: "rs", primary: "#C6363C", secondary: "#0C4076", shortName: "SRB" },
  { name: "Czechia", flag: "🇨🇿", code: "cz", primary: "#D7141A", secondary: "#11457E", shortName: "CZE" },
  { name: "Slovenia", flag: "🇸🇮", code: "si", primary: "#003DA5", secondary: "#FF0000", shortName: "SVN" },
  { name: "Senegal", flag: "🇸🇳", code: "sn", primary: "#00853F", secondary: "#FDEF42", shortName: "SEN" },
  { name: "Nigeria", flag: "🇳🇬", code: "ng", primary: "#008751", secondary: "#FFFFFF", shortName: "NGA" },
  { name: "Ivory Coast", flag: "🇨🇮", code: "ci", primary: "#F77F00", secondary: "#FFFFFF", shortName: "CIV" },
  { name: "Tunisia", flag: "🇹🇳", code: "tn", primary: "#E70013", secondary: "#FFFFFF", shortName: "TUN" },
  { name: "Algeria", flag: "🇩🇿", code: "dz", primary: "#006233", secondary: "#D21034", shortName: "ALG" },
  { name: "Egypt", flag: "🇪🇬", code: "eg", primary: "#CE1126", secondary: "#FFFFFF", shortName: "EGY" },
  { name: "South Africa", flag: "🇿🇦", code: "za", primary: "#007A4D", secondary: "#FFB81C", shortName: "RSA" },
  { name: "Bosnia & Herzegovina", flag: "🇧🇦", code: "ba", primary: "#002395", secondary: "#FECC02", shortName: "BIH" },
  { name: "Chile", flag: "🇨🇱", code: "cl", primary: "#D52B1E", secondary: "#FFFFFF", shortName: "CHI" },
  { name: "Paraguay", flag: "🇵🇾", code: "py", primary: "#D52B1E", secondary: "#FFFFFF", shortName: "PAR" },
  { name: "Iraq", flag: "🇮🇶", code: "iq", primary: "#007A3D", secondary: "#FFFFFF", shortName: "IRQ" },
  { name: "Jordan", flag: "🇯🇴", code: "jo", primary: "#007A3D", secondary: "#FFFFFF", shortName: "JOR" },
  { name: "New Zealand", flag: "🇳🇿", code: "nz", primary: "#00247D", secondary: "#FFFFFF", shortName: "NZL" },
  { name: "Jamaica", flag: "🇯🇲", code: "jm", primary: "#000000", secondary: "#FED100", shortName: "JAM" },
  { name: "Cabo Verde", flag: "🇨🇻", code: "cv", primary: "#003893", secondary: "#CF2027", shortName: "CPV" },
  { name: "Honduras", flag: "🇭🇳", code: "hn", primary: "#0073CF", secondary: "#FFFFFF", shortName: "HON" },
  { name: "Panama", flag: "🇵🇦", code: "pa", primary: "#DA121A", secondary: "#002B7F", shortName: "PAN" },
  { name: "Indonesia", flag: "🇮🇩", code: "id", primary: "#CE1126", secondary: "#FFFFFF", shortName: "IDN" },
  { name: "Uzbekistan", flag: "🇺🇿", code: "uz", primary: "#1EB53A", secondary: "#0099B5", shortName: "UZB" },
  { name: "Qatar", flag: "🇶🇦", code: "qa", primary: "#8D1B3D", secondary: "#FFFFFF", shortName: "QAT" },
];

export default teams;

export const getTeam = (name: string): Team | undefined =>
  teams.find((t) => t.name === name);

export const getFlagUrl = (code: string, size: number = 160): string =>
  `https://flagcdn.com/w${size}/${code}.png`;
