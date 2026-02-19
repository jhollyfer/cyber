# Skill: i18n / Internacionalizacao

O sistema de internacionalizacao usa `react-i18next` com `i18next-browser-languagedetector`. A configuracao vive em `src/i18n.ts`, os arquivos de traducao em `locales/{lang}/translation.json` e o provider `I18nextProvider` envolve a app no `__root.tsx`. Toda string de interface em rotas publicas deve usar `t('key')`. O idioma e detectado automaticamente (localStorage > navigator) com fallback para portugues. O componente `LanguageSwitcher` permite trocar o idioma.

---

## Estrutura do Arquivo

```
frontend/
  src/
    i18n.ts                                      <-- Configuracao i18next
    locales/
      pt/
        translation.json                         <-- Traducoes portugues
      en/
        translation.json                         <-- Traducoes ingles
    routes/
      __root.tsx                                 <-- I18nextProvider wrapper
    components/
      common/
        language-switcher.tsx                     <-- Seletor de idioma
        navbar.tsx                               <-- Usa LanguageSwitcher
```

---

## Template: Configuracao (`i18n.ts`)

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationPT from './locales/pt/translation.json';

const resources = {
  en: { translation: translationEN },
  pt: { translation: translationPT },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    defaultNS: 'translation',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
```

## Template: Arquivo de Traducao

```json
{
  "nav": {
    "items": "{{NavItem1}}",
    "entity1": "{{Entity1Plural}}",
    "entity2": "{{Entity2Plural}}",
    "categories": "Categorias",
    "aboutUs": "Sobre Nos"
  },
  "home": {
    "hero": {
      "title": "Titulo da pagina inicial",
      "subtitle": "Subtitulo descritivo"
    }
  },
  "entity": {
    "title": "{{EntityPlural}}",
    "search": "Buscar {{entityPlural}}...",
    "detail": "{{DetailField}}",
    "noResults": "Nenhum resultado encontrado"
  },
  "common": {
    "back": "Voltar",
    "loading": "Carregando...",
    "error": "Ocorreu um erro"
  },
  "footer": {
    "about": {
      "section1": "{{FooterSection1}}",
      "section2": "{{FooterSection2}}"
    },
    "support": {
      "title": "SUPORTE"
    },
    "copyright": "Copyright texto"
  }
}
```

## Template: Uso em Componente

```typescript
import { useTranslation } from 'react-i18next';

function RouteComponent(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <section>
      <h1>{t('entity.title')}</h1>
      <p>{t('entity.search')}</p>
      <button>{t('common.back')}</button>
    </section>
  );
}
```

## Template: Language Switcher

```typescript
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher(): React.JSX.Element {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'pt', label: 'Portugues', flag: 'BR' },
    { code: 'en', label: 'English', flag: 'US' },
  ];

  const changeLanguage = (lng: string): void => {
    i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          {currentLanguage.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {languages.map((lang) => (
          <DropdownMenuItem key={lang.code} onClick={() => changeLanguage(lang.code)}>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## Exemplo Real

```typescript
// routes/_public/layout.tsx (trecho)
import { useTranslation } from 'react-i18next';

function RouteComponent(): React.JSX.Element {
  const { t } = useTranslation();

  const MENU_LIST = [
    { title: t('nav.products'), url: '/pieces' },
    { title: t('nav.artisans'), url: '/artisans' },
    { title: t('nav.categories'), url: '/categories' },
    { title: t('nav.culturalContent'), url: '/cultural-contents' },
    { title: t('nav.aboutUs'), url: '/#footer' },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex min-h-screen flex-col">
        <Navbar className="sticky top-0 z-50 bg-[#8D0009]" menu={MENU_LIST} />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
```

```typescript
// routes/_public/pieces/index.tsx (trecho)
function RouteComponent(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <section>
      <button onClick={() => router.history.go(-1)}>
        <ArrowLeft />
        <span>{t('common.back')}</span>
      </button>
      <h1>{t('pieces.title')}</h1>
      <InputGroupInput placeholder={t('pieces.search')} />
    </section>
  );
}
```

```typescript
// routes/__root.tsx (trecho)
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

function RootDocument({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <I18nextProvider i18n={i18n}>
      <html lang={i18n.language}>
        <head><HeadContent /></head>
        <body>{children}</body>
      </html>
    </I18nextProvider>
  );
}
```

**Leitura do exemplo:**

1. `useTranslation()` retorna `{ t, i18n }`. O `t` e a funcao de traducao, `i18n` e a instancia para controle de idioma.
2. `t('nav.products')` busca a chave `nav.products` no JSON de traducao do idioma ativo.
3. O `I18nextProvider` no `__root.tsx` disponibiliza o contexto i18n para toda a arvore de componentes.
4. `html lang={i18n.language}` define o atributo `lang` do HTML dinamicamente.
5. `LanguageDetector` detecta o idioma na ordem: localStorage (`i18nextLng`) > navegador. O fallback e `pt`.
6. `i18n.changeLanguage('en')` troca o idioma e persiste no localStorage automaticamente.

---

## Estrutura de Keys

```
nav.*                  → Navegacao (menu, links)
home.*                 → Pagina inicial
  home.hero.*          → Secao hero
  home.featured.*      → Secao destaque
  home.categories.*    → Secao categorias
{{entity}}.*           → Pagina da entidade (title, search, noResults)
categories.*           → Pagina de categorias
common.*               → Strings compartilhadas (back, loading, error, clear)
footer.*               → Footer (about, support, copyright)
```

---

## Como Adicionar Uma Nova Traducao

### Passo 1: Adicionar key nos dois JSONs

```json
// locales/pt/translation.json
{ "newSection": { "title": "Titulo em portugues" } }

// locales/en/translation.json
{ "newSection": { "title": "Title in English" } }
```

### Passo 2: Usar no componente

```typescript
const { t } = useTranslation();
<h1>{t('newSection.title')}</h1>
```

---

## Regras e Convencoes

1. **`useTranslation()` em rotas publicas** -- toda rota em `routes/_public/` deve usar `useTranslation()`. Rotas privadas (admin) podem usar texto hardcoded.

2. **Keys com dot notation** -- use hierarquia por secao: `section.subsection.key`. Ex.: `pieces.search`, `home.hero.title`.

3. **Ambos idiomas obrigatorios** -- toda key adicionada deve existir em `pt/translation.json` e `en/translation.json`.

4. **Fallback para portugues** -- `fallbackLng: 'pt'` garante que se uma key nao existir no idioma ativo, a versao PT e exibida.

5. **Deteccao automatica** -- o idioma e detectado automaticamente via localStorage > navigator. Nao defina idioma manualmente.

6. **Persistencia no localStorage** -- a escolha do usuario e salva em `localStorage['i18nextLng']` automaticamente.

7. **`I18nextProvider` no root** -- o provider deve envolver toda a aplicacao em `__root.tsx`, nao em layouts individuais.

8. **Interpolacao desabilitada** -- `escapeValue: false` permite HTML nos valores (React ja escapa automaticamente).

9. **Namespace unico** -- use o namespace `translation` (default). Nao crie namespaces adicionais.

10. **Componentes compartilhados** -- Navbar, Footer e LanguageSwitcher usam `useTranslation()` diretamente, recebendo traducoes pelo contexto.

---

## Checklist

- [ ] A key existe em `locales/pt/translation.json`.
- [ ] A key existe em `locales/en/translation.json`.
- [ ] O componente importa `useTranslation` de `react-i18next`.
- [ ] O componente desestrutura `{ t }` do `useTranslation()`.
- [ ] Todas as strings de interface usam `t('key')`.
- [ ] Keys seguem dot notation: `section.subsection.key`.
- [ ] Nao ha texto hardcoded em portugues na rota publica.
- [ ] `I18nextProvider` esta no `__root.tsx`.

---

## Erros Comuns

| Erro | Causa | Correcao |
|------|-------|----------|
| Texto aparece como key (`pieces.title`) | Key nao existe no JSON de traducao | Adicionar a key em ambos os JSONs |
| Idioma nao persiste | `caches` nao inclui `localStorage` | Verificar `detection.caches: ['localStorage']` no config |
| Texto nao atualiza ao trocar idioma | Componente nao usa `useTranslation()` | Adicionar `const { t } = useTranslation()` no componente |
| Key hardcoded em rota publica | Esqueceu de usar `t()` | Substituir texto hardcoded por `t('key')` |
| JSON invalido | Erro de syntax no translation.json | Validar JSON (virgula extra, aspas) |
| Fallback nao funciona | `fallbackLng` nao definido | Verificar `fallbackLng: 'pt'` no config |
| LanguageSwitcher nao aparece | Componente nao importado na Navbar | Verificar import e renderizacao na Navbar |

---

**Cross-references:** ver [030-skill-rota-publica-navegacao.md](./030-skill-rota-publica-navegacao.md), [027-skill-layout.md](./027-skill-layout.md).
