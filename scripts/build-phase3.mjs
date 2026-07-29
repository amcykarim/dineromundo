import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const countries = [
  {
    slug: 'mexico', name: 'México', code: 'MX', currency: 'Peso mexicano', currencyCode: 'MXN',
    language: 'Español', population: '130.9 millones', capital: 'Ciudad de México',
    timezones: 'UTC−8 a UTC−5, según la región',
    description: 'Información financiera para entender transferencias, costos y opciones de entrega de dinero hacia México.',
    overview: 'México cuenta con un sistema financiero amplio que combina bancos, cooperativas, empresas de transferencias y una extensa red de puntos para retiro de efectivo. Antes de enviar dinero conviene comparar el costo total, el tipo de cambio aplicado y la forma en que la persona destinataria desea recibir los fondos.',
    wallet: 'Algunos servicios ofrecen depósitos a billeteras o cuentas digitales compatibles. La disponibilidad depende del proveedor y de la cuenta del destinatario.'
  },
  {
    slug: 'colombia', name: 'Colombia', code: 'CO', currency: 'Peso colombiano', currencyCode: 'COP',
    language: 'Español', population: '52.9 millones', capital: 'Bogotá',
    timezones: 'UTC−5',
    description: 'Guía educativa para comparar transferencias y métodos de recepción de dinero en Colombia.',
    overview: 'Colombia dispone de bancos, empresas de giros, corresponsales y servicios digitales para recibir transferencias internacionales. La mejor modalidad depende de si la persona necesita depósito bancario, retiro en efectivo o una opción digital disponible en su zona.',
    wallet: 'Las billeteras digitales pueden estar disponibles para determinados corredores y proveedores. Verifica compatibilidad, límites y requisitos antes de enviar.'
  },
  {
    slug: 'republica-dominicana', name: 'República Dominicana', code: 'DO', currency: 'Peso dominicano', currencyCode: 'DOP',
    language: 'Español', population: '11.4 millones', capital: 'Santo Domingo',
    timezones: 'UTC−4',
    description: 'Recursos claros para conocer formas de enviar y recibir dinero en República Dominicana.',
    overview: 'República Dominicana cuenta con bancos, remesadoras y redes de agentes para recibir dinero desde el exterior. El destinatario puede valorar la cercanía del punto de entrega, el horario, los documentos requeridos y el importe final que recibirá.',
    wallet: 'Algunas plataformas permiten abonos a cuentas o productos digitales. Confirma que el servicio y la institución receptora sean compatibles.'
  },
  {
    slug: 'guatemala', name: 'Guatemala', code: 'GT', currency: 'Quetzal', currencyCode: 'GTQ',
    language: 'Español', population: '18.4 millones', capital: 'Ciudad de Guatemala',
    timezones: 'UTC−6',
    description: 'Orientación financiera sobre transferencias, tarifas y recepción de dinero en Guatemala.',
    overview: 'En Guatemala las transferencias pueden recibirse mediante bancos, cooperativas, agentes de remesas y otros canales autorizados. La cobertura del servicio puede variar entre áreas urbanas y rurales, por lo que es importante confirmar el punto de entrega con anticipación.',
    wallet: 'La recepción en productos móviles o digitales depende del proveedor, la institución y la zona. No todos los corredores ofrecen esta modalidad.'
  },
  {
    slug: 'honduras', name: 'Honduras', code: 'HN', currency: 'Lempira', currencyCode: 'HNL',
    language: 'Español', population: '10.8 millones', capital: 'Tegucigalpa',
    timezones: 'UTC−6',
    description: 'Información educativa para comparar opciones de envío y recepción de dinero en Honduras.',
    overview: 'Honduras dispone de bancos, cooperativas y redes de agentes que participan en la recepción de transferencias internacionales. Además del costo, conviene revisar accesibilidad, límites, horarios y requisitos de identificación.',
    wallet: 'Algunas opciones digitales pueden permitir abonos móviles o a cuentas compatibles. Revisa la disponibilidad real para el destinatario antes de pagar.'
  },
  {
    slug: 'el-salvador', name: 'El Salvador', code: 'SV', currency: 'Dólar estadounidense', currencyCode: 'USD',
    language: 'Español', population: '6.3 millones', capital: 'San Salvador',
    timezones: 'UTC−6',
    description: 'Guía para entender transferencias internacionales y opciones de entrega de dinero en El Salvador.',
    overview: 'El Salvador utiliza el dólar estadounidense como moneda de curso legal y cuenta con bancos, cooperativas y agentes para recibir transferencias. Aunque una operación no requiera conversión entre monedas, todavía puede incluir tarifas y otros cargos.',
    wallet: 'La disponibilidad de billeteras móviles cambia según el servicio y las condiciones de la cuenta. Verifica límites, acceso y forma de retiro.'
  },
  {
    slug: 'peru', name: 'Perú', code: 'PE', currency: 'Sol', currencyCode: 'PEN',
    language: 'Español; quechua y aimara donde predominan', population: '34.2 millones', capital: 'Lima',
    timezones: 'UTC−5',
    description: 'Recursos para evaluar costos, métodos y tiempos al enviar dinero hacia Perú.',
    overview: 'Perú ofrece recepción mediante bancos, agentes, puntos de retiro y determinados servicios digitales. La cobertura y los límites pueden diferir según la ciudad, la institución receptora y el método seleccionado.',
    wallet: 'Algunos proveedores permiten depósitos en productos digitales compatibles. Confirma el nombre exacto del servicio, los límites y la identidad del titular.'
  },
  {
    slug: 'ecuador', name: 'Ecuador', code: 'EC', currency: 'Dólar estadounidense', currencyCode: 'USD',
    language: 'Español; kichwa y shuar para relaciones interculturales', population: '18.1 millones', capital: 'Quito',
    timezones: 'UTC−5 continental; UTC−6 Galápagos',
    description: 'Información clara para comparar transferencias y métodos de recepción de dinero en Ecuador.',
    overview: 'Ecuador utiliza el dólar estadounidense y dispone de bancos, cooperativas y redes de agentes para recibir transferencias internacionales. Es útil comprobar la cobertura local, los documentos solicitados y cualquier cargo aplicado al destinatario.',
    wallet: 'Las opciones de billetera o cuenta digital dependen del corredor y del proveedor. Verifica compatibilidad antes de iniciar la operación.'
  }
];

const base = (depth) => '../'.repeat(depth);
const header = (depth, current = '') => {
  const home = base(depth);
  const countriesHref = depth === 1 ? './' : '../';
  return `<a class="skip-link" href="#contenido">Saltar al contenido principal</a>
<header class="site-header"><div class="container header-inner">
  <a class="brand" href="${home}" aria-label="DineroMundo, página de inicio"><span>Dinero</span>Mundo</a>
  <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="sr-only">Abrir menú principal</span><span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span></button>
  <nav class="site-nav" id="site-nav" aria-label="Navegación principal">
    <a href="${home}">Inicio</a><a href="${home}#enviar-dinero">Enviar dinero</a><a href="${home}calculadoras/">Calculadoras</a><a href="${countriesHref}"${current === 'countries' ? ' aria-current="page"' : ''}>Países</a><a href="${home}proveedores/">Proveedores</a><a href="${home}#aprender">Aprender</a><a href="${home}#nosotros">Nosotros</a>
    <a class="btn btn-primary nav-cta" href="${home}calculadoras/">Explorar herramientas</a>
  </nav>
</div></header>`;
};

const footer = (depth) => {
  const home = base(depth);
  const countriesHref = depth === 1 ? './' : '../';
  return `<footer class="site-footer"><div class="container">
  <div class="footer-grid">
    <div class="footer-brand"><a class="brand brand-light" href="${home}"><span>Dinero</span>Mundo</a><p>Tu centro financiero para enviar dinero, comparar opciones y tomar mejores decisiones.</p></div>
    <div><h2>DineroMundo</h2><ul><li><a href="${home}#nosotros">Nosotros</a></li><li><span>Contacto — Próximamente</span></li><li><span>Política editorial — Próximamente</span></li></ul></div>
    <div><h2>Herramientas</h2><ul><li><a href="${home}calculadoras/">Calculadoras</a></li><li><a href="${home}#enviar-dinero">Enviar dinero</a></li><li><a href="${countriesHref}">Países</a></li><li><a href="${home}proveedores/">Proveedores</a></li></ul></div>
    <div><h2>Legal</h2><ul><li><span>Privacidad — Próximamente</span></li><li><span>Términos — Próximamente</span></li><li><span>Aviso financiero — Próximamente</span></li><li><span>Divulgación de afiliados — Próximamente</span></li></ul></div>
  </div>
  <div class="footer-bottom"><p>© <span data-year>2026</span> DineroMundo.com.</p><p>Contenido educativo; no constituye asesoría financiera, legal ni fiscal.</p></div>
</div></footer>`;
};

const shell = ({ title, description, canonical, depth, body, schema = '' }) => `<!doctype html>
<html lang="es"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title><meta name="description" content="${description}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website"><meta property="og:locale" content="es_US"><meta property="og:site_name" content="DineroMundo">
  <meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}">
  <meta name="twitter:card" content="summary">
  <link rel="stylesheet" href="${base(depth)}assets/css/styles.css">${schema}
</head><body>
${header(depth, 'countries')}${body}${footer(depth)}
<script src="${base(depth)}assets/js/main.js" defer></script><script src="${base(depth)}assets/js/countries.js" defer></script>
</body></html>`;

const organizationSchema = {
  '@context': 'https://schema.org', '@type': 'Organization',
  name: 'DineroMundo', url: 'https://dineromundo.com/'
};

const directoryCards = countries.map((country) => `<article class="card country-directory-card" data-country-card>
  <span class="country-badge">${country.code}</span>
  <h2>${country.name}</h2><p>${country.description}</p>
  <a class="btn btn-secondary" href="${country.slug}/">Ver guía de ${country.name}</a>
</article>`).join('');

const directoryBody = `<main id="contenido">
  <section class="page-hero"><div class="container">
    <nav class="breadcrumbs" aria-label="Migas de pan"><ol><li><a href="../">Inicio</a></li><li aria-current="page">Países</li></ol></nav>
    <p class="eyebrow">Guías financieras por país</p><h1>Centros de información financiera para Latinoamérica</h1>
    <p class="hero-lede">Consulta información clara sobre monedas, opciones para recibir transferencias, costos y herramientas útiles para ocho destinos populares.</p>
  </div></section>
  <div class="container"><aside class="ad-slot" aria-label="Espacio publicitario">Espacio publicitario</aside></div>
  <section class="section"><div class="container">
    <div class="country-directory-tools"><div class="field country-search"><label for="country-search">Buscar país</label><input id="country-search" type="search" data-country-search placeholder="Ejemplo: México, dólar o Colombia"></div><p class="country-count" data-country-count aria-live="polite">8 países</p></div>
    <div class="country-directory-grid">${directoryCards}</div>
    <p class="filter-empty" data-country-empty hidden>No encontramos un país que coincida con tu búsqueda.</p>
  </div></section>
  <div class="container"><aside class="ad-slot ad-bottom" aria-label="Espacio publicitario">Espacio publicitario</aside></div>
</main>`;

fs.mkdirSync(path.join(root, 'paises'), { recursive: true });
fs.writeFileSync(path.join(root, 'paises', 'index.html'), shell({
  title: 'Guías financieras por país | DineroMundo',
  description: 'Explora guías financieras de México, Colombia, República Dominicana, Guatemala, Honduras, El Salvador, Perú y Ecuador.',
  canonical: 'https://dineromundo.com/paises/', depth: 1, body: directoryBody,
  schema: `<script type="application/ld+json">${JSON.stringify(organizationSchema)}</script>`
}));

const providers = [
  ['wise', 'Wise', 'Servicio digital para determinadas transferencias internacionales.'],
  ['western-union', 'Western Union', 'Red con opciones digitales y presenciales según el corredor.'],
  ['remitly', 'Remitly', 'Servicio digital con métodos de entrega que dependen del destino.'],
  ['moneygram', 'MoneyGram', 'Proveedor con canales digitales y una red internacional de agentes.'],
  ['ria-money-transfer', 'Ria Money Transfer', 'Servicio de transferencias con opciones en línea y presenciales.'],
  ['xoom', 'Xoom', 'Servicio de PayPal disponible para determinados países y métodos.']
];

function countryPage(country, index) {
  const previous = countries[(index - 1 + countries.length) % countries.length];
  const next = countries[(index + 1) % countries.length];
  const canonical = `https://dineromundo.com/paises/${country.slug}/`;
  const faqs = [
    [`¿Cuánto puede tardar una transferencia a ${country.name}?`, 'El tiempo depende del método de pago, el proveedor, las revisiones de seguridad, el horario y la forma de entrega. Puede variar desde minutos hasta varios días hábiles.'],
    ['¿Qué documentos pueden solicitar?', 'Los servicios suelen requerir identificación oficial y datos básicos de la operación. Los requisitos cambian según el proveedor, el importe, el país de origen y las normas aplicables.'],
    [`¿Cómo funciona el tipo de cambio hacia ${country.currencyCode}?`, `Cuando existe conversión, el proveedor aplica una tasa para convertir la moneda enviada a ${country.currency}. Esa tasa puede diferir de una tasa de referencia.`],
    ['¿Qué afecta el costo total?', 'La tarifa visible, el margen incluido en el tipo de cambio, el método de pago, la velocidad, el canal de entrega y posibles cargos para el destinatario pueden afectar el costo.'],
    ['¿Cómo puedo comparar opciones?', 'Compara cuánto pagas en total, cuánto recibe la otra persona, el tiempo estimado, la cobertura y los requisitos. No evalúes solamente la tarifa anunciada.'],
    ['¿Cómo puedo reducir tarifas?', 'Prueba distintos métodos y fechas, evita opciones urgentes cuando no sean necesarias y compara el resultado final. Confirma siempre las condiciones antes de pagar.'],
    ['¿Qué datos del destinatario debo revisar?', 'Verifica el nombre exactamente como aparece en su identificación o cuenta, además del número de cuenta, teléfono, institución y ciudad cuando correspondan.']
  ];
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map(([question, answer]) => ({
      '@type': 'Question', name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer }
    }))
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://dineromundo.com/' },
      { '@type': 'ListItem', position: 2, name: 'Países', item: 'https://dineromundo.com/paises/' },
      { '@type': 'ListItem', position: 3, name: country.name, item: canonical }
    ]
  };
  const body = `<main id="contenido">
    <section class="country-hero"><div class="container country-hero-grid">
      <div><nav class="breadcrumbs" aria-label="Migas de pan"><ol><li><a href="../../">Inicio</a></li><li><a href="../">Países</a></li><li aria-current="page">${country.name}</li></ol></nav>
        <p class="eyebrow">Guía financiera por país</p><h1>Dinero y transferencias en ${country.name}</h1><p class="hero-lede">${country.overview}</p>
      </div>
      <div class="country-visual" role="img" aria-label="Representación tipográfica de ${country.name}"><span class="country-visual-code">${country.code}</span><small>${country.currencyCode} · ${country.capital}</small></div>
    </div></section>
    <div class="container"><aside class="ad-slot" aria-label="Espacio publicitario">Espacio publicitario</aside></div>

    <section class="section" aria-labelledby="facts-title"><div class="container"><div class="section-head"><div><p class="eyebrow">Datos esenciales</p><h2 id="facts-title">Información rápida de ${country.name}</h2></div></div>
      <dl class="facts-grid">
        <div class="fact-card"><dt>Moneda</dt><dd>${country.currency}</dd></div><div class="fact-card"><dt>Código monetario</dt><dd>${country.currencyCode}</dd></div>
        <div class="fact-card"><dt>Idioma oficial</dt><dd>${country.language}</dd></div><div class="fact-card"><dt>Población aproximada</dt><dd>${country.population}</dd></div>
        <div class="fact-card"><dt>Capital</dt><dd>${country.capital}</dd></div><div class="fact-card"><dt>Zonas horarias</dt><dd>${country.timezones}</dd></div>
      </dl><p class="source-note">Población redondeada con referencia a datos del Banco Mundial de 2024. Las cifras pueden actualizarse.</p>
    </div></section>

    <section class="section section-tint" aria-labelledby="sending-title"><div class="container"><div class="section-head"><div><p class="eyebrow">Opciones de entrega</p><h2 id="sending-title">Cómo enviar dinero a ${country.name}</h2><p>La disponibilidad depende del proveedor, del país desde donde se envía y de la ubicación de la persona destinataria.</p></div></div>
      <div class="method-grid">
        <article class="method-card"><h3>Transferencia bancaria</h3><p>Puede depositar directamente en una cuenta compatible. Revisa datos bancarios, límites, moneda de recepción y tiempo de acreditación.</p></article>
        <article class="method-card"><h3>Retiro en efectivo</h3><p>Permite cobrar en una agencia participante. Confirma ubicación, horario, identificación requerida y plazo para retirar.</p></article>
        <article class="method-card"><h3>Billetera móvil</h3><p>${country.wallet}</p></article>
        <article class="method-card"><h3>Pago con tarjeta de débito</h3><p>Puede acelerar la financiación del envío, pero la institución emisora o el proveedor podrían aplicar límites o cargos.</p></article>
        <article class="method-card"><h3>Pago con tarjeta de crédito</h3><p>Puede tratarse como adelanto de efectivo o generar cargos adicionales. Comprueba las condiciones del emisor antes de usarla.</p></article>
        <article class="method-card"><h3>Velocidad de entrega</h3><p>Las estimaciones van desde minutos hasta varios días hábiles. Revisiones, fines de semana y datos incorrectos pueden causar retrasos.</p></article>
      </div><p class="availability-note">No se muestran precios ni tasas en vivo. Confirma el costo, la tasa de cambio y la disponibilidad directamente con el servicio antes de enviar.</p>
    </div></section>

    <section class="section" aria-labelledby="providers-title"><div class="container"><div class="section-head"><div><p class="eyebrow">Información general</p><h2 id="providers-title">Proveedores populares</h2><p>Estos nombres se presentan con fines informativos, sin clasificación ni afirmaciones sobre cuál es más barato.</p></div></div>
      <div class="provider-info-grid">${providers.map(([slug, name, description]) => `<article class="card provider-info-card"><span class="label">Información general</span><h3>${name}</h3><p>${description} Confirma la disponibilidad para esta ruta directamente con el proveedor.</p><a href="../../proveedores/${slug}/">Ver análisis de ${name}</a></article>`).join('')}</div>
    </div></section>

    <div class="container"><aside class="ad-slot" aria-label="Espacio publicitario">Espacio publicitario</aside></div>
    <section class="section section-tint" aria-labelledby="tips-title"><div class="container"><div class="section-head"><div><p class="eyebrow">Decisiones informadas</p><h2 id="tips-title">Consejos financieros para transferencias</h2></div></div>
      <div class="tips-grid">
        <article class="tip-card"><h3>Compara el costo total</h3><p>Revisa tarifa, tipo de cambio y cantidad final recibida, no solo el cargo inicial.</p></article>
        <article class="tip-card"><h3>Evita sorpresas cambiarias</h3><p>Compara la tasa ofrecida con una referencia independiente y confirma la moneda de entrega.</p></article>
        <article class="tip-card"><h3>Entiende las tarifas</h3><p>Pregunta si existen cargos por método de pago, recepción, retiro o velocidad.</p></article>
        <article class="tip-card"><h3>Verifica los datos</h3><p>Un nombre, teléfono o número de cuenta incorrecto puede retrasar o impedir la entrega.</p></article>
        <article class="tip-card"><h3>Protege la operación</h3><p>No envíes dinero por presión ni a personas desconocidas. Desconfía de premios y urgencias inesperadas.</p></article>
      </div>
    </div></section>

    <section class="section" aria-labelledby="calculators-title"><div class="container"><div class="section-head"><div><p class="eyebrow">Herramientas gratuitas</p><h2 id="calculators-title">Calculadoras relacionadas</h2></div></div>
      <div class="related-links">
        <a href="../../calculadoras/costo-envio-dinero/">Calculadora de costo de envío</a><a href="../../calculadoras/presupuesto-mensual/">Calculadora de presupuesto</a>
        <a href="../../calculadoras/meta-de-ahorro/">Calculadora de meta de ahorro</a><a href="../../calculadoras/porcentajes/">Calculadora de porcentajes</a>
      </div>
    </div></section>

    <section class="section section-tint" aria-labelledby="faq-title"><div class="container country-faq"><p class="eyebrow">Preguntas frecuentes</p><h2 id="faq-title">Preguntas sobre envíos a ${country.name}</h2>
      ${faqs.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join('')}
    </div></section>

    <section class="section" aria-labelledby="guides-title"><div class="container"><div class="section-head"><div><p class="eyebrow">Más información</p><h2 id="guides-title">Guías relacionadas</h2></div></div>
      <div class="guide-grid">
        <article class="guide-card"><h3>Cómo abrir una cuenta bancaria en ${country.name}</h3><p>Requisitos generales, preguntas importantes y conceptos bancarios.</p><span class="coming">Próximamente</span></article>
        <article class="guide-card"><h3>Cómo entender el tipo de cambio</h3><p>Una explicación sencilla sobre tasas de referencia y márgenes.</p><span class="coming">Próximamente</span></article>
        <article class="guide-card"><h3>Seguridad al recibir transferencias</h3><p>Pasos básicos para verificar operaciones y evitar estafas.</p><span class="coming">Próximamente</span></article>
      </div>
    </div></section>

    <div class="container"><aside class="ad-slot" aria-label="Espacio publicitario">Espacio publicitario</aside>
      <nav class="country-nav" aria-label="Navegación entre países"><a href="../${previous.slug}/">← ${previous.name}</a><a class="directory-link" href="../">Todos los países</a><a class="next" href="../${next.slug}/">${next.name} →</a></nav>
    </div>
  </main>`;

  return shell({
    title: `Enviar dinero a ${country.name}: guía financiera | DineroMundo`,
    description: country.description,
    canonical, depth: 2, body,
    schema: `<script type="application/ld+json">${JSON.stringify(organizationSchema)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`
  });
}

countries.forEach((country, index) => {
  const directory = path.join(root, 'paises', country.slug);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'index.html'), countryPage(country, index));
});
