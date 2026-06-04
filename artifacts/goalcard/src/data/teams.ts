export interface Team {
  name: string;
  flag: string;
  primary: string;
  secondary: string;
  shortName: string;
}

const teams: Team[] = [
  { name: "United States", flag: "🇺🇸", primary: "#002868", secondary: "#BF0A30", shortName: "USA" },
  { name: "Mexico", flag: "🇲🇽", primary: "#006847", secondary: "#CE1126", shortName: "MEX" },
  { name: "South Africa", flag: "🇿🇦", primary: "#007A4D", secondary: "#FFB81C", shortName: "RSA" },
  { name: "South Korea", flag: "🇰🇷", primary: "#003478", secondary: "#CD2E3A", shortName: "KOR" },
  { name: "Czechia", flag: "🇨🇿", primary: "#D7141A", secondary: "#11457E", shortName: "CZE" },
  { name: "Canada", flag: "🇨🇦", primary: "#FF0000", secondary: "#FFFFFF", shortName: "CAN" },
  { name: "Bosnia & Herzegovina", flag: "🇧🇦", primary: "#002395", secondary: "#FECC02", shortName: "BIH" },
  { name: "Belgium", flag: "🇧🇪", primary: "#000000", secondary: "#FAE042", shortName: "BEL" },
  { name: "Egypt", flag: "🇪🇬", primary: "#CE1126", secondary: "#FFFFFF", shortName: "EGY" },
  { name: "Chile", flag: "🇨🇱", primary: "#D52B1E", secondary: "#FFFFFF", shortName: "CHI" },
  { name: "Germany", flag: "🇩🇪", primary: "#000000", secondary: "#FFCE00", shortName: "GER" },
  { name: "Serbia", flag: "🇷🇸", primary: "#C6363C", secondary: "#0C4076", shortName: "SRB" },
  { name: "Portugal", flag: "🇵🇹", primary: "#006600", secondary: "#FF0000", shortName: "POR" },
  { name: "Paraguay", flag: "🇵🇾", primary: "#D52B1E", secondary: "#FFFFFF", shortName: "PAR" },
  { name: "Australia", flag: "🇦🇺", primary: "#00843D", secondary: "#FFCD00", shortName: "AUS" },
  { name: "Turkey", flag: "🇹🇷", primary: "#E30A17", secondary: "#FFFFFF", shortName: "TUR" },
  { name: "Morocco", flag: "🇲🇦", primary: "#C1272D", secondary: "#006233", shortName: "MAR" },
  { name: "Saudi Arabia", flag: "🇸🇦", primary: "#006C35", secondary: "#FFFFFF", shortName: "KSA" },
  { name: "Iraq", flag: "🇮🇶", primary: "#007A3D", secondary: "#FFFFFF", shortName: "IRQ" },
  { name: "Jordan", flag: "🇯🇴", primary: "#007A3D", secondary: "#FFFFFF", shortName: "JOR" },
  { name: "Argentina", flag: "🇦🇷", primary: "#74ACDF", secondary: "#F6B40E", shortName: "ARG" },
  { name: "Brazil", flag: "🇧🇷", primary: "#009C3B", secondary: "#FFDF00", shortName: "BRA" },
  { name: "France", flag: "🇫🇷", primary: "#002395", secondary: "#ED2939", shortName: "FRA" },
  { name: "Spain", flag: "🇪🇸", primary: "#AA151B", secondary: "#F1BF00", shortName: "ESP" },
  { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", primary: "#012169", secondary: "#FFFFFF", shortName: "ENG" },
  { name: "Netherlands", flag: "🇳🇱", primary: "#FF6600", secondary: "#FFFFFF", shortName: "NED" },
  { name: "Japan", flag: "🇯🇵", primary: "#BC002D", secondary: "#FFFFFF", shortName: "JPN" },
  { name: "Uruguay", flag: "🇺🇾", primary: "#5EB6E4", secondary: "#FFFFFF", shortName: "URU" },
  { name: "Colombia", flag: "🇨🇴", primary: "#FCD116", secondary: "#003087", shortName: "COL" },
  { name: "Switzerland", flag: "🇨🇭", primary: "#FF0000", secondary: "#FFFFFF", shortName: "SUI" },
  { name: "Denmark", flag: "🇩🇰", primary: "#C60C30", secondary: "#FFFFFF", shortName: "DEN" },
  { name: "Austria", flag: "🇦🇹", primary: "#ED2939", secondary: "#FFFFFF", shortName: "AUT" },
  { name: "Ukraine", flag: "🇺🇦", primary: "#005BBB", secondary: "#FFD500", shortName: "UKR" },
  { name: "Poland", flag: "🇵🇱", primary: "#DC143C", secondary: "#FFFFFF", shortName: "POL" },
  { name: "Slovenia", flag: "🇸🇮", primary: "#003DA5", secondary: "#FF0000", shortName: "SVN" },
  { name: "Senegal", flag: "🇸🇳", primary: "#00853F", secondary: "#FDEF42", shortName: "SEN" },
  { name: "Nigeria", flag: "🇳🇬", primary: "#008751", secondary: "#FFFFFF", shortName: "NGA" },
  { name: "Ivory Coast", flag: "🇨🇮", primary: "#F77F00", secondary: "#FFFFFF", shortName: "CIV" },
  { name: "Tunisia", flag: "🇹🇳", primary: "#E70013", secondary: "#FFFFFF", shortName: "TUN" },
  { name: "Algeria", flag: "🇩🇿", primary: "#006233", secondary: "#D21034", shortName: "ALG" },
  { name: "New Zealand", flag: "🇳🇿", primary: "#00247D", secondary: "#FFFFFF", shortName: "NZL" },
  { name: "Jamaica", flag: "🇯🇲", primary: "#000000", secondary: "#FED100", shortName: "JAM" },
  { name: "Cabo Verde", flag: "🇨🇻", primary: "#003893", secondary: "#CF2027", shortName: "CPV" },
  { name: "Honduras", flag: "🇭🇳", primary: "#0073CF", secondary: "#FFFFFF", shortName: "HON" },
  { name: "Panama", flag: "🇵🇦", primary: "#DA121A", secondary: "#002B7F", shortName: "PAN" },
  { name: "Indonesia", flag: "🇮🇩", primary: "#CE1126", secondary: "#FFFFFF", shortName: "IDN" },
  { name: "Uzbekistan", flag: "🇺🇿", primary: "#1EB53A", secondary: "#0099B5", shortName: "UZB" },
  { name: "Qatar", flag: "🇶🇦", primary: "#8D1B3D", secondary: "#FFFFFF", shortName: "QAT" },
];

export default teams;

export const getTeam = (name: string): Team | undefined =>
  teams.find((t) => t.name === name);
