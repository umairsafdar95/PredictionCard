import { useState } from "react";
import { FormState, Theme, Language } from "@/types";
import teams, { getTeam } from "@/data/teams";
import { getTodaysMatches, type Match } from "@/data/matches";
import SchedulePage from "@/components/SchedulePage";
import { type ScheduleMatch } from "@/data/schedule";

interface FormPageProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  onGenerate: () => void;
  challengerName: string | null;
  cardCount: number;
}

const THEMES: {
  id: Theme;
  label: string;
  desc: string;
  bg: string;
  accent: string;
  preview: string;
}[] = [
  {
    id: "dark",
    label: "Night Match",
    desc: "Dark stadium, green glow",
    bg: "linear-gradient(135deg, #050d14 0%, #0a1a0d 100%)",
    accent: "#22c55e",
    preview: "🌙",
  },
  {
    id: "colors",
    label: "National Colors",
    desc: "Team flag split design",
    bg: "linear-gradient(90deg, #002868 50%, #006847 50%)",
    accent: "#ffffff",
    preview: "🎌",
  },
  {
    id: "modern",
    label: "FIFA Gold",
    desc: "Deep navy & gold luxury",
    bg: "linear-gradient(135deg, #071330 0%, #0d1e4a 100%)",
    accent: "#d4af37",
    preview: "🏆",
  },
  {
    id: "retro",
    label: "Retro Classic",
    desc: "Vintage poster, bold red",
    bg: "linear-gradient(135deg, #f5ede0 0%, #edddc8 100%)",
    accent: "#c0392b",
    preview: "🕰️",
  },
  {
    id: "neon",
    label: "Neon Lights",
    desc: "Jet black, electric cyan",
    bg: "radial-gradient(ellipse at 50% 0%, #07101a 0%, #010508 100%)",
    accent: "#00e8ff",
    preview: "⚡",
  },
];

const LANGUAGES: { id: Language; label: string; flag: string }[] = [
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "ar", label: "العربية", flag: "🇸🇦" },
  { id: "fr", label: "Français", flag: "🇫🇷" },
  { id: "pt", label: "Português", flag: "🇧🇷" },
  { id: "es", label: "Español", flag: "🇪🇸" },
  { id: "de", label: "Deutsch", flag: "🇩🇪" },
  { id: "tr", label: "Türkçe", flag: "🇹🇷" },
];

const UI_TEXT: Record<Language, {
  subtitle: string; step1: string; step1sub: string; step2: string; step2sub: string;
  step3: string; step3sub: string; step4: string; step4sub: string; step5: string;
  step5sub: string; generate: string; howItWorks: string; about: string; faq: string;
  team1: string; team2: string; namePlaceholder: string; freeInstant: string;
  howStep1Title: string; howStep1Text: string; howStep2Title: string; howStep2Text: string;
  howStep3Title: string; howStep3Text: string; howStep4Title: string; howStep4Text: string;
  aboutP1: string; aboutP2: string; aboutP3: string;
  faqQ1: string; faqA1: string; faqQ2: string; faqA2: string;
  faqQ3: string; faqA3: string; faqQ4: string; faqA4: string; faqQ5: string; faqA5: string;
  footerTagline: string; footerCopyright: string;
}> = {
  en: {
    subtitle: "Predict the score · Download your card · Challenge friends",
    step1: "Which match?", step1sub: "Pick the two teams",
    step2: "What's your predicted score?", step2sub: "Set the final score",
    step3: "Your name on the card", step3sub: 'Shown as "Predicted by [Name]"',
    step4: "Card style", step4sub: "Choose your design theme",
    step5: "Card language", step5sub: "Text on the card",
    generate: "Generate My Card",
    howItWorks: "How to Make Your World Cup 2026 Prediction Card",
    about: "The Best Free World Cup Prediction Card Maker",
    faq: "Frequently Asked Questions",
    team1: "Team 1", team2: "Team 2", namePlaceholder: "e.g. Ahmed, Sarah, Carlos...",
    freeInstant: "Free · Instant · Shareable on WhatsApp & Instagram",
    howStep1Title: "Choose Your Match",
    howStep1Text: "Select any FIFA World Cup 2026 match from all 48 qualified teams — USA vs Mexico, Brazil vs Argentina, France vs Morocco, and every other fixture.",
    howStep2Title: "Enter Your Score Prediction",
    howStep2Text: "What's your predicted final score? Tap + and − to set the goals for each team. Your World Cup score prediction appears live on the card.",
    howStep3Title: "Pick Your Card Design",
    howStep3Text: "Choose from 5 prediction card themes: Night Match, National Colors, FIFA Gold, Retro Classic, or Neon Lights. Each design looks stunning on any screen.",
    howStep4Title: "Download and Share",
    howStep4Text: "Download your prediction card as a high-quality 1080×1080 PNG. Share it on WhatsApp, Instagram Stories, or Twitter and challenge your friends to make their own predictions.",
    aboutP1: "PerdictionCard.com is the fastest way to create and share your FIFA World Cup 2026 score predictions. Unlike basic text predictions, our football prediction cards are beautifully designed images that stand out in WhatsApp groups and Instagram feeds.",
    aboutP2: "With all 48 World Cup 2026 teams available, you can generate a new prediction card for every single game of the tournament. Each card is personalized with your name, predicted score, team colors, and national flags.",
    aboutP3: "Our World Cup card maker works in 7 languages including Arabic (RTL), Portuguese, Spanish, and French — perfect for football fans worldwide. No signup, no app download, and completely free.",
    faqQ1: "Is the World Cup 2026 prediction card generator free?",
    faqA1: "Yes. Creating your World Cup 2026 prediction card is 100% free. No account, no email, no credit card needed. Generate as many cards as you want for every match.",
    faqQ2: "Which teams are available in the prediction card generator?",
    faqA2: "All 48 qualified FIFA World Cup 2026 teams are available, including USA, Mexico, Canada (host nations), plus Brazil, Argentina, France, Spain, England, Morocco, Saudi Arabia, Japan, South Korea, and all other qualified nations.",
    faqQ3: "Can I share my prediction card on WhatsApp?",
    faqA3: "Absolutely. Your prediction card downloads as a 1080×1080 PNG image which you can share instantly on WhatsApp, Instagram, Twitter, or any social platform. The Share button lets you send directly from your phone.",
    faqQ4: "Does the prediction card work in Arabic?",
    faqA4: "Yes. Select Arabic from the language menu and your prediction card will display in Arabic with proper right-to-left text. We support English, Arabic, Portuguese, Spanish, French, Turkish, and German.",
    faqQ5: "What size is the prediction card image?",
    faqA5: "Prediction cards download as 1080×1080 pixel PNG images — perfect for Instagram square posts and WhatsApp sharing. The high resolution ensures your card looks crisp on any screen.",
    footerTagline: "Free FIFA World Cup 2026 Prediction Card Generator",
    footerCopyright: "© 2026 perdictioncard.com · Made for football fans worldwide · Not affiliated with FIFA",
  },
  ar: {
    subtitle: "توقع النتيجة · نزّل بطاقتك · تحدّ أصدقاءك",
    step1: "أي مباراة؟", step1sub: "اختر الفريقين",
    step2: "ما هو توقعك للنتيجة؟", step2sub: "حدد عدد الأهداف",
    step3: "اسمك على البطاقة", step3sub: "سيظهر كـ «توقع بواسطة [الاسم]»",
    step4: "تصميم البطاقة", step4sub: "اختر الأسلوب",
    step5: "لغة البطاقة", step5sub: "النص الذي يظهر على البطاقة",
    generate: "إنشاء بطاقة توقعي",
    howItWorks: "كيف تصنع بطاقة توقعاتك لكأس العالم 2026",
    about: "أفضل مولد بطاقات توقعات مجاني لكأس العالم",
    faq: "الأسئلة المتكررة",
    team1: "الفريق 1", team2: "الفريق 2", namePlaceholder: "مثال: أحمد، سارة، كارلوس...",
    freeInstant: "مجاني · فوري · قابل للمشاركة على واتساب وإنستغرام",
    howStep1Title: "اختر مباراتك",
    howStep1Text: "اختر أي مباراة من كأس العالم 2026 من بين 48 فريقاً — الولايات المتحدة ضد المكسيك، البرازيل ضد الأرجنتين، فرنسا ضد المغرب، وجميع المباريات الأخرى.",
    howStep2Title: "أدخل توقعك للنتيجة",
    howStep2Text: "ما هي نتيجتك المتوقعة؟ اضغط + و − لتحديد عدد الأهداف لكل فريق. يظهر توقعك مباشرةً على البطاقة.",
    howStep3Title: "اختر تصميم البطاقة",
    howStep3Text: "اختر من بين 5 تصاميم: مباراة ليلية، ألوان وطنية، ذهبي فيفا، كلاسيكي قديم، أو أضواء النيون. كل تصميم رائع على أي شاشة.",
    howStep4Title: "نزّل وشارك",
    howStep4Text: "نزّل بطاقة توقعك كصورة PNG عالية الجودة 1080×1080. شاركها على واتساب أو إنستغرام أو تويتر وتحدّ أصدقاءك.",
    aboutP1: "موقع PerdictionCard.com هو أسرع طريقة لإنشاء ومشاركة توقعاتك لنتائج كأس العالم 2026. على خلاف التوقعات النصية البسيطة، تُعدّ بطاقات توقعاتنا لكرة القدم صوراً مصمَّمة بشكل جميل تبرز في مجموعات واتساب وتغذيات إنستغرام.",
    aboutP2: "مع توفر جميع فرق كأس العالم 2026 الـ48، يمكنك إنشاء بطاقة توقع جديدة لكل مباراة في البطولة. كل بطاقة مخصصة باسمك والنتيجة المتوقعة وألوان الفريق والأعلام الوطنية.",
    aboutP3: "يعمل مولّد بطاقات كأس العالم لدينا بـ7 لغات تشمل العربية (من اليمين لليسار) والبرتغالية والإسبانية والفرنسية — مثالي لمحبي كرة القدم حول العالم. لا تسجيل، لا تحميل تطبيق، ومجاناً تماماً.",
    faqQ1: "هل مولّد بطاقات التوقع لكأس العالم 2026 مجاني؟",
    faqA1: "نعم. إنشاء بطاقة توقعاتك لكأس العالم 2026 مجاني 100٪. لا حساب، لا بريد إلكتروني، لا بطاقة ائتمان. أنشئ عدداً غير محدود من البطاقات لكل مباراة.",
    faqQ2: "ما هي الفرق المتاحة في مولّد بطاقات التوقع؟",
    faqA2: "جميع فرق كأس العالم 2026 الـ48 متاحة، بما فيها الولايات المتحدة والمكسيك وكندا (الدول المضيفة)، إضافة إلى البرازيل والأرجنتين وفرنسا وإسبانيا وإنجلترا والمغرب والسعودية واليابان وكوريا الجنوبية وجميع الأمم الأخرى.",
    faqQ3: "هل يمكنني مشاركة بطاقة توقعي على واتساب؟",
    faqA3: "بالطبع. يتم تنزيل بطاقة توقعك كصورة PNG بحجم 1080×1080 يمكنك مشاركتها فوراً على واتساب وإنستغرام وتويتر أو أي منصة. يتيح لك زر المشاركة الإرسال مباشرة من هاتفك.",
    faqQ4: "هل تعمل بطاقة التوقع باللغة العربية؟",
    faqA4: "نعم. اختر العربية من قائمة اللغات وستُعرض بطاقة توقعك باللغة العربية مع النص من اليمين إلى اليسار. ندعم: الإنجليزية والعربية والبرتغالية والإسبانية والفرنسية والتركية والألمانية.",
    faqQ5: "ما هو حجم صورة بطاقة التوقع؟",
    faqA5: "تُنزَّل بطاقات التوقع كصور PNG بحجم 1080×1080 بيكسل — مثالية لمنشورات إنستغرام المربعة والمشاركة على واتساب. الدقة العالية تضمن وضوح بطاقتك على أي شاشة.",
    footerTagline: "مولّد بطاقات توقعات كأس العالم 2026 المجاني",
    footerCopyright: "© 2026 perdictioncard.com · صُنع لمحبي كرة القدم حول العالم · غير تابع لفيفا",
  },
  fr: {
    subtitle: "Prédis le score · Télécharge ta carte · Défie tes amis",
    step1: "Quel match ?", step1sub: "Choisis les deux équipes",
    step2: "Quel est ton score prédit ?", step2sub: "Fixe le score final",
    step3: "Ton prénom sur la carte", step3sub: "Affiché comme « Prédit par [Prénom] »",
    step4: "Style de la carte", step4sub: "Choisis ton design",
    step5: "Langue de la carte", step5sub: "Texte sur la carte",
    generate: "Générer ma carte de prédiction",
    howItWorks: "Comment créer ta carte de prédiction Coupe du Monde 2026",
    about: "Le meilleur générateur gratuit de cartes de prédiction",
    faq: "Questions fréquentes",
    team1: "Équipe 1", team2: "Équipe 2", namePlaceholder: "ex. Ahmed, Sarah, Carlos...",
    freeInstant: "Gratuit · Instantané · Partageable sur WhatsApp et Instagram",
    howStep1Title: "Choisis ton match",
    howStep1Text: "Sélectionne n'importe quel match de la Coupe du Monde 2026 parmi 48 équipes — USA vs Mexique, Brésil vs Argentine, France vs Maroc et tous les autres.",
    howStep2Title: "Entre ton score prédit",
    howStep2Text: "Quel est ton score final prédit ? Appuie sur + et − pour fixer les buts de chaque équipe. Ta prédiction apparaît en direct sur la carte.",
    howStep3Title: "Choisis ton design de carte",
    howStep3Text: "Choisis parmi 5 thèmes : Match de nuit, Couleurs nationales, Or FIFA, Classique rétro ou Lumières néon. Chaque design est superbe sur n'importe quel écran.",
    howStep4Title: "Télécharge et partage",
    howStep4Text: "Télécharge ta carte de prédiction en PNG haute qualité 1080×1080. Partage-la sur WhatsApp, Instagram Stories ou Twitter et défie tes amis.",
    aboutP1: "PerdictionCard.com est le moyen le plus rapide de créer et partager vos prédictions de score pour la Coupe du Monde FIFA 2026. Contrairement aux prédictions textuelles basiques, nos cartes sont de belles images qui se démarquent dans les groupes WhatsApp et les fils Instagram.",
    aboutP2: "Avec les 48 équipes disponibles, vous pouvez générer une nouvelle carte de prédiction pour chaque match du tournoi. Chaque carte est personnalisée avec votre nom, le score prédit, les couleurs de l'équipe et les drapeaux nationaux.",
    aboutP3: "Notre générateur fonctionne en 7 langues dont l'arabe (RTL), le portugais, l'espagnol et le français — parfait pour les fans de football du monde entier. Sans inscription, sans téléchargement, et entièrement gratuit.",
    faqQ1: "Le générateur de cartes de prédiction Coupe du Monde 2026 est-il gratuit ?",
    faqA1: "Oui. Créer ta carte de prédiction est 100 % gratuit. Aucun compte, aucun e-mail, aucune carte bancaire requis. Génère autant de cartes que tu veux pour chaque match.",
    faqQ2: "Quelles équipes sont disponibles dans le générateur ?",
    faqA2: "Les 48 équipes qualifiées sont disponibles, dont les USA, le Mexique, le Canada (nations hôtes), ainsi que le Brésil, l'Argentine, la France, l'Espagne, l'Angleterre, le Maroc, l'Arabie saoudite, le Japon, la Corée du Sud et toutes les autres nations.",
    faqQ3: "Puis-je partager ma carte de prédiction sur WhatsApp ?",
    faqA3: "Absolument. Ta carte se télécharge sous forme d'image PNG 1080×1080 que tu peux partager instantanément sur WhatsApp, Instagram, Twitter ou toute autre plateforme. Le bouton Partager te permet d'envoyer directement depuis ton téléphone.",
    faqQ4: "La carte de prédiction fonctionne-t-elle en arabe ?",
    faqA4: "Oui. Sélectionne l'arabe dans le menu des langues et ta carte s'affichera en arabe avec un texte de droite à gauche. Nous prenons en charge l'anglais, l'arabe, le portugais, l'espagnol, le français, le turc et l'allemand.",
    faqQ5: "Quelle est la taille de l'image de la carte de prédiction ?",
    faqA5: "Les cartes se téléchargent en PNG de 1080×1080 pixels — le format carré idéal pour les posts Instagram et le partage WhatsApp. La haute résolution garantit que ta carte est nette sur n'importe quel écran.",
    footerTagline: "Générateur gratuit de cartes de prédiction Coupe du Monde 2026",
    footerCopyright: "© 2026 perdictioncard.com · Créé pour les fans de football du monde entier · Non affilié à la FIFA",
  },
  pt: {
    subtitle: "Preveja o placar · Baixe seu card · Desafie amigos",
    step1: "Qual partida?", step1sub: "Escolha os dois times",
    step2: "Qual é o seu placar previsto?", step2sub: "Defina o placar final",
    step3: "Seu nome no card", step3sub: "Aparecerá como «Previsto por [Nome]»",
    step4: "Estilo do card", step4sub: "Escolha seu design",
    step5: "Idioma do card", step5sub: "Texto no card",
    generate: "Gerar meu card de previsão",
    howItWorks: "Como criar seu card de previsão da Copa do Mundo 2026",
    about: "O melhor gerador gratuito de cards de previsão",
    faq: "Perguntas frequentes",
    team1: "Time 1", team2: "Time 2", namePlaceholder: "ex. Ahmed, Sarah, Carlos...",
    freeInstant: "Grátis · Instantâneo · Compartilhável no WhatsApp e Instagram",
    howStep1Title: "Escolha sua partida",
    howStep1Text: "Selecione qualquer jogo da Copa do Mundo 2026 entre 48 seleções — EUA vs México, Brasil vs Argentina, França vs Marrocos e todos os outros jogos.",
    howStep2Title: "Digite seu placar previsto",
    howStep2Text: "Qual é o seu placar final previsto? Toque em + e − para definir os gols de cada time. Sua previsão aparece ao vivo no card.",
    howStep3Title: "Escolha o design do card",
    howStep3Text: "Escolha entre 5 temas: Noite de Jogo, Cores Nacionais, Ouro FIFA, Clássico Retrô ou Luzes Neon. Cada design fica incrível em qualquer tela.",
    howStep4Title: "Baixe e compartilhe",
    howStep4Text: "Baixe seu card de previsão como PNG de alta qualidade 1080×1080. Compartilhe no WhatsApp, Instagram Stories ou Twitter e desafie seus amigos.",
    aboutP1: "PerdictionCard.com é a maneira mais rápida de criar e compartilhar suas previsões de placar para a Copa do Mundo FIFA 2026. Ao contrário de previsões de texto simples, nossos cards são imagens lindamente criadas que se destacam nos grupos do WhatsApp e feeds do Instagram.",
    aboutP2: "Com todas as 48 seleções da Copa do Mundo 2026 disponíveis, você pode criar um novo card de previsão para cada jogo do torneio. Cada card é personalizado com seu nome, placar previsto, cores do time e bandeiras nacionais.",
    aboutP3: "Nosso criador de cards funciona em 7 idiomas, incluindo árabe (RTL), português, espanhol e francês — perfeito para fãs de futebol em todo o mundo. Sem cadastro, sem download de app, e completamente gratuito.",
    faqQ1: "O gerador de cards de previsão da Copa do Mundo 2026 é gratuito?",
    faqA1: "Sim. Criar seu card de previsão da Copa do Mundo 2026 é 100% gratuito. Sem conta, sem e-mail, sem cartão de crédito. Gere quantos cards quiser para cada partida.",
    faqQ2: "Quais times estão disponíveis no gerador?",
    faqA2: "Todos os 48 times qualificados para a Copa do Mundo FIFA 2026 estão disponíveis, incluindo EUA, México, Canadá (países sede), além de Brasil, Argentina, França, Espanha, Inglaterra, Marrocos, Arábia Saudita, Japão, Coreia do Sul e todas as outras nações.",
    faqQ3: "Posso compartilhar meu card de previsão no WhatsApp?",
    faqA3: "Com certeza. Seu card é baixado como uma imagem PNG 1080×1080 que você pode compartilhar instantaneamente no WhatsApp, Instagram, Twitter ou qualquer plataforma social. O botão Compartilhar permite enviar diretamente do seu celular.",
    faqQ4: "O card de previsão funciona em árabe?",
    faqA4: "Sim. Selecione árabe no menu de idiomas e seu card será exibido em árabe com texto da direita para a esquerda. Suportamos inglês, árabe, português, espanhol, francês, turco e alemão.",
    faqQ5: "Qual é o tamanho da imagem do card de previsão?",
    faqA5: "Os cards são baixados como imagens PNG de 1080×1080 pixels — formato quadrado perfeito para posts do Instagram e compartilhamento no WhatsApp. A alta resolução garante que seu card fique nítido em qualquer tela.",
    footerTagline: "Gerador gratuito de cards de previsão da Copa do Mundo 2026",
    footerCopyright: "© 2026 perdictioncard.com · Feito para fãs de futebol do mundo inteiro · Não afiliado à FIFA",
  },
  es: {
    subtitle: "Predice el marcador · Descarga tu tarjeta · Reta a amigos",
    step1: "¿Qué partido?", step1sub: "Elige los dos equipos",
    step2: "¿Cuál es tu marcador predicho?", step2sub: "Establece el marcador final",
    step3: "Tu nombre en la tarjeta", step3sub: "Aparecerá como «Predicho por [Nombre]»",
    step4: "Estilo de la tarjeta", step4sub: "Elige tu diseño",
    step5: "Idioma de la tarjeta", step5sub: "Texto en la tarjeta",
    generate: "Generar mi tarjeta de predicción",
    howItWorks: "Cómo hacer tu tarjeta de predicción del Mundial 2026",
    about: "El mejor generador gratuito de tarjetas de predicción",
    faq: "Preguntas frecuentes",
    team1: "Equipo 1", team2: "Equipo 2", namePlaceholder: "ej. Ahmed, Sarah, Carlos...",
    freeInstant: "Gratis · Instantáneo · Compartible en WhatsApp e Instagram",
    howStep1Title: "Elige tu partido",
    howStep1Text: "Selecciona cualquier partido del Mundial 2026 entre 48 equipos — EE.UU. vs México, Brasil vs Argentina, Francia vs Marruecos y todos los demás.",
    howStep2Title: "Introduce tu marcador predicho",
    howStep2Text: "¿Cuál es tu marcador final previsto? Pulsa + y − para establecer los goles de cada equipo. Tu predicción aparece en directo en la tarjeta.",
    howStep3Title: "Elige el diseño de tu tarjeta",
    howStep3Text: "Elige entre 5 temas: Partido Nocturno, Colores Nacionales, Oro FIFA, Clásico Retro o Luces Neón. Cada diseño luce espectacular en cualquier pantalla.",
    howStep4Title: "Descarga y comparte",
    howStep4Text: "Descarga tu tarjeta de predicción como PNG de alta calidad 1080×1080. Compártela en WhatsApp, Instagram Stories o Twitter y reta a tus amigos.",
    aboutP1: "PerdictionCard.com es la forma más rápida de crear y compartir tus predicciones de marcador para la Copa del Mundo FIFA 2026. A diferencia de las predicciones de texto básicas, nuestras tarjetas son imágenes bellamente diseñadas que destacan en grupos de WhatsApp y feeds de Instagram.",
    aboutP2: "Con los 48 equipos disponibles, puedes generar una nueva tarjeta de predicción para cada partido del torneo. Cada tarjeta está personalizada con tu nombre, marcador predicho, colores del equipo y banderas nacionales.",
    aboutP3: "Nuestro creador funciona en 7 idiomas incluyendo árabe (RTL), portugués, español y francés — perfecto para aficionados al fútbol de todo el mundo. Sin registro, sin descarga de app, y completamente gratis.",
    faqQ1: "¿El generador de tarjetas de predicción del Mundial 2026 es gratuito?",
    faqA1: "Sí. Crear tu tarjeta de predicción del Mundial 2026 es 100% gratuito. Sin cuenta, sin correo, sin tarjeta de crédito. Genera tantas tarjetas como quieras para cada partido.",
    faqQ2: "¿Qué equipos están disponibles en el generador?",
    faqA2: "Los 48 equipos clasificados para la Copa del Mundo FIFA 2026 están disponibles, incluidos EE.UU., México, Canadá (naciones sede), más Brasil, Argentina, Francia, España, Inglaterra, Marruecos, Arabia Saudita, Japón, Corea del Sur y todos los demás.",
    faqQ3: "¿Puedo compartir mi tarjeta de predicción en WhatsApp?",
    faqA3: "Por supuesto. Tu tarjeta se descarga como imagen PNG 1080×1080 que puedes compartir al instante en WhatsApp, Instagram, Twitter o cualquier plataforma. El botón Compartir te permite enviar directamente desde tu teléfono.",
    faqQ4: "¿La tarjeta de predicción funciona en árabe?",
    faqA4: "Sí. Selecciona árabe en el menú de idiomas y tu tarjeta se mostrará en árabe con texto de derecha a izquierda. Admitimos inglés, árabe, portugués, español, francés, turco y alemán.",
    faqQ5: "¿Cuál es el tamaño de la imagen de la tarjeta de predicción?",
    faqA5: "Las tarjetas se descargan como imágenes PNG de 1080×1080 píxeles — el formato cuadrado perfecto para publicaciones de Instagram y compartir en WhatsApp. La alta resolución garantiza que tu tarjeta se vea nítida en cualquier pantalla.",
    footerTagline: "Generador gratuito de tarjetas de predicción del Mundial 2026",
    footerCopyright: "© 2026 perdictioncard.com · Hecho para aficionados al fútbol de todo el mundo · No afiliado a la FIFA",
  },
  de: {
    subtitle: "Tippe das Ergebnis · Lade deine Karte herunter · Fordere Freunde heraus",
    step1: "Welches Spiel?", step1sub: "Wähle die zwei Teams",
    step2: "Wie lautet dein Tipp?", step2sub: "Setze das Endergebnis",
    step3: "Dein Name auf der Karte", step3sub: "Erscheint als \u201eVorhergesagt von [Name]\u201c",
    step4: "Karten-Design", step4sub: "Wähle deinen Stil",
    step5: "Kartensprache", step5sub: "Text auf der Karte",
    generate: "Meine Tipp-Karte erstellen",
    howItWorks: "So erstellst du deine WM 2026 Tipp-Karte",
    about: "Der beste kostenlose WM-Tipp-Karten-Generator",
    faq: "Häufig gestellte Fragen",
    team1: "Team 1", team2: "Team 2", namePlaceholder: "z.B. Ahmed, Sarah, Carlos...",
    freeInstant: "Kostenlos · Sofort · Teilbar auf WhatsApp & Instagram",
    howStep1Title: "Wähle dein Spiel",
    howStep1Text: "Wähle ein beliebiges WM 2026 Spiel aus 48 Teams — USA vs Mexiko, Brasilien vs Argentinien, Frankreich vs Marokko und alle anderen Begegnungen.",
    howStep2Title: "Gib deinen Tipp ein",
    howStep2Text: "Was ist dein vorhergesagtes Endergebnis? Tippe + und −, um die Tore jedes Teams festzulegen. Dein Tipp erscheint live auf der Karte.",
    howStep3Title: "Wähle dein Karten-Design",
    howStep3Text: "Wähle aus 5 Themen: Nachtspiel, Nationalfarben, FIFA Gold, Retro Klassik oder Neonlichter. Jedes Design sieht auf jedem Bildschirm fantastisch aus.",
    howStep4Title: "Herunterladen und teilen",
    howStep4Text: "Lade deine Tipp-Karte als hochauflösendes 1080×1080 PNG herunter. Teile sie auf WhatsApp, Instagram Stories oder Twitter und fordere deine Freunde heraus.",
    aboutP1: "PerdictionCard.com ist der schnellste Weg, deine FIFA WM 2026 Ergebnis-Tipps zu erstellen und zu teilen. Im Gegensatz zu einfachen Texttipps sind unsere Tipp-Karten wunderschön gestaltete Bilder, die in WhatsApp-Gruppen und Instagram-Feeds herausstechen.",
    aboutP2: "Mit allen 48 WM 2026 Teams kannst du für jedes Spiel des Turniers eine neue Tipp-Karte erstellen. Jede Karte wird mit deinem Namen, dem vorhergesagten Ergebnis, Teamfarben und Nationalflaggen personalisiert.",
    aboutP3: "Unser WM-Karten-Generator unterstützt 7 Sprachen darunter Arabisch (RTL), Portugiesisch, Spanisch und Französisch — perfekt für Fußballfans weltweit. Ohne Anmeldung, ohne App-Download und völlig kostenlos.",
    faqQ1: "Ist der WM 2026 Tipp-Karten-Generator kostenlos?",
    faqA1: "Ja. Das Erstellen deiner WM 2026 Tipp-Karte ist 100 % kostenlos. Kein Konto, keine E-Mail, keine Kreditkarte erforderlich. Erstelle so viele Karten wie du willst für jedes Spiel.",
    faqQ2: "Welche Teams sind im Generator verfügbar?",
    faqA2: "Alle 48 qualifizierten Teams sind verfügbar, darunter USA, Mexiko, Kanada (Gastgeberländer) sowie Brasilien, Argentinien, Frankreich, Spanien, England, Marokko, Saudi-Arabien, Japan, Südkorea und alle anderen qualifizierten Nationen.",
    faqQ3: "Kann ich meine Tipp-Karte auf WhatsApp teilen?",
    faqA3: "Absolut. Deine Karte wird als 1080×1080 PNG-Bild heruntergeladen, das du sofort auf WhatsApp, Instagram, Twitter oder jeder anderen Plattform teilen kannst. Mit dem Teilen-Button kannst du direkt von deinem Handy senden.",
    faqQ4: "Funktioniert die Tipp-Karte auf Arabisch?",
    faqA4: "Ja. Wähle Arabisch im Sprachmenü und deine Karte wird auf Arabisch mit Rechts-nach-Links-Text angezeigt. Wir unterstützen Englisch, Arabisch, Portugiesisch, Spanisch, Französisch, Türkisch und Deutsch.",
    faqQ5: "Wie groß ist das Bild der Tipp-Karte?",
    faqA5: "Tipp-Karten werden als 1080×1080 Pixel PNG-Bilder heruntergeladen — das perfekte quadratische Format für Instagram-Posts und WhatsApp-Sharing. Die hohe Auflösung sorgt dafür, dass deine Karte auf jedem Bildschirm scharf aussieht.",
    footerTagline: "Kostenloser FIFA WM 2026 Tipp-Karten-Generator",
    footerCopyright: "© 2026 perdictioncard.com · Für Fußballfans weltweit · Nicht mit der FIFA verbunden",
  },
  tr: {
    subtitle: "Skoru tahmin et · Kartını indir · Arkadaşlarına meydan oku",
    step1: "Hangi maç?", step1sub: "İki takımı seç",
    step2: "Tahmin ettiğin skor nedir?", step2sub: "Final skorunu belirle",
    step3: "Karttaki adın", step3sub: "«[Ad] tarafından tahmin edildi» olarak görünür",
    step4: "Kart tasarımı", step4sub: "Stilini seç",
    step5: "Kart dili", step5sub: "Karttaki metin",
    generate: "Tahmin kartımı oluştur",
    howItWorks: "2026 Dünya Kupası Tahmin Kartın Nasıl Yapılır",
    about: "En iyi ücretsiz Dünya Kupası tahmin kartı oluşturucu",
    faq: "Sıkça Sorulan Sorular",
    team1: "Takım 1", team2: "Takım 2", namePlaceholder: "örn. Ahmed, Sarah, Carlos...",
    freeInstant: "Ücretsiz · Anında · WhatsApp ve Instagram'da paylaşılabilir",
    howStep1Title: "Maçını seç",
    howStep1Text: "2026 Dünya Kupası'ndan 48 takım arasında herhangi bir maçı seç — ABD vs Meksika, Brezilya vs Arjantin, Fransa vs Fas ve diğer tüm maçlar.",
    howStep2Title: "Tahmin ettiğin skoru gir",
    howStep2Text: "Tahmin ettiğin final skoru nedir? Her takım için gol sayısını belirlemek için + ve − düğmelerine dokun. Tahminın kart üzerinde canlı görünür.",
    howStep3Title: "Kart tasarımını seç",
    howStep3Text: "5 tema arasından seç: Gece Maçı, Ulusal Renkler, FIFA Altın, Retro Klasik veya Neon Işıklar. Her tasarım her ekranda muhteşem görünür.",
    howStep4Title: "İndir ve paylaş",
    howStep4Text: "Tahmin kartını yüksek kaliteli 1080×1080 PNG olarak indir. WhatsApp, Instagram Hikayeleri veya Twitter'da paylaş ve arkadaşlarına meydan oku.",
    aboutP1: "PerdictionCard.com, FIFA 2026 Dünya Kupası skor tahminlerinizi oluşturmanın ve paylaşmanın en hızlı yoludur. Temel metin tahminlerinin aksine, futbol tahmin kartlarımız WhatsApp gruplarında ve Instagram akışlarında öne çıkan güzelce tasarlanmış görsellerdir.",
    aboutP2: "2026 Dünya Kupası'nın 48 takımının tamamı mevcut olduğundan, turnuvanın her maçı için yeni bir tahmin kartı oluşturabilirsiniz. Her kart adınız, tahmin ettiğiniz skor, takım renkleri ve ulusal bayraklarla kişiselleştirilir.",
    aboutP3: "Dünya Kupası kart yapıcımız, Arapça (RTL), Portekizce, İspanyolca ve Fransızca dahil 7 dilde çalışır — dünya genelindeki futbol severler için mükemmel. Kayıt yok, uygulama indirme yok ve tamamen ücretsiz.",
    faqQ1: "2026 Dünya Kupası tahmin kartı oluşturucu ücretsiz mi?",
    faqA1: "Evet. 2026 Dünya Kupası tahmin kartınızı oluşturmak %100 ücretsizdir. Hesap, e-posta veya kredi kartı gerekmez. Her maç için istediğiniz kadar kart oluşturun.",
    faqQ2: "Oluşturucuda hangi takımlar mevcut?",
    faqA2: "Tüm 48 FIFA Dünya Kupası 2026 takımı mevcuttur; ABD, Meksika, Kanada (ev sahibi ülkeler) ve ayrıca Brezilya, Arjantin, Fransa, İspanya, İngiltere, Fas, Suudi Arabistan, Japonya, Güney Kore ve diğer tüm katılan uluslar dahildir.",
    faqQ3: "Tahmin kartımı WhatsApp'ta paylaşabilir miyim?",
    faqA3: "Kesinlikle. Tahmin kartınız 1080×1080 PNG görüntüsü olarak indirilir ve WhatsApp, Instagram, Twitter veya herhangi bir sosyal platformda anında paylaşabilirsiniz. Paylaş düğmesi, doğrudan telefonunuzdan göndermenizi sağlar.",
    faqQ4: "Tahmin kartı Arapça çalışıyor mu?",
    faqA4: "Evet. Dil menüsünden Arapçayı seçin; tahmin kartınız doğru sağdan sola metinle Arapça olarak görüntülenir. İngilizce, Arapça, Portekizce, İspanyolca, Fransızca, Türkçe ve Almancayı destekliyoruz.",
    faqQ5: "Tahmin kartı görüntüsünün boyutu nedir?",
    faqA5: "Tahmin kartları 1080×1080 piksel PNG görüntüsü olarak indirilir — Instagram kare gönderileri ve WhatsApp paylaşımı için mükemmel format. Yüksek çözünürlük, kartınızın her ekranda net görünmesini sağlar.",
    footerTagline: "Ücretsiz FIFA 2026 Dünya Kupası Tahmin Kartı Oluşturucu",
    footerCopyright: "© 2026 perdictioncard.com · Dünya genelindeki futbol severler için yapıldı · FIFA ile bağlantısı yoktur",
  },
};

function ScorePicker({
  value,
  onChange,
  hasError,
  flag,
  shortName,
  teamName,
}: {
  value: number;
  onChange: (v: number) => void;
  hasError: boolean;
  flag: string;
  shortName: string;
  teamName: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "6px",
        fontSize: "14px", color: "#4b5563", fontWeight: 600,
      }}>
        <span style={{ fontSize: "22px" }}>{flag}</span>
        <span>{shortName}</span>
      </div>
      <button
        type="button"
        aria-label={`Increase score for ${teamName}`}
        onClick={() => onChange(Math.min(9, value + 1))}
        style={{
          width: "48px", height: "48px",
          background: "linear-gradient(135deg, #15803d, #16a34a)",
          border: "none",
          borderRadius: "10px",
          color: "#fff",
          fontSize: "24px",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Oswald', sans-serif",
          fontWeight: 700,
          boxShadow: "0 3px 10px rgba(22,163,74,0.35)",
        }}
      >+</button>
      <div style={{
        width: "88px", height: "88px",
        background: "#fff",
        border: hasError ? "2px solid #dc2626" : "2.5px solid #16a34a",
        borderRadius: "14px",
        color: "#0f172a",
        fontSize: "52px",
        fontFamily: "'Oswald', sans-serif",
        fontWeight: 900,
        textAlign: "center",
        lineHeight: "88px",
        boxShadow: "0 4px 16px rgba(22,163,74,0.15)",
      }}>{value}</div>
      <button
        type="button"
        aria-label={`Decrease score for ${teamName}`}
        onClick={() => onChange(Math.max(0, value - 1))}
        style={{
          width: "48px", height: "48px",
          background: "#f1f5f9",
          border: "1.5px solid #e2e8f0",
          borderRadius: "10px",
          color: "#64748b",
          fontSize: "24px",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Oswald', sans-serif",
          fontWeight: 700,
        }}
      >−</button>
    </div>
  );
}

export default function FormPage({ formState, setFormState, onGenerate, challengerName, cardCount }: FormPageProps) {
  const { team1, team2, score1, score2, name, theme, language } = formState;
  const ui = UI_TEXT[language];
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"predict" | "schedule">("predict");
  const [loadedMatch, setLoadedMatch] = useState<{ team1: string; team2: string; team1Flag: string; team2Flag: string } | null>(null);
  const todayMatches = getTodaysMatches().slice(0, 3);

  const t1 = getTeam(team1);
  const t2 = getTeam(team2);

  const set = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (field === "team1" || field === "team2") {
      const a = field === "team1" ? (value as string) : formState.team1;
      const b = field === "team2" ? (value as string) : formState.team2;
      if (a && b && a === b) {
        setErrors((e) => ({ ...e, team2: "Teams must be different" }));
      } else {
        setErrors((e) => { const copy = { ...e }; delete copy.team2; return copy; });
      }
    }
  };

  const handleSubmit = () => {
    const errs: Record<string, string> = {};
    if (!team1) errs.team1 = "Please select Team 1";
    if (!team2) errs.team2 = "Please select Team 2";
    if (team1 && team2 && team1 === team2) errs.team2 = "Teams must be different";
    if (!name.trim()) errs.name = "Please enter your name";
    if (name.length > 20) errs.name = "Name must be 20 characters or less";
    if (score1 < 0 || score1 > 9) errs.score1 = "Score must be 0–9";
    if (score2 < 0 || score2 > 9) errs.score2 = "Score must be 0–9";
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      document.getElementById(Object.keys(errs)[0])?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    onGenerate();
  };

  const prefillMatch = (m: Match) => {
    setFormState((prev) => ({ ...prev, team1: m.team1, team2: m.team2 }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const card: React.CSSProperties = {
    background: "#fff",
    borderRadius: "20px",
    padding: "28px 24px",
    marginBottom: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
    border: "1px solid rgba(0,0,0,0.06)",
  };

  const stepBadge = (n: string): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "26px", height: "26px",
    background: "linear-gradient(135deg, #15803d, #22c55e)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: 800,
    marginRight: "10px",
    flexShrink: 0,
    fontFamily: "'Oswald', sans-serif",
    letterSpacing: "0",
  });

  const errorMsg: React.CSSProperties = { color: "#dc2626", fontSize: "12px", marginTop: "5px", fontWeight: 500 };

  const selectStyle = (hasError?: boolean): React.CSSProperties => ({
    width: "100%",
    background: "#f8fafc",
    border: hasError ? "2px solid #dc2626" : "1.5px solid #e2e8f0",
    borderRadius: "12px",
    padding: "14px 14px",
    color: "#0f172a",
    fontSize: "15px",
    fontFamily: "'Poppins', sans-serif",
    cursor: "pointer",
    outline: "none",
    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.04)",
    appearance: "auto",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "#0f172a", fontFamily: "'Poppins', sans-serif" }}>

      {/* ══ HERO HEADER ══ */}
      <header style={{
        background: "linear-gradient(160deg, #061220 0%, #0a1f14 55%, #061220 100%)",
        padding: "0",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative: pitch arc lines */}
        <div style={{
          position: "absolute", bottom: "-320px", left: "50%",
          transform: "translateX(-50%)",
          width: "1000px", height: "1000px",
          border: "1px solid rgba(34,197,94,0.08)",
          borderRadius: "50%",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-180px", left: "50%",
          transform: "translateX(-50%)",
          width: "600px", height: "600px",
          border: "1px solid rgba(34,197,94,0.06)",
          borderRadius: "50%",
          pointerEvents: "none",
        }} />
        {/* Decorative: green spotlight */}
        <div style={{
          position: "absolute", top: 0, left: "50%",
          transform: "translateX(-50%)",
          width: "700px", height: "400px",
          background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34,197,94,0.15) 0%, transparent 100%)",
          pointerEvents: "none",
        }} />
        {/* Top gold accent bar */}
        <div style={{
          width: "100%", height: "3px",
          background: "linear-gradient(90deg, transparent, #d4af37 30%, #f5e17a 50%, #d4af37 70%, transparent)",
        }} />

        <div style={{ padding: "40px 20px 44px", position: "relative" }}>

          {/* Tournament badge — bigger, bolder */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            background: "linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(245,225,122,0.10) 100%)",
            border: "1.5px solid rgba(212,175,55,0.55)",
            borderRadius: "40px",
            padding: "9px 22px",
            marginBottom: "24px",
            boxShadow: "0 0 24px rgba(212,175,55,0.18), inset 0 1px 0 rgba(255,255,255,0.10)",
          }}>
            <span style={{ fontSize: "20px", lineHeight: 1 }}>🏆</span>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1px" }}>
              <span style={{
                fontSize: "13px", color: "#f5e17a", fontWeight: 800,
                letterSpacing: "3px", textTransform: "uppercase" as const,
                fontFamily: "'Oswald', sans-serif", lineHeight: 1,
              }}>FIFA WORLD CUP 2026</span>
              <span style={{
                fontSize: "10px", color: "rgba(212,175,55,0.65)", fontWeight: 600,
                letterSpacing: "4px", textTransform: "uppercase" as const,
                fontFamily: "'Poppins', sans-serif", lineHeight: 1,
              }}>MATCH PREDICTION</span>
            </div>
          </div>

          {/* Logo — larger, more impact */}
          <div style={{ marginBottom: "12px", lineHeight: 1 }}>
            <div style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: "clamp(52px, 12vw, 72px)",
              fontWeight: 900,
              letterSpacing: "1px",
              color: "#fff",
              lineHeight: 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
            }}>
              {/* HD Football SVG */}
              <svg
                viewBox="0 0 120 120"
                style={{ width: "clamp(60px,11vw,76px)", height: "clamp(60px,11vw,76px)", flexShrink: 0, filter: "drop-shadow(0 6px 20px rgba(0,0,0,0.7)) drop-shadow(0 2px 6px rgba(0,0,0,0.5))" }}
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Main sphere — light from top-left */}
                  <radialGradient id="hd_ball" cx="36%" cy="28%" r="70%" gradientUnits="objectBoundingBox">
                    <stop offset="0%"   stopColor="#ffffff" />
                    <stop offset="20%"  stopColor="#f0f0f0" />
                    <stop offset="55%"  stopColor="#d0d0d0" />
                    <stop offset="80%"  stopColor="#a0a0a0" />
                    <stop offset="100%" stopColor="#606060" />
                  </radialGradient>
                  {/* Edge vignette */}
                  <radialGradient id="hd_vignette" cx="50%" cy="50%" r="50%">
                    <stop offset="55%" stopColor="rgba(0,0,0,0)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
                  </radialGradient>
                  {/* Primary specular */}
                  <radialGradient id="hd_spec1" cx="40%" cy="30%" r="50%">
                    <stop offset="0%"   stopColor="rgba(255,255,255,0.90)" />
                    <stop offset="50%"  stopColor="rgba(255,255,255,0.30)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </radialGradient>
                  {/* Secondary tiny specular */}
                  <radialGradient id="hd_spec2" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="rgba(255,255,255,0.70)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </radialGradient>
                  {/* Pentagon shading — darker in shadow zones */}
                  <radialGradient id="hd_patch" cx="36%" cy="28%" r="70%">
                    <stop offset="0%"   stopColor="#2a2a2a" />
                    <stop offset="60%"  stopColor="#111111" />
                    <stop offset="100%" stopColor="#080808" />
                  </radialGradient>
                  <clipPath id="hd_clip">
                    <circle cx="60" cy="60" r="56" />
                  </clipPath>
                </defs>

                {/* Drop shadow circle */}
                <ellipse cx="62" cy="116" rx="38" ry="6" fill="rgba(0,0,0,0.35)" />

                {/* Base sphere */}
                <circle cx="60" cy="60" r="56" fill="url(#hd_ball)" />

                {/* Black pentagon patches — classic Telstar layout */}
                <g clipPath="url(#hd_clip)" fill="url(#hd_patch)" stroke="#0a0a0a" strokeWidth="0.5" strokeLinejoin="round">
                  {/* Top center */}
                  <polygon points="60,8 71,17 67,30 53,30 49,17" />
                  {/* Top-left */}
                  <polygon points="30,22 43,18 49,30 41,41 27,37" />
                  {/* Top-right */}
                  <polygon points="90,22 77,18 71,30 79,41 93,37" />
                  {/* Mid-left */}
                  <polygon points="13,55 24,47 37,52 35,66 20,70" />
                  {/* Mid-right */}
                  <polygon points="107,55 96,47 83,52 85,66 100,70" />
                  {/* Bot-left */}
                  <polygon points="23,86 22,71 35,66 44,75 38,88" />
                  {/* Bot-right */}
                  <polygon points="97,86 98,71 85,66 76,75 82,88" />
                  {/* Bottom center */}
                  <polygon points="60,110 49,101 53,88 67,88 71,101" />
                </g>

                {/* Edge vignette for depth */}
                <circle cx="60" cy="60" r="56" fill="url(#hd_vignette)" />

                {/* Primary specular highlight */}
                <ellipse cx="44" cy="38" rx="19" ry="13"
                  fill="url(#hd_spec1)"
                  transform="rotate(-30 44 38)"
                />
                {/* Small bright hotspot */}
                <ellipse cx="40" cy="32" rx="7" ry="4.5"
                  fill="url(#hd_spec2)"
                  transform="rotate(-20 40 32)"
                />
              </svg>

              <span>
                <span style={{
                  background: "linear-gradient(135deg, #22c55e 0%, #4ade80 50%, #86efac 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 20px rgba(34,197,94,0.4))",
                }}>Perd</span><span style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>ictionCard</span>
              </span>
            </div>
          </div>

          <div style={{
            fontSize: "17px",
            color: "rgba(255,255,255,0.70)",
            marginBottom: "32px",
            letterSpacing: "0.3px",
            fontFamily: "'Poppins', sans-serif",
          }}>{ui.subtitle}</div>

          {/* Stats row — larger values */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap" as const,
          }}>
            {[
              { icon: "🃏", val: (cardCount + 47293).toLocaleString(), label: ui.cardsMade ?? "cards made" },
              { icon: "🌍", val: "32", label: ui.nations ?? "nations" },
              { icon: "🎨", val: "5", label: ui.cardStyles ?? "card styles" },
            ].map((s) => (
              <div key={s.label} style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: "16px",
                padding: "12px 20px",
                display: "flex", alignItems: "center", gap: "10px",
                backdropFilter: "blur(4px)",
              }}>
                <span style={{ fontSize: "18px" }}>{s.icon}</span>
                <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: "24px", fontWeight: 700, color: "#fff" }}>{s.val}</span>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.50)" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom green bar — slightly thicker */}
        <div style={{ height: "5px", background: "linear-gradient(90deg, #15803d, #22c55e, #86efac, #22c55e, #15803d)" }} />
      </header>

      {/* ── TAB BAR ── */}
      <div style={{
        background: "#0d0d1f",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex" }}>
          {(["predict", "schedule"] as const).map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, padding: "14px 0",
                  background: "none", border: "none",
                  borderBottom: active ? "3px solid #22c55e" : "3px solid transparent",
                  color: active ? "#22c55e" : "rgba(255,255,255,0.50)",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "14px", fontWeight: 600,
                  cursor: "pointer", transition: "color 0.2s, border-color 0.2s",
                  letterSpacing: "0.3px",
                }}
              >
                {tab === "predict" ? "⚽ Make Prediction" : "📅 Schedule"}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "schedule" ? (
        <SchedulePage language={language} onPredict={(m: ScheduleMatch) => {
          set("team1", m.team1);
          set("team2", m.team2);
          setLoadedMatch({ team1: m.team1, team2: m.team2, team1Flag: m.team1Flag, team2Flag: m.team2Flag });
          setActiveTab("predict");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }} />
      ) : (
        <>

      {/* Challenge banner */}
      {challengerName && (
        <div style={{
          background: "linear-gradient(135deg, #92400e 0%, #d97706 100%)",
          padding: "14px 20px",
          textAlign: "center",
          fontSize: "15px",
          fontWeight: 600,
          color: "#fff",
          borderBottom: "3px solid #f59e0b",
        }}>
          🏆 <strong>{challengerName}</strong> challenged you to predict this match!
        </div>
      )}

      <main role="main" style={{ maxWidth: "600px", margin: "0 auto", padding: "28px 16px 64px" }}>

        {/* Loaded match banner */}
        {loadedMatch && (
          <div style={{
            background: "rgba(34,197,94,0.10)",
            border: "1px solid rgba(34,197,94,0.25)",
            borderRadius: "14px",
            padding: "13px 18px",
            marginBottom: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
            <span style={{ fontSize: "20px" }}>⚽</span>
            <div style={{ flex: 1, fontSize: "13px", color: "#86efac", fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>
              Match loaded: {loadedMatch.team1Flag} {loadedMatch.team1} vs {loadedMatch.team2Flag} {loadedMatch.team2} — enter your prediction!
            </div>
            <button
              type="button"
              onClick={() => setLoadedMatch(null)}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.40)", fontSize: "20px", cursor: "pointer", padding: "0 4px", lineHeight: 1 }}
            >✕</button>
          </div>
        )}

        {/* ── STEP 1: Match ── */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "18px" }}>
            <span style={stepBadge("1")}>1</span>
            <div>
              <div style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a" }}>{ui.step1}</div>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "1px" }}>{ui.step1sub}</div>
            </div>
          </div>

          {/* Today's quick-pick matches */}
          {todayMatches.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "11px", color: "#9ca3af", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px", fontWeight: 700 }}>Today's matches — tap to prefill</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {todayMatches.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    aria-label={`Predict ${m.team1} vs ${m.team2}`}
                    onClick={() => prefillMatch(m)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      background: "#f8fafc", border: "1.5px solid #e2e8f0",
                      borderRadius: "10px", padding: "11px 14px",
                      cursor: "pointer", color: "#0f172a",
                      fontFamily: "'Poppins', sans-serif", fontSize: "13px", fontWeight: 500,
                      textAlign: "left",
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.borderColor = "#22c55e"; e.currentTarget.style.background = "#f0fdf4"; }}
                    onMouseOut={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}
                  >
                    <span>{getTeam(m.team1)?.flag} {m.team1} <span style={{ color: "#9ca3af" }}>vs</span> {getTeam(m.team2)?.flag} {m.team2}</span>
                    <span style={{ fontSize: "11px", color: "#9ca3af", background: "#e5e7eb", borderRadius: "6px", padding: "2px 8px", whiteSpace: "nowrap" }}>{m.time}</span>
                  </button>
                ))}
              </div>
              <div style={{ textAlign: "center", fontSize: "12px", color: "#cbd5e1", margin: "14px 0 8px", letterSpacing: "2px" }}>── OR PICK MANUALLY ──</div>
            </div>
          )}

          {/* Team selectors */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "10px", alignItems: "start" }}>
            <div>
              {t1 && (
                <div style={{ textAlign: "center", marginBottom: "6px" }}>
                  <img src={`https://flagcdn.com/w80/${t1.code}.png`} alt={t1.name} style={{ height: "32px", width: "auto", borderRadius: "3px", border: "1px solid rgba(255,255,255,0.15)" }} />
                </div>
              )}
              <select
                id="team1"
                value={team1}
                onChange={(e) => set("team1", e.target.value)}
                style={selectStyle(!!errors.team1)}
                title="Select Team 1 for your World Cup prediction"
                aria-label="Select Team 1"
              >
                <option value="">{ui.team1}</option>
                {teams.map((t) => <option key={t.name} value={t.name}>{t.flag} {t.name}</option>)}
              </select>
              {errors.team1 && <div style={errorMsg}>{errors.team1}</div>}
            </div>

            <div style={{
              fontFamily: "'Oswald', sans-serif", fontWeight: 900,
              fontSize: "13px", color: "#fff",
              background: "linear-gradient(135deg, #15803d, #16a34a)",
              borderRadius: "10px", padding: "14px 10px",
              marginTop: t1 ? "38px" : "0",
              letterSpacing: "2px",
              boxShadow: "0 3px 10px rgba(22,163,74,0.30)",
            }}>VS</div>

            <div>
              {t2 && (
                <div style={{ textAlign: "center", marginBottom: "6px" }}>
                  <img src={`https://flagcdn.com/w80/${t2.code}.png`} alt={t2.name} style={{ height: "32px", width: "auto", borderRadius: "3px", border: "1px solid rgba(255,255,255,0.15)" }} />
                </div>
              )}
              <select
                id="team2"
                value={team2}
                onChange={(e) => set("team2", e.target.value)}
                style={selectStyle(!!errors.team2)}
                title="Select Team 2 for your World Cup prediction"
                aria-label="Select Team 2"
              >
                <option value="">{ui.team2}</option>
                {teams.map((t) => <option key={t.name} value={t.name}>{t.flag} {t.name}</option>)}
              </select>
              {errors.team2 && <div style={errorMsg}>{errors.team2}</div>}
            </div>
          </div>
        </div>

        {/* ── STEP 2: Score ── */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            <span style={stepBadge("2")}>2</span>
            <div>
              <div style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a" }}>{ui.step2}</div>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "1px" }}>{ui.step2sub}</div>
            </div>
          </div>

          {/* Scoreboard */}
          <div style={{
            background: "linear-gradient(135deg, #0a1628 0%, #0f2040 100%)",
            borderRadius: "16px",
            padding: "24px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          }}>
            <ScorePicker
              value={score1}
              onChange={(v) => set("score1", v)}
              hasError={!!errors.score1}
              flag={t1?.flag ?? "🏳"}
              shortName={t1?.shortName ?? (team1 || "Team 1")}
              teamName={team1 || "Team 1"}
            />
            <div style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: "56px", color: "rgba(255,255,255,0.2)",
              fontWeight: 300, lineHeight: 1, paddingBottom: "50px",
            }}>:</div>
            <ScorePicker
              value={score2}
              onChange={(v) => set("score2", v)}
              hasError={!!errors.score2}
              flag={t2?.flag ?? "🏳"}
              shortName={t2?.shortName ?? (team2 || "Team 2")}
              teamName={team2 || "Team 2"}
            />
          </div>
        </div>

        {/* ── STEP 3: Name ── */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "18px" }}>
            <span style={stepBadge("3")}>3</span>
            <div>
              <div style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a" }}>{ui.step3}</div>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "1px" }}>{ui.step3sub}</div>
            </div>
          </div>
          <input
            id="name"
            type="text"
            value={name}
            maxLength={20}
            placeholder={ui.namePlaceholder}
            onChange={(e) => set("name", e.target.value)}
            style={{
              width: "100%",
              background: "#f8fafc",
              border: errors.name ? "2px solid #dc2626" : "1.5px solid #e2e8f0",
              borderRadius: "12px",
              padding: "16px",
              color: "#0f172a",
              fontSize: "16px",
              fontFamily: "'Poppins', sans-serif",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
            {errors.name ? <div style={errorMsg}>{errors.name}</div> : <span />}
            <div style={{ fontSize: "12px", color: name.length >= 18 ? "#dc2626" : "#9ca3af" }}>{name.length}/20</div>
          </div>
        </div>

        {/* ── STEP 4: Theme ── */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "18px" }}>
            <span style={stepBadge("4")}>4</span>
            <div>
              <div style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a" }}>{ui.step4}</div>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "1px" }}>{ui.step4sub}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {THEMES.map((t) => {
              const selected = theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-label={`Select ${t.label} card theme`}
                  aria-pressed={selected}
                  onClick={() => set("theme", t.id)}
                  style={{
                    flex: 1,
                    padding: "0",
                    background: "none",
                    border: selected ? `2.5px solid ${t.accent === "#ffffff" ? "#22c55e" : t.accent}` : "2px solid #e2e8f0",
                    borderRadius: "14px",
                    cursor: "pointer",
                    overflow: "hidden",
                    boxShadow: selected ? `0 0 0 3px ${t.accent === "#ffffff" ? "rgba(34,197,94,0.2)" : t.accent + "33"}` : "none",
                    transition: "all 0.2s",
                  }}
                >
                  {/* Color preview bar */}
                  <div style={{
                    height: "64px",
                    background: t.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "26px",
                    position: "relative",
                    overflow: "hidden",
                  }}>
                    {/* Accent dot */}
                    <div style={{
                      position: "absolute", top: "8px", right: "8px",
                      width: "8px", height: "8px",
                      borderRadius: "50%",
                      background: t.accent,
                      boxShadow: `0 0 6px ${t.accent}`,
                    }} />
                    {t.preview}
                  </div>
                  {/* Label */}
                  <div style={{
                    padding: "10px 8px 12px",
                    background: selected ? "#f0fdf4" : "#fafafa",
                  }}>
                    <div style={{
                      fontSize: "12px", fontWeight: 700,
                      color: selected ? "#15803d" : "#374151",
                      marginBottom: "2px",
                      fontFamily: "'Oswald', sans-serif",
                      letterSpacing: "0.5px",
                    }}>{t.label}</div>
                    <div style={{ fontSize: "10px", color: "#9ca3af" }}>{t.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── STEP 5: Language ── */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "18px" }}>
            <span style={stepBadge("5")}>5</span>
            <div>
              <div style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a" }}>{ui.step5}</div>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "1px" }}>{ui.step5sub}</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
            {LANGUAGES.map((l) => {
              const sel = language === l.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  aria-label={`Set card language to ${l.label}`}
                  aria-pressed={sel}
                  onClick={() => set("language", l.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "12px 14px",
                    background: sel ? "#f0fdf4" : "#f8fafc",
                    border: sel ? "2px solid #16a34a" : "1.5px solid #e2e8f0",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "13px",
                    fontWeight: sel ? 700 : 500,
                    color: sel ? "#15803d" : "#374151",
                    textAlign: "left",
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: "20px" }}>{l.flag}</span>
                  <span>{l.label}</span>
                  {sel && <span style={{ marginLeft: "auto", fontSize: "14px" }}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── GENERATE BUTTON ── */}
        <button
          type="button"
          aria-label="Generate World Cup prediction card"
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "22px",
            background: "linear-gradient(135deg, #14532d 0%, #15803d 40%, #16a34a 100%)",
            border: "none",
            borderRadius: "16px",
            color: "#fff",
            fontSize: "20px",
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 800,
            letterSpacing: "3px",
            cursor: "pointer",
            textTransform: "uppercase",
            boxShadow: "0 8px 32px rgba(22,163,74,0.45), 0 2px 0 rgba(255,255,255,0.1) inset",
            transition: "transform 0.15s, box-shadow 0.15s",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 40px rgba(22,163,74,0.55), 0 2px 0 rgba(255,255,255,0.1) inset";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(22,163,74,0.45), 0 2px 0 rgba(255,255,255,0.1) inset";
          }}
        >
          ⚽ &nbsp;{ui.generate}
        </button>

        <div style={{ textAlign: "center", fontSize: "12px", color: "#9ca3af", marginTop: "10px" }}>
          {ui.freeInstant}
        </div>

        {/* ── HOW IT WORKS ── */}
        <section
          aria-label="How to create your World Cup 2026 prediction card"
          style={{ marginTop: "64px", borderTop: "1px solid #e5e7eb", paddingTop: "48px" }}
        >
          <h2 style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "22px", fontWeight: 700,
            color: "rgba(255,255,255,0.90)", marginBottom: "24px", letterSpacing: "1px",
          }}>{ui.howItWorks}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { n: "1", title: ui.howStep1Title, text: ui.howStep1Text },
              { n: "2", title: ui.howStep2Title, text: ui.howStep2Text },
              { n: "3", title: ui.howStep3Title, text: ui.howStep3Text },
              { n: "4", title: ui.howStep4Title, text: ui.howStep4Text },
            ].map((step) => (
              <div key={step.n} style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "20px 18px",
                border: "1px solid #e5e7eb",
              }}>
                <h3 style={{
                  fontFamily: "'Oswald', sans-serif", fontSize: "15px", fontWeight: 700,
                  color: "#15803d", marginBottom: "8px", letterSpacing: "0.5px",
                }}>{step.n}. {step.title}</h3>
                <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.6, margin: 0 }}>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section
          aria-label="About PredictionCard"
          style={{ marginTop: "48px" }}
        >
          <h2 style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "22px", fontWeight: 700,
            color: "rgba(255,255,255,0.90)", marginBottom: "16px", letterSpacing: "1px",
          }}>{ui.about}</h2>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #e5e7eb" }}>
            <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: 1.7, marginBottom: "14px" }}>{ui.aboutP1}</p>
            <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: 1.7, marginBottom: "14px" }}>{ui.aboutP2}</p>
            <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: 1.7, margin: 0 }}>{ui.aboutP3}</p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section
          aria-label="Frequently Asked Questions about PredictionCard"
          style={{ marginTop: "48px" }}
        >
          <h2 style={{
            fontFamily: "'Oswald', sans-serif", fontSize: "22px", fontWeight: 700,
            color: "rgba(255,255,255,0.90)", marginBottom: "20px", letterSpacing: "1px",
          }}>{ui.faq}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { q: ui.faqQ1, a: ui.faqA1 },
              { q: ui.faqQ2, a: ui.faqA2 },
              { q: ui.faqQ3, a: ui.faqA3 },
              { q: ui.faqQ4, a: ui.faqA4 },
              { q: ui.faqQ5, a: ui.faqA5 },
            ].map((faq) => (
              <div
                key={faq.q}
                style={{ background: "#fff", borderRadius: "14px", padding: "20px", border: "1px solid #e5e7eb" }}
              >
                <h3
                  style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}
                >{faq.q}</h3>
                <div>
                  <p
                    style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.6, margin: 0 }}
                  >{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer
          role="contentinfo"
          style={{ marginTop: "60px", borderTop: "1px solid #e5e7eb", paddingTop: "32px", paddingBottom: "16px" }}
        >
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "22px", fontWeight: 700, color: "#15803d", marginBottom: "6px" }}>
              ⚽ PerdictionCard
            </div>
            <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0 0 12px" }}>
              {ui.footerTagline}
            </p>
          </div>
          <nav aria-label="Language links" style={{ textAlign: "center", marginBottom: "16px", fontSize: "13px" }}>
            <a href="/" style={{ color: "#6b7280", textDecoration: "none", margin: "0 6px" }}>English</a> ·
            <a href="/ar/" style={{ color: "#6b7280", textDecoration: "none", margin: "0 6px" }}>العربية</a> ·
            <a href="/pt/" style={{ color: "#6b7280", textDecoration: "none", margin: "0 6px" }}>Português</a> ·
            <a href="/es/" style={{ color: "#6b7280", textDecoration: "none", margin: "0 6px" }}>Español</a> ·
            <a href="/fr/" style={{ color: "#6b7280", textDecoration: "none", margin: "0 6px" }}>Français</a>
          </nav>
          <p style={{ textAlign: "center", fontSize: "11px", color: "#d1d5db", margin: 0 }}>
            {ui.footerCopyright}
          </p>
        </footer>
      </main>

      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        select option { background: #fff; color: #0f172a; }
        select:focus { border-color: #16a34a !important; box-shadow: 0 0 0 3px rgba(22,163,74,0.15) !important; outline: none; }
        input:focus { border-color: #16a34a !important; box-shadow: 0 0 0 3px rgba(22,163,74,0.15) !important; outline: none; }
        button:active { transform: scale(0.98) !important; }
      `}</style>
        </>
      )}
    </div>
  );
}
