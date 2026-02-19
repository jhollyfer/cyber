# Testes

O backend utiliza o **Vitest** como framework de testes, com suporte a TypeScript decorators via plugin **SWC**.

## Configuracoes

Existem duas configuracoes separadas para testes unitarios e testes end-to-end (e2e).

### Testes Unitarios -- `vitest.config.ts`

- **Inclui:** arquivos `*.use-case.spec.ts` e `*.service.spec.ts`
- **Setup:** `test/setup.ts` -- realiza apenas o import de `reflect-metadata`, necessario para o funcionamento dos decorators
- Execucao padrao com pool de threads

### Testes E2E -- `vitest.e2e.config.ts`

- **Inclui:** arquivos `*.controller.spec.ts`
- **Setup:** `test/setup.e2e.ts`
- **Pool:** `forks`
- **maxWorkers:** `1` (execucao sequencial para evitar conflitos no banco)
- **Timeout:** `60000ms` (60 segundos)

## Setup E2E -- `test/setup.e2e.ts`

O setup de testes e2e realiza o isolamento do banco de dados. O Prisma utiliza um schema PostgreSQL isolado (ou banco de teste dedicado) para cada execucao de testes, garantindo que os dados de teste nao interfiram com dados de desenvolvimento.

No `afterAll`, os dados de teste sao limpos para evitar acumulo.

## Plugin SWC

O projeto utiliza o plugin SWC do Vitest para suporte a **decorators do TypeScript**, que sao amplamente utilizados no backend (ex: injecao de dependencias via `@Service()`, controllers via `@Controller`).

## Scripts npm

| Script           | Descricao                                      |
|------------------|-------------------------------------------------|
| `test`           | Executa todos os testes                         |
| `test:unit`      | Executa apenas os testes unitarios              |
| `test:e2e`       | Executa apenas os testes end-to-end             |
| `test:run`       | Executa os testes em modo single-run (sem watch)|
| `test:coverage`  | Executa os testes com relatorio de cobertura    |
