import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const reviewed = '28 de julio de 2026';
const guides = [
  {
    slug:'presupuesto-mensual', title:'Cómo crear un presupuesto mensual', category:'Presupuesto', categorySlug:'presupuesto', minutes:9,
    description:'Aprende a organizar ingresos, gastos, ahorro y pagos de deuda mediante un presupuesto mensual flexible.',
    intro:'Un presupuesto mensual es un plan para decidir cómo usar tus ingresos antes y durante el mes. No exige eliminar todo gasto opcional: ayuda a distinguir prioridades, detectar ajustes posibles y reservar dinero para objetivos sin perder de vista las obligaciones.',
    takeaways:['Trabaja con ingreso neto realmente disponible.','Separa gastos fijos, variables, ahorro y deuda.','Revisa el plan con los resultados reales de cada mes.','Con ingresos irregulares, parte de una estimación prudente.'],
    sections:[
      ['Qué contiene un presupuesto','Comienza con el ingreso neto: lo que llega después de retenciones o deducciones. Registra vivienda, servicios, seguros y pagos mínimos como compromisos relativamente fijos. Alimentación, transporte, cuidado personal y entretenimiento suelen variar. Incluye el ahorro como una categoría deliberada y no solamente como lo que sobra. La diferencia entre ingresos y salidas muestra el dinero restante o el déficit que requiere atención.'],
      ['Cómo construirlo','Reúne estados de cuenta, recibos y pagos recientes. Anota cada categoría sin juzgarla y evita redondear siempre hacia abajo. Asigna primero obligaciones esenciales, después pagos de deuda y metas de ahorro, y finalmente gastos flexibles. Los porcentajes pueden orientarte, pero un hogar con vivienda costosa, cuidados familiares o ingresos variables necesitará una distribución distinta.'],
      ['Revisión mensual','Compara el plan con lo ocurrido: algunas categorías estarán por encima y otras por debajo. Ajustar no significa que el presupuesto fracasó; significa que estás usando información nueva. Revisa suscripciones, fechas de vencimiento y gastos poco frecuentes. Reserva mensualmente una parte para costos anuales, reparaciones o matrículas, de modo que no aparezcan como sorpresas completas.'],
      ['Ingresos irregulares','Si cobras por horas, propinas o trabajo independiente, usa como base un mes conservador o el promedio de varios meses, sin asumir que el mejor mes se repetirá. Prioriza obligaciones esenciales y crea un fondo para meses bajos. Cuando el ingreso supere la base, reparte el excedente entre próximos gastos, ahorro, deuda y necesidades postergadas.']
    ],
    example:'Ejemplo ilustrativo: Lucía recibe USD 3.000 netos. Planifica USD 1.350 para vivienda y servicios, USD 700 para alimentación y transporte, USD 300 para deudas, USD 350 para ahorro y USD 200 para gastos flexibles. Quedan USD 100. Al cerrar el mes descubre que el transporte costó USD 60 más; reduce temporalmente el gasto flexible y actualiza el siguiente presupuesto.',
    checklist:['Anotar el ingreso neto esperado.','Registrar todos los gastos fijos.','Estimar gastos variables con datos recientes.','Asignar ahorro y pagos de deuda.','Comprobar el dinero restante.','Comparar plan y realidad al terminar el mes.'],
    mistakes:['Usar salario bruto en vez del neto disponible.','Olvidar gastos trimestrales o anuales.','Fijar montos imposibles para alimentación o transporte.','Considerar el ahorro únicamente si sobra dinero.','Abandonar el plan después de un mes atípico.'],
    calculators:[['Calculadora de presupuesto mensual','presupuesto-mensual'],['Calculadora de meta de ahorro','meta-de-ahorro'],['Calculadora de fondo de emergencia','fondo-de-emergencia']],
    related:['regla-50-30-20','ingreso-bruto-vs-neto','como-ahorrar-dinero','como-pagar-deudas'],
    faqs:[
      ['¿Debo registrar cada compra?','El detalle ayuda al comenzar, pero puedes agrupar compras pequeñas si mantienes categorías confiables y revisas sus totales.'],
      ['¿Qué hago si mis gastos superan mis ingresos?','Identifica primero gastos que pueden ajustarse, revisa fechas y pagos, y busca apoyo apropiado si no puedes cubrir necesidades básicas.'],
      ['¿El ahorro cuenta como gasto?','En el presupuesto puede tratarse como una asignación planificada: dinero que sale del disponible actual para una meta futura.'],
      ['¿Con qué frecuencia debo actualizarlo?','Revísalo durante el mes y realiza un cierre mensual. También actualízalo cuando cambien ingreso, vivienda o responsabilidades.'],
      ['¿Puedo usar categorías diferentes?','Sí. Las categorías deben representar tu hogar; no existe una lista universal que funcione para todas las personas.'],
      ['¿Cómo presupuesto ingresos variables?','Usa una base prudente, prioriza obligaciones y decide de antemano cómo repartir ingresos adicionales.']
    ]
  },
  {
    slug:'regla-50-30-20', title:'Regla 50/30/20: cómo usarla y adaptarla', category:'Presupuesto', categorySlug:'presupuesto', minutes:8,
    description:'Entiende la regla 50/30/20, sus categorías y cómo adaptarla a vivienda costosa o ingresos irregulares.',
    intro:'La regla 50/30/20 propone dividir el ingreso neto entre necesidades, deseos y ahorro o metas de deuda. Es una referencia sencilla para iniciar una conversación sobre prioridades, no una obligación ni una medida de éxito financiero.',
    takeaways:['50% representa necesidades, 30% deseos y 20% metas.','Los porcentajes se aplican normalmente al ingreso neto.','La vivienda y otras circunstancias pueden exigir otra distribución.','Lo importante es crear un plan sostenible y revisable.'],
    sections:[
      ['Qué significa cada porcentaje','Las necesidades incluyen vivienda, servicios básicos, alimentación esencial, transporte necesario, seguros y pagos mínimos. Los deseos abarcan gastos que mejoran la vida pero pueden modificarse, como entretenimiento o comidas fuera. El último 20% puede dirigirse a ahorro, fondo de emergencia y pagos de deuda por encima del mínimo. La clasificación depende del contexto: un vehículo puede ser esencial para una persona y opcional para otra.'],
      ['Por qué puede no encajar','En ciudades con vivienda costosa, las necesidades pueden superar 50% incluso con un gasto razonable. Hogares con cuidado infantil, salud, apoyo familiar o deuda elevada también tendrán otra distribución. Reducir cada necesidad no siempre es posible. La regla sirve para observar el conjunto, no para culpar a quien enfrenta costos estructurales o ingresos insuficientes.'],
      ['Cómo adaptarla','Puedes usar 60/20/20, 70/20/10 u otra proporción que refleje la realidad. Define primero cuánto requieren las necesidades, protege una contribución alcanzable a metas y asigna el resto con intención. Si hoy solamente puedes ahorrar una cantidad pequeña, establece un punto de partida y aumenta cuando cambie el ingreso o termine una obligación.'],
      ['Ingresos bajos o variables','Con ingreso limitado, prioriza seguridad, vivienda, comida, transporte y pagos indispensables. Con ingreso irregular, aplica los porcentajes a una base conservadora y decide cómo distribuir excedentes. Un porcentaje sobre un mes excepcional puede crear compromisos que no se sostienen. Conviene separar dinero para impuestos cuando corresponda y para meses con menos trabajo.']
    ],
    example:'Ejemplo ilustrativo: con USD 2.400 netos, la fórmula original asignaría USD 1.200 a necesidades, USD 720 a deseos y USD 480 a ahorro o deuda. Si la vivienda y el transporte ya cuestan USD 1.450, el hogar podría usar temporalmente 65/15/20 o 65/20/15 y revisar el plan cuando cambie un gasto.',
    checklist:['Calcular el ingreso neto mensual.','Clasificar necesidades y deseos según el contexto.','Medir los porcentajes actuales.','Elegir una adaptación realista.','Definir una cantidad para ahorro o deuda.','Revisar la distribución después de varios meses.'],
    mistakes:['Tratar los porcentajes como una ley.','Usar ingreso bruto sin considerar deducciones.','Clasificar todo gasto personal como necesidad.','Ignorar vivienda, salud o cuidado familiar.','Intentar un cambio drástico que no puede mantenerse.'],
    calculators:[['Calculadora de presupuesto mensual','presupuesto-mensual'],['Calculadora de porcentajes','porcentajes']],
    related:['presupuesto-mensual','como-ahorrar-dinero','fondo-de-emergencia','ingreso-bruto-vs-neto'],
    faqs:[
      ['¿La regla 50/30/20 funciona para todos?','No. Es un punto de partida que debe adaptarse a ingreso, vivienda, familia, deuda y costo de vida.'],
      ['¿Se usa el ingreso bruto o neto?','Generalmente se usa el ingreso neto disponible, porque representa lo que realmente puede asignarse.'],
      ['¿Los pagos mínimos de deuda son necesidades?','Suelen tratarse como obligaciones. Los pagos adicionales pueden incluirse entre metas de ahorro y deuda.'],
      ['¿Qué pasa si la vivienda supera 50%?','Revisa el resto del presupuesto y usa una proporción distinta. No fuerces porcentajes que oculten la realidad.'],
      ['¿Puedo ahorrar menos de 20%?','Sí. Una contribución sostenible puede ser más útil que una meta que abandones. Evalúa aumentarla gradualmente.'],
      ['¿Cómo se aplica con ingresos variables?','Utiliza una estimación prudente y distribuye los excedentes según prioridades definidas previamente.']
    ]
  },
  {
    slug:'fondo-de-emergencia', title:'Cómo crear un fondo de emergencia', category:'Ahorro', categorySlug:'ahorro', minutes:9,
    description:'Aprende a estimar, construir, usar y reponer un fondo para gastos inesperados.',
    intro:'Un fondo de emergencia es dinero reservado para situaciones imprevistas que afectan necesidades importantes. Puede reducir la necesidad de depender inmediatamente de una tarjeta o préstamo, aunque la cantidad adecuada cambia según el hogar.',
    takeaways:['Calcula primero los gastos esenciales mensuales.','Tres, seis, nueve o doce meses son referencias, no reglas.','Prioriza acceso seguro al dinero cuando surja una emergencia.','Construye y repone el fondo gradualmente.'],
    sections:[
      ['Qué debe cubrir','Incluye vivienda, alimentación básica, servicios, transporte necesario, seguros, medicinas y pagos mínimos. No hace falta usar el gasto mensual completo si contiene compras opcionales. Multiplica los esenciales por el número de meses que deseas cubrir y resta los ahorros ya reservados. El resultado es una meta inicial que puede cambiar con empleo, salud o responsabilidades familiares.'],
      ['Elegir una meta','Tres meses pueden ser un primer objetivo; seis, nueve o doce meses ofrecen mayor cobertura matemática. Una persona con ingreso estable y dos fuentes en el hogar puede elegir una meta diferente a quien trabaja por temporadas o mantiene dependientes. También puedes crear escalones: primero un monto pequeño, luego un mes y después una meta más amplia.'],
      ['Dónde mantenerlo','Muchas personas buscan un lugar separado del gasto diario, accesible y con bajo riesgo. Las cuentas, protecciones y reglas varían por país e institución. Compara disponibilidad, comisiones, límites de retiro y protección aplicable. Un rendimiento potencial no compensa necesariamente perder acceso cuando aparece una necesidad urgente.'],
      ['Uso y reconstrucción','Define qué situaciones califican: pérdida de ingreso, reparación esencial, salud o viaje familiar urgente, por ejemplo. Una compra prevista o un descuento no suele ser inesperado. Si utilizas el fondo, registra cuánto salió, ajusta temporalmente otras metas y programa aportes para reconstruirlo sin descuidar necesidades actuales.']
    ],
    example:'Ejemplo ilustrativo: un hogar calcula USD 1.800 de gastos esenciales y elige una meta inicial de tres meses: USD 5.400. Ya tiene USD 900 y aporta USD 250 mensuales. Le faltan USD 4.500; sin considerar intereses, tardaría aproximadamente 18 meses. Puede revisar la meta si cambia el empleo o el gasto esencial.',
    checklist:['Calcular gastos esenciales.','Elegir una cobertura inicial.','Restar ahorros de emergencia existentes.','Separar el fondo del gasto cotidiano.','Programar aportes alcanzables.','Definir cuándo usarlo y cómo reponerlo.'],
    mistakes:['Incluir únicamente el alquiler y olvidar alimentos o seguros.','Invertirlo en algo difícil de vender rápidamente.','Usarlo para gastos previsibles.','Esperar a poder aportar una cantidad grande.','No actualizar la meta cuando cambia el hogar.'],
    calculators:[['Calculadora de fondo de emergencia','fondo-de-emergencia'],['Calculadora de meta de ahorro','meta-de-ahorro'],['Calculadora de presupuesto mensual','presupuesto-mensual']],
    related:['como-ahorrar-dinero','presupuesto-mensual','regla-50-30-20','como-pagar-deudas'],
    faqs:[
      ['¿Cuántos meses debe cubrir?','Tres, seis, nueve o doce meses son referencias. La meta depende de estabilidad laboral, dependientes, salud y otras reservas.'],
      ['¿Debo ahorrar antes de pagar deudas?','Puede ser útil mantener una reserva básica mientras trabajas en deudas, pero el equilibrio depende de costos y riesgos personales.'],
      ['¿Dónde conviene guardar el fondo?','Busca seguridad, acceso y costos razonables. Verifica reglas y protección directamente con una institución apropiada.'],
      ['¿Una reparación de automóvil es emergencia?','Puede serlo si el vehículo es necesario y el gasto no era previsible. El mantenimiento regular debería planificarse aparte.'],
      ['¿Puedo tener varias metas de emergencia?','Sí. Puedes separar desempleo, salud o reparaciones si eso facilita la organización.'],
      ['¿Qué hago después de utilizarlo?','Evalúa la nueva situación y reinicia aportes realistas hasta reconstruir la reserva.']
    ]
  },
  {
    slug:'como-ahorrar-dinero', title:'Cómo ahorrar dinero con un plan realista', category:'Ahorro', categorySlug:'ahorro', minutes:8,
    description:'Pasos claros para definir metas, reducir costos, automatizar aportes y ahorrar con ingresos variables.',
    intro:'Ahorrar no consiste solamente en gastar menos. Un plan útil conecta una meta específica con una cantidad, una fecha aproximada y decisiones que pueden mantenerse. Incluso aportes pequeños permiten observar progreso y ajustar hábitos.',
    takeaways:['Define para qué ahorras y cuánto necesitas.','Separa aportes automáticamente cuando sea posible.','Revisa gastos recurrentes y comisiones.','Mide el progreso sin depender de meses perfectos.'],
    sections:[
      ['Convertir una intención en meta','“Ahorrar más” es difícil de medir. Indica el propósito, monto restante y fecha deseada. Divide la cantidad entre los meses disponibles como primera estimación, sin confundirla con una garantía. Si la contribución requerida no cabe en el presupuesto, extiende la fecha, reduce la meta o combina ambas opciones.'],
      ['Crear espacio en el presupuesto','Revisa suscripciones, cargos bancarios, seguros, teléfono y compras frecuentes. Distingue reducción temporal de cambio permanente. Planificar comidas y compras puede disminuir decisiones impulsivas, pero no todas las categorías ofrecen el mismo margen. Compara precios, costo por unidad, calidad y transporte, no solamente el precio anunciado.'],
      ['Automatizar y separar','Si tu banco o empleador ofrece transferencias automáticas, programarlas cerca del día de cobro puede reducir olvidos. Verifica que no provoquen sobregiros. Usar categorías o cuentas separadas ayuda a distinguir emergencia, viaje, educación y gastos anuales. Las opciones, comisiones y protecciones varían por institución y país.'],
      ['Ahorrar con ingreso irregular','Establece un aporte mínimo para meses bajos y una regla para ingresos adicionales, como reservar una parte de cada pago. Mantén primero dinero para obligaciones, impuestos cuando correspondan y próximos gastos. Revisa el promedio periódicamente; no conviertas el mejor mes en la expectativa permanente.']
    ],
    example:'Ejemplo ilustrativo: Mateo quiere reunir USD 1.200 en diez meses y ya tiene USD 200. Le faltan USD 1.000, equivalentes a USD 100 mensuales sin intereses. Cancela una suscripción de USD 25, reduce compras no planificadas en USD 35 y asigna USD 40 al recibir cada pago mensual.',
    checklist:['Nombrar la meta y su prioridad.','Calcular cuánto falta.','Elegir una fecha flexible.','Identificar uno o dos ajustes concretos.','Programar o registrar aportes.','Revisar el progreso mensualmente.'],
    mistakes:['Fijar una meta sin revisar el presupuesto.','Recortar necesidades esenciales.','Ignorar comisiones y cargos recurrentes.','Usar una fecha imposible como única medida de éxito.','Mezclar todo el ahorro con el dinero cotidiano.'],
    calculators:[['Calculadora de meta de ahorro','meta-de-ahorro'],['Calculadora de presupuesto mensual','presupuesto-mensual'],['Calculadora de interés compuesto','interes-compuesto']],
    related:['fondo-de-emergencia','presupuesto-mensual','regla-50-30-20','cuenta-corriente-vs-ahorro'],
    faqs:[
      ['¿Cuánto debería ahorrar cada mes?','Depende de tu meta, fecha, ingreso y obligaciones. Una cantidad sostenible es un punto de partida válido.'],
      ['¿Es útil automatizar el ahorro?','Puede ayudar a mantener constancia si hay saldo suficiente y entiendes las reglas de la cuenta.'],
      ['¿Qué hago si no puedo aportar un mes?','Evita comprometer necesidades. Retoma el plan y ajusta la fecha o el aporte futuro.'],
      ['¿Necesito una cuenta separada?','No es obligatorio, pero separar categorías puede reducir el uso accidental del dinero.'],
      ['¿Cómo ahorro con propinas o trabajo independiente?','Reserva una proporción de cada entrada y usa una estimación prudente para obligaciones.'],
      ['¿Debo buscar el mayor interés disponible?','Compara también seguridad, acceso, comisiones y condiciones; una tasa no resume toda la cuenta.']
    ]
  },
  {
    slug:'cuenta-corriente-vs-ahorro', title:'Cuenta corriente vs. cuenta de ahorro', category:'Ahorro', categorySlug:'ahorro', minutes:9,
    description:'Compara los usos generales, tarjetas, transferencias, intereses, comisiones y requisitos de cuentas corrientes y de ahorro.',
    intro:'Las cuentas corrientes y de ahorro cumplen funciones diferentes. La primera suele facilitar pagos cotidianos; la segunda ayuda a separar dinero para objetivos. Sus nombres, protecciones y condiciones cambian según el país y la institución.',
    takeaways:['La cuenta corriente suele priorizar pagos y acceso frecuente.','La cuenta de ahorro suele separar reservas y puede pagar interés.','Comisiones, mínimos y límites deben revisarse antes de abrir.','La protección de depósitos no es igual en todos los países.'],
    sections:[
      ['Uso cotidiano','Una cuenta corriente puede permitir depósito de salario, pagos, transferencias, cheques donde se utilicen y tarjeta de débito. La tarjeta toma fondos del saldo disponible y no crea crédito por sí sola. Revisa retiros, sobregiros, cargos de cajero, depósitos móviles, horarios y cuánto tarda un depósito en quedar disponible.'],
      ['Objetivos de ahorro','Una cuenta de ahorro suele usarse para emergencia, gastos anuales o metas. Algunas instituciones ofrecen interés, pero la tasa puede cambiar y no debe ser el único criterio. Comprueba cuántos retiros permite, cómo se transfiere a la cuenta corriente, cuánto tarda y si existe un saldo mínimo para evitar cargos.'],
      ['Comisiones y requisitos','Pregunta por mantenimiento mensual, saldo mínimo, depósitos directos, cajeros fuera de red, transferencias y sobregiros. Una cuenta “sin comisión” puede tener condiciones. Confirma qué identificación acepta la institución, si requiere dirección o número fiscal, y qué opciones existen para recibir ayuda en tu idioma.'],
      ['Protección de depósitos','Algunos países tienen sistemas que protegen depósitos elegibles hasta límites definidos, pero no todas las instituciones, productos o saldos reciben la misma cobertura. Verifica el organismo oficial y la membresía de la institución. La protección contra quiebra no significa que una cuenta esté libre de fraude o cargos.']
    ],
    example:'Ejemplo ilustrativo: Ana recibe su salario en una cuenta corriente y mantiene allí pagos del mes. Transfiere una cantidad fija a una cuenta de ahorro para reparaciones. Antes de abrirlas compara mantenimiento, cajeros, saldo mínimo, velocidad de transferencia y protección aplicable, sin suponer que una tasa promocional será permanente.',
    checklist:['Definir el uso principal de la cuenta.','Revisar mantenimiento y saldo mínimo.','Comprobar tarjeta, cajeros y transferencias.','Preguntar por sobregiros y depósitos.','Verificar protección oficial aplicable.','Leer cómo cerrar o cambiar la cuenta.'],
    mistakes:['Elegir solo por una promoción.','Confundir tarjeta de débito con crédito.','Ignorar cargos de cajeros o sobregiros.','Asumir que toda institución tiene la misma protección.','Mantener el fondo de emergencia en una cuenta difícil de acceder.'],
    calculators:[['Calculadora de presupuesto mensual','presupuesto-mensual'],['Calculadora de meta de ahorro','meta-de-ahorro']],
    related:['como-ahorrar-dinero','fondo-de-emergencia','presupuesto-mensual','como-evitar-estafas-financieras'],
    faqs:[
      ['¿Una cuenta de ahorro siempre paga interés?','No. Depende del producto, institución y país; las tasas y condiciones pueden cambiar.'],
      ['¿Puedo pagar facturas desde una cuenta de ahorro?','Algunas instituciones lo permiten con límites o condiciones. Confirma las funciones antes de depender de ellas.'],
      ['¿La tarjeta de débito crea historial de crédito?','Por lo general usa tu propio saldo y no funciona como préstamo. Verifica cualquier producto asociado.'],
      ['¿Qué es un saldo mínimo?','Es una cantidad que la institución puede exigir para abrir, mantener beneficios o evitar ciertos cargos.'],
      ['¿Todas las cuentas están aseguradas?','No. La elegibilidad depende del país, institución, tipo de producto y límites oficiales.'],
      ['¿Puedo tener ambas cuentas?','Sí, si sus costos y funciones tienen sentido para ti. También existen otras estructuras según la institución.']
    ]
  },
  {
    slug:'como-funciona-el-credito-en-estados-unidos', title:'Cómo funciona el crédito en Estados Unidos', category:'Crédito', categorySlug:'credito', minutes:10,
    description:'Introducción educativa a reportes, puntajes, pagos, saldos, antigüedad y solicitudes de crédito en Estados Unidos.',
    intro:'En Estados Unidos, el historial de crédito registra cómo se han administrado determinadas cuentas. Los prestamistas pueden consultar reportes, puntajes y otra información, pero utilizan modelos y criterios distintos. Crédito e ingreso no significan lo mismo.',
    takeaways:['El reporte contiene información; el puntaje resume datos mediante un modelo.','Pagar a tiempo y controlar saldos son hábitos importantes.','La antigüedad y las solicitudes pueden influir según el modelo.','Ninguna acción garantiza aprobación ni un aumento específico.'],
    sections:[
      ['Reportes y puntajes','Los reportes pueden incluir tarjetas, préstamos, historial de pagos, saldos, consultas y ciertos registros. Un puntaje usa información del reporte para estimar riesgo mediante una fórmula. Existen varios modelos y versiones, por eso dos puntajes pueden diferir. Un prestamista también puede revisar ingreso, deuda, garantía y reglas internas.'],
      ['Factores generales','El historial de pagos suele ser relevante; un atraso puede afectar de manera distinta según recencia y modelo. Los montos adeudados y la utilización de tarjetas muestran cuánto crédito disponible se usa. La antigüedad de cuentas, combinación de tipos de crédito y solicitudes recientes también pueden considerarse, sin que exista una fórmula única pública para cada decisión.'],
      ['Crear historial con tiempo','Mantener cuentas al día, revisar estados y evitar solicitar crédito innecesariamente son prácticas prudentes. Una tarjeta asegurada puede ser una herramienta si reporta a agencias y sus costos son razonables, pero la aprobación no está garantizada. No necesitas pagar intereses deliberadamente para mostrar actividad; consulta cómo reporta cada emisor.'],
      ['Revisar y corregir','Obtén reportes mediante canales oficiales y verifica nombre, cuentas, saldos y pagos. Si encuentras información que no reconoces o parece inexacta, sigue el proceso de disputa con la agencia y la entidad que reportó. Guarda documentos y evita empresas que prometen borrar información correcta de inmediato.']
    ],
    example:'Ejemplo ilustrativo: Carlos tiene una tarjeta con límite de USD 1.000 y saldo de estado de USD 250. Paga a tiempo y revisa el reporte para confirmar que la cuenta aparece correctamente. Ese comportamiento puede contribuir a su historial, pero no permite predecir un puntaje ni asegurar la aprobación de un préstamo.',
    checklist:['Revisar reportes mediante fuentes oficiales.','Confirmar pagos y saldos reportados.','Pagar al menos el mínimo antes del vencimiento.','Controlar utilización y solicitudes nuevas.','Disputar errores con documentación.','Comparar costos antes de abrir una cuenta.'],
    mistakes:['Confundir puntaje con ingreso.','Creer que existe un único puntaje.','Solicitar varias cuentas sin revisar costos.','Pagar tarde por esperar el cierre del estado.','Contratar promesas de reparación inmediata.'],
    calculators:[['Calculadora de porcentajes','porcentajes'],['Calculadora de deuda a ingreso','deuda-ingreso'],['Calculadora de pago de tarjeta','pago-tarjeta-credito']],
    related:['que-es-el-puntaje-de-credito','utilizacion-de-credito','tarjeta-de-credito-asegurada','como-pagar-deudas'],
    faqs:[
      ['¿Crédito e ingreso son lo mismo?','No. El crédito describe cuentas e historial; el ingreso representa dinero recibido y puede evaluarse por separado.'],
      ['¿Existe un solo puntaje de crédito?','No. Hay varios modelos, versiones y agencias, y los prestamistas pueden usar información adicional.'],
      ['¿Cuánto tarda construir crédito?','Toma tiempo y depende de la información reportada. No existe un plazo ni aumento garantizado.'],
      ['¿Debo mantener deuda para tener puntaje?','No es necesario pagar intereses intencionalmente. Usa las cuentas de forma manejable y paga según sus términos.'],
      ['¿Una consulta siempre reduce el puntaje?','El efecto depende del tipo de consulta y del modelo. Confirma qué clase de revisión se realizará.'],
      ['¿Un buen puntaje garantiza un préstamo?','No. El prestamista puede evaluar ingreso, deuda, producto y sus propios criterios.']
    ]
  },
  {
    slug:'que-es-el-puntaje-de-credito', title:'Qué es el puntaje de crédito', category:'Crédito', categorySlug:'credito', minutes:8,
    description:'Conoce qué representa un puntaje de crédito, por qué puede variar y cómo revisar información inexacta.',
    intro:'Un puntaje de crédito es un cálculo que resume determinada información de un reporte en un momento específico. No es una calificación de valor personal ni una promesa de aprobación. Distintos modelos pueden producir resultados diferentes.',
    takeaways:['El puntaje depende del modelo y de los datos disponibles.','Pago, saldos, antigüedad y solicitudes pueden influir.','Los prestamistas también consideran información fuera del puntaje.','Revisar reportes ayuda a detectar errores o fraude.'],
    sections:[
      ['Qué representa','El modelo analiza patrones del reporte para estimar la probabilidad de que una obligación se pague según lo acordado. La cifra puede cambiar cuando se actualizan saldos, pagos o cuentas. No publicamos rangos exactos como si fueran universales, porque las escalas, versiones y decisiones del prestamista varían.'],
      ['Por qué existen diferencias','Una agencia puede tener información que otra todavía no recibió; el prestamista puede solicitar una versión específica; y la fecha de cálculo puede ser distinta. Aplicaciones de monitoreo también pueden mostrar un modelo educativo diferente al usado en una solicitud. Una diferencia no significa automáticamente que alguno sea incorrecto.'],
      ['Factores generales','Los pagos puntuales, los montos adeudados, la utilización, la antigüedad, los tipos de cuenta y las solicitudes nuevas pueden influir de manera diferente. Ningún porcentaje aislado garantiza un resultado. Cerrar una tarjeta, aumentar un saldo o abrir una cuenta puede cambiar varias variables al mismo tiempo.'],
      ['Monitoreo responsable','Consulta reportes mediante fuentes oficiales, reconoce todas las cuentas y confirma pagos. Si hay un error, presenta una disputa con evidencia. Si sospechas robo de identidad, utiliza canales oficiales de protección. Evita pagar por promesas de crear una identidad nueva o borrar información válida.']
    ],
    example:'Ejemplo ilustrativo: Elena ve dos puntajes distintos en herramientas diferentes. Revisa la fecha, el modelo y la agencia utilizada. Ambos reportes muestran sus cuentas correctamente, por lo que entiende que la variación puede provenir del modelo y no intenta manipular el resultado con una acción apresurada.',
    checklist:['Identificar el modelo y fecha mostrados.','Revisar reportes, no solo la cifra.','Confirmar cuentas y pagos.','Mantener saldos manejables.','Limitar solicitudes innecesarias.','Disputar información inexacta.'],
    mistakes:['Tratar una cifra como permanente.','Comparar modelos diferentes como si fueran iguales.','Creer que el puntaje garantiza aprobación.','Ignorar el reporte subyacente.','Pagar a empresas que prometen resultados exactos.'],
    calculators:[['Calculadora de porcentajes','porcentajes'],['Calculadora de deuda a ingreso','deuda-ingreso']],
    related:['como-funciona-el-credito-en-estados-unidos','utilizacion-de-credito','tarjeta-de-credito-asegurada','como-evitar-estafas-financieras'],
    faqs:[
      ['¿Por qué tengo varios puntajes?','Pueden usar modelos, versiones, agencias y fechas diferentes.'],
      ['¿Qué puntaje usa un prestamista?','Depende del producto y la entidad. Pregunta qué información puede consultarse cuando corresponda.'],
      ['¿Revisar mi propio reporte afecta el crédito?','Una revisión personal mediante canales autorizados suele tratarse de forma distinta a una solicitud de crédito.'],
      ['¿Puede cambiar de un mes a otro?','Sí, cuando se actualizan saldos, pagos, cuentas o consultas.'],
      ['¿Puedo corregir un dato incorrecto?','Sí. Utiliza los procesos de disputa de la agencia y de la entidad que proporcionó la información.'],
      ['¿Un puntaje alto garantiza la tasa más baja?','No. Producto, ingreso, deuda, mercado y criterios del prestamista también influyen.']
    ]
  },
  {
    slug:'utilizacion-de-credito', title:'Cómo funciona la utilización de crédito', category:'Crédito', categorySlug:'credito', minutes:9,
    description:'Aprende a calcular utilización por tarjeta y total, y comprende por qué ningún porcentaje garantiza un resultado.',
    intro:'La utilización de crédito compara los saldos reportados de tarjetas con sus límites disponibles. Puede calcularse por cuenta y en conjunto. Es un factor observado por algunos modelos, pero no sustituye pagar puntualmente.',
    takeaways:['Utilización equivale a saldo dividido entre límite.','Se observa por tarjeta y también en total.','Saldo actual y saldo del estado no siempre coinciden.','Ningún porcentaje garantiza un cambio de puntaje.'],
    sections:[
      ['Cálculo básico','Si una tarjeta muestra USD 300 de saldo y USD 1.000 de límite, la utilización matemática es 30%. Con varias tarjetas, suma saldos y límites para calcular el total, pero recuerda que un modelo también puede observar cada cuenta. Si un límite cambia o una cuenta se cierra, la proporción total puede modificarse aunque la deuda sea igual.'],
      ['Qué saldo se reporta','El saldo del estado es la cantidad registrada al cerrar el ciclo; el saldo actual incorpora movimientos posteriores. El emisor puede reportar en una fecha diferente al vencimiento. Pagar antes de la fecha límite evita atraso según los términos, pero no garantiza qué saldo aparecerá en cada reporte. Consulta el calendario del emisor.'],
      ['Relación con los pagos','Una utilización menor puede ayudar en algunos modelos, pero pagar a tiempo sigue siendo esencial. No retrases un pago para perseguir un porcentaje. Tampoco necesitas mantener saldo y pagar intereses para demostrar uso. Revisa el estado, paga al menos el mínimo y, cuando sea posible, reduce deuda de manera sostenible.'],
      ['Cerrar o aumentar límites','Cerrar una tarjeta puede reducir el crédito total disponible y elevar la proporción. Mantenerla también puede implicar cuota, riesgo de uso o dificultad de control. Solicitar un aumento puede generar una revisión de crédito. Considera costos y hábitos, no solamente el efecto potencial sobre una cifra.']
    ],
    example:'Ejemplo ilustrativo: dos tarjetas tienen límites de USD 1.000 y USD 2.000, con saldos de USD 200 y USD 700. La utilización total es USD 900 ÷ USD 3.000 = 30%. Individualmente son 20% y 35%. El ejemplo enseña el cálculo, no predice un puntaje.',
    checklist:['Anotar límite y saldo de cada tarjeta.','Calcular utilización individual.','Calcular utilización total.','Revisar fechas de estado y vencimiento.','Pagar puntualmente.','Evaluar costos antes de cerrar una cuenta.'],
    mistakes:['Usar solamente la proporción total.','Confundir fecha de reporte con vencimiento.','Mantener deuda para pagar intereses.','Cerrar una cuenta sin revisar consecuencias.','Creer que un porcentaje garantiza aprobación.'],
    calculators:[['Calculadora de porcentajes','porcentajes'],['Calculadora de pago de tarjeta','pago-tarjeta-credito']],
    related:['que-es-el-puntaje-de-credito','como-funciona-el-credito-en-estados-unidos','tarjeta-de-credito-asegurada','como-pagar-deudas'],
    faqs:[
      ['¿Cuál es la fórmula?','Divide el saldo entre el límite y multiplica por 100. Si el límite es cero, la fórmula no es válida.'],
      ['¿Existe un porcentaje perfecto?','No. Los modelos varían y ninguna proporción garantiza un resultado.'],
      ['¿Se calcula por tarjeta o en total?','Ambos cálculos pueden ser relevantes según el modelo utilizado.'],
      ['¿Saldo actual y saldo del estado son iguales?','No siempre. El actual cambia con compras y pagos posteriores al cierre.'],
      ['¿Debo pagar antes del cierre?','Puede reducir el saldo que eventualmente se reporte, pero confirma fechas y prioriza el pago puntual.'],
      ['¿Cerrar una tarjeta reduce la utilización?','Puede aumentarla al reducir el límite total disponible, aunque otros factores también importan.']
    ]
  },
  {
    slug:'tarjeta-de-credito-asegurada', title:'Qué es una tarjeta de crédito asegurada', category:'Crédito', categorySlug:'credito', minutes:9,
    description:'Guía sobre depósitos de garantía, límites, pagos, intereses, reportes y condiciones de una tarjeta asegurada.',
    intro:'Una tarjeta asegurada requiere normalmente un depósito que respalda la cuenta. Puede ayudar a establecer historial cuando el emisor reporta a agencias, pero sigue siendo crédito: exige pagos, puede cobrar intereses y no garantiza aprobación.',
    takeaways:['El depósito no sustituye los pagos mensuales.','Límite y depósito pueden relacionarse, pero dependen del emisor.','Comprueba a qué agencias se reporta.','Lee cómo se devuelve el depósito y cómo se cierra o mejora la cuenta.'],
    sections:[
      ['Depósito y límite','El emisor puede solicitar un depósito antes de abrir la cuenta. Ese dinero reduce su riesgo, pero no suele usarse para pagar compras mensuales. El límite puede ser igual o diferente al depósito. Revisa mínimo, máximo, forma de aportar fondos y si el depósito gana interés, sin asumir que todos los productos funcionan igual.'],
      ['Uso y pagos','Las compras crean un saldo que debe pagarse según el estado. Si no pagas el total, pueden aplicarse intereses; los atrasos pueden generar cargos y reportes negativos. Una cuota anual u otras comisiones también reducen el valor del producto. No es necesario mantener deuda deliberadamente para mostrar actividad.'],
      ['Reportes y transición','Pregunta si el emisor reporta a las agencias principales y con qué nombre aparece la cuenta. Algunas tarjetas permiten revisión para cambiar a una no asegurada, pero el momento y los requisitos varían. Otras requieren cerrar y solicitar otro producto. Ninguna transición ni aumento de límite está garantizado.'],
      ['Devolución del depósito','El depósito puede devolverse cuando la cuenta se convierte o se cierra con saldo pagado, según las condiciones. El proceso puede tardar y podrían descontarse obligaciones pendientes. Antes de solicitar, lee cómo cerrar, cuándo se devuelve, qué ocurre con disputas y si existen cargos no reembolsables.']
    ],
    example:'Ejemplo ilustrativo: una tarjeta solicita un depósito de USD 300 y ofrece un límite de USD 300. La persona compra USD 40, recibe un estado por USD 40 y paga según la fecha. El depósito permanece separado; no cubre automáticamente la compra. Los términos reales deben confirmarse con el emisor.',
    checklist:['Comparar depósito y límite.','Revisar cuota e intereses.','Confirmar agencias a las que reporta.','Leer fechas de estado y pago.','Entender conversión o cierre.','Confirmar devolución del depósito.'],
    mistakes:['Creer que el depósito paga la factura.','Elegir sin revisar cuotas.','Mantener saldo para generar interés.','Asumir que habrá conversión automática.','Solicitar sin confirmar reportes.'],
    calculators:[['Calculadora de pago de tarjeta','pago-tarjeta-credito'],['Calculadora de porcentajes','porcentajes']],
    related:['como-funciona-el-credito-en-estados-unidos','que-es-el-puntaje-de-credito','utilizacion-de-credito','como-pagar-deudas'],
    faqs:[
      ['¿El depósito reemplaza el pago mensual?','No. Debes pagar las compras según el estado; el depósito respalda la cuenta.'],
      ['¿Está garantizada la aprobación?','No. El emisor aplica requisitos de identidad, ingreso y elegibilidad.'],
      ['¿Todas reportan a las agencias?','No necesariamente. Confirma a cuáles reporta y con qué frecuencia.'],
      ['¿Recuperaré el depósito?','Depende de pagar el saldo y cumplir las condiciones de conversión o cierre.'],
      ['¿Necesito mantener un saldo?','No. Mantener deuda puede generar intereses y no garantiza beneficio crediticio.'],
      ['¿Puede convertirse en una tarjeta no asegurada?','Algunos productos lo permiten bajo revisión; otros no. Lee los términos antes de solicitar.']
    ]
  },
  {
    slug:'como-pagar-deudas', title:'Cómo crear un plan para pagar deudas', category:'Deudas', categorySlug:'deudas', minutes:10,
    description:'Organiza saldos, tasas, mínimos y aportes adicionales para construir un plan realista de pago.',
    intro:'Un plan de deuda convierte varias obligaciones en una lista clara de pagos, prioridades y fechas. No elimina intereses ni dificultades de ingreso, pero permite evaluar opciones como bola de nieve o avalancha y medir avances.',
    takeaways:['Registra saldo, tasa, mínimo y vencimiento de cada deuda.','Mantén los mínimos mientras diriges dinero adicional.','Conserva una reserva razonable para imprevistos.','Contacta al acreedor pronto si no puedes pagar.'],
    sections:[
      ['Crear el inventario','Incluye tarjetas, préstamos, facturas financiadas y otras obligaciones. Anota saldo, tasa o costo, mínimo, fecha y si existe garantía. Confirma los datos en estados recientes. También registra pagos automáticos y consecuencias de atraso. La lista no debe incluir contraseñas ni números completos de cuenta.'],
      ['Elegir un método','La bola de nieve prioriza el saldo más pequeño y puede ofrecer avances visibles. La avalancha dirige el extra a la tasa más alta y puede reducir intereses matemáticamente si los pagos se mantienen. También puedes usar un enfoque híbrido. El método útil es el que cabe en el presupuesto y puede sostenerse.'],
      ['Definir el pago adicional','Resta necesidades, mínimos y una reserva básica del ingreso disponible. El extra debe ser realista; prometer una cantidad excesiva puede obligarte a volver a usar crédito. Cuando termine una deuda, dirige su pago a la siguiente. Revisa si existen penalidades o reglas especiales antes de adelantar un préstamo.'],
      ['Cuando el pago se complica','Contacta al acreedor antes de ignorar el problema y pregunta por opciones oficiales. Solicita términos por escrito y desconfía de empresas que exigen pago anticipado o prometen eliminar deuda legítima. Si la situación es compleja, busca asesoría acreditada apropiada para tu jurisdicción.']
    ],
    example:'Ejemplo ilustrativo: Rosa tiene saldos de USD 500 al 18%, USD 1.200 al 24% y USD 3.000 al 10%. Paga todos los mínimos y dispone de USD 150 extra. Con avalancha prioriza 24%; con bola de nieve prioriza USD 500. Compara motivación, costo estimado y sostenibilidad antes de elegir.',
    checklist:['Listar cada deuda y sus términos.','Confirmar pagos mínimos.','Crear un presupuesto realista.','Elegir bola de nieve, avalancha o híbrido.','Programar el pago adicional.','Revisar progreso y nuevas dificultades.'],
    mistakes:['Omitir una deuda pequeña.','Dejar de pagar mínimos de otras cuentas.','Usar todo el efectivo y quedar sin reserva.','Ignorar penalidades de prepago.','Aceptar promesas de eliminación garantizada.'],
    calculators:[['Calculadora de pago de tarjeta','pago-tarjeta-credito'],['Calculadora de préstamo','prestamo'],['Calculadora de deuda a ingreso','deuda-ingreso']],
    related:['metodo-bola-de-nieve','metodo-avalancha','presupuesto-mensual','fondo-de-emergencia'],
    faqs:[
      ['¿Qué deuda debo pagar primero?','Depende de tasas, saldos, riesgos y motivación. Compara avalancha, bola de nieve y obligaciones urgentes.'],
      ['¿Debo pagar más del mínimo?','Cuando el presupuesto lo permite, puede reducir tiempo e intereses. Mantén necesidades y una reserva razonable.'],
      ['¿Conviene usar todos mis ahorros?','Quedarte sin reserva puede crear nueva deuda ante un imprevisto. Evalúa un equilibrio.'],
      ['¿Qué hago si no puedo pagar el mínimo?','Contacta al acreedor pronto y solicita opciones oficiales por escrito.'],
      ['¿Consolidar siempre reduce el costo?','No. Revisa tasa, plazo, comisiones, garantía y costo total antes de decidir.'],
      ['¿Cuándo actualizo el plan?','Cada mes y cuando cambien ingreso, tasas, saldos o gastos esenciales.']
    ]
  },
  {
    slug:'metodo-bola-de-nieve', title:'Método bola de nieve para pagar deudas', category:'Deudas', categorySlug:'deudas', minutes:8,
    description:'Conoce cómo ordenar deudas por saldo, trasladar pagos y evaluar la motivación frente al costo de intereses.',
    intro:'El método bola de nieve ordena las deudas desde el saldo más pequeño hasta el mayor. Mantiene los pagos mínimos de todas y dirige el dinero adicional a la primera. Su principal atractivo es crear avances visibles.',
    takeaways:['Ordena por saldo, no por tasa.','Paga mínimos en todas las demás deudas.','Traslada el pago liberado a la siguiente.','Puede costar más intereses que priorizar la tasa más alta.'],
    sections:[
      ['Cómo se organiza','Registra saldos y mínimos, ordena de menor a mayor y determina un aporte adicional. Paga el mínimo de cada obligación para evitar atrasos, mientras envías el extra al saldo más pequeño. Cuando termina, suma su mínimo y el extra al pago de la deuda siguiente; de ahí proviene la idea de una bola que crece.'],
      ['Motivación y progreso','Cerrar una cuenta pequeña puede ofrecer una señal rápida de avance y simplificar el número de pagos. Para algunas personas, esa motivación ayuda a sostener el plan. Sin embargo, una deuda pequeña puede tener tasa menor que otra, por lo que el costo total podría ser más alto que con avalancha.'],
      ['Cuándo compararlo','Puede resultar útil si te abruma administrar muchas cuentas o necesitas hitos frecuentes. Antes de elegir, estima cuánto tardaría cada método, cuánto interés podría generar y qué tan probable es que mantengas el plan. Considera también deudas con garantía, atraso o consecuencias urgentes.'],
      ['Mantener el sistema','Automatiza mínimos cuando sea seguro, registra cada saldo y celebra avances sin crear deuda nueva. Si el ingreso baja, reduce temporalmente el extra antes de omitir obligaciones esenciales. Revisa estados para confirmar que el pago adicional se aplicó correctamente y conserva comprobantes.']
    ],
    example:'Ejemplo ilustrativo: hay tres deudas: USD 400, USD 1.100 y USD 2.600. Además de mínimos, existen USD 120 mensuales. Los USD 120 van a la deuda de USD 400. Al terminarla, su mínimo también se suma al pago de USD 1.100. No se muestran ahorros garantizados porque dependen de tasas y fechas.',
    checklist:['Ordenar saldos de menor a mayor.','Anotar mínimos y fechas.','Definir el extra disponible.','Pagar mínimos en todas.','Aplicar el extra al saldo menor.','Trasladar el pago cuando termine.'],
    mistakes:['Ordenar por tasa y llamarlo bola de nieve.','Dejar de pagar mínimos.','Ignorar una deuda atrasada o garantizada.','Usar un extra imposible de mantener.','Volver a cargar saldos pagados.'],
    calculators:[['Calculadora de pago de tarjeta','pago-tarjeta-credito'],['Calculadora de préstamo','prestamo']],
    related:['como-pagar-deudas','metodo-avalancha','presupuesto-mensual','fondo-de-emergencia'],
    faqs:[
      ['¿Por qué se llama bola de nieve?','Porque el pago dirigido crece al incorporar los mínimos de deudas ya terminadas.'],
      ['¿Siempre ahorra más intereses?','No. Priorizar tasas altas puede producir menor interés matemático.'],
      ['¿Debo cerrar una tarjeta pagada?','No automáticamente. Revisa costos, hábitos y posible efecto sobre crédito antes de decidir.'],
      ['¿Qué ocurre con los otros pagos?','Continúas pagando al menos sus mínimos mientras priorizas una deuda.'],
      ['¿Puedo cambiar de método?','Sí. Revisa costos y motivación, y mantén los pagos requeridos durante el cambio.'],
      ['¿Funciona con ingreso irregular?','Puede adaptarse usando un mínimo sostenible y aportes adicionales en meses mejores.']
    ]
  },
  {
    slug:'metodo-avalancha', title:'Método avalancha para pagar deudas', category:'Deudas', categorySlug:'deudas', minutes:8,
    description:'Aprende a priorizar tasas de interés, mantener mínimos y comparar la avalancha con la bola de nieve.',
    intro:'El método avalancha dirige el dinero adicional a la deuda con mayor tasa de interés, mientras mantiene mínimos en las demás. Busca reducir el costo matemático, aunque puede tardar en producir una cuenta completamente pagada.',
    takeaways:['Ordena las deudas por tasa, de mayor a menor.','Mantén todos los pagos mínimos.','Dirige el extra a la tasa más alta.','El ahorro real depende de saldos, tasas, pagos y fechas.'],
    sections:[
      ['Preparar el orden','Confirma la tasa aplicable de cada deuda y si puede cambiar. Ordena de mayor a menor; en caso de empate, puedes usar saldo, vencimiento u otra prioridad coherente. Incluye comisiones relevantes y términos promocionales que vencerán, pero no inventes una tasa futura.'],
      ['Aplicar los pagos','Paga el mínimo de todas las cuentas y dirige el extra a la primera. Cuando termine, traslada su pago completo a la siguiente tasa. Comprueba que los pagos adicionales reduzcan capital según el contrato y revisa penalidades de prepago en préstamos cuando correspondan.'],
      ['Ventaja matemática','Manteniendo los mismos pagos totales, atacar primero una tasa mayor suele reducir intereses frente a pagar primero una tasa menor. El monto exacto depende del calendario, cálculo diario o mensual, cambios de tasa y comportamiento futuro. Una calculadora ofrece una estimación, no un estado del acreedor.'],
      ['Desafío de motivación','La deuda con mayor tasa puede tener saldo grande y tardar en desaparecer. Divide el objetivo en hitos, registra reducción de saldo e interés y evita medir el éxito solamente por cuentas cerradas. Si la frustración amenaza la constancia, compara un enfoque híbrido o bola de nieve.']
    ],
    example:'Ejemplo ilustrativo: tres deudas tienen tasas de 25%, 16% y 8%. Después de mínimos, hay USD 150 adicionales. El método dirige ese extra a 25%, aunque su saldo no sea el menor. Al terminar, el pago se traslada a 16%. El interés ahorrado no se garantiza sin términos completos.',
    checklist:['Confirmar tasas y si son variables.','Ordenar de mayor a menor.','Registrar mínimos y fechas.','Asignar un extra sostenible.','Verificar aplicación a capital.','Trasladar el pago a la siguiente tasa.'],
    mistakes:['Usar una tasa promocional sin fecha de vencimiento.','Omitir mínimos de otras deudas.','Ignorar penalidades o cargos.','Abandonar por no ver una cuenta cerrada pronto.','Suponer un ahorro exacto sin términos completos.'],
    calculators:[['Calculadora de pago de tarjeta','pago-tarjeta-credito'],['Calculadora de préstamo','prestamo']],
    related:['como-pagar-deudas','metodo-bola-de-nieve','presupuesto-mensual','utilizacion-de-credito'],
    faqs:[
      ['¿La avalancha siempre cuesta menos?','Con pagos y términos comparables suele priorizar el costo, pero cambios de tasa, cargos y comportamiento alteran el resultado.'],
      ['¿Qué hago si dos tasas son iguales?','Puedes priorizar el saldo menor, una fecha importante o el método que facilite constancia.'],
      ['¿Debo incluir una deuda sin interés?','Inclúyela en el inventario y paga lo requerido; normalmente quedaría después de tasas positivas, salvo otra urgencia.'],
      ['¿Cómo mantengo la motivación?','Registra reducción de saldo, interés estimado y pequeños hitos mensuales.'],
      ['¿Puedo combinar avalancha y bola de nieve?','Sí. Un enfoque híbrido puede cerrar una cuenta pequeña y después priorizar tasas.'],
      ['¿El resultado de una calculadora es exacto?','Es una estimación; el acreedor aplica sus términos, fechas y redondeos.']
    ]
  },
  {
    slug:'como-leer-un-talon-de-pago', title:'Cómo leer un talón de pago en Estados Unidos', category:'Trabajo e ingresos', categorySlug:'trabajo-ingresos', minutes:10,
    description:'Identifica salario bruto, horas, retenciones, beneficios, Seguro Social, Medicare, neto y acumulados.',
    intro:'Un talón de pago explica cómo el ingreso bruto se convierte en pago neto. Los nombres, deducciones y formato varían por empleador, estado, localidad y situación laboral. Esta guía ayuda a leerlo, no a calcular impuestos personales.',
    takeaways:['Compara horas y tarifa con el período trabajado.','Distingue ingreso bruto, deducciones y pago neto.','Revisa cifras del período y acumuladas del año.','Pregunta al empleador ante una discrepancia.'],
    sections:[
      ['Ingresos del período','Busca fechas del período y de pago, tarifa por hora, horas regulares y horas extra. El multiplicador de tiempo extra depende de normas y políticas aplicables; no supongas que todo trabajo adicional usa la misma fórmula. Empleados asalariados pueden ver una cantidad por período. Bonos, comisiones o propinas reportadas pueden aparecer en líneas separadas.'],
      ['Retenciones obligatorias','El talón puede mostrar retención federal, estatal o local donde corresponda, además de Seguro Social y Medicare. Los nombres y cálculos dependen de clasificación, formularios y jurisdicción. Una retención es un pago anticipado o deducción de nómina; no determina por sí sola el impuesto final. Consulta fuentes oficiales para preguntas específicas.'],
      ['Beneficios y otras deducciones','Seguro médico, dental, retiro, transporte, cuotas u otros beneficios pueden reducir el cheque. Algunas cantidades pueden tratarse de manera distinta antes o después de impuestos, según las reglas. Confirma elecciones, cobertura y contribuciones del empleador. No compartas un talón completo porque contiene identificadores y datos personales.'],
      ['Neto y acumulado anual','El pago neto es lo depositado o entregado después de deducciones. Las cifras “year to date” o acumuladas resumen ingresos y deducciones desde el inicio del año. Compáralas periódicamente con talones anteriores. Una diferencia puede deberse a bono, cambio de beneficio, horas o corrección, pero merece verificación.']
    ],
    example:'Ejemplo ilustrativo: un talón muestra 40 horas a USD 20 y 5 horas extra con un multiplicador indicado de 1,5. El bruto ilustrativo es USD 800 + USD 150 = USD 950 antes de deducciones. No se aplican tasas fiscales porque dependen de la situación y jurisdicción.',
    checklist:['Confirmar período y fecha de pago.','Revisar horas, tarifa y extras.','Comparar bruto y conceptos adicionales.','Identificar cada deducción.','Comprobar pago neto.','Revisar acumulados y reportar discrepancias.'],
    mistakes:['Mirar solo el depósito bancario.','Confundir período trabajado con fecha de pago.','Asumir la misma regla de horas extra para todos.','Ignorar cambios de beneficios.','Compartir identificadores del talón.'],
    calculators:[['Calculadora de sueldo por hora','sueldo-por-hora'],['Calculadora de presupuesto mensual','presupuesto-mensual']],
    related:['ingreso-bruto-vs-neto','presupuesto-mensual','regla-50-30-20','como-evitar-estafas-financieras'],
    faqs:[
      ['¿Qué significa ingreso bruto?','Es el ingreso antes de retenciones y otras deducciones del período.'],
      ['¿Por qué cambió mi pago neto?','Horas, bonos, retenciones, beneficios o correcciones pueden cambiarlo. Compara líneas específicas.'],
      ['¿Todas las personas reciben talones iguales?','No. Formato y conceptos varían por empleador, jurisdicción y clasificación.'],
      ['¿La retención es mi impuesto final?','No necesariamente. El resultado fiscal depende de reglas y circunstancias individuales.'],
      ['¿Qué significa acumulado anual?','Es el total registrado desde el inicio del año hasta ese pago para un concepto.'],
      ['¿Qué hago si encuentro un error?','Documenta la diferencia y contacta a nómina o recursos humanos mediante canales oficiales.']
    ]
  },
  {
    slug:'ingreso-bruto-vs-neto', title:'Ingreso bruto vs. ingreso neto', category:'Trabajo e ingresos', categorySlug:'trabajo-ingresos', minutes:8,
    description:'Comprende la diferencia entre ingreso antes de deducciones y dinero disponible, incluso con trabajo independiente.',
    intro:'El ingreso bruto se mide antes de ciertas deducciones; el ingreso neto es lo que queda después. La diferencia es esencial para presupuestar, interpretar un talón y responder solicitudes que usan definiciones específicas.',
    takeaways:['Bruto y neto responden preguntas diferentes.','Presupuesta normalmente con dinero realmente disponible.','Una solicitud de préstamo puede pedir ingreso bruto.','El trabajo independiente requiere separar gastos y obligaciones.'],
    sections:[
      ['Ingreso bruto','Para un empleado, puede incluir salario, horas, bonos o comisiones antes de retenciones. Para un negocio o contratista, “bruto” puede referirse a ingresos antes de gastos, pero la definición exacta depende del documento. Lee la etiqueta y el período: semanal, mensual o anual. No conviertas una cifra sin considerar semanas efectivamente trabajadas.'],
      ['Ingreso neto','En un talón, es la cantidad después de retenciones y deducciones. No todas las deducciones son impuestos: algunas corresponden a beneficios o aportes elegidos. El neto del cheque tampoco siempre equivale al ingreso disponible anual si existen pagos independientes, reembolsos o gastos que debes cubrir fuera de nómina.'],
      ['Presupuesto y solicitudes','Para un presupuesto mensual, usa el efectivo que puedes asignar después de deducciones y separaciones necesarias. Algunos prestamistas solicitan bruto para aplicar sus propios cálculos, pero también revisan deuda y documentación. Proporciona la definición solicitada y no asumas que una cifra bruta representa capacidad de pago.'],
      ['Contratistas y trabajadores independientes','El pago recibido puede parecer neto porque no trae retenciones, pero parte podría corresponder a impuestos, seguro, herramientas o gastos del negocio. Mantén registros separados y consulta fuentes oficiales o un profesional apropiado sobre obligaciones. Esta guía no calcula ni estima impuestos individuales.']
    ],
    example:'Ejemplo ilustrativo: un empleado tiene USD 3.200 brutos mensuales y recibe USD 2.550 después de retenciones y beneficios. Usa USD 2.550 como base inicial del presupuesto. Si una solicitud pide bruto, informa USD 3.200 según su documentación; no sustituye una cifra por la otra.',
    checklist:['Identificar el período de la cifra.','Confirmar qué incluye el bruto.','Separar impuestos y otras deducciones.','Usar neto disponible para el presupuesto.','Leer la definición en solicitudes.','Guardar registros si trabajas por cuenta propia.'],
    mistakes:['Presupuestar con bruto.','Tratar toda deducción como impuesto.','Confundir ingresos del negocio con ganancia personal.','Multiplicar un cheque atípico como si fuera regular.','Dar una definición incorrecta en una solicitud.'],
    calculators:[['Calculadora de sueldo por hora','sueldo-por-hora'],['Calculadora de presupuesto mensual','presupuesto-mensual']],
    related:['como-leer-un-talon-de-pago','presupuesto-mensual','regla-50-30-20','como-ahorrar-dinero'],
    faqs:[
      ['¿Cuál uso para mi presupuesto?','Normalmente el neto realmente disponible, ajustado por obligaciones que no aparecen en nómina.'],
      ['¿Por qué una solicitud pide ingreso bruto?','La entidad puede aplicar su propia evaluación y verificarlo con documentos.'],
      ['¿El neto es igual al salario después de impuestos?','Puede incluir además beneficios, retiro y otras deducciones.'],
      ['¿Cómo convierto ingreso semanal a mensual?','Una estimación anual divide el total esperado entre doce; considera semanas trabajadas y variaciones.'],
      ['¿Los contratistas tienen ingreso neto al cobrar?','El pago recibido puede requerir separar gastos e impuestos; consulta la definición apropiada.'],
      ['¿DineroMundo calcula mis impuestos?','No. Las obligaciones dependen de jurisdicción y circunstancias individuales.']
    ]
  },
  {
    slug:'como-comparar-envios-de-dinero', title:'Cómo comparar servicios para enviar dinero', category:'Transferencias', categorySlug:'transferencias', minutes:10,
    description:'Compara costo total, cantidad recibida, conversión, pago, recepción, tiempo, límites y seguimiento.',
    intro:'Comparar transferencias exige mirar más que la tarifa visible. Dos servicios pueden mostrar tarifas distintas y entregar cantidades diferentes por el tipo de cambio, forma de pago o recepción. La comparación debe usar la misma ruta, monto y momento.',
    takeaways:['Compara pago total y monto final recibido.','Revisa tarifa y tipo de cambio juntos.','Confirma pago, recepción, identificación y límites.','Las cotizaciones cambian; verifica antes de confirmar.'],
    sections:[
      ['Costo total y conversión','Anota cuánto pagas, incluida la tarifa, y cuánto recibe el destinatario en su moneda. Compara el tipo de cambio con una referencia independiente para observar una posible diferencia de conversión, sin asumir que toda diferencia es idéntica. Tarjeta, banco, efectivo o entrega rápida pueden añadir cargos del proveedor o de terceros.'],
      ['Pago y recepción','Comprueba si puedes pagar con cuenta bancaria, débito, crédito o efectivo y cómo afecta el costo. Confirma si el destinatario recibe en banco, efectivo, billetera u otro servicio, además de moneda, institución, ubicación e identificación. La disponibilidad general de un proveedor no garantiza un método en cada ruta.'],
      ['Tiempo, límites y verificación','Los tiempos pueden expresarse en minutos, mismo día o varios días hábiles, pero dependen de verificación, horarios, fines de semana, datos y cumplimiento. Revisa mínimos, máximos, límites acumulados y documentos. Una demora estimada no es una promesa y un límite puede cambiar según el perfil.'],
      ['Cancelación, seguimiento y soporte','Antes de pagar, lee cuándo puede cancelarse, qué ocurre si la información es incorrecta y cómo se solicita un reembolso. Guarda número de referencia y recibo. Identifica canales oficiales y horarios de soporte. Nunca envíes dinero porque una persona desconocida presiona o promete una recompensa.']
    ],
    example:'Ejemplo ilustrativo sin proveedores: Servicio A cobra USD 5 y usa una conversión; Servicio B cobra USD 2 pero entrega menos moneda de destino. La comparación correcta observa pago total y monto recibido, no concluye que B sea más económico solo por la tarifa. Confirma ambos resultados en la pantalla final.',
    checklist:['Usar la misma ruta y monto.','Anotar pago total.','Anotar monto recibido.','Revisar tipo de cambio y tarifa.','Confirmar pago, recepción y tiempo.','Leer límites, cancelación y soporte.'],
    mistakes:['Elegir por la tarifa anunciada.','Comparar cotizaciones de días distintos.','No verificar la moneda entregada.','Suponer que un método existe en todo país.','Enviar sin revisar datos del destinatario.'],
    calculators:[['Calculadora de costo de envío','costo-envio-dinero'],['Calculadora de porcentajes','porcentajes']],
    related:['como-evitar-estafas-financieras','presupuesto-mensual','cuenta-corriente-vs-ahorro','como-ahorrar-dinero'],
    extraLinks:[['Directorio de proveedores','../../proveedores/'],['Centro de comparaciones','../../comparar/']],
    faqs:[
      ['¿Cuál proveedor es más barato?','Depende de ruta, monto, pago, recepción, conversión y momento. Solicita cotizaciones equivalentes.'],
      ['¿La tarifa muestra todo el costo?','No siempre. También puede existir diferencia cambiaria y cargos de pago o recepción.'],
      ['¿Cómo comparo el tipo de cambio?','Observa la conversión ofrecida y cuánto recibe finalmente el destinatario.'],
      ['¿El tiempo estimado está garantizado?','No. Verificación, bancos, fines de semana y datos pueden cambiarlo.'],
      ['¿Qué necesita el destinatario?','Depende del método: puede requerir identificación, cuenta, teléfono o referencia.'],
      ['¿Puedo cancelar después de pagar?','Depende del estado y las reglas del servicio. Revisa términos y actúa rápidamente.']
    ]
  },
  {
    slug:'como-evitar-estafas-financieras', title:'Cómo evitar estafas financieras', category:'Seguridad financiera', categorySlug:'seguridad', minutes:10,
    description:'Reconoce presión, suplantación, pagos inusuales y promesas falsas, y aprende a verificar y reportar.',
    intro:'Las estafas financieras suelen combinar presión, confianza o confusión para conseguir dinero o información. Reconocer señales y verificar por un canal independiente puede interrumpir el proceso sin recurrir al miedo.',
    takeaways:['Pausa cuando exista urgencia o secreto.','Nunca compartas contraseñas ni códigos de seguridad.','Verifica usando un teléfono o sitio oficial independiente.','Conserva evidencia y reporta por canales apropiados.'],
    sections:[
      ['Señales de alerta','Desconfía de demandas urgentes, amenazas, premios inesperados, inversiones con ganancias garantizadas, empleos que piden dinero, romances que avanzan hacia solicitudes económicas y pagos anticipados para recibir un beneficio. Tarjetas de regalo, criptomonedas o transferencias a desconocidos son difíciles de recuperar y suelen usarse para evitar protecciones.'],
      ['Suplantación y mensajes','Una persona puede imitar a un familiar, banco, proveedor, policía, agencia pública o empleador. El identificador de llamada, correo o perfil puede falsificarse. No uses el enlace ni número recibido para verificar. Busca el contacto oficial por separado y pregunta directamente. Una institución legítima no necesita tu contraseña completa ni un código para “proteger” tu cuenta.'],
      ['Transferencias y comprobantes falsos','Una captura, correo o mensaje no demuestra que el dinero llegó. Comprueba el saldo dentro de la aplicación o cuenta oficial. No devuelvas un supuesto pago excedente antes de confirmar su validez. Verifica nombre, destino y referencia antes de enviar; una operación completada puede ser difícil o imposible de cancelar.'],
      ['Qué hacer','Pausa, no respondas a nuevas exigencias y protege las cuentas relacionadas. Contacta a la institución con datos oficiales, cambia credenciales comprometidas y activa medidas disponibles. Guarda mensajes, recibos, nombres y fechas. Reporta a la plataforma, institución y autoridad apropiada para tu país; si existe peligro inmediato, usa servicios locales de emergencia.']
    ],
    example:'Ejemplo ilustrativo: alguien llama diciendo ser un familiar con una emergencia y exige una transferencia secreta. La persona cuelga, llama al familiar mediante un número conocido y descubre que está bien. No comparte códigos, conserva el número recibido y reporta el intento a su proveedor telefónico.',
    checklist:['Pausar ante urgencia o secreto.','Verificar por un canal independiente.','No compartir claves ni códigos.','Confirmar pagos dentro de la cuenta oficial.','Guardar mensajes y recibos.','Reportar a instituciones y autoridades apropiadas.'],
    mistakes:['Confiar en el identificador de llamada.','Usar el enlace enviado para verificar.','Compartir un código de un solo uso.','Devolver un pago no confirmado.','Sentir vergüenza y no pedir ayuda.'],
    calculators:[['Calculadora de costo de envío','costo-envio-dinero'],['Calculadora de presupuesto mensual','presupuesto-mensual']],
    related:['como-comparar-envios-de-dinero','cuenta-corriente-vs-ahorro','como-funciona-el-credito-en-estados-unidos','presupuesto-mensual'],
    faqs:[
      ['¿Un banco puede pedirme un código por teléfono?','No compartas códigos recibidos para acceso o verificación. Cuelga y contacta al banco por un canal oficial.'],
      ['¿Una captura confirma una transferencia?','No. Verifica el movimiento dentro de la cuenta o aplicación oficial.'],
      ['¿Qué hago si ya envié dinero?','Contacta inmediatamente al proveedor y a la institución de pago; la recuperación no está garantizada.'],
      ['¿Debo borrar los mensajes?','Conserva evidencia antes de bloquear, salvo que hacerlo aumente un riesgo inmediato.'],
      ['¿Dónde reporto?','A la institución implicada, plataforma y autoridad competente de tu país. Usa fuentes oficiales.'],
      ['¿Las promesas de inversión garantizada son confiables?','Una promesa de ganancia alta o garantizada es una señal de alerta que requiere verificación independiente.']
    ]
  }
];

const categories=[['all','Todas'],['presupuesto','Presupuesto'],['ahorro','Ahorro'],['credito','Crédito'],['deudas','Deudas'],['trabajo-ingresos','Trabajo e ingresos'],['transferencias','Transferencias'],['seguridad','Seguridad financiera']];
const categoryPractice={
  presupuesto:'Un plan financiero mejora cuando se compara con evidencia del propio hogar. Conserva totales por categoría, anota qué gasto fue excepcional y evita convertir un solo mes en una conclusión permanente. Si una cifra no funciona, cambia una variable a la vez para reconocer su efecto. También distingue entre una dificultad de organización y una falta real de ingreso: un formato más detallado no resuelve por sí solo una cantidad insuficiente para cubrir necesidades.',
  ahorro:'El progreso de ahorro rara vez sigue una línea perfecta. Registra aportes y retiros con su propósito, pero no conviertas una pausa necesaria en motivo para abandonar la meta. Revisa acceso, seguridad, costos y condiciones del lugar donde mantienes el dinero. Cuando cambie la fecha o el objetivo, actualiza el plan de forma explícita para que la cantidad mensual continúe siendo comprensible y alcanzable.',
  credito:'Antes de tomar una decisión de crédito, separa lo que conoces de lo que estás suponiendo. Guarda estados, términos y fechas; identifica el modelo o institución que presenta una cifra; y evita actuar por un cambio aislado. Los efectos pueden variar y aparecer en momentos distintos. La prioridad práctica es cumplir pagos, entender costos y corregir información inexacta, no perseguir una predicción exacta.',
  deudas:'Mide el avance con saldo, pagos realizados y capacidad de mantener el plan. Una estrategia puede cambiar si aparece una emergencia, una tasa variable o una obligación con consecuencias más urgentes. Documenta cualquier acuerdo con el acreedor y verifica cómo se aplica un pago adicional. Si el plan exige volver a usar crédito para gastos básicos, necesita una revisión más realista.',
  'trabajo-ingresos':'Guarda talones, contratos y registros de horas en un lugar seguro y compara períodos equivalentes. Una diferencia puede tener una explicación normal, pero conviene identificar la línea exacta en vez de mirar solamente el depósito. Protege números de empleado, direcciones y otros identificadores. Para dudas fiscales o laborales específicas, consulta una fuente oficial o profesional competente en la jurisdicción correspondiente.',
  transferencias:'Realiza la comparación en una sola sesión cuando sea posible y conserva la pantalla final antes de confirmar. Una cotización anterior puede dejar de representar la conversión, tarifa o disponibilidad actual. Usa exactamente el mismo monto, país, método de pago y recepción para ambos servicios. Si cambias una condición, registra el cambio para no atribuir la diferencia al proveedor equivocado.',
  seguridad:'La prevención funciona mejor con un procedimiento decidido antes de una situación urgente. Identifica cómo contactar oficialmente a tus instituciones, activa las alertas disponibles y acuerda con familiares una forma de verificar emergencias. Practicar una pausa breve reduce la presión de responder. Si algo parece extraño, pedir una segunda opinión a una persona confiable no es una señal de debilidad.'
};
const countries=[['México','mexico'],['Colombia','colombia'],['República Dominicana','republica-dominicana'],['Guatemala','guatemala'],['Honduras','honduras'],['El Salvador','el-salvador'],['Perú','peru'],['Ecuador','ecuador']];
const base=d=>'../'.repeat(d);
const header=(depth,current='')=>{const home=base(depth),learn=depth===1?'./':'../';return `<a class="skip-link" href="#contenido">Saltar al contenido</a><header class="site-header"><div class="container header-inner"><a class="brand" href="${home}" aria-label="DineroMundo, inicio"><span>Dinero</span>Mundo</a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="sr-only">Abrir menú principal</span><span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span></button><nav class="site-nav" id="site-nav" aria-label="Navegación principal"><a href="${home}">Inicio</a><a href="${home}#enviar-dinero">Enviar dinero</a><a href="${home}calculadoras/">Calculadoras</a><a href="${home}paises/">Países</a><a href="${home}proveedores/">Proveedores</a><a href="${home}comparar/">Comparar</a><a href="${learn}"${current==='learning'?' aria-current="page"':''}>Aprender</a><a class="btn btn-primary nav-cta" href="${home}calculadoras/">Explorar herramientas</a></nav></div></header>`};
const footer=depth=>{const home=base(depth);return `<footer class="site-footer"><div class="container"><div class="footer-grid"><div class="footer-brand"><a class="brand brand-light" href="${home}"><span>Dinero</span>Mundo</a><p>Tu centro financiero para enviar dinero, comparar opciones y tomar mejores decisiones.</p></div><div><h2>DineroMundo</h2><ul><li><a href="${home}#nosotros">Nosotros</a></li><li><a href="${home}metodologia/">Política editorial</a></li><li><span>Contacto — Próximamente</span></li></ul></div><div><h2>Herramientas</h2><ul><li><a href="${home}calculadoras/">Calculadoras</a></li><li><a href="${home}paises/">Países</a></li><li><a href="${home}proveedores/">Proveedores</a></li><li><a href="${home}comparar/">Comparar proveedores</a></li><li><a href="${home}aprender/">Centro educativo</a></li></ul></div><div><h2>Legal</h2><ul><li><span>Privacidad — Próximamente</span></li><li><span>Términos — Próximamente</span></li><li><span>Aviso financiero — Próximamente</span></li></ul></div></div><div class="footer-bottom"><p>© <span data-current-year>2026</span> DineroMundo.com</p><p>Contenido educativo; verifica condiciones con fuentes apropiadas.</p></div></div></footer>`};
const org={'@context':'https://schema.org','@type':'Organization',name:'DineroMundo',url:'https://dineromundo.com/'};
const shell=({title,description,canonical,depth,body,schema='',directory=false})=>`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="${description}"><link rel="canonical" href="${canonical}"><meta property="og:type" content="${directory?'website':'article'}"><meta property="og:locale" content="es_US"><meta property="og:site_name" content="DineroMundo"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${description}"><link rel="stylesheet" href="${base(depth)}assets/css/styles.css">${schema}</head><body>${header(depth,'learning')}${body}${footer(depth)}<script src="${base(depth)}assets/js/main.js" defer></script>${directory?`<script src="${base(depth)}assets/js/learning.js" defer></script>`:''}</body></html>`;
const ad='<aside class="ad-slot" aria-label="Espacio publicitario">Espacio publicitario</aside>';
const guideBySlug=Object.fromEntries(guides.map(g=>[g.slug,g]));

function directoryPage(){
  const cards=guides.map(g=>`<article class="card learning-card" data-learning-card data-category="${g.categorySlug}"><span class="article-tag">${g.category}</span><h2>${g.title}</h2><p>${g.description}</p><div class="learning-card-meta"><span>${g.minutes} min de lectura</span><span>Revisado: ${reviewed}</span></div><a class="btn btn-secondary" href="${g.slug}/">Leer guía</a></article>`).join('');
  const featured=[guides[0],guides[5],guides[15]].map(g=>`<article class="card featured-guide"><span class="label">${g.category}</span><h2>${g.title}</h2><p>${g.description}</p><a class="btn" href="${g.slug}/">Leer guía destacada</a></article>`).join('');
  const filters=categories.map(([s,n])=>`<button type="button" data-learning-filter="${s}" aria-pressed="${s==='all'}">${n}</button>`).join('');
  const body=`<main id="contenido"><section class="page-hero"><div class="container"><nav class="breadcrumbs" aria-label="Migas de pan"><ol><li><a href="../">Inicio</a></li><li aria-current="page">Aprender</li></ol></nav><p class="eyebrow">Educación financiera</p><h1>Aprende a manejar mejor tu dinero</h1><p class="hero-lede">Encuentra guías claras sobre presupuesto, ahorro, crédito, deudas, salarios y transferencias internacionales.</p></div></section><div class="container">${ad}</div>
  <section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Para comenzar</p><h2>Guías destacadas</h2><p>Tres puntos de entrada para organizar dinero, comprender crédito y protegerte.</p></div></div><div class="featured-guide-grid">${featured}</div></div></section>
  <section class="section section-tint"><div class="container"><div class="learning-directory-tools"><div class="field"><label for="learning-search">Buscar una guía</label><input id="learning-search" type="search" placeholder="Ejemplo: presupuesto o crédito" data-learning-search></div><fieldset><legend>Filtrar por categoría</legend><div class="learning-filter-buttons">${filters}</div></fieldset><p data-learning-count aria-live="polite">16 guías</p></div><div class="learning-grid">${cards}</div><p class="filter-empty" data-learning-empty hidden>No encontramos una guía con esos criterios.</p></div></section>
  <section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Rutas de aprendizaje</p><h2>Avanza tema por tema</h2></div></div><div class="learning-path-grid"><article class="learning-path-card"><h3>Organiza tu dinero</h3><ol><li><a href="ingreso-bruto-vs-neto/">Comprende tu ingreso</a></li><li><a href="presupuesto-mensual/">Crea un presupuesto</a></li><li><a href="fondo-de-emergencia/">Construye una reserva</a></li></ol></article><article class="learning-path-card"><h3>Comprende el crédito</h3><ol><li><a href="como-funciona-el-credito-en-estados-unidos/">Conoce el sistema</a></li><li><a href="que-es-el-puntaje-de-credito/">Entiende el puntaje</a></li><li><a href="utilizacion-de-credito/">Calcula utilización</a></li></ol></article><article class="learning-path-card"><h3>Reduce riesgos</h3><ol><li><a href="como-comparar-envios-de-dinero/">Compara transferencias</a></li><li><a href="como-evitar-estafas-financieras/">Reconoce estafas</a></li><li><a href="../comparar/">Revisa proveedores</a></li></ol></article></div></div></section>
  <section class="section section-tint"><div class="container"><div class="review-content"><section><h2>Calculadoras relacionadas</h2><div class="related-links"><a href="../calculadoras/presupuesto-mensual/">Presupuesto mensual</a><a href="../calculadoras/meta-de-ahorro/">Meta de ahorro</a><a href="../calculadoras/pago-tarjeta-credito/">Pago de tarjeta</a><a href="../calculadoras/costo-envio-dinero/">Costo de envío</a></div></section><section><h2>Guías por país</h2><div class="provider-country-grid">${countries.map(([n,s])=>`<a href="../paises/${s}/">${n}</a>`).join('')}</div></section><section class="financial-note"><h2>Aviso financiero</h2><p>El contenido es educativo y general. Las reglas y prácticas cambian según país e institución. Verifica información actual con una fuente oficial o profesional apropiado cuando sea necesario.</p></section></div></div></section><div class="container">${ad}</div></main>`;
  const breadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Inicio',item:'https://dineromundo.com/'},{'@type':'ListItem',position:2,name:'Aprender',item:'https://dineromundo.com/aprender/'}]};
  return shell({title:'Aprende a manejar mejor tu dinero | DineroMundo',description:'Guías financieras en español sobre presupuesto, ahorro, crédito, deudas, ingresos, transferencias y seguridad financiera.',canonical:'https://dineromundo.com/aprender/',depth:1,body,directory:true,schema:`<script type="application/ld+json">${JSON.stringify(org)}</script><script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`});
}

function articlePage(g,index){
  const previous=guides[(index-1+guides.length)%guides.length],next=guides[(index+1)%guides.length];
  const faqHtml=g.faqs.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('');
  const related=g.related.map(s=>`<a href="../${s}/">${guideBySlug[s].title}</a>`).join('');
  const calculatorLinks=g.calculators.map(([n,s])=>`<a href="../../calculadoras/${s}/">${n}</a>`).join('');
  const extra=(g.extraLinks||[]).map(([n,u])=>`<a href="${u}">${n}</a>`).join('');
  const body=`<main id="contenido"><article><header class="article-hero"><div class="container"><nav class="breadcrumbs" aria-label="Migas de pan"><ol><li><a href="../../">Inicio</a></li><li><a href="../">Aprender</a></li><li aria-current="page">${g.title}</li></ol></nav><p class="eyebrow">${g.category}</p><h1>${g.title}</h1><p class="hero-lede">${g.intro}</p><p class="review-date">${g.minutes} min de lectura · Última revisión: ${reviewed}</p></div></header><div class="container">${ad}</div>
  <div class="container section article-layout"><div class="article-content"><section class="key-takeaways" aria-labelledby="takeaways-title"><h2 id="takeaways-title">Ideas principales</h2><ul>${g.takeaways.map(x=>`<li>${x}</li>`).join('')}</ul></section>
  ${g.sections.map(([h,p],i)=>`<section id="seccion-${i+1}"><h2>${h}</h2><p>${p}</p></section>`).join('')}
  <section><h2>Cómo llevar esta guía a la práctica</h2><p>${categoryPractice[g.categorySlug]}</p><p>Empieza por <strong>${g.checklist[0].toLowerCase()}</strong> Después continúa con ${g.checklist[1].toLowerCase()} y ${g.checklist[2].toLowerCase()} Registra la fecha de la revisión y la información utilizada. Repite el proceso cuando cambien tus ingresos, responsabilidades, términos o metas; así podrás distinguir un ajuste razonado de una reacción apresurada. Si una decisión implica un contrato, impuesto, derecho o riesgo importante, confirma los detalles actuales con una fuente oficial o profesional competente.</p></section>${ad}
  <section class="practical-example"><h2>Ejemplo práctico ilustrativo</h2><p>${g.example}</p></section>
  <section class="article-checklist-section"><h2>Checklist paso a paso</h2><ul class="article-checklist">${g.checklist.map(x=>`<li>${x}</li>`).join('')}</ul><button class="btn btn-secondary print-checklist" type="button" onclick="window.print()">Imprimir checklist</button><p class="source-note">Esta lista no guarda ni transmite información.</p></section>
  <section class="common-mistakes"><h2>Errores comunes</h2><ul>${g.mistakes.map(x=>`<li>${x}</li>`).join('')}</ul></section>
  <section><h2>Calculadoras relacionadas</h2><div class="related-links">${calculatorLinks}</div></section>
  <section><h2>Guías relacionadas</h2><div class="related-links">${related}${extra}</div></section>
  <section class="article-faq"><h2>Preguntas frecuentes</h2>${faqHtml}</section>${ad}
  <section><h2>Fuentes y metodología</h2><p>DineroMundo organiza conceptos financieros generales con fines educativos. Las prácticas, productos y reglas varían por país, institución y situación. Verifica detalles actuales con fuentes oficiales o un profesional apropiado cuando el tema lo requiera. No presentamos credenciales personales ni resultados garantizados.</p><p><a href="../../metodologia/">Consulta la metodología editorial</a>. Última revisión: ${reviewed}.</p></section>
  <section class="financial-note"><h2>Aviso financiero</h2><p>Esta guía ofrece información general y no asesoría financiera, fiscal, legal, migratoria, crediticia o de inversión. DineroMundo no conoce tu situación y no promete resultados.</p></section></div>
  <aside class="article-sidebar" aria-label="Contenido de la guía"><nav><h2>En esta guía</h2><ul>${g.sections.map(([h],i)=>`<li><a href="#seccion-${i+1}">${h}</a></li>`).join('')}<li><a href="#preguntas">Preguntas frecuentes</a></li></ul></nav></aside></div></article>
  <div class="container"><nav class="article-nav" aria-label="Navegación entre guías"><a href="../${previous.slug}/">← ${previous.title}</a><a class="directory-link" href="../">Todas las guías</a><a class="next" href="../${next.slug}/">${next.title} →</a></nav></div></main>`.replace('<section class="article-faq">','<section class="article-faq" id="preguntas">');
  const canonical=`https://dineromundo.com/aprender/${g.slug}/`;
  const breadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Inicio',item:'https://dineromundo.com/'},{'@type':'ListItem',position:2,name:'Aprender',item:'https://dineromundo.com/aprender/'},{'@type':'ListItem',position:3,name:g.title,item:canonical}]};
  const article={'@context':'https://schema.org','@type':'Article',headline:g.title,description:g.description,dateModified:'2026-07-28',inLanguage:'es',author:{'@type':'Organization',name:'DineroMundo'},publisher:{'@type':'Organization',name:'DineroMundo'},mainEntityOfPage:canonical};
  const faq={'@context':'https://schema.org','@type':'FAQPage',mainEntity:g.faqs.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))};
  return shell({title:`${g.title} | Guía de DineroMundo`,description:g.description,canonical,depth:2,body,schema:`<script type="application/ld+json">${JSON.stringify(org)}</script><script type="application/ld+json">${JSON.stringify(breadcrumb)}</script><script type="application/ld+json">${JSON.stringify(article)}</script><script type="application/ld+json">${JSON.stringify(faq)}</script>`});
}

const learnRoot=path.join(root,'aprender');fs.mkdirSync(learnRoot,{recursive:true});fs.writeFileSync(path.join(learnRoot,'index.html'),directoryPage());
guides.forEach((g,i)=>{const d=path.join(learnRoot,g.slug);fs.mkdirSync(d,{recursive:true});fs.writeFileSync(path.join(d,'index.html'),articlePage(g,i));});

// Update only shared learning links and approved integration points.
const htmlFiles=[];const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).forEach(e=>{if(e.name==='.git'||e.name==='.agents'||e.name==='aprender')return;const f=path.join(dir,e.name);if(e.isDirectory())walk(f);else if(e.name==='index.html')htmlFiles.push(f)});walk(root);
for(const file of htmlFiles){let html=fs.readFileSync(file,'utf8');const depth=path.relative(root,path.dirname(file)).split(path.sep).filter(Boolean).length,rel='../'.repeat(depth);html=html.replace(/href="[^"]*(?:#aprender|aprender\/)">Aprender<\/a>/g,`href="${rel}aprender/">Aprender</a>`);if(!html.includes('>Centro educativo</a>')){html=html.replace(/(<li><a href="[^"]*comparar\/">Comparar proveedores<\/a><\/li>)/,`$1<li><a href="${rel}aprender/">Centro educativo</a></li>`);if(!html.includes('>Centro educativo</a>'))html=html.replace(/(<div><h2>Herramientas<\/h2><ul>[\s\S]*?)(<\/ul><\/div>\s*<div><h2>Legal<\/h2>)/,`$1<li><a href="${rel}aprender/">Centro educativo</a></li>$2`)}fs.writeFileSync(file,html)}

let home=fs.readFileSync(path.join(root,'index.html'),'utf8');
const homepageLinks={
  'Cómo crear un presupuesto mensual':'presupuesto-mensual',
  'Cómo empezar un fondo de emergencia':'fondo-de-emergencia',
  'Cómo funciona el crédito en Estados Unidos':'como-funciona-el-credito-en-estados-unidos',
  'Cómo comparar servicios para enviar dinero':'como-comparar-envios-de-dinero',
  'Cuenta corriente vs. cuenta de ahorro':'cuenta-corriente-vs-ahorro',
  'Cómo evitar estafas financieras':'como-evitar-estafas-financieras'
};
for(const [title,slug] of Object.entries(homepageLinks)){const escaped=title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');home=home.replace(new RegExp(`(<article class="card article-card"><span class="article-tag">[^<]+</span><h3>${escaped}</h3><p>[^<]+</p>)<span class="coming">Próximamente</span>(</article>)`),`$1<a href="aprender/${slug}/">Leer guía</a>$2`)}
if(!home.includes('class="learning-directory-link"'))home=home.replace(/(<div class="section-head"><div><p class="eyebrow">Educación financiera<\/p><h2 id="learn-title">Aprende a manejar mejor tu dinero<\/h2><p>[^<]+<\/p><\/div>)(<\/div>)/,`$1<a class="learning-directory-link" href="aprender/">Ver todas las guías</a>$2`);
fs.writeFileSync(path.join(root,'index.html'),home);

const learningSection=`<section class="learning-links"><h2>Educación financiera relacionada</h2><p>Complementa esta información con guías generales y verifica siempre los datos actuales.</p><div class="related-links"><a href="../../aprender/como-comparar-envios-de-dinero/">Cómo comparar servicios para enviar dinero</a><a href="../../aprender/como-evitar-estafas-financieras/">Cómo evitar estafas financieras</a></div></section>`;
for(const slug of ['wise','western-union','remitly','moneygram','ria-money-transfer','xoom']){const file=path.join(root,'proveedores',slug,'index.html');let html=fs.readFileSync(file,'utf8');if(!html.includes('class="learning-links"'))html=html.replace('<section class="comparison-upcoming">',`${learningSection}<section class="comparison-upcoming">`);fs.writeFileSync(file,html)}
for(const entry of fs.readdirSync(path.join(root,'comparar'),{withFileTypes:true}).filter(e=>e.isDirectory())){const file=path.join(root,'comparar',entry.name,'index.html');let html=fs.readFileSync(file,'utf8');if(!html.includes('class="learning-links"'))html=html.replace('<section class="provider-faq"',`${learningSection}<section class="provider-faq"`);fs.writeFileSync(file,html)}

const sitemap=path.join(root,'sitemap.xml');let xml=fs.readFileSync(sitemap,'utf8');for(const url of ['https://dineromundo.com/aprender/',...guides.map(g=>`https://dineromundo.com/aprender/${g.slug}/`)])if(!xml.includes(`<loc>${url}</loc>`))xml=xml.replace('</urlset>',`  <url><loc>${url}</loc></url>\n</urlset>`);fs.writeFileSync(sitemap,xml);
console.log(`Phase 6 generated: ${guides.length} guides and learning directory.`);
