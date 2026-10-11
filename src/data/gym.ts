// =============================================================================
//  ALFARERO BODY GYM — CONFIGURACIÓN CENTRAL DEL NEGOCIO
// -----------------------------------------------------------------------------
//  Edita SOLO este archivo para cambiar el contenido del sitio.
//  Los valores marcados como "provisional" son de ejemplo y deben reemplazarse
//  por la información real del gimnasio antes de publicar.
// =============================================================================

export type NavLink = {
  label: string;
  href: string;
};

export type GalleryImage = {
  src: string;
  alt: string;
  caption?: string;
  /** "wide" ocupa dos columnas en pantallas grandes, "tall" dos filas. */
  span?: "wide" | "tall" | "normal";
};

export type TeamMember = {
  name: string;
  role: string;
  specialty: string;
  description: string;
  image: string;
};

export type ScheduleDay = {
  day: string;
  /** Formato 24h "HH:MM". Usa null si el día está cerrado. */
  open: string | null;
  close: string | null;
  closed: boolean;
};

export type SocialIcon =
  | "facebook"
  | "instagram"
  | "tiktok"
  | "whatsapp"
  | "youtube";

export type SocialLink = {
  label: string;
  href: string;
  icon: SocialIcon;
};

export const gym = {
  // ---------------------------------------------------------------------------
  // Identidad
  // ---------------------------------------------------------------------------
  name: "Alfarero Body Gym",
  shortName: "Alfarero",
  tagline: "Transforma tu cuerpo. Fortalece tu mente.",
  description:
    "Gimnasio de musculación, fuerza y entrenamiento funcional. Un espacio para entrenar con disciplina, acompañamiento y una comunidad que te impulsa.",
  city: "Nicaragua",
  siteUrl: "https://alfarerobodygym.com",
  logo: "/images/logo.png",

  // ---------------------------------------------------------------------------
  // Navegación
  // ---------------------------------------------------------------------------
  nav: [
    { label: "Inicio", href: "#inicio" },
    { label: "Nosotros", href: "#nosotros" },
    { label: "Instalaciones", href: "#instalaciones" },
    { label: "Nuestro equipo", href: "#equipo" },
    { label: "Horarios", href: "#horarios" },
    { label: "Ubicación", href: "#ubicacion" },
    { label: "Contacto", href: "#contacto" },
  ] as NavLink[],

  // ---------------------------------------------------------------------------
  // Portada (Hero)
  // ---------------------------------------------------------------------------
  hero: {
    image: "/images/hero.jpg",
    imageAlt:
      "Atleta de Alfarero Body Gym realizando una sentadilla con barra durante una competencia de powerlifting.",
    eyebrow: "Fuerza · Disciplina · Comunidad",
    title: "Alfarero Body Gym",
    description:
      "Un gimnasio donde el esfuerzo se convierte en resultados. Entrena con equipo de calidad, guía profesional y una comunidad que te acompaña en cada repetición.",
    primaryCta: { label: "Conoce nuestras instalaciones", href: "#instalaciones" },
    secondaryCta: { label: "Contáctanos", href: "#contacto" },
    stats: [
      { value: "+20", label: "Máquinas y estaciones" },
      { value: "6", label: "Días por semana" },
      { value: "100%", label: "Energía y disciplina" },
    ],
  },

  // ---------------------------------------------------------------------------
  // Sobre nosotros
  // ---------------------------------------------------------------------------
  about: {
    image: "/images/gallery/comunidad-gimnasio.jpg",
    imageAlt:
      "Grupo de miembros de Alfarero Body Gym reunidos dentro del gimnasio frente al mural de la marca.",
    eyebrow: "Sobre nosotros",
    title: "Un gimnasio, una comunidad",
    paragraphs: [
      "Alfarero Body Gym nace del deseo de crear un espacio donde cualquier persona —sin importar su nivel— pueda entrenar con confianza, aprender la técnica correcta y avanzar hacia sus metas.",
      "Nuestras instalaciones combinan áreas de pesas, musculación, cardio y entrenamiento funcional. Más que máquinas, ofrecemos un ambiente motivador donde la disciplina y el respeto son parte del día a día.",
    ],
    philosophyTitle: "Filosofía de entrenamiento",
    philosophy:
      "Creemos en el progreso constante: técnica antes que carga, constancia antes que prisa. Cada rutina se adapta al punto de partida de cada persona para construir resultados reales y sostenibles.",
    valuesTitle: "Nuestros valores",
    values: [
      {
        title: "Disciplina",
        description:
          "El hábito diario es la base de todo resultado. Te acompañamos a mantenerlo.",
      },
      {
        title: "Respeto",
        description:
          "Un ambiente sano donde cada persona entrena a su ritmo y se siente bienvenida.",
      },
      {
        title: "Comunidad",
        description:
          "Aquí nadie entrena solo: celebramos cada logro, grande o pequeño.",
      },
      {
        title: "Superación",
        description:
          "Buscamos ser un poco mejores cada semana, dentro y fuera del gimnasio.",
      },
    ],
    benefitsTitle: "¿Por qué entrenar con nosotros?",
    benefits: [
      "Áreas dedicadas para fuerza, musculación, cardio y funcional.",
      "Equipamiento en buen estado y espacios ordenados.",
      "Asesoría y acompañamiento para entrenar con buena técnica.",
      "Ambiente motivador y comunidad que impulsa tus metas.",
    ],
  },

  // ---------------------------------------------------------------------------
  // Misión y visión
  // ---------------------------------------------------------------------------
  missionVision: {
    mission: {
      title: "Nuestra misión",
      description:
        "Brindar un espacio de entrenamiento seguro, motivador y accesible que ayude a las personas a mejorar su salud, su condición física y su confianza a través de la disciplina y el ejercicio.",
    },
    vision: {
      title: "Nuestra visión",
      description:
        "Ser un referente local en bienestar y entrenamiento, reconocido por la calidad de su ambiente, el acompañamiento a sus miembros y el impacto positivo en su comunidad.",
    },
  },

  // ---------------------------------------------------------------------------
  // Instalaciones / galería
  // ---------------------------------------------------------------------------
  gallery: {
    eyebrow: "Instalaciones",
    title: "Nuestros espacios",
    description:
      "Un recorrido visual por nuestras áreas de entrenamiento y por la comunidad que las hace vivir. Toca cualquier imagen para ampliarla.",
    images: [
      {
        src: "/images/gallery/fuerza-sentadilla.jpg",
        alt: "Atleta realizando una sentadilla con barra en el área de fuerza.",
        caption: "Área de fuerza",
        span: "wide",
      },
      {
        src: "/images/gallery/levantamiento.jpg",
        alt: "Miembro del gimnasio preparándose para un levantamiento de peso muerto.",
        caption: "Entrenamiento con barra",
        span: "tall",
      },
      {
        src: "/images/gallery/competencia-grupo.jpg",
        alt: "Equipo de Alfarero Body Gym posando en una competencia deportiva.",
        caption: "Competencias",
      },
      {
        src: "/images/gallery/comunidad-gimnasio.jpg",
        alt: "Comunidad de Alfarero Body Gym reunida dentro de las instalaciones.",
        caption: "Comunidad",
        span: "wide",
      },
      {
        src: "/images/gallery/indumentaria.jpg",
        alt: "Camisetas con el logotipo de Alfarero Body Gym en color naranja y negro.",
        caption: "Indumentaria oficial",
      },
      {
        src: "/images/gallery/entrenadores.jpg",
        alt: "Miembros del equipo de Alfarero Body Gym.",
        caption: "Nuestro equipo",
      },
    ] as GalleryImage[],
  },

  // ---------------------------------------------------------------------------
  // Equipo (PERFILES DE EJEMPLO — provisionales)
  // ---------------------------------------------------------------------------
  team: {
    eyebrow: "Nuestro equipo",
    title: "Quienes te acompañan",
    // Estos perfiles son de EJEMPLO. Reemplaza nombres, cargos y textos por los
    // datos reales del equipo del gimnasio.
    // note: "Los perfiles mostrados son de ejemplo y se encuentran en revisión.",
    members: [
  {
    name: "Elving",
    role: "Entrenador personal",
    specialty:
      "Hipertrofia y planificación de rutinas, acondicionamiento y movilidad, preparación física y competencia",
    description:
      "Entrenador enfocado en el desarrollo muscular, la planificación de rutinas personalizadas, el acondicionamiento físico, la movilidad y la preparación para competencias deportivas.",
    image: "/images/team/perfil-3.jpg",
  },
] as TeamMember[],
  },

  // ---------------------------------------------------------------------------
  // Horarios (PROVISIONALES)
  // ---------------------------------------------------------------------------
  schedule: {
    eyebrow: "Horarios",
    title: "Horario de atención",
    timeZone: "America/Managua",
    // Cambia a false cuando confirmes los horarios reales del gimnasio.
    provisional: false,
    // Cuando sea true (y "provisional" sea false) se mostrará el estado
    // "Abierto ahora / Cerrado" calculado con la hora local configurada.
    openStatusEnabled: false,
    days: [
      { day: "Lunes a viernes", open: "05:00", close: "21:00", closed: false },
      { day: "Sábado", open: "05:00", close: "18:00", closed: false },
      { day: "Domingo", open: null, close: null, closed: true },
    ] as ScheduleDay[],
  },

  // ---------------------------------------------------------------------------
  // Ubicación (PROVISIONAL — no se inventan coordenadas)
  // ---------------------------------------------------------------------------
 location: {
  eyebrow: "Ubicación",
  title: "Encuéntranos",
  addressLines: [
    "Del parque de feria Joaquín Reina 3 1/2 al oeste, Rivas",
  ],
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3910.6298671292175!2d-85.82143392643785!3d11.434388346716082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f744fbe894c3009%3A0x14a05b764f81997d!2sAlfarero%20body%20gym!5e0!3m2!1ses!2sni!4v1791601728817!5m2!1ses!2sni",
  directionsUrl:
    "https://www.google.com/maps/search/?api=1&query=Alfarero+Body+Gym",
  directionsLabel: "Cómo llegar",
},

  // ---------------------------------------------------------------------------
  // Contacto
  // ---------------------------------------------------------------------------
  contact: {
    eyebrow: "Contacto",
    title: "Tu mejor versión comienza hoy.",
    description:
      "Escríbenos por WhatsApp para resolver tus dudas sobre planes, horarios y cómo empezar a entrenar con nosotros.",
    // Número provisional en formato internacional, sin espacios ni símbolos.
    whatsapp: "50589749236",
    whatsappMessage:
      "Hola, quiero información sobre Alfarero Body Gym (planes, horarios y cómo empezar).",
    phone: "+505 8974 9236",
    phoneHref: "tel:+50589749236",
    email: "contacto@alfarerobodygym.com",
    formNote:
      "Al enviar, se abrirá WhatsApp con tu mensaje listo para enviar. Este sitio no almacena datos.",
    socials: [
      { label: "Facebook", href: "https://www.facebook.com/groups/2750732705252387/user/100024626993750?locale=es_LA", icon: "facebook" },
       { label: "Instagram", href: "https://www.instagram.com/", icon: "instagram" },
      { label: "WhatsApp", href: "https://wa.me/50589749236", icon: "whatsapp" },
    ] as SocialLink[],
  },

  // ---------------------------------------------------------------------------
  // Pie de página
  // ---------------------------------------------------------------------------
  footer: {
    tagline: "Fuerza, disciplina y comunidad bajo un mismo techo.",
  },
};

export type Gym = typeof gym;

/**
 * Construye un enlace de WhatsApp con un mensaje opcional.
 * El número debe venir en formato internacional, sin espacios ni símbolos.
 */
export function whatsappLink(whatsapp: string, message?: string): string {
  const base = `https://wa.me/${whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
