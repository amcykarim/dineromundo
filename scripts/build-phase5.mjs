import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const reviewed = '28 de julio de 2026';
const providers = {
  wise: {
    name: 'Wise',
    type: 'Servicio internacional principalmente digital',
    online: 'Disponible en determinados mercados',
    physical: 'No es su enfoque principal',
    bankPay: 'Disponible según el país',
    debit: 'Puede variar según la ruta',
    credit: 'Puede variar según la ruta',
    bankDeposit: 'Método de entrega principal en muchas rutas',
    cash: 'No es su enfoque principal',
    wallet: 'Disponibilidad limitada según la ruta',
    other: 'Funciones de cuenta internacional donde estén disponibles',
    account: 'Generalmente requerido para enviar en línea',
    app: 'Disponible en determinados mercados',
    geography: 'Varía por país, moneda y ruta',
    strengths: ['Experiencia principalmente digital', 'Depósito en cuenta bancaria en muchas rutas', 'Desglose de tarifa y conversión antes de confirmar', 'Aplicación y seguimiento digital donde estén disponibles'],
    scenarios: ['buscas un proceso totalmente digital', 'el destinatario prefiere depósito bancario', 'quieres revisar por separado tarifa y conversión', 'no necesitas una red tradicional de retiro en efectivo']
  },
  remitly: {
    name: 'Remitly',
    type: 'Servicio digital orientado a remesas',
    online: 'Disponible en determinados mercados',
    physical: 'No es su modelo principal para iniciar envíos',
    bankPay: 'Puede variar según el país emisor',
    debit: 'Disponible en ciertos mercados',
    credit: 'Disponible en ciertos mercados',
    bankDeposit: 'Disponible en rutas determinadas',
    cash: 'Disponible en rutas determinadas',
    wallet: 'Disponible en ciertos destinos',
    other: 'Entrega a domicilio donde esté habilitada',
    account: 'Normalmente requerido',
    app: 'Disponible en determinados mercados',
    geography: 'Las opciones cambian por destino y ruta',
    strengths: ['Proceso digital orientado a remesas', 'Diversos métodos de recepción según el destino', 'Retiro en efectivo en rutas habilitadas', 'Seguimiento digital de la transferencia'],
    scenarios: ['el destinatario necesita comparar retiro en efectivo', 'la ruta ofrece billetera móvil o entrega a domicilio', 'prefieres iniciar el envío por web o aplicación', 'quieres comparar varias formas de recepción']
  },
  'western-union': {
    name: 'Western Union',
    type: 'Servicio en línea y mediante agentes físicos',
    online: 'Disponible en determinados mercados',
    physical: 'Disponible en numerosos mercados; confirma la ubicación',
    bankPay: 'Puede variar según la ruta',
    debit: 'Disponible en ciertos mercados',
    credit: 'Disponible en ciertos mercados',
    bankDeposit: 'Disponible según el destino',
    cash: 'Método relevante donde exista red participante',
    wallet: 'Disponible en determinados países',
    other: 'Opciones adicionales según el destino',
    account: 'Depende del canal y de los requisitos locales',
    app: 'Disponible en determinados mercados',
    geography: 'Varía por país, canal y ruta',
    strengths: ['Canales digitales y ubicaciones físicas', 'Retiro en efectivo en redes participantes', 'Depósito bancario y otros métodos donde estén habilitados', 'Seguimiento mediante número de referencia'],
    scenarios: ['prefieres iniciar o pagar en una ubicación física', 'el destinatario necesita retiro en efectivo', 'quieres comparar canales digitales y presenciales', 'la ruta requiere una opción de recepción específica']
  },
  xoom: {
    name: 'Xoom',
    type: 'Servicio digital asociado con PayPal',
    online: 'Disponible en mercados admitidos',
    physical: 'No es su enfoque para iniciar transferencias',
    bankPay: 'Puede depender de las opciones de PayPal',
    debit: 'Puede estar disponible según la cuenta y el mercado',
    credit: 'Puede estar disponible según la cuenta y el mercado',
    bankDeposit: 'Disponible en determinados destinos',
    cash: 'Disponible en determinadas rutas',
    wallet: 'Puede variar según el país',
    other: 'Recargas móviles o pago de facturas donde estén habilitados',
    account: 'Se utiliza una cuenta de PayPal o Xoom según el mercado',
    app: 'Disponible en determinados mercados',
    geography: 'Cambia significativamente por destino',
    strengths: ['Proceso digital relacionado con PayPal', 'Depósito bancario o retiro en efectivo donde estén disponibles', 'Recargas móviles y pago de facturas en destinos habilitados', 'Seguimiento digital'],
    scenarios: ['ya utilizas PayPal y deseas revisar la integración disponible', 'el destino admite recarga o pago de facturas', 'prefieres una experiencia digital', 'quieres comparar depósito bancario con retiro en efectivo']
  },
  moneygram: {
    name: 'MoneyGram',
    type: 'Servicio digital y mediante ubicaciones de agentes',
    online: 'Disponible en determinados mercados',
    physical: 'Disponible donde exista una ubicación participante',
    bankPay: 'Puede variar según el país',
    debit: 'Disponible en ciertos mercados',
    credit: 'Disponible en ciertos mercados',
    bankDeposit: 'Disponible según el destino',
    cash: 'Disponible en rutas y agentes participantes',
    wallet: 'Disponible en determinados destinos',
    other: 'Opciones adicionales según la ruta',
    account: 'Depende del canal y del mercado',
    app: 'Disponible en determinados mercados',
    geography: 'Varía según origen, destino y canal',
    strengths: ['Acceso digital y mediante agentes', 'Retiro en efectivo donde esté habilitado', 'Depósito bancario y billetera en rutas seleccionadas', 'Seguimiento de transferencias'],
    scenarios: ['necesitas comparar ubicaciones físicas', 'el destinatario quiere retirar efectivo', 'la ruta permite depósito en cuenta', 'quieres valorar comodidad presencial y digital']
  },
  'ria-money-transfer': {
    name: 'Ria Money Transfer',
    type: 'Servicio en línea y mediante ubicaciones físicas',
    online: 'Disponible en determinados países emisores',
    physical: 'Disponible donde existan agentes participantes',
    bankPay: 'Puede variar según el mercado',
    debit: 'Disponible en ciertos mercados',
    credit: 'Disponible en ciertos mercados',
    bankDeposit: 'Disponible en rutas seleccionadas',
    cash: 'Disponible en redes participantes',
    wallet: 'Disponible en determinados destinos',
    other: 'Opciones según la ruta',
    account: 'Depende del canal y del país',
    app: 'Disponible en determinados mercados',
    geography: 'Debe confirmarse para origen y destino',
    strengths: ['Opciones digitales y presenciales donde estén disponibles', 'Retiro en efectivo en agentes participantes', 'Depósito bancario en rutas habilitadas', 'Alternativas de pago dependientes del mercado'],
    scenarios: ['quieres revisar una ubicación participante cercana', 'el destinatario necesita efectivo', 'la ruta ofrece depósito bancario', 'buscas comparar canales presencial y digital']
  }
};

const comparisons = [
  {
    slug: 'wise-vs-remitly', a: 'wise', b: 'remitly',
    title: 'Wise vs Remitly: diferencias y opciones | DineroMundo',
    description: 'Compara Wise y Remitly: acceso digital, depósito bancario, retiro en efectivo, billetera móvil, costos y disponibilidad por ruta.',
    summary: 'Wise y Remitly permiten iniciar transferencias por canales digitales, pero suelen responder a necesidades de recepción diferentes. Wise se concentra principalmente en transferencias internacionales y depósitos bancarios; Remitly ofrece alternativas orientadas a remesas que pueden incluir efectivo, billetera móvil o entrega a domicilio.',
    differences: [
      'Wise suele poner el énfasis en una experiencia internacional digital y en entregar fondos a una cuenta bancaria. Remitly está diseñado alrededor de rutas de remesas y puede presentar más formas de recepción cuando el destino las admite.',
      'El retiro en efectivo no es el centro del modelo de Wise. En Remitly puede ser relevante, junto con depósito bancario, billetera móvil o entrega a domicilio. Ninguna opción debe asumirse para todos los países.',
      'La comparación útil consiste en introducir la misma cantidad, método de pago y forma de recepción en ambos servicios, y revisar cuánto se paga y cuánto recibe la persona destinataria.'
    ],
    topics: ['Depósito bancario', 'Retiro en efectivo', 'Billetera móvil', 'Costo total']
  },
  {
    slug: 'wise-vs-western-union', a: 'wise', b: 'western-union',
    title: 'Wise vs Western Union: comparación informativa | DineroMundo',
    description: 'Diferencias entre Wise y Western Union: experiencia digital, agentes físicos, depósito bancario, efectivo, pagos y costos por ruta.',
    summary: 'Wise ofrece una experiencia principalmente digital, mientras Western Union combina canales en línea con una red de ubicaciones participantes. La diferencia más importante suele ser cómo desea enviar el remitente y cómo necesita recibir el destinatario.',
    differences: [
      'Wise suele resultar relevante al comparar transferencias digitales con depósito bancario. Western Union añade la posibilidad de iniciar o completar ciertas operaciones en ubicaciones físicas, según el mercado.',
      'Para un destinatario que necesita efectivo, la red participante de Western Union puede ser un factor práctico. Si la prioridad es un abono bancario y un flujo digital, conviene revisar las condiciones de Wise y también las opciones bancarias de Western Union.',
      'El canal presencial, la tarjeta o la cuenta bancaria pueden producir costos y tiempos distintos. La marca por sí sola no determina el resultado final.'
    ],
    topics: ['Digital o presencial', 'Depósito bancario', 'Retiro en efectivo', 'Método de pago']
  },
  {
    slug: 'wise-vs-xoom', a: 'wise', b: 'xoom',
    title: 'Wise vs Xoom: métodos, costos y diferencias | DineroMundo',
    description: 'Compara Wise y Xoom de forma educativa: PayPal, depósito bancario, retiro, recargas, pago de facturas y costo total.',
    summary: 'Wise y Xoom son servicios digitales, pero sus funciones de recepción no son idénticas. Xoom está asociado con PayPal y puede incluir depósito, efectivo, recargas o pago de facturas; Wise se enfoca en transferencias internacionales y funciones de cuenta donde estén disponibles.',
    differences: [
      'Ambos permiten gestionar operaciones en línea, aunque Xoom se relaciona con el ecosistema de PayPal y Wise mantiene una propuesta centrada en transferencias y cuentas internacionales.',
      'Las recargas móviles o pagos de facturas pueden aparecer en Xoom para destinos habilitados. En Wise, el depósito bancario es una referencia más habitual que el retiro en efectivo o esos servicios adicionales.',
      'Las opciones de financiación, el tipo de cambio y el método exacto de recepción cambian por mercado. Comprueba la misma ruta en ambos antes de decidir.'
    ],
    topics: ['Servicios digitales', 'PayPal', 'Depósito bancario', 'Servicios adicionales']
  },
  {
    slug: 'remitly-vs-xoom', a: 'remitly', b: 'xoom',
    title: 'Remitly vs Xoom: comparación de transferencias | DineroMundo',
    description: 'Compara Remitly y Xoom: opciones digitales, efectivo, depósito bancario, billetera, PayPal y otros servicios según el destino.',
    summary: 'Remitly y Xoom operan principalmente por medios digitales y pueden ofrecer varias formas de recepción. La cobertura concreta de depósito, efectivo, billetera, recarga, pago de facturas o entrega a domicilio depende del destino.',
    differences: [
      'Remitly estructura su experiencia alrededor del envío de remesas y puede ofrecer efectivo, billetera móvil o entrega a domicilio en rutas seleccionadas. Xoom combina transferencias con funciones como recarga o pago de facturas donde estén disponibles.',
      'Xoom está asociado con PayPal, por lo que la cuenta y las fuentes de fondos disponibles pueden influir en el proceso. Remitly utiliza su propia cuenta y sus métodos admitidos por mercado.',
      'Aunque ambos pueden ofrecer depósito bancario y efectivo, los socios de pago y recepción no necesariamente coinciden. Verifica la ubicación o cuenta específica antes de enviar.'
    ],
    topics: ['Proceso digital', 'Formas de recepción', 'PayPal', 'Disponibilidad']
  },
  {
    slug: 'western-union-vs-moneygram', a: 'western-union', b: 'moneygram',
    title: 'Western Union vs MoneyGram: diferencias | DineroMundo',
    description: 'Compara Western Union y MoneyGram: agentes físicos, envíos en línea, efectivo, depósito bancario, identificación y costo final.',
    summary: 'Western Union y MoneyGram combinan opciones digitales con ubicaciones de agentes en distintos mercados. Para compararlos, conviene revisar la ruta, la cercanía del agente, la identificación requerida y el monto final recibido.',
    differences: [
      'Los dos servicios son conocidos por el retiro en efectivo mediante agentes participantes, pero la presencia local y los horarios pueden ser diferentes en cada comunidad.',
      'El envío en línea, el depósito bancario y otros métodos no tienen la misma disponibilidad en todas las rutas. Una opción visible para un país puede no existir para otro.',
      'La comodidad de una ubicación no sustituye la comparación financiera. Revisa tarifa, conversión, pago con tarjeta o banco y posibles cargos de terceros.'
    ],
    topics: ['Agentes físicos', 'Retiro en efectivo', 'Identificación', 'Costo entregado']
  },
  {
    slug: 'moneygram-vs-ria-money-transfer', a: 'moneygram', b: 'ria-money-transfer',
    title: 'MoneyGram vs Ria: comparación informativa | DineroMundo',
    description: 'Compara MoneyGram y Ria Money Transfer: agentes, opciones en línea, retiro en efectivo, depósito bancario y disponibilidad.',
    summary: 'MoneyGram y Ria Money Transfer pueden ofrecer canales digitales y presenciales, además de retiro en efectivo o depósito bancario en rutas habilitadas. La accesibilidad del agente y el país desde donde se envía son factores centrales.',
    differences: [
      'Ambos servicios participan en rutas habituales de remesas, pero sus ubicaciones, socios pagadores y canales en línea pueden variar considerablemente según el mercado.',
      'MoneyGram y Ria pueden permitir retiro en efectivo o depósito bancario. Debes confirmar no solo el país, sino también la ciudad, el agente o la institución receptora.',
      'El método de pago disponible desde el país emisor puede cambiar el costo y el tiempo. Compara una operación equivalente y conserva la referencia de la cotización.'
    ],
    topics: ['Red de agentes', 'Envío en línea', 'Efectivo o banco', 'País emisor']
  },
  {
    slug: 'remitly-vs-western-union', a: 'remitly', b: 'western-union',
    title: 'Remitly vs Western Union: métodos y opciones | DineroMundo',
    description: 'Compara Remitly y Western Union: experiencia digital, ubicaciones físicas, efectivo, depósito, billetera y verificación.',
    summary: 'Remitly adopta un modelo digital orientado a remesas; Western Union suma a sus canales digitales una presencia física relevante. La preferencia del destinatario y el acceso del remitente suelen definir qué aspectos comparar.',
    differences: [
      'Remitly normalmente inicia el envío en web o aplicación. Western Union puede permitir procesos en línea o en una ubicación participante, una diferencia importante para quien paga en persona.',
      'Ambos pueden ofrecer retiro en efectivo, depósito bancario, billetera u otras entregas en ciertos mercados, pero las combinaciones disponibles para una misma ruta no tienen por qué coincidir.',
      'Los requisitos de cuenta, verificación e identificación dependen del canal. Una operación presencial puede pedir pasos distintos a una transferencia completamente digital.'
    ],
    topics: ['Digital o agente', 'Opciones de recepción', 'Verificación', 'Ruta']
  },
  {
    slug: 'ria-money-transfer-vs-western-union', a: 'ria-money-transfer', b: 'western-union',
    title: 'Ria vs Western Union: diferencias y servicios | DineroMundo',
    description: 'Compara Ria Money Transfer y Western Union: agentes, transferencias en línea, efectivo, banco, costos y disponibilidad por ruta.',
    summary: 'Ria Money Transfer y Western Union pueden combinar canales en línea con ubicaciones físicas. La diferencia práctica depende de los agentes cercanos, del destino, de la forma de pago y de cómo desea recibir el dinero la otra persona.',
    differences: [
      'Las redes de agentes de Ria y Western Union no son idénticas. Comprueba dirección, horario, disponibilidad de efectivo e identificación antes de elegir una ubicación.',
      'El retiro en efectivo y el depósito bancario pueden estar disponibles en ambos servicios según la ruta, pero no debe asumirse que los mismos métodos funcionan en todos los países.',
      'El monto final recibido permite comparar mejor que la tarifa aislada. Incluye en la revisión la conversión, el canal de pago y cualquier cargo externo.'
    ],
    topics: ['Agentes participantes', 'Efectivo', 'Depósito bancario', 'Monto recibido']
  }
];

const countryLinks = [
  ['México','mexico'],['Colombia','colombia'],['República Dominicana','republica-dominicana'],['Guatemala','guatemala'],
  ['Honduras','honduras'],['El Salvador','el-salvador'],['Perú','peru'],['Ecuador','ecuador']
];
const calculatorLinks = [
  ['Calculadora de costo de envío','costo-envio-dinero'],['Calculadora de porcentajes','porcentajes'],
  ['Calculadora de presupuesto mensual','presupuesto-mensual'],['Calculadora de meta de ahorro','meta-de-ahorro']
];
const base = (depth) => '../'.repeat(depth);
const header = (depth, current = '') => {
  const home = base(depth);
  return `<a class="skip-link" href="#contenido">Saltar al contenido</a><header class="site-header"><div class="container header-inner"><a class="brand" href="${home}" aria-label="DineroMundo, inicio"><span>Dinero</span>Mundo</a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="sr-only">Abrir menú principal</span><span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span></button><nav class="site-nav" id="site-nav" aria-label="Navegación principal"><a href="${home}">Inicio</a><a href="${home}#enviar-dinero">Enviar dinero</a><a href="${home}calculadoras/">Calculadoras</a><a href="${home}paises/">Países</a><a href="${home}proveedores/">Proveedores</a><a href="${depth === 1 ? './' : '../'}"${current === 'comparisons' ? ' aria-current="page"' : ''}>Comparar</a><a href="${home}#aprender">Aprender</a><a class="btn btn-primary nav-cta" href="${home}calculadoras/">Explorar herramientas</a></nav></div></header>`;
};
const footer = (depth) => {
  const home = base(depth);
  return `<footer class="site-footer"><div class="container"><div class="footer-grid"><div class="footer-brand"><a class="brand brand-light" href="${home}"><span>Dinero</span>Mundo</a><p>Tu centro financiero para enviar dinero, comparar opciones y tomar mejores decisiones.</p></div><div><h2>DineroMundo</h2><ul><li><a href="${home}#nosotros">Nosotros</a></li><li><a href="${home}metodologia/">Política editorial</a></li><li><span>Contacto — Próximamente</span></li></ul></div><div><h2>Herramientas</h2><ul><li><a href="${home}calculadoras/">Calculadoras</a></li><li><a href="${home}paises/">Países</a></li><li><a href="${home}proveedores/">Proveedores</a></li><li><a href="${home}comparar/">Comparar proveedores</a></li></ul></div><div><h2>Legal</h2><ul><li><span>Privacidad — Próximamente</span></li><li><span>Términos — Próximamente</span></li><li><span>Aviso financiero — Próximamente</span></li></ul></div></div><div class="footer-bottom"><p>© <span data-current-year>2026</span> DineroMundo.com</p><p>Contenido educativo; verifica costos y condiciones directamente.</p></div></div></footer>`;
};
const schemaOrg = {'@context':'https://schema.org','@type':'Organization',name:'DineroMundo',url:'https://dineromundo.com/'};
const shell = ({title,description,canonical,depth,body,schema='',directory=false}) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="${description}"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:locale" content="es_US"><meta property="og:site_name" content="DineroMundo"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${description}"><link rel="stylesheet" href="${base(depth)}assets/css/styles.css">${schema}</head><body>${header(depth,'comparisons')}${body}${footer(depth)}<script src="${base(depth)}assets/js/main.js" defer></script>${directory?`<script src="${base(depth)}assets/js/comparisons.js" defer></script>`:''}</body></html>`;
const ad = '<aside class="ad-slot" aria-label="Espacio publicitario">Espacio publicitario</aside>';
const escape = (s) => s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function directoryPage() {
  const cards = comparisons.map(c => `<article class="card comparison-directory-card" data-comparison-card data-providers="${c.a} ${c.b}"><span class="label">Comparación informativa</span><h2>${providers[c.a].name} vs ${providers[c.b].name}</h2><p>${c.summary}</p><ul>${c.topics.map(t=>`<li>${t}</li>`).join('')}</ul><a class="btn btn-primary" href="${c.slug}/">Ver comparación</a><small class="review-date">Revisado: ${reviewed}</small></article>`).join('');
  const filterButtons = [['all','Todos'],...Object.entries(providers).map(([slug,p])=>[slug,p.name])].map(([slug,name])=>`<button type="button" data-comparison-filter="${slug}" aria-pressed="${slug==='all'}">${name}</button>`).join('');
  const body = `<main id="contenido"><section class="page-hero"><div class="container"><nav class="breadcrumbs" aria-label="Migas de pan"><ol><li><a href="../">Inicio</a></li><li aria-current="page">Comparar</li></ol></nav><p class="eyebrow">Centro de comparación</p><h1>Comparaciones de proveedores de transferencias</h1><p class="hero-lede">Compara características generales de distintos servicios para enviar dinero. Las tarifas, tipos de cambio, límites, métodos y disponibilidad pueden variar según el país y la ruta.</p></div></section><div class="container">${ad}</div>
  <section class="section"><div class="container"><div class="comparison-directory-tools"><div class="field"><label for="comparison-search">Buscar una comparación</label><input id="comparison-search" type="search" placeholder="Ejemplo: Wise o efectivo" data-comparison-search></div><fieldset><legend>Filtrar por proveedor</legend><div class="comparison-filter-buttons">${filterButtons}</div></fieldset><p data-comparison-count aria-live="polite">8 comparaciones</p></div><div class="comparison-directory-grid">${cards}</div><p class="filter-empty" data-comparison-empty hidden>No encontramos una comparación con esos criterios.</p></div></section>
  <section class="section section-tint"><div class="container"><div class="section-head"><div><p class="eyebrow">Método editorial</p><h2>Cómo preparamos estas comparaciones</h2><p>Organizamos características generales documentadas por los proveedores y evitamos convertir una diferencia de funciones en un ranking.</p></div></div><div class="comparison-factor-grid"><article class="review-card"><h3>Misma pregunta para ambos</h3><p>Revisamos acceso, pago, recepción, cuenta y disponibilidad con el mismo marco educativo.</p></article><article class="review-card"><h3>Sin precios en vivo</h3><p>No mostramos cotizaciones, promociones ni tiempos garantizados. Esos datos deben confirmarse antes de enviar.</p></article><article class="review-card"><h3>Actualización transparente</h3><p>Indicamos la fecha de revisión y enlazamos nuestra <a href="../metodologia/">metodología editorial</a>.</p></article></div></div></section>
  <section class="section"><div class="container"><div class="review-content"><section><h2>Factores que debes comparar</h2><p>Comprueba el país de origen y destino, monto pagado, cantidad recibida, tipo de cambio, tarifa visible, método de pago, forma de recepción, tiempo estimado, límites, identificación, cancelaciones y atención al cliente. Una función puede estar disponible solamente en ciertas rutas.</p></section><section><h2>Reseñas de proveedores</h2><div class="related-links">${Object.entries(providers).map(([s,p])=>`<a href="../proveedores/${s}/">${p.name}</a>`).join('')}</div></section><section><h2>Guías por país</h2><div class="provider-country-grid">${countryLinks.map(([n,s])=>`<a href="../paises/${s}/">${n}</a>`).join('')}</div></section><section><h2>Calculadoras relacionadas</h2><div class="related-links">${calculatorLinks.map(([n,s])=>`<a href="../calculadoras/${s}/">${n}</a>`).join('')}</div></section><section class="financial-note"><h2>Aviso financiero</h2><p>Estas páginas son educativas y no ofrecen recomendaciones individuales. DineroMundo no procesa transferencias. Verifica costos, condiciones y disponibilidad directamente con cada servicio.</p></section></div></div></section><div class="container">${ad}</div></main>`;
  const breadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Inicio',item:'https://dineromundo.com/'},{'@type':'ListItem',position:2,name:'Comparar',item:'https://dineromundo.com/comparar/'}]};
  return shell({title:'Comparaciones de proveedores de transferencias | DineroMundo',description:'Compara características generales, métodos de pago y recepción, acceso digital y disponibilidad de proveedores de transferencias.',canonical:'https://dineromundo.com/comparar/',depth:1,body,directory:true,schema:`<script type="application/ld+json">${JSON.stringify(schemaOrg)}</script><script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`});
}

function faqs(c, a, b) {
  return [
    [`¿Cuál tiene tarifas más bajas, ${a.name} o ${b.name}?`,`No existe una respuesta universal. Depende de la ruta, monto, pago, recepción, conversión, promociones y momento. Compara cotizaciones equivalentes directamente.`],
    [`¿Cuál permite recibir dinero en efectivo?`,`Las posibilidades cambian por ruta. ${a.name}: ${a.cash.toLowerCase()}. ${b.name}: ${b.cash.toLowerCase()}. Confirma la ubicación y disponibilidad antes de pagar.`],
    [`¿Se puede enviar a una cuenta bancaria con ambos?`,`${a.name}: ${a.bankDeposit.toLowerCase()}. ${b.name}: ${b.bankDeposit.toLowerCase()}. Verifica banco, moneda y datos requeridos.`],
    [`¿Necesito una cuenta para usar ${a.name} o ${b.name}?`,`Los requisitos dependen del canal y del mercado. ${a.name}: ${a.account.toLowerCase()}. ${b.name}: ${b.account.toLowerCase()}. Ambos pueden solicitar verificación de identidad.`],
    [`¿Cuánto puede tardar una transferencia?`,`Puede indicar minutos, mismo día o varios días hábiles. Influyen la verificación, pago, recepción, horarios y revisiones de cumplimiento.`],
    [`¿Cómo afecta el tipo de cambio al costo?`,`Una diferencia en la conversión puede reducir el monto recibido incluso cuando la tarifa visible parece baja. Revisa cuánto pagas y cuánto llega en la moneda de destino.`],
    [`¿Se puede cancelar una transferencia?`,`Depende del estado y de las reglas vigentes. Revisa las condiciones y contacta al proveedor inmediatamente.`],
    [`¿Dónde verifico la disponibilidad actual?`,`En el sitio o aplicación oficial de cada proveedor con la ruta, monto y métodos deseados. DineroMundo no sustituye esa confirmación.`]
  ];
}

function comparisonPage(c, index) {
  const a=providers[c.a],b=providers[c.b],previous=comparisons[(index-1+comparisons.length)%comparisons.length],next=comparisons[(index+1)%comparisons.length];
  const rows = [
    ['Tipo de servicio','type'],['Transferencia en línea','online'],['Ubicaciones físicas','physical'],['Pago desde cuenta bancaria','bankPay'],['Pago con tarjeta de débito','debit'],['Pago con tarjeta de crédito','credit'],['Depósito bancario','bankDeposit'],['Retiro en efectivo','cash'],['Billetera móvil','wallet'],['Otros servicios de entrega','other'],['Requisito de cuenta','account'],['Aplicación móvil','app'],['Disponibilidad geográfica','geography'],['Costo final depende de la ruta',null],['Última revisión',null]
  ].map(([label,key])=>`<tr><th scope="row">${label}</th><td>${key?a[key]:label==='Última revisión'?reviewed:'Sí; confirma la cotización'}</td><td>${key?b[key]:label==='Última revisión'?reviewed:'Sí; confirma la cotización'}</td></tr>`).join('');
  const faq=faqs(c,a,b);
  const faqHtml=faq.map(([q,ans])=>`<details><summary>${q}</summary><p>${ans}</p></details>`).join('');
  const body=`<main id="contenido"><section class="comparison-hero"><div class="container"><nav class="breadcrumbs" aria-label="Migas de pan"><ol><li><a href="../../">Inicio</a></li><li><a href="../">Comparar</a></li><li aria-current="page">${a.name} vs ${b.name}</li></ol></nav><p class="eyebrow">Comparación de proveedores</p><h1>${a.name} vs ${b.name}</h1><p class="hero-lede">${c.summary}</p><p class="review-date">Última revisión: ${reviewed}</p><div class="comparison-disclaimer"><strong>Importante</strong><p>Esta comparación es informativa y no utiliza tarifas ni tipos de cambio en vivo. Los costos, límites, promociones, métodos y tiempos pueden cambiar. Confirma siempre los detalles directamente con cada proveedor antes de enviar dinero.</p></div></div></section><div class="container">${ad}</div>
  <section class="section"><div class="container review-content"><section><h2>Comparación rápida</h2><div class="comparison-table-wrap" tabindex="0" role="region" aria-label="Tabla comparativa de ${a.name} y ${b.name}"><table><caption>Características generales; la disponibilidad puede variar.</caption><thead><tr><th scope="col">Característica</th><th scope="col">${a.name}</th><th scope="col">${b.name}</th></tr></thead><tbody>${rows}</tbody></table></div></section>
  <section><h2>Diferencias principales</h2>${c.differences.map(p=>`<p>${p}</p>`).join('')}</section>
  <section><h2>Acceso en línea y presencial</h2><p>${a.name}: ${a.type}; acceso físico: ${a.physical.toLowerCase()}. ${b.name}: ${b.type}; acceso físico: ${b.physical.toLowerCase()}. Confirma el canal para tu ruta.</p></section>
  <section><h2>Métodos de pago</h2><p>Banco, débito y crédito pueden modificar costo y tiempo. También podrían existir cargos externos.</p><div class="review-columns"><article class="review-card"><h3>${a.name}</h3><p>Banco: ${a.bankPay}. Débito: ${a.debit}. Crédito: ${a.credit}.</p></article><article class="review-card"><h3>${b.name}</h3><p>Banco: ${b.bankPay}. Débito: ${b.debit}. Crédito: ${b.credit}.</p></article></div></section>
  <section><h2>Métodos de recepción</h2><p>Comprueba institución, agente, moneda e identificación para la ruta exacta.</p><div class="review-columns"><article class="review-card"><h3>${a.name}</h3><p>Banco: ${a.bankDeposit}. Efectivo: ${a.cash}. Billetera: ${a.wallet}. ${a.other}.</p></article><article class="review-card"><h3>${b.name}</h3><p>Banco: ${b.bankDeposit}. Efectivo: ${b.cash}. Billetera: ${b.wallet}. ${b.other}.</p></article></div></section>
  <section><h2>Tarifas y tipos de cambio</h2><p>El costo puede incluir tarifa, diferencia cambiaria, cargos de pago o recepción, entrega rápida y comisiones externas.</p><p><strong>No compares únicamente la tarifa anunciada. Revisa el monto total que pagas, el tipo de cambio y cuánto recibe finalmente el destinatario.</strong></p><p><a href="../../calculadoras/costo-envio-dinero/">Usa la calculadora de costo de envío</a> con cotizaciones directas.</p></section>${ad}
  <section><h2>Tiempo de transferencia</h2><p>Puede indicar minutos, mismo día o varios días hábiles. Verificación, datos, horarios, fines de semana, pago, recepción y cumplimiento pueden causar demoras.</p></section>
  <section><h2>Cuenta e identificación</h2><p>${a.name}: ${a.account}. ${b.name}: ${b.account}. Pueden solicitar identidad y datos del destinatario.</p></section>
  <section><h2>Disponibilidad por país y ruta</h2><p>${a.name}: ${a.geography}. ${b.name}: ${b.geography}. La presencia de una marca no garantiza todas las funciones.</p></section>
  <section><h2>Límites de transferencia</h2><p>Dependen del canal, verificación, país y pago. Confirma los límites antes de enviar.</p></section>
  <section><h2>Seguridad y prevención de fraude</h2><p>Usa canales oficiales, protege códigos, verifica al destinatario y desconfía de premios o emergencias dudosas.</p></section>
  <section><h2>Atención al cliente</h2><p>Usa canales oficiales; conserva la referencia.</p></section>
  <section><h2>Cancelaciones y reembolsos</h2><p>Dependen del estado y las reglas. Ante un error, contacta al proveedor inmediatamente.</p></section>
  <section><h2>Aspectos destacados de ${a.name}</h2><ul>${a.strengths.map(x=>`<li>${x}</li>`).join('')}</ul></section>
  <section><h2>Aspectos destacados de ${b.name}</h2><ul>${b.strengths.map(x=>`<li>${x}</li>`).join('')}</ul></section>
  <section><h2>${a.name} puede ser una opción para comparar cuando…</h2><ul>${a.scenarios.map(x=>`<li>${x}.</li>`).join('')}</ul><p>Confirma la ruta y el resultado final.</p></section>
  <section><h2>${b.name} puede ser una opción para comparar cuando…</h2><ul>${b.scenarios.map(x=>`<li>${x}.</li>`).join('')}</ul><p>La utilidad depende de la ruta.</p></section>
  <section class="comparison-checklist-section"><h2>Checklist para comparar paso a paso</h2><ol class="process-list"><li>Confirma país emisor y destino.</li><li>Solicita cotizaciones para el mismo monto.</li><li>Compara pago total y cantidad recibida.</li><li>Revisa tipo de cambio y tarifa visible.</li><li>Confirma costos del método de pago.</li><li>Compara tiempo y forma de recepción.</li><li>Comprueba límites e identificación.</li><li>Lee cancelación y reembolso.</li></ol><ul class="comparison-checklist">${['País emisor admitido','Destino admitido','Pago total del remitente','Monto final del destinatario','Tipo de cambio aplicado','Tarifa visible','Costo del método de pago','Tiempo de entrega','Método de recepción','Límite de transferencia','Identificación requerida','Requisitos del destinatario','Reglas de cancelación','Reglas de reembolso','Método de seguimiento','Acceso a atención al cliente'].map(x=>`<li>${x}</li>`).join('')}</ul><button class="btn btn-secondary print-checklist" type="button" onclick="window.print()">Imprimir checklist</button><p class="source-note">La lista no guarda ni transmite selecciones.</p></section>
  <section><h2>Guías por país relacionadas</h2><p>La disponibilidad y los métodos pueden variar. Consulta la guía del país y confirma los detalles directamente con el proveedor.</p><div class="provider-country-grid">${countryLinks.map(([n,s])=>`<a href="../../paises/${s}/">${n}</a>`).join('')}</div></section>
  <section><h2>Calculadoras relacionadas</h2><div class="related-links">${calculatorLinks.map(([n,s])=>`<a href="../../calculadoras/${s}/">${n}</a>`).join('')}</div></section>
  <section><h2>Reseñas relacionadas</h2><div class="review-columns"><a class="card provider-review-link" href="../../proveedores/${c.a}/">Análisis de ${a.name}</a><a class="card provider-review-link" href="../../proveedores/${c.b}/">Análisis de ${b.name}</a></div></section>
  <section class="provider-faq"><h2>Preguntas frecuentes</h2>${faqHtml}</section>${ad}
  <section><h2>Fuentes y metodología</h2><p>DineroMundo organiza información pública con fines educativos, sin precios en vivo ni procesamiento de transferencias. Verifica cambios directamente. Una afiliación futura tendría que divulgarse.</p><ul class="source-list"><li><a href="../../proveedores/${c.a}/">Reseña y fuentes de ${a.name}</a></li><li><a href="../../proveedores/${c.b}/">Reseña y fuentes de ${b.name}</a></li><li><a href="../../metodologia/">Metodología editorial de DineroMundo</a></li></ul><p class="review-date">Última revisión: ${reviewed}</p></section>
  <section class="financial-note"><h2>Aviso financiero</h2><p>Esta comparación ofrece información general y no asesoría financiera, legal o personal. Las tarifas, tipos de cambio, límites, promociones, métodos y tiempos pueden cambiar. Verifica los datos con ambos proveedores antes de transferir.</p></section></div></section>
  <div class="container"><nav class="provider-nav" aria-label="Navegación entre comparaciones"><a href="../${previous.slug}/">← ${providers[previous.a].name} vs ${providers[previous.b].name}</a><a class="directory-link" href="../">Todas las comparaciones</a><a class="next" href="../${next.slug}/">${providers[next.a].name} vs ${providers[next.b].name} →</a></nav></div></main>`;
  const breadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Inicio',item:'https://dineromundo.com/'},{'@type':'ListItem',position:2,name:'Comparar',item:'https://dineromundo.com/comparar/'},{'@type':'ListItem',position:3,name:`${a.name} vs ${b.name}`,item:`https://dineromundo.com/comparar/${c.slug}/`}]};
  const faqSchema={'@context':'https://schema.org','@type':'FAQPage',mainEntity:faq.map(([q,ans])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:ans}}))};
  return shell({title:c.title,description:c.description,canonical:`https://dineromundo.com/comparar/${c.slug}/`,depth:2,body,schema:`<script type="application/ld+json">${JSON.stringify(schemaOrg)}</script><script type="application/ld+json">${JSON.stringify(breadcrumb)}</script><script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`});
}

const compareRoot=path.join(root,'comparar');
fs.mkdirSync(compareRoot,{recursive:true});
fs.writeFileSync(path.join(compareRoot,'index.html'),directoryPage());
comparisons.forEach((c,i)=>{const dir=path.join(compareRoot,c.slug);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),comparisonPage(c,i));});

// Add Phase 5 links without rewriting approved page content.
const related = Object.fromEntries(Object.keys(providers).map(slug=>[slug,comparisons.filter(c=>c.a===slug||c.b===slug)]));
for(const [slug,items] of Object.entries(related)){
  const file=path.join(root,'proveedores',slug,'index.html');
  let html=fs.readFileSync(file,'utf8');
  const section=`<section class="comparison-upcoming"><h2>Comparaciones relacionadas</h2><div class="related-links">${items.map(c=>`<a href="../../comparar/${c.slug}/">${providers[c.a].name} vs ${providers[c.b].name}</a>`).join('')}</div></section>`;
  html=html.replace(/<section class="comparison-upcoming">[\s\S]*?<\/section>/,section);
  fs.writeFileSync(file,html);
}

// Add a modest homepage link and shared footer link idempotently.
const htmlFiles=[];
const walk=(dir)=>fs.readdirSync(dir,{withFileTypes:true}).forEach(e=>{if(e.name==='.git'||e.name==='.agents'||e.name==='comparar')return;const f=path.join(dir,e.name);if(e.isDirectory())walk(f);else if(e.name==='index.html')htmlFiles.push(f);});
walk(root);
for(const file of htmlFiles){
  let html=fs.readFileSync(file,'utf8');
  const depth=path.relative(root,path.dirname(file)).split(path.sep).filter(Boolean).length;
  const rel='../'.repeat(depth);
  if(!html.includes('>Comparar proveedores</a>')){
    html=html.replace(/(<li><a href="[^"]*proveedores\/">Proveedores<\/a><\/li>)/,`$1<li><a href="${rel}comparar/">Comparar proveedores</a></li>`);
  }
  fs.writeFileSync(file,html);
}
let home=fs.readFileSync(path.join(root,'index.html'),'utf8');
if(!home.includes('class="provider-compare-link"')) home=home.replace(/(<div class="section-head"><div><p class="eyebrow">Conoce tus opciones<\/p><h2 id="providers-title">Explora proveedores de transferencias<\/h2><p>[^<]+<\/p><\/div>)(<\/div>)/,`$1<a class="provider-compare-link" href="comparar/">Comparar proveedores</a>$2`);
fs.writeFileSync(path.join(root,'index.html'),home);

const sitemap=path.join(root,'sitemap.xml');
let xml=fs.readFileSync(sitemap,'utf8');
const newUrls=['https://dineromundo.com/comparar/',...comparisons.map(c=>`https://dineromundo.com/comparar/${c.slug}/`)];
for(const url of newUrls) if(!xml.includes(`<loc>${url}</loc>`)) xml=xml.replace('</urlset>',`  <url><loc>${url}</loc></url>\\n</urlset>`);
fs.writeFileSync(sitemap,xml);
console.log(`Phase 5 generated: ${comparisons.length} comparison pages and directory.`);
