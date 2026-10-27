---
trigger: always_on
---
# Contexto de Dominio Judicial — CONSILIIUM (TSJ Venezuela)

> Conocimiento de dominio extraído del sistema legacy CONSILIUM.md para preservar como **domain knowledge** en la nueva arquitectura.

## 1. Identidad del Sistema

| Elemento | Valor |
|---|---|
| **Marca interna servidor** | IUSTITIA |
| **Nombre proyecto** | CONSILIIUM (doble I en prosa, una I en dirs/packages) |
| **Marca pública** | "Sistema de Gestión Judicial" |
| **Título HTML** | SISTEMA DE GESTIÓN JUDICIAL - TSJ |
| **Subtítulo** | Tribunal Supremo de Justicia • República Bolivariana de Venezuela |
| **Idiomas** | Español (Venezuela), locale `es-AR` para fechas |

## 2. Propósito Funcional

Sistema de gestión judicial que simula el portal oficial del **Tribunal Supremo de Justicia (TSJ)** permitiendo:
- Consulta pública de expedientes por tribunal, NUE, carátula, parte procesal, cédula
- Autenticación con registro y sesiones persistentes (8 horas)
- Roles: Invitado / Público Registrado / Funcionario TSJ (admin)
- Panel de 7 jurisdicciones con emblemas SVG
- Ficha 360° de expediente con barra de progreso procesal e historial
- Biblioteca jurídica (15 leyes, 5 categorías)
- Noticias judiciales en carrusel
- Asistente virtual por keyword matching
- Modo claro/oscuro persistente

---

## 3. Jurisdicciones y Tribunales (7)

| ID | Título | Categoría | Competencias (Tags) | Emblema SVG |
|---|---|---|---|---|
| `lopnna` | Tribunales de Protección (LOPNNA) | Ley Orgánica LOPNNA | Manutención, Régimen de Visitas, Colocación Familiar, Patria Potestad | Manos doradas + silueta niño + balanza |
| `penal` | Jurisdicción Penal Ordinaria y Especial | COPP | Control de Garantías, Juicio Oral, Delitos Informáticos, Ejecución Penal | Escudo + espada cruzada + mazo + balanza |
| `violencia` | Tribunales de Violencia Contra la Mujer | Ley Especial VCM | Medidas de Protección, Violencia Psicológica, Feminicidio, Medidas Cautelares | Flor púrpura + silueta femenina + símbolo equidad |
| `civil` | Tribunales Civiles, Mercantiles y de Tránsito | Código Proc. Civil | Cobro de Bolívares, Hipotecas, Sociedades Mercantiles, Tránsito | Frontispicio + columnas romanas + pergamino lacre |
| `laboral` | Tribunales del Trabajo y Agrarios | LOTTT | Prestaciones Sociales, Calificación de Despido, Juicio Laboral, Agrario | Engranaje industrial + espiga + balanza |
| `contencioso` | Contencioso Administrativo y Tributario | Poder Público (LOJCA) | Nulidad de Actos, Reparos Tributarios, Contratos Públicos, SENIAT | Capitolio + columnas + escudo fiscal |
| `tsj_salas` | Salas del Tribunal Supremo de Justicia | Máxima Instancia TSJ | Recurso de Casación, Interpretación Constitucional, Avocamiento, Plenaria | Códice constitucional + 8 estrellas doradas |

**Paleta emblemas:** Fondo `#092C53`/`#061C38`, anillo `#D4AF37` (dorado), acentos `#C59B27`, `#0D47A1`, blanco.

---

## 4. Estados Procesales (5)

| Estado | Badge Color | Descripción |
|---|---|---|
| `En Trámite` | Azul | Causa en tramitación activa |
| `Apertura a Prueba` | Ámbar | Etapa probatoria |
| `Autos para Sentencia` | Púrpura | Conclusión de pruebas, pendiente fallo |
| `Sentencia Dictada` | Verde | Fallo emitido |
| `Archivado` | — | Existe en schema BD, no en datos demo |

---

## 5. Formato NUE (Número Único de Expediente)

```
EXP-YYYY-NNN-CÓDIGO
```
- `YYYY`: Año (ej. 2026)
- `NNN`: Secuencial (ej. 00104, 00188)
- `CÓDIGO`: ID jurisdicción en mayúsculas (LOPNNA, PENAL, VCM, CIVIL, LAB, CONT, SCON)

Ejemplos: `EXP-2026-00104-LOPNNA`, `EXP-2026-00701-SCON`

---

## 6. Biblioteca Jurídica (15 Leyes, 5 Categorías)

| Categoría | Leyes (Artículos) |
|---|---|
| **Constitucional** | CRBV (1-188), LOPE (1-220), LOPPE (1-290) |
| **Civil y Mercantil** | Código Civil (1-1200), Código Comercio (1-890), Ley Propiedad Horizontal (1-140) |
| **Penal** | COPP (1-500), Ley Corrupción (1-180), Ley Delitos Informáticos (1-160) |
| **Laboral** | LOT (1-280), LETT (1-320), Ley Seguridad Social (1-260) |
| **Administrativo** | LOPA (1-240), LCP (1-200), LOAP (1-180) |

---

## 7. Tipos de Actuaciones Procesales (Demo)

Demanda Inicial, Medida Cautelar, Informe Multidisciplinario, Acusación Fiscal, Audiencia Preliminar, Prueba Digital, Imposición de Medidas, Informe Psiquiátrico, Libelo de Demanda, Sentencia Definitiva, Acta de Audiencia, Recurso Contencioso, Auto de Admisión, Solicitud Constitucional, Fijación de Ponencia.

---

## 8. Matriz de Permisos por Rol

| Capacidad | Invitado | Público Registrado | Funcionario (Admin) |
|---|---|---|---|
| Ver home/tribunales | ✓ (gate login) | ✓ | ✓ |
| Ver leyes/normativa | ✗ (requiere login) | ✓ | ✓ |
| Ver expedientes | ✓ (requiere login) | ✓ | ✓ |
| Buscar expedientes | ✓ | ✓ | ✓ |
| Ficha 360° | ✓ | ✓ | ✓ |
| Guardar búsquedas | ✗ (401) | ✓ | ✓ |
| Descargar/imprimir PDF | ✓ | ✓ | ✓ |
| Agregar actuación | ✗ | ✗ | ✓ |
| Crear nueva causa | ✗ | ✗ | ✓ |
| Eliminar/dar baja causa | ✗ | ✗ | ✓ |

---

## 9. Glosario Términos Venezolanos

| Término | Definición |
|---|---|
| **NUE** | Número Único de Expediente |
| **Fojas** | Páginas foliadas de expediente |
| **Carátula** | Identificación nominal (partes + objeto) |
| **Actuación** | Evento procesal (escrito, auto, sentencia) |
| **INPREABOGADO** | Instituto Previsión Social del Abogado |
| **C.I.** | Cédula de Identidad venezolana |
| **LOPNNA** | Ley Orgánica Protección Niños/Adolescentes |
| **COPP** | Código Orgánico Procesal Penal |
| **VCM** | Violencia Contra la Mujer |
| **LOT/LOTTT** | Ley Orgánica del Trabajo |
| **LOJCA** | Ley Orgánica Jurisdicción Contencioso Administrativa |
| **CRBV** | Constitución República Bolivariana Venezuela |
| **SENIAT** | Servicio Nacional Integrado Administración Aduanera/Tributaria |
| **Fiscalía** | Ministerio Público (acusa en penal) |
| **RIF** | Registro Único Información Fiscal |