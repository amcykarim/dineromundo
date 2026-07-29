import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const reviewed = '28 de julio de 2026';
const countries = [
  ['mexico', 'México'], ['colombia', 'Colombia'],
  ['republica-dominicana', 'República Dominicana'], ['guatemala', 'Guatemala'],
  ['honduras', 'Honduras'], ['el-salvador', 'El Salvador'],
  ['peru', 'Perú'], ['ecuador', 'Ecuador']
];

const providers = [
  {
    slug: 'wise', name: 'Wise',
    title: 'Wise: cómo funciona, costos y opciones | DineroMundo',
    description: 'Análisis educativo de Wise: funcionamiento, métodos de pago, depósito bancario, costos, tipos de cambio y aspectos que debes comparar.',
    overview: 'Servicio digital para transferencias internacionales. El depósito bancario es un método central; pagos y monedas disponibles cambian según ubicación y ruta.',
    directory: 'Servicio digital enfocado en transferencias internacionales y depósitos en cuentas compatibles.',
    delivery: 'Depósito bancario y transferencias a cuentas compatibles; otras opciones dependen de la ruta.',
    payment: 'Cuenta bancaria, saldo de Wise y tarjetas elegibles donde estén disponibles.',
    capabilities: ['bank', 'debit', 'credit', 'online'],
    key: {
      type: 'Servicio digital de transferencias y cuenta multidivisa',
      online: 'Sí, mediante sitio web y aplicación',
      physical: 'No se centra en una red tradicional de agentes',
      bank: 'Método principal en muchas rutas',
      cash: 'No es el enfoque habitual del servicio',
      wallet: 'Puede variar; no se presenta como método general',
      debit: 'Disponible para determinadas monedas y ubicaciones',
      credit: 'Disponible para determinadas monedas y ubicaciones',
      account: 'Cuenta bancaria o saldo de Wise, según la operación',
      app: 'Aplicación móvil disponible',
      requirement: 'Normalmente requiere registro y verificación',
      geography: 'Varía por país, moneda y ruta'
    },
    works: 'Wise permite configurar una transferencia digital indicando monedas y datos del receptor. Antes de confirmar, muestra las formas de pago habilitadas. La transferencia bancaria es una opción habitual y, según la región, pueden aparecer tarjetas u otros métodos. El destinatario suele recibir en una cuenta compatible.',
    ways: 'El envío se inicia en línea o en la aplicación y puede financiarse desde una cuenta bancaria, un saldo Wise u otros métodos mostrados. Wise no se centra en una red física tradicional ni en retiro de efectivo; quien necesite efectivo debe comparar otro servicio.',
    fees: 'Wise presenta la conversión y la tarifa antes de confirmar, pero eso no significa que siempre tenga el menor costo. El precio depende de monedas, importe, pago y ruta; una tarjeta o banco externo puede añadir costos. Revisa tasa, tarifa e importe final.',
    speed: 'El tiempo puede ser de minutos o varios días hábiles. Depende de cuándo Wise recibe el pago, la moneda, el banco receptor, la verificación y los horarios. La estimación no constituye una promesa.',
    limits: 'Los límites y documentos dependen de moneda, ruta, importe y regulación. Algunas operaciones requieren evidencia del origen de fondos. Confirma los límites dentro de la plataforma.',
    security: 'Wise utiliza registro, verificación de identidad y controles de pago. El nombre de la cuenta bancaria normalmente debe coincidir con la cuenta Wise. Revisa los datos y evita solicitudes inesperadas.',
    advantages: ['Experiencia principalmente digital para configurar y seguir transferencias.', 'Depósito bancario como método de entrega importante en muchas rutas.', 'Desglose visible de tasa, tarifa e importe recibido antes de confirmar.', 'Posibilidad de financiar desde cuenta bancaria, saldo u otros métodos cuando estén habilitados.'],
    disadvantages: ['No es la opción principal para quien necesita una amplia red tradicional de retiro en efectivo.', 'Las formas de pago y monedas admitidas cambian según ubicación y ruta.', 'El pago con tarjeta puede tener un costo distinto al pago bancario.', 'Puede requerirse documentación adicional para ciertas operaciones o importes.'],
    useful: 'Puede compararse cuando se prefiere un proceso digital, el destinatario recibe en una cuenta compatible y se desea revisar tarifa y conversión antes de confirmar.',
    alternatives: 'Conviene comparar alternativas cuando la persona destinataria necesita retirar efectivo, cuando la ruta no está disponible, cuando el método de pago preferido no aparece o cuando otra plataforma ofrece una modalidad de recepción más conveniente. Compara siempre el importe final recibido.',
    sources: [
      ['Cómo enviar dinero con Wise', 'https://wise.com/help/articles/2977959/how-do-i-send-money-with-wise'],
      ['Cómo pagar mediante transferencia bancaria', 'https://wise.com/help/articles/2559761/how-to-pay-by-bank-transfer'],
      ['Cómo pagar con tarjeta', 'https://wise.com/help/articles/2556723/how-to-pay-by-card']
    ]
  },
  {
    slug: 'western-union', name: 'Western Union',
    title: 'Western Union: envíos, tarifas y métodos | DineroMundo',
    description: 'Análisis educativo de Western Union: envíos en línea y presenciales, retiro en efectivo, depósitos, pagos, costos y disponibilidad.',
    overview: 'Servicio con canales digitales y ubicaciones físicas. Puede ofrecer retiro, depósito o billetera según país y ruta.',
    directory: 'Servicio con opciones en línea y presenciales, conocido por su red de retiro en efectivo.',
    delivery: 'Retiro en efectivo, depósito bancario y billetera móvil donde estén disponibles.',
    payment: 'Cuenta bancaria, débito, crédito o efectivo en ubicaciones participantes.',
    capabilities: ['bank', 'cash', 'wallet', 'debit', 'credit', 'online', 'physical'],
    key: {
      type: 'Transferencias digitales y mediante agentes',
      online: 'Sí, donde el canal digital está disponible',
      physical: 'Sí, en ubicaciones participantes',
      bank: 'Disponible en determinadas rutas',
      cash: 'Método importante mediante agentes participantes',
      wallet: 'Disponible en determinados países y billeteras',
      debit: 'Puede estar disponible según el canal',
      credit: 'Puede estar disponible; el emisor podría cobrar aparte',
      account: 'Puede estar disponible según el país de envío',
      app: 'Aplicación móvil disponible en determinados mercados',
      requirement: 'Perfil para envíos digitales; requisitos distintos en persona',
      geography: 'Métodos y disponibilidad varían por país y ruta'
    },
    works: 'Western Union permite iniciar transferencias en su sitio, aplicación o una ubicación participante. El remitente elige país, importe, pago y recepción disponible. Para retiro en efectivo se genera un número de control que debe conservarse con cuidado. Los depósitos y billeteras requieren datos específicos.',
    ways: 'La combinación de canales digitales y agentes físicos permite iniciar operaciones en línea o en persona. En algunos mercados una transferencia puede pagarse con cuenta bancaria, tarjeta de débito, tarjeta de crédito o efectivo en una ubicación. Estas opciones no son universales. El sistema muestra las alternativas compatibles después de seleccionar origen, destino e importe.',
    fees: 'El costo cambia con ruta, canal, pago, velocidad y recepción. Cuando hay conversión, la tasa también importa. Una tarjeta de crédito puede generar un cargo externo de adelanto de efectivo. Compara tarifa, tasa e importe recibido.',
    speed: 'Puede mostrar minutos, mismo día o varios días hábiles. El tiempo real depende del pago, agente, horario bancario, verificación, festivos y exactitud de los datos. No todo retiro estará listo inmediatamente.',
    limits: 'Los límites varían por país, canal, perfil, historial y método. Una operación en línea puede tener condiciones distintas de una realizada en una agencia. El proveedor o agente puede solicitar identificación adicional y documentación sobre la operación.',
    security: 'Las operaciones usan números de seguimiento y pueden requerir verificación de identidad. El remitente debe compartir el número de control solo con la persona destinataria, verificar nombres tal como aparecen en la identificación y desconfiar de solicitudes para enviar dinero a desconocidos.',
    advantages: ['Canales digitales y ubicaciones físicas donde estén disponibles.', 'Retiro en efectivo como modalidad relevante para personas sin cuenta bancaria.', 'Depósito bancario y billetera móvil en determinadas rutas.', 'Número de control para consultar el estado de la transferencia.'],
    disadvantages: ['El costo puede cambiar de forma importante según forma de pago y entrega.', 'La disponibilidad de agentes y métodos depende de la ubicación.', 'Una tarjeta de crédito puede ocasionar cargos externos adicionales.', 'El retiro puede requerir desplazamiento, identificación y horario de atención.'],
    useful: 'Este servicio puede ser una opción para comparar cuando el destinatario necesita retiro en efectivo, cuando el remitente prefiere una ubicación física o cuando se desea elegir entre depósito, efectivo y billetera disponible.',
    alternatives: 'Compara alternativas si se prefiere un flujo bancario, una ubicación no es accesible, falta el método deseado o el importe final resulta menos conveniente.',
    sources: [
      ['Enviar dinero internacionalmente', 'https://www.westernunion.com/us/en/send-money.html'],
      ['Enviar a una cuenta bancaria', 'https://www.westernunion.com/us/en/send-to-bank-account.html'],
      ['Enviar y recibir dinero', 'https://www.westernunion.com/us/en/home.html']
    ]
  },
  {
    slug: 'remitly', name: 'Remitly',
    title: 'Remitly: análisis del servicio de transferencias | DineroMundo',
    description: 'Análisis educativo de Remitly: transferencias digitales, depósito bancario, retiro en efectivo, billeteras, pagos y costos.',
    overview: 'Servicio digital de remesas que puede ofrecer depósito bancario, retiro en efectivo, billetera móvil, entrega a domicilio u otras modalidades según el destino.',
    directory: 'Servicio digital de remesas con varias modalidades de entrega según el país destinatario.',
    delivery: 'Depósito bancario, retiro, billetera móvil o entrega disponible según destino.',
    payment: 'Débito, crédito y otros métodos que la plataforma habilite para el remitente.',
    capabilities: ['bank', 'cash', 'wallet', 'debit', 'credit', 'online'],
    key: {
      type: 'Servicio digital de remesas',
      online: 'Sí, mediante sitio web y aplicación',
      physical: 'No se centra en ubicaciones físicas para el remitente',
      bank: 'Disponible para determinados destinos',
      cash: 'Disponible mediante socios en determinadas rutas',
      wallet: 'Disponible en determinados países y servicios',
      debit: 'Puede utilizarse donde esté habilitada',
      credit: 'Puede utilizarse donde esté habilitada',
      account: 'Otros métodos pueden aparecer según el mercado',
      app: 'Aplicación móvil disponible',
      requirement: 'Requiere registro; puede solicitar verificación',
      geography: 'Modalidades diferentes según origen y destino'
    },
    works: 'Remitly funciona como un servicio digital: el remitente crea una cuenta, elige país, importe, velocidad y forma de entrega, añade los datos del destinatario y selecciona un método de pago disponible. La persona receptora no necesariamente necesita la aplicación; puede recibir mediante banco, retiro, billetera, entrega u otra modalidad habilitada para la ruta.',
    ways: 'El envío se configura en la web o aplicación. Las tarjetas de débito y crédito son métodos documentados en determinados mercados, pero pueden existir otras alternativas. La modalidad de recepción cambia con el destino y el socio local. Una opción visible para un país no implica que esté disponible para todas las ciudades, importes o destinatarios.',
    fees: 'La plataforma puede mostrar promociones o condiciones para determinados usuarios, pero estas cambian y no deben tratarse como precio permanente. Evalúa el costo regular aplicable a tu operación. Revisa tarifa, tasa de cambio, método de pago, velocidad y cantidad recibida. Una entidad bancaria o tarjeta podría imponer cargos externos.',
    speed: 'La velocidad seleccionada es una estimación condicionada por forma de pago, entrega, revisión de la transacción y disponibilidad de los socios. Una transferencia puede clasificarse en minutos, mismo día o varios días hábiles. La verificación y los datos incorrectos pueden alargar el proceso.',
    limits: 'Los límites dependen de cuenta, origen, destino, método y verificación. Remitly puede solicitar identificación. La entrega, billetera o retiro tiene condiciones del socio receptor.',
    security: 'La cuenta puede requerir verificación de identidad y la operación se supervisa antes de completarse. Revisa notificaciones dentro de canales oficiales, confirma la información del destinatario y no envíes fondos como respuesta a premios, amenazas o solicitudes inesperadas.',
    advantages: ['Proceso digital desde la web o aplicación.', 'Varias modalidades de entrega en destinos compatibles.', 'Posibilidad de comparar opciones de velocidad mostradas para la ruta.', 'Seguimiento y notificaciones asociados a la transferencia.'],
    disadvantages: ['Las modalidades disponibles cambian mucho entre destinos.', 'Una promoción temporal no representa el costo de transferencias futuras.', 'Algunos métodos pueden depender de socios y horarios locales.', 'Puede solicitarse verificación adicional antes de liberar la operación.'],
    useful: 'Este servicio puede ser una opción para comparar cuando se prefiere enviar digitalmente y el destinatario necesita elegir entre banco, efectivo, billetera o una modalidad local disponible.',
    alternatives: 'Conviene comparar alternativas cuando se necesita iniciar el envío físicamente, cuando el socio de entrega no es accesible, cuando una modalidad no aparece para la ruta o cuando otra opción entrega un importe final más favorable.',
    sources: [
      ['Opciones de retiro en efectivo', 'https://www.remitly.com/us/en/landing/cash-pickup'],
      ['Aplicación y métodos de entrega', 'https://www.remitly.com/us/en/home/mobile-app'],
      ['Información general de envíos', 'https://www.remitly.com/us/en/home/app-download']
    ]
  },
  {
    slug: 'moneygram', name: 'MoneyGram',
    title: 'MoneyGram: cómo enviar y recibir dinero | DineroMundo',
    description: 'Análisis educativo de MoneyGram: envíos digitales y mediante agentes, retiro, depósitos, billeteras, pagos y costos.',
    overview: 'Servicio que combina envíos en línea y ubicaciones de agentes. Puede ofrecer retiro en efectivo, depósito bancario, tarjeta de débito o billetera móvil según la ruta.',
    directory: 'Servicio con operaciones digitales y agentes, además de diferentes métodos de recepción.',
    delivery: 'Retiro en efectivo, cuenta bancaria, tarjeta o billetera donde estén disponibles.',
    payment: 'Cuenta, tarjeta o efectivo en determinadas ubicaciones y mercados.',
    capabilities: ['bank', 'cash', 'wallet', 'debit', 'credit', 'online', 'physical'],
    key: {
      type: 'Transferencias digitales y mediante agentes',
      online: 'Sí, en mercados compatibles',
      physical: 'Sí, mediante ubicaciones participantes',
      bank: 'Disponible en determinadas rutas',
      cash: 'Disponible mediante agentes participantes',
      wallet: 'Disponible con billeteras compatibles',
      debit: 'Pago o recepción según mercado y producto',
      credit: 'Puede estar disponible para pagos digitales',
      account: 'Puede estar disponible según el país de envío',
      app: 'Aplicación móvil disponible en determinados mercados',
      requirement: 'Cuenta para el canal digital; condiciones distintas en agentes',
      geography: 'Métodos y socios cambian por ubicación'
    },
    works: 'MoneyGram permite configurar determinadas transferencias en línea y otras en una ubicación de agente. El remitente selecciona la ruta, el importe, la forma de recepción y el pago que se muestre como disponible. Para retiro en efectivo, el destinatario suele necesitar identificación y un número de referencia. Los depósitos digitales requieren datos correctos de cuenta, tarjeta o billetera.',
    ways: 'En una ubicación participante el pago suele realizarse en efectivo y algunas aceptan débito; el canal en línea puede presentar cuenta bancaria, tarjeta u opciones digitales. La combinación depende del mercado. La presencia de una modalidad en la información general no garantiza que esté habilitada para una ruta concreta.',
    fees: 'El importe entregado debe ser el centro de la comparación, no únicamente la tarifa visible. El costo puede incluir conversión, forma de pago, canal y recepción. Bancos, emisores de tarjetas o billeteras pueden aplicar cargos propios. Revisa el resumen completo antes de confirmar.',
    speed: 'Algunas operaciones pueden estar disponibles en minutos, mientras que depósitos y revisiones pueden requerir el mismo día o varios días hábiles. Influyen el pago, la entrega, la institución receptora, la verificación y el horario del agente.',
    limits: 'Importes permitidos y requisitos dependen de la ubicación, la cuenta, la ruta y el método. Una agencia puede aplicar procedimientos diferentes al canal digital. La disponibilidad debe confirmarse en la plataforma o ubicación elegida.',
    security: 'El retiro en efectivo requiere normalmente identificación válida y número de referencia. MoneyGram documenta controles de verificación y monitoreo. Conserva el recibo, no compartas el número con terceros y verifica que el nombre coincida con la identificación.',
    advantages: ['Opción de iniciar determinadas transferencias en línea o con un agente.', 'Retiro en efectivo para destinatarios que no usan cuenta bancaria.', 'Depósito, tarjeta y billetera en rutas compatibles.', 'Número de referencia para seguimiento y retiro.'],
    disadvantages: ['Métodos y formas de pago cambian por mercado y ubicación.', 'El costo total puede diferir según canal y recepción.', 'El retiro depende de horarios, documentos y disponibilidad de efectivo.', 'Algunas transferencias pueden requerir revisión o información adicional.'],
    useful: 'Este servicio puede ser una opción para comparar cuando se busca retiro en efectivo, acceso a una agencia o distintas modalidades digitales disponibles para el destinatario.',
    alternatives: 'Compara otros servicios si necesitas una modalidad no disponible, si prefieres exclusivamente depósito bancario, si el agente está lejos o si otra alternativa ofrece un importe final recibido más conveniente.',
    sources: [
      ['Cómo recibir dinero', 'https://www.moneygram.com/us/en/send-and-receive/receiving-money/'],
      ['Preguntas sobre envíos en ubicaciones', 'https://www.moneygram.com/us/en/help-center/faq/send-receive/send-money-at-location'],
      ['Transferencias en línea', 'https://www.moneygram.com/us/en/send-and-receive/money-transfers-online']
    ]
  },
  {
    slug: 'ria-money-transfer', name: 'Ria Money Transfer',
    title: 'Ria Money Transfer: funcionamiento y opciones | DineroMundo',
    description: 'Análisis educativo de Ria Money Transfer: envíos en línea y físicos, retiro, depósito, billeteras, métodos de pago y costos.',
    overview: 'Servicio con opciones digitales y físicas donde están disponibles. Puede ofrecer retiro en efectivo, depósito bancario, billetera móvil o entrega limitada según la ruta.',
    directory: 'Servicio de remesas con canales en línea y ubicaciones físicas en mercados compatibles.',
    delivery: 'Retiro en efectivo, depósito bancario, billetera o entrega donde estén disponibles.',
    payment: 'Cuenta bancaria, débito, crédito, efectivo u opciones locales según mercado.',
    capabilities: ['bank', 'cash', 'wallet', 'debit', 'credit', 'online', 'physical'],
    key: {
      type: 'Transferencias digitales y mediante ubicaciones',
      online: 'Disponible en determinados países',
      physical: 'Disponible mediante Ria y socios participantes',
      bank: 'Disponible para determinadas rutas',
      cash: 'Método importante en ubicaciones participantes',
      wallet: 'Disponible en determinadas rutas',
      debit: 'Disponible según país y canal',
      credit: 'Disponible según país y canal',
      account: 'Disponible en determinados mercados',
      app: 'Aplicación disponible en países compatibles',
      requirement: 'Registro para canal digital; identificación en ubicaciones',
      geography: 'Debe confirmarse por país de envío y destino'
    },
    works: 'Ria permite iniciar transferencias en su aplicación, sitio web, socios digitales o ubicaciones físicas, dependiendo del país. El remitente elige cómo pagar y cómo recibirá la otra persona. La documentación oficial describe depósito bancario, retiro, billetera móvil y entrega a domicilio en destinos limitados.',
    ways: 'Las formas de pago en línea varían por país e incluyen tarjetas, cuentas y opciones locales. En ubicaciones participantes puede aceptarse efectivo o débito según el establecimiento. La disponibilidad concreta solo se conoce al seleccionar origen, destino, importe y canal.',
    fees: 'La tarifa del servicio se muestra antes de autorizar una transferencia digital, pero puede haber costos gubernamentales, bancarios o del método de pago. Una tarjeta de crédito puede tratar la operación como adelanto de efectivo. Compara tasa, tarifa y cantidad final recibida.',
    speed: 'El plazo puede pertenecer a categorías de minutos, mismo día o días hábiles. Importe, restricciones del destino, horario del agente, exactitud de los datos, forma de pago y revisión de cumplimiento pueden afectar la entrega.',
    limits: 'Los límites cambian por país, canal, identidad, ruta y método. La entrega a domicilio está disponible solamente en destinos seleccionados. Una ubicación o socio puede imponer requisitos adicionales.',
    security: 'Ria puede solicitar identificación del remitente y del destinatario, además de autorizaciones bancarias o de tarjeta. Conserva el PIN o número de orden, verifica nombres y datos, y utiliza únicamente canales oficiales para rastrear la operación.',
    advantages: ['Canales en línea y ubicaciones físicas en mercados compatibles.', 'Retiro en efectivo y depósito bancario para determinadas rutas.', 'Billetera y entrega limitada donde estén disponibles.', 'Diversidad de métodos de pago locales según el país.'],
    disadvantages: ['El canal digital no está disponible de la misma manera en todos los países.', 'Los métodos de entrega y pago cambian según la ruta.', 'Tarjeta de crédito y terceros pueden generar cargos externos.', 'El retiro depende de agentes, horarios e identificación.'],
    useful: 'Este servicio puede ser una opción para comparar cuando se desea retiro en efectivo, depósito bancario o acceso a una ubicación física, siempre que la ruta y el canal estén disponibles.',
    alternatives: 'Conviene evaluar alternativas cuando Ria digital no opera desde el país de envío, cuando el punto de retiro no es conveniente, cuando se necesita otra modalidad o cuando el costo total comparado resulta menos favorable.',
    sources: [
      ['Cómo enviar dinero con Ria', 'https://help.riamoneytransfer.com/hc/en-us/articles/4406285759377-How-do-I-send-money-with-Ria'],
      ['Opciones de entrega', 'https://help.riamoneytransfer.com/hc/en-us/articles/4407687013137-What-are-the-delivery-options-when-I-send-money'],
      ['Opciones de pago en línea', 'https://help.riamoneytransfer.com/hc/en-us/articles/7907355982097-What-are-my-payment-options-online']
    ]
  },
  {
    slug: 'xoom', name: 'Xoom',
    title: 'Xoom: transferencias internacionales y métodos | DineroMundo',
    description: 'Análisis educativo de Xoom, servicio de PayPal: depósitos, retiro, billeteras, recargas, pago de facturas, costos y disponibilidad.',
    overview: 'Servicio digital de PayPal para enviar dinero y, donde esté disponible, realizar depósitos, retiro en efectivo, recargas móviles o pagos de facturas.',
    directory: 'Servicio digital de PayPal con funciones de transferencia y servicios que varían por país.',
    delivery: 'Depósito bancario, retiro, tarjeta o billetera según el destino.',
    payment: 'Métodos guardados en PayPal y opciones mostradas para la operación.',
    capabilities: ['bank', 'cash', 'wallet', 'debit', 'credit', 'online'],
    key: {
      type: 'Servicio digital asociado con PayPal',
      online: 'Sí, mediante sitio web y aplicación',
      physical: 'No acepta efectivo como canal general de envío',
      bank: 'Disponible para determinados destinos',
      cash: 'Retiro disponible mediante socios en ciertas rutas',
      wallet: 'Disponible en determinados países',
      debit: 'Puede utilizarse mediante métodos elegibles',
      credit: 'Puede utilizarse mediante métodos elegibles',
      account: 'Puede utilizar métodos guardados en PayPal',
      app: 'Aplicación móvil disponible',
      requirement: 'Requiere cuenta de PayPal o registro compatible',
      geography: 'Funciones varían significativamente por país'
    },
    works: 'Xoom es un servicio de PayPal. El usuario inicia sesión con una cuenta personal de PayPal o completa el registro permitido, selecciona una función, el destino y el importe, y revisa las modalidades disponibles. Además de transferencias, determinadas rutas pueden admitir recarga móvil o pago de facturas.',
    ways: 'El proceso es digital. Los fondos pueden enviarse a cuenta bancaria, tarjeta elegible, billetera o retiro, según el país. El pago utiliza métodos disponibles o guardados en PayPal, que pueden incluir cuenta bancaria, tarjeta o saldo en determinados casos. Xoom no acepta efectivo como método general para iniciar una transferencia digital.',
    fees: 'Xoom muestra la tarifa y el importe estimado antes de confirmar, pero el costo total también puede incluir diferencia cambiaria y cargos de la forma de pago o institución receptora. Las opciones guardadas en PayPal no necesariamente tienen el mismo costo. Compara la conversión completa.',
    speed: 'Las categorías pueden ser minutos, mismo día o días hábiles. El método de financiación, el banco, el socio de retiro, la verificación y el país influyen. Las descripciones de velocidad para una ruta no deben aplicarse a otra.',
    limits: 'Las funciones y límites cambian de forma importante por país, tipo de servicio, cuenta y verificación. El pago de facturas, la recarga o el retiro pueden no aparecer en todos los destinos. Confirma dentro del flujo antes de depender de una modalidad.',
    security: 'Xoom utiliza el acceso de PayPal y controles de verificación y monitoreo. Protege las credenciales de PayPal, activa los mecanismos de seguridad disponibles y confirma destinatario, cuenta, teléfono o factura antes de autorizar.',
    advantages: ['Integración con una cuenta personal de PayPal.', 'Proceso digital mediante web o aplicación.', 'Depósito, retiro, billetera, recarga o facturas en mercados compatibles.', 'Resumen de tarifa e importe antes de confirmar.'],
    disadvantages: ['Las funciones cambian significativamente según el país.', 'No es un canal general para iniciar operaciones con efectivo.', 'El costo puede variar con el método de financiación y la conversión.', 'Determinadas funciones dependen de bancos, socios y productos compatibles.'],
    useful: 'Este servicio puede ser una opción para comparar cuando la persona ya utiliza PayPal, prefiere un flujo digital o necesita una función compatible como depósito, retiro, recarga o pago de factura.',
    alternatives: 'Compara alternativas si necesitas pagar en efectivo, usar una ubicación de agente, acceder a una función no disponible para el destino o encontrar un mejor importe final después de todos los costos.',
    sources: [
      ['Qué es Xoom y cómo funciona', 'https://www.paypal.com/us/cshelp/article/what-is-xoom-and-how-does-it-work-help228'],
      ['Servicios de transferencia de Xoom', 'https://www.xoom.com/money-transfer'],
      ['Métodos de pago de PayPal', 'https://www.paypal.com/us/cshelp/article/what-payment-methods-can-i-use-with-paypal-help468']
    ]
  }
];

const base = (depth) => '../'.repeat(depth);
const header = (depth, current = '') => {
  const home = base(depth);
  const providerHref = current === 'providers' ? (depth === 1 ? './' : '../') : `${home}proveedores/`;
  return `<a class="skip-link" href="#contenido">Saltar al contenido principal</a><header class="site-header"><div class="container header-inner">
  <a class="brand" href="${home}" aria-label="DineroMundo, página de inicio"><span>Dinero</span>Mundo</a>
  <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="sr-only">Abrir menú principal</span><span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span></button>
  <nav class="site-nav" id="site-nav" aria-label="Navegación principal"><a href="${home}">Inicio</a><a href="${home}#enviar-dinero">Enviar dinero</a><a href="${home}calculadoras/">Calculadoras</a><a href="${home}paises/">Países</a><a href="${providerHref}"${current === 'providers' ? ' aria-current="page"' : ''}>Proveedores</a><a href="${home}#aprender">Aprender</a><a href="${home}#nosotros">Nosotros</a><a class="btn btn-primary nav-cta" href="${home}calculadoras/">Explorar herramientas</a></nav>
</div></header>`;
};
const footer = (depth, current = '') => {
  const home = base(depth), providerHref = current === 'providers' ? (depth === 1 ? './' : '../') : `${home}proveedores/`;
  return `<footer class="site-footer"><div class="container"><div class="footer-grid">
  <div class="footer-brand"><a class="brand brand-light" href="${home}"><span>Dinero</span>Mundo</a><p>Tu centro financiero para enviar dinero, comparar opciones y tomar mejores decisiones.</p></div>
  <div><h2>DineroMundo</h2><ul><li><a href="${home}#nosotros">Nosotros</a></li><li><span>Contacto — Próximamente</span></li><li><a href="${home}metodologia/">Política editorial</a></li></ul></div>
  <div><h2>Herramientas</h2><ul><li><a href="${home}calculadoras/">Calculadoras</a></li><li><a href="${home}#enviar-dinero">Enviar dinero</a></li><li><a href="${home}paises/">Países</a></li><li><a href="${providerHref}">Proveedores</a></li></ul></div>
  <div><h2>Legal</h2><ul><li><span>Privacidad — Próximamente</span></li><li><span>Términos — Próximamente</span></li><li><span>Aviso financiero — Próximamente</span></li><li><span>Divulgación de afiliados — Próximamente</span></li></ul></div>
  </div><div class="footer-bottom"><p>© <span data-year>2026</span> DineroMundo.com.</p><p>Contenido educativo; no constituye asesoría financiera, legal ni fiscal.</p></div></div></footer>`;
};
const shell = ({ title, description, canonical, depth, body, schema = '', current = 'providers' }) => `<!doctype html><html lang="es"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="${description}">
<link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:locale" content="es_US"><meta property="og:site_name" content="DineroMundo"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}"><meta name="twitter:card" content="summary"><link rel="stylesheet" href="${base(depth)}assets/css/styles.css">${schema}
</head><body>${header(depth, current)}${body}${footer(depth, current)}<script src="${base(depth)}assets/js/main.js" defer></script><script src="${base(depth)}assets/js/providers.js" defer></script></body></html>`;

const organization = { '@context': 'https://schema.org', '@type': 'Organization', name: 'DineroMundo', url: 'https://dineromundo.com/' };
const capabilityLabels = {
  bank: 'Depósito bancario', cash: 'Retiro en efectivo', wallet: 'Billetera móvil',
  debit: 'Tarjeta de débito', credit: 'Tarjeta de crédito', online: 'Envío en línea', physical: 'Ubicaciones físicas'
};

const directoryCards = providers.map((p) => `<article class="card provider-directory-card" data-provider-card data-capabilities="${p.capabilities.join(' ')}">
<span class="label">Información general</span><span class="provider-wordmark">${p.name}</span><p>${p.directory}</p>
<dl><dt>Métodos de entrega — ejemplos</dt><dd>${p.delivery}</dd><dt>Métodos de pago — ejemplos</dt><dd>${p.payment}</dd></dl>
<a class="btn btn-secondary" href="${p.slug}/">Ver análisis de ${p.name}</a><small class="review-date">Última revisión: ${reviewed}</small></article>`).join('');

const directoryBody = `<main id="contenido"><section class="page-hero"><div class="container"><nav class="breadcrumbs" aria-label="Migas de pan"><ol><li><a href="../">Inicio</a></li><li aria-current="page">Proveedores</li></ol></nav>
<p class="eyebrow">Información para comparar</p><h1>Proveedores de transferencias internacionales</h1><p class="hero-lede">Explora información general sobre servicios para enviar dinero, métodos de entrega, formas de pago y aspectos importantes que debes verificar antes de realizar una transferencia.</p></div></section>
<div class="container"><aside class="ad-slot" aria-label="Espacio publicitario">Espacio publicitario</aside></div>
<section class="section"><div class="container"><div class="provider-directory-tools">
<div class="field"><label for="provider-search">Buscar proveedor</label><input id="provider-search" data-provider-search type="search" placeholder="Ejemplo: Wise, efectivo o depósito"></div>
<div class="field"><label for="provider-filter">Filtrar por capacidad documentada</label><select id="provider-filter" data-provider-filter><option value="all">Todas las capacidades</option>${Object.entries(capabilityLabels).map(([value, label]) => `<option value="${value}">${label}</option>`).join('')}</select></div>
<p class="provider-directory-count" data-provider-count aria-live="polite">6 proveedores</p></div>
<div class="provider-directory-grid">${directoryCards}</div><p class="filter-empty" data-provider-empty hidden>No encontramos proveedores que coincidan con los filtros.</p></div></section>
<section class="section section-tint"><div class="container"><div class="section-head"><div><p class="eyebrow">Proceso editorial</p><h2>Cómo revisamos los proveedores</h2><p>Organizamos información pública oficial para ayudar a identificar preguntas importantes antes de una transferencia.</p></div></div>
<div class="review-method-grid"><article class="review-card"><h3>Fuentes públicas</h3><p>Consultamos páginas de ayuda, condiciones y descripciones oficiales disponibles al momento de la revisión.</p></article><article class="review-card"><h3>Lenguaje neutral</h3><p>No asignamos puntuaciones, estrellas ni ganadores. Las funciones dependen de la ruta y pueden cambiar.</p></article><article class="review-card"><h3>Verificación directa</h3><p>Invitamos a confirmar tarifas, tasas, límites y disponibilidad dentro del proveedor antes de pagar.</p></article></div></div></section>
<section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Antes de elegir</p><h2>Factores importantes de comparación</h2></div></div>
<div class="comparison-factor-grid"><article class="review-card"><h3>Costo completo</h3><p>Compara tarifa, tipo de cambio, forma de pago y cantidad final recibida.</p></article><article class="review-card"><h3>Entrega y acceso</h3><p>Confirma método, ubicación, horario, documentos y tiempo estimado.</p></article><article class="review-card"><h3>Límites y soporte</h3><p>Revisa límites, cancelación, reembolsos y canales de asistencia.</p></article></div></div></section>
<section class="section section-tint"><div class="container"><div class="section-head"><div><p class="eyebrow">Explora más</p><h2>Guías de países relacionadas</h2></div></div><div class="provider-country-grid">${countries.map(([slug, name]) => `<a href="../paises/${slug}/">${name}</a>`).join('')}</div></div></section>
<section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Herramientas</p><h2>Calculadoras relacionadas</h2></div></div><div class="related-links"><a href="../calculadoras/costo-envio-dinero/">Costo de envío</a><a href="../calculadoras/porcentajes/">Porcentajes</a><a href="../calculadoras/presupuesto-mensual/">Presupuesto mensual</a><a href="../calculadoras/meta-de-ahorro/">Meta de ahorro</a></div>
<p class="financial-note">DineroMundo no procesa transferencias ni ofrece recomendaciones individualizadas. La información es educativa y puede cambiar.</p></div></section>
<div class="container"><aside class="ad-slot ad-bottom" aria-label="Espacio publicitario">Espacio publicitario</aside></div></main>`;

fs.mkdirSync(path.join(root, 'proveedores'), { recursive: true });
fs.writeFileSync(path.join(root, 'proveedores', 'index.html'), shell({
  title: 'Proveedores de transferencias internacionales | DineroMundo',
  description: 'Explora información neutral sobre Wise, Western Union, Remitly, MoneyGram, Ria y Xoom: métodos, costos y factores para comparar.',
  canonical: 'https://dineromundo.com/proveedores/', depth: 1, body: directoryBody,
  schema: `<script type="application/ld+json">${JSON.stringify(organization)}</script>`
}));

function providerPage(p, index) {
  const previous = providers[(index - 1 + providers.length) % providers.length];
  const next = providers[(index + 1) % providers.length];
  const canonical = `https://dineromundo.com/proveedores/${p.slug}/`;
  const faqs = [
    [`¿Necesito una cuenta para usar ${p.name}?`, `${p.key.requirement}. Los requisitos exactos pueden cambiar según el país, el canal y el nivel de verificación.`],
    [`¿Qué información puede necesitar quien envía con ${p.name}?`, 'Normalmente se solicitan datos de identidad, origen y destino, importe, método de pago e información del destinatario. Algunas operaciones requieren documentos adicionales.'],
    [`¿Qué datos puede necesitar el destinatario?`, `Depende de la entrega: una cuenta requiere datos bancarios; un retiro puede exigir nombre idéntico a la identificación y número de referencia; una billetera requiere datos compatibles.`],
    [`¿Se puede recibir dinero en efectivo con ${p.name}?`, `${p.key.cash}. Confirma el país, la ciudad, el socio, el horario y los documentos directamente antes de enviar.`],
    [`¿Puede depositarse en una cuenta bancaria?`, `${p.key.bank}. La institución, moneda y datos requeridos dependen de la ruta.`],
    [`¿Cómo se determina el costo con ${p.name}?`, 'Puede depender del importe, origen, destino, método de pago, entrega, velocidad y conversión. Revisa siempre el resumen final mostrado antes de confirmar.'],
    [`¿Cuánto puede tardar una transferencia?`, 'Puede clasificarse en minutos, mismo día o uno o varios días hábiles. Verificación, bancos, agentes, fines de semana y datos del destinatario pueden modificar la estimación.'],
    [`¿Dónde confirmo la disponibilidad actual?`, `Dentro del sitio web, aplicación o ubicación oficial de ${p.name}. DineroMundo no consulta inventarios, tarifas ni estados en tiempo real.`]
  ];
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
  const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://dineromundo.com/' },
    { '@type': 'ListItem', position: 2, name: 'Proveedores', item: 'https://dineromundo.com/proveedores/' },
    { '@type': 'ListItem', position: 3, name: p.name, item: canonical }
  ]};
  const keyRows = [
    ['Tipo de servicio', p.key.type], ['Transferencias en línea', p.key.online],
    ['Ubicaciones físicas', p.key.physical], ['Depósito bancario', p.key.bank],
    ['Retiro en efectivo', p.key.cash], ['Billetera móvil', p.key.wallet],
    ['Pago con débito', p.key.debit], ['Pago con crédito', p.key.credit],
    ['Pago desde cuenta bancaria', p.key.account], ['Aplicación móvil', p.key.app],
    ['Requisito de cuenta', p.key.requirement], ['Disponibilidad geográfica', p.key.geography],
    ['Última revisión', reviewed]
  ];
  const body = `<main id="contenido">
  <section class="provider-hero"><div class="container provider-hero-grid"><div><nav class="breadcrumbs" aria-label="Migas de pan"><ol><li><a href="../../">Inicio</a></li><li><a href="../">Proveedores</a></li><li aria-current="page">${p.name}</li></ol></nav><span class="label">Análisis educativo de proveedor</span><h1>${p.name}: funcionamiento, costos y opciones</h1><p class="hero-lede">${p.overview}</p></div>
  <aside class="provider-summary-card"><span class="provider-wordmark">${p.name}</span><p>Información general para comparar. No es una cotización, puntuación ni recomendación individual.</p><small>Última revisión: ${reviewed}</small></aside></div></section>
  <div class="container"><aside class="ad-slot" aria-label="Espacio publicitario">Espacio publicitario</aside></div>
  <section class="section" aria-labelledby="key-title"><div class="container"><div class="section-head"><div><p class="eyebrow">Resumen neutral</p><h2 id="key-title">Información clave</h2><p>Las capacidades pueden variar según la ruta. Consulta la disponibilidad directamente con el proveedor.</p></div></div><dl class="key-info-grid">${keyRows.map(([term, value]) => `<div><dt>${term}</dt><dd>${value}</dd></div>`).join('')}</dl></div></section>
  <section class="section section-tint"><div class="container review-content">
    <section><h2>Cómo funciona ${p.name}</h2><p>${p.works}</p></section>
    <section><h2>Formas de enviar dinero</h2><p>${p.ways}</p><div class="review-columns"><article class="review-card"><h3>Métodos de pago</h3><p>${p.payment} La selección final aparece dentro del flujo oficial y puede cambiar según la operación.</p></article><article class="review-card"><h3>Entrega y recepción</h3><p>${p.delivery} La disponibilidad depende del país, la ruta y los socios participantes.</p></article></div></section>
    <section><h2>Tarifas y tipos de cambio</h2><p>${p.fees}</p><p class="availability-note">El costo total no depende únicamente de la tarifa visible. Compara cuánto pagas, el tipo de cambio aplicado y cuánto recibe finalmente el destinatario.</p><p><a href="../../calculadoras/costo-envio-dinero/">Usar la calculadora educativa de costo de envío</a></p></section>
    <section><h2>Velocidad de la transferencia</h2><p>${p.speed}</p><div class="review-columns"><article class="review-card"><h3>Minutos o mismo día</h3><p>Puede aparecer para determinados pagos y entregas, sujeto a revisión y disponibilidad.</p></article><article class="review-card"><h3>Uno o varios días hábiles</h3><p>Puede aplicar a pagos bancarios, depósitos, fines de semana, festivos o revisiones.</p></article></div></section>
    <section><h2>Límites, países y disponibilidad</h2><p>${p.limits}</p><p>${p.key.geography}. Explora las guías de país y confirma las opciones directamente con el proveedor.</p></section>
    <section><h2>Seguridad y protección de la cuenta</h2><p>${p.security}</p></section>
    <section><h2>Ventajas y posibles desventajas</h2><div class="balanced-grid"><article class="balanced-card advantages"><h3>Ventajas para considerar</h3><ul>${p.advantages.map(x => `<li>${x}</li>`).join('')}</ul></article><article class="balanced-card considerations"><h3>Posibles desventajas</h3><ul>${p.disadvantages.map(x => `<li>${x}</li>`).join('')}</ul></article></div></section>
    <section><h2>¿Para quién puede ser útil?</h2><div class="review-columns"><article class="review-card"><h3>Puede ser una opción para comparar cuando…</h3><p>${p.useful}</p></article><article class="review-card"><h3>Conviene comparar alternativas cuando…</h3><p>${p.alternatives}</p></article></div></section>
    <section><h2>Proceso educativo paso a paso</h2><p>Los pasos exactos pueden diferir según el país, el canal y la operación.</p><ol class="process-list"><li>Confirma que el proveedor admite la ruta.</li><li>Crea una cuenta si es necesaria.</li><li>Ingresa el importe de la transferencia.</li><li>Elige una forma de pago disponible.</li><li>Selecciona cómo recibirá el destinatario.</li><li>Revisa tarifa, tasa e importe entregado.</li><li>Verifica cuidadosamente los datos del destinatario.</li><li>Completa la verificación de identidad solicitada.</li><li>Confirma la operación solo después de revisar.</li><li>Guarda la referencia y sigue la transferencia.</li></ol></section>
    <section class="provider-checklist-section"><h2>Lista para comparar e imprimir</h2><p>Marca cada punto para comparar servicios con los mismos criterios.</p><ul class="comparison-checklist">${['Total pagado','Cantidad recibida','Tipo de cambio aplicado','Tarifa visible','Tiempo de entrega','Forma de pago','Forma de recepción','Límites de transferencia','Reglas de cancelación','Reglas de reembolso','Acceso a soporte','Identificación requerida','Requisitos del destinatario'].map(x => `<li>${x}</li>`).join('')}</ul></section>
    <section><h2>Guías de países relacionadas</h2><p>Explora la guía del país y confirma las opciones disponibles directamente con el proveedor.</p><div class="provider-country-grid">${countries.map(([slug, name]) => `<a href="../../paises/${slug}/">${name}</a>`).join('')}</div></section>
    <section><h2>Calculadoras relacionadas</h2><div class="related-links"><a href="../../calculadoras/costo-envio-dinero/">Costo de envío</a><a href="../../calculadoras/porcentajes/">Porcentajes</a><a href="../../calculadoras/presupuesto-mensual/">Presupuesto mensual</a><a href="../../calculadoras/meta-de-ahorro/">Meta de ahorro</a></div></section>
    <section class="comparison-upcoming"><strong>Comparaciones próximamente</strong><p>Las páginas comparativas pertenecen a una fase futura y todavía no están enlazadas.</p></section>
  </div></section>
  <div class="container"><aside class="ad-slot" aria-label="Espacio publicitario">Espacio publicitario</aside></div>
  <section class="section"><div class="container review-content provider-faq"><h2>Preguntas frecuentes sobre ${p.name}</h2>${faqs.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div></section>
  <section class="section section-tint" id="metodologia"><div class="container review-content"><h2>Fuentes y metodología</h2><p>DineroMundo revisa información pública del proveedor y la organiza con fines educativos. Esta página se revisó el ${reviewed}. La información puede cambiar; verifica tarifas, tasas, límites y disponibilidad directamente con ${p.name}.</p><p>DineroMundo no procesa transferencias, no es ${p.name} y no controla sus servicios. Si en el futuro existe una relación de afiliación, se divulgará de manera clara. Consulta también nuestra <a href="../../metodologia/">metodología editorial</a>.</p><ul class="source-list">${p.sources.map(([label, url]) => `<li><a href="${url}" rel="nofollow noopener">${label} — fuente oficial de ${p.name}</a></li>`).join('')}</ul></div></section>
  <section class="section"><div class="container review-content"><div class="financial-note"><h2>Aviso financiero</h2><p>Esta reseña es educativa e informativa. No constituye asesoría financiera, legal, fiscal ni una recomendación individual. Tarifas, tasas, límites, requisitos y métodos pueden cambiar.</p></div></div></section>
  <div class="container"><aside class="ad-slot" aria-label="Espacio publicitario">Espacio publicitario</aside><nav class="provider-nav" aria-label="Navegación entre proveedores"><a href="../${previous.slug}/">← ${previous.name}</a><a class="directory-link" href="../">Todos los proveedores</a><a class="next" href="../${next.slug}/">${next.name} →</a></nav></div>
  </main>`;
  return shell({ title: p.title, description: p.description, canonical, depth: 2, body, schema: `<script type="application/ld+json">${JSON.stringify(organization)}</script><script type="application/ld+json">${JSON.stringify(breadcrumb)}</script><script type="application/ld+json">${JSON.stringify(faqSchema)}</script>` });
}

providers.forEach((provider, index) => {
  const directory = path.join(root, 'proveedores', provider.slug);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'index.html'), providerPage(provider, index));
});

const methodologyBody = `<main id="contenido"><section class="page-hero"><div class="container"><nav class="breadcrumbs" aria-label="Migas de pan"><ol><li><a href="../">Inicio</a></li><li aria-current="page">Metodología editorial</li></ol></nav><p class="eyebrow">Transparencia editorial</p><h1>Metodología de DineroMundo</h1><p class="hero-lede">Cómo organizamos, revisamos y presentamos información financiera educativa.</p></div></section><section class="section"><div class="container review-content"><div class="editorial-principles"><article class="review-card"><h2>Fuentes</h2><p>Priorizamos información pública oficial de instituciones y proveedores. Indicamos la fecha de revisión y evitamos inventar datos.</p></article><article class="review-card"><h2>Neutralidad</h2><p>No asignamos estrellas, ganadores ni afirmaciones absolutas. Explicamos factores para que cada persona compare.</p></article><article class="review-card"><h2>Actualización</h2><p>Las condiciones financieras cambian. Recomendamos verificar precios, tasas, requisitos y disponibilidad directamente.</p></article></div><section><h2>Alcance de las reseñas</h2><p>DineroMundo resume métodos de pago y entrega, costos posibles, límites, seguridad y preguntas frecuentes. No procesa transferencias ni representa a los proveedores. Las páginas son educativas y no reemplazan los términos oficiales.</p></section><section><h2>Afiliación y correcciones</h2><p>Cualquier relación de afiliación futura deberá divulgarse claramente sin alterar nuestra obligación de usar lenguaje neutral. Cuando se identifica un error verificable, la información se corrige y se actualiza la fecha de revisión.</p></section><p><a class="btn btn-secondary" href="../proveedores/">Explorar proveedores</a></p></div></section></main>`;
fs.mkdirSync(path.join(root, 'metodologia'), { recursive: true });
fs.writeFileSync(path.join(root, 'metodologia', 'index.html'), shell({
  title: 'Metodología editorial | DineroMundo',
  description: 'Conoce cómo DineroMundo revisa fuentes, mantiene un enfoque neutral y presenta información financiera educativa.',
  canonical: 'https://dineromundo.com/metodologia/', depth: 1, body: methodologyBody, current: 'methodology',
  schema: `<script type="application/ld+json">${JSON.stringify(organization)}</script>`
}));
