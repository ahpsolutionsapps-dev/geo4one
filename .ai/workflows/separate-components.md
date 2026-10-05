# Workflow: Separar Feature en Componentes

## Objetivo

Analizar una feature y dividir su interfaz en componentes
con responsabilidades claras y reutilizables.

## Procedimiento

1. Leer `AGENTS.md`.
2. Leer las reglas de arquitectura aplicables.
3. Analizar la feature.
4. Analizar los componentes existentes.
5. Identificar componentes reutilizables.
6. Identificar componentes específicos de la feature.
7. Detectar posibles duplicaciones.
8. Proponer la estructura de componentes.
9. No modificar código durante la fase de análisis.
10. Implementar los componentes aprobados.
11. Integrarlos en las pantallas.
12. Ejecutar lint/análisis estático.
13. Ejecutar tests.
14. Informar los archivos creados y modificados.

## Reglas

- No crear componentes duplicados.
- No mezclar lógica de negocio con presentación.
- Mantener componentes pequeños y con responsabilidad clara.
- Respetar Clean Architecture.
- Respetar la organización por features.