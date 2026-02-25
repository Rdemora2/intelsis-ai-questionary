# Business Automation Radar (BAR)

Diagnóstico de maturidade em automação com inteligência artificial generativa.  
Microproduto interativo (60–90 s) para eventos e campanhas corporativas do **Grupo Intelsis**.

> **Tema visual:** dark-mode premium — superfícies `#0a0f1a` com acentos em verde `#22c55e`.

---

## Stack

| Camada | Tecnologia |
|---|---|
| **Framework** | Next.js 14 (App Router) · TypeScript |
| **UI** | Tailwind CSS · Animações CSS custom (partículas, splash, shimmer) |
| **Validação** | Zod |
| **Banco de dados** | PostgreSQL — Neon (sa-east-1) · Prisma ORM |
| **LLM** | Google Gemini (`gemini-2.0-flash`) via `@google/generative-ai` |
| **Testes** | Vitest (33 testes) |

---

## Pré-requisitos

- Node.js 18+
- pnpm 8+
- Conta Neon (ou outro PostgreSQL) para o banco
- Chave de API do Google Gemini

## Execução local

```bash
# 1. Instalar dependências
pnpm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com DATABASE_URL e GEMINI_API_KEY

# 3. Gerar cliente Prisma e aplicar schema
pnpm db:generate
pnpm db:push

# 4. Iniciar servidor de desenvolvimento
pnpm dev
```

Acesse http://localhost:3000

---

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `GEMINI_API_KEY` | Sim* | Chave da API Google Gemini. Sem ela, o sistema usa fallback determinístico. |
| `DATABASE_URL` | Sim | Connection string PostgreSQL (ex: `postgresql://user:pass@host/db?sslmode=require`) |
| `ADMIN_USER` | Sim | Usuário do painel admin |
| `ADMIN_PASS` | Sim | Senha do painel admin |

> \* Quando a chave não está presente, o diagnóstico funciona normalmente usando a heurística de fallback.

---

## Estrutura do projeto

```
src/
├── app/
│   ├── page.tsx                # Landing page (splash + partículas animadas)
│   ├── scan/page.tsx           # Formulário de diagnóstico
│   ├── result/[id]/page.tsx    # Resultado + CTA especialista
│   ├── privacy/page.tsx        # Política de privacidade (LGPD)
│   ├── admin/page.tsx          # Painel administrativo
│   └── api/
│       ├── scan/route.ts       # POST – processar diagnóstico + criar lead
│       └── admin/
│           ├── leads/route.ts  # GET – listar leads
│           └── export/route.ts # GET – exportar CSV
├── components/
│   ├── ScanForm.tsx            # Formulário principal (checkboxes + dados do lead + LGPD)
│   ├── ResultView.tsx          # Visualização do resultado
│   ├── LoadingSteps.tsx        # Animação de carregamento (orb + progress bar)
│   └── HomeSplash.tsx          # Splash screen animada
├── lib/
│   ├── scoring.ts              # Heurística de pontuação por pesos
│   ├── llm.ts                  # Integração Google Gemini (temp 0.75, 2048 tokens)
│   ├── prompts.ts              # System prompt + tom consultivo + variação
│   ├── fallback.ts             # Respostas determinísticas de fallback
│   ├── validation.ts           # Schemas Zod (scan, lead, LLM output)
│   ├── sanitize.ts             # Sanitização de input
│   ├── rate-limit.ts           # Rate limiting por IP
│   ├── logger.ts               # Logs estruturados
│   ├── auth.ts                 # Auth do admin (Basic Auth)
│   └── prisma.ts               # Cliente Prisma (singleton)
└── types/                      # Tipos TypeScript
```

---

## Fluxo principal

1. **Splash (/)** → Tela de carregamento animada (orb + anel rotativo + partículas)
2. **Landing (/)** → Hero com logo Grupo Intelsis, partículas de fundo, CTA "Iniciar diagnóstico"
3. **Scan (/scan)** → Formulário com 4 grupos de checkboxes + campo de contexto + dados da empresa (nome, empresa, e-mail, porte, área) + consentimento LGPD
4. **Loading** → Animação de 3 etapas com progress bar e shimmer
5. **Resultado (/result/[id])** → Score, nível, sinais de automação, soluções SAP sugeridas, impactos, sumário executivo
6. **CTA** → "Fale com um especialista Intelsis" (link para grupointelsis.com.br)
7. **Admin (/admin)** → Tabela de leads, filtros, export CSV

---

## Scoring e LLM

### Heurística de pontuação

- 13 checkboxes com pesos individuais (8–15 pontos)
- Score normalizado para 0–100
- Bônus de até 10 pontos por keywords no texto livre
- Níveis: **Baixo** (0–33), **Médio** (34–66), **Alto** (67–100)
- Temas de automação extraídos dos itens selecionados
- Score e sinais passados ao LLM para análise personalizada

### Integração Gemini

- **Modelo:** `gemini-2.0-flash` (singleton com cache)
- **Temperatura:** 0.75 (promove variação nas respostas)
- **Max tokens:** 2048 (evita truncamento de JSON)
- **Timeout:** 12 s
- **Tom consultivo:** o prompt proíbe termos negativos/julgadores (ex: "ineficiência", "falha", "gargalo") e exige linguagem de oportunidade
- **Variação:** instruções de sinonímia + seed aleatório por requisição para evitar repetição
- **Mapeamento SAP:** 9 soluções mapeadas (SAP Business One, S/4HANA, SuccessFactors, Ariba, Concur, etc.)

### Fallback

- Se `GEMINI_API_KEY` não configurada → fallback determinístico
- Se LLM retornar JSON inválido → 1 tentativa de reparo (modelo a 0.5 de temperatura)
- Se reparo falhar → fallback determinístico com textos consultivos pré-definidos

---

## LGPD

- Consentimento explícito obrigatório no formulário antes do envio
- Política de privacidade completa em `/privacy` (9 seções, referências aos artigos da Lei 13.709/2018)
- Dados coletados: nome, empresa, e-mail, porte, área de atuação, respostas do diagnóstico
- Compartilhamento declarado: Google Gemini API (processamento), Neon PostgreSQL (armazenamento)
- Direitos do titular (art. 18): confirmação, acesso, correção, anonimização, portabilidade, eliminação, revogação

---

## Testes

```bash
# Executar todos os testes (33 testes)
pnpm test
```

Os testes cobrem:
- Validação de schemas Zod (scan request, lead request, LLM output)
- Heurística de scoring (pesos, normalização, níveis, keyword bonus)
- Campos obrigatórios (nome, empresa, e-mail, consentimento LGPD)

---

## Deploy (Vercel)

1. Conecte o repositório no Vercel
2. Configure as variáveis de ambiente no dashboard (`GEMINI_API_KEY`, `DATABASE_URL`, `ADMIN_USER`, `ADMIN_PASS`)
3. O Vercel executará `next build` automaticamente
4. O schema Prisma já está configurado para PostgreSQL

---

## Segurança

- Rate limiting por IP (10 req/10 min por padrão)
- Sanitização de inputs (remoção de HTML, controle de tamanho)
- Proteção contra prompt injection no campo de texto
- Conexão SSL obrigatória com o banco de dados
- Admin protegido por Basic Auth via variáveis de ambiente
- Logs estruturados sem armazenamento de chaves ou dados sensíveis
- Consentimento explícito LGPD para captura de dados pessoais

---

## Licença

Proprietary — Todos os direitos reservados. Grupo Intelsis.
