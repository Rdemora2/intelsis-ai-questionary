import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-950">
      <div className="mx-auto w-full max-w-2xl px-4 pt-5 pb-2">
        <Link
          href="/"
          className="text-sm text-surface-400 hover:text-brand-400 transition-colors"
        >
          ← Início
        </Link>
      </div>
      <main className="mx-auto w-full max-w-2xl px-4 py-4">
        <article className="max-w-none">
          <h1 className="text-xl font-bold text-white mb-6">
            Política de Privacidade
          </h1>

          <p className="text-sm text-surface-500 mb-6">
            Última atualização: fevereiro de 2026
          </p>

          <section className="space-y-5 text-sm text-surface-300 leading-relaxed">
            <div>
              <h2 className="font-semibold text-white mb-2">
                1. Controlador dos dados
              </h2>
              <p>
                O controlador responsável pelo tratamento dos dados pessoais
                coletados nesta aplicação é o{" "}
                <strong className="text-white">Grupo Intelsis</strong> (
                <a
                  href="https://grupointelsis.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-400 underline hover:text-brand-300"
                >
                  grupointelsis.com.br
                </a>
                ), com sede no Brasil, nos termos do art. 5º, inciso VI, da Lei
                nº 13.709/2018 (LGPD).
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-white mb-2">
                2. Dados pessoais coletados
              </h2>
              <p className="mb-2">
                Para realizar o diagnóstico, coletamos obrigatoriamente:
              </p>
              <ul className="list-disc list-inside space-y-1 text-surface-400 ml-2">
                <li>
                  <strong className="text-surface-300">Nome completo</strong> —
                  identificação do titular
                </li>
                <li>
                  <strong className="text-surface-300">Nome da empresa</strong>{" "}
                  — contexto organizacional
                </li>
                <li>
                  <strong className="text-surface-300">
                    E-mail corporativo
                  </strong>{" "}
                  — canal de contato e envio de resultados
                </li>
                <li>
                  <strong className="text-surface-300">Porte da empresa</strong>{" "}
                  (faixa de colaboradores) — personalização da análise
                </li>
                <li>
                  <strong className="text-surface-300">Área de atuação</strong>{" "}
                  — personalização da análise
                </li>
                <li>
                  <strong className="text-surface-300">
                    Respostas ao questionário
                  </strong>{" "}
                  (seleção de dores operacionais) — geração do diagnóstico
                </li>
              </ul>
              <p className="mt-2">
                Opcionalmente, você pode fornecer uma{" "}
                <strong className="text-surface-300">descrição textual</strong>{" "}
                de um problema operacional (máx. 500 caracteres) para enriquecer
                a análise.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-white mb-2">
                3. Base legal e finalidade do tratamento
              </h2>
              <p className="mb-2">
                O tratamento dos seus dados é fundamentado no{" "}
                <strong className="text-white">consentimento do titular</strong>{" "}
                (art. 7º, inciso I, da LGPD), obtido de forma livre, informada e
                inequívoca por meio de checkbox obrigatório antes do envio do
                formulário.
              </p>
              <p>As finalidades específicas são:</p>
              <ul className="list-disc list-inside space-y-1 text-surface-400 ml-2 mt-1">
                <li>
                  Geração do diagnóstico de automação com recomendações de
                  soluções SAP
                </li>
                <li>
                  Eventual contato comercial por parte da equipe Intelsis para
                  aprofundamento do diagnóstico
                </li>
                <li>Melhoria contínua da ferramenta de diagnóstico</li>
              </ul>
            </div>

            <div>
              <h2 className="font-semibold text-white mb-2">
                4. Compartilhamento de dados com terceiros
              </h2>
              <p className="mb-2">
                Para gerar o diagnóstico, as respostas ao questionário (sem
                dados pessoais identificáveis) são enviadas à API Google Gemini
                (Google LLC) exclusivamente para processamento da análise. A
                Google não retém os dados enviados via API para fins de
                treinamento de modelos, conforme os{" "}
                <a
                  href="https://ai.google.dev/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-400 underline hover:text-brand-300"
                >
                  Termos de Serviço da API Gemini
                </a>
                .
              </p>
              <p>
                Os dados pessoais (nome, empresa, e-mail) são armazenados em
                banco de dados PostgreSQL hospedado pela{" "}
                <strong className="text-surface-300">Neon</strong> (neon.tech),
                com infraestrutura na região sa-east-1 (São Paulo). Não
                vendemos, alugamos ou transferimos seus dados pessoais a
                terceiros para fins diversos dos aqui descritos.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-white mb-2">
                5. Armazenamento e medidas de segurança
              </h2>
              <ul className="list-disc list-inside space-y-1 text-surface-400 ml-2">
                <li>
                  Comunicação cifrada via HTTPS/TLS em todas as transmissões
                </li>
                <li>Banco de dados com conexão SSL obrigatória</li>
                <li>
                  Sanitização e validação de todos os inputs antes do
                  processamento
                </li>
                <li>
                  Limitação de taxa (rate limiting) para prevenção de abusos
                </li>
                <li>Acesso ao painel administrativo restrito</li>
              </ul>
              <p className="mt-2">
                Os dados são mantidos pelo tempo necessário ao cumprimento das
                finalidades descritas nesta política ou até solicitação de
                exclusão pelo titular.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-white mb-2">
                6. Direitos do titular (art. 18 da LGPD)
              </h2>
              <p className="mb-2">
                Você pode, a qualquer momento, exercer os seguintes direitos:
              </p>
              <ul className="list-disc list-inside space-y-1 text-surface-400 ml-2">
                <li>
                  <strong className="text-surface-300">Confirmação</strong> da
                  existência de tratamento de dados
                </li>
                <li>
                  <strong className="text-surface-300">Acesso</strong> aos dados
                  pessoais coletados
                </li>
                <li>
                  <strong className="text-surface-300">Correção</strong> de
                  dados incompletos, inexatos ou desatualizados
                </li>
                <li>
                  <strong className="text-surface-300">
                    Anonimização, bloqueio ou eliminação
                  </strong>{" "}
                  de dados desnecessários ou excessivos
                </li>
                <li>
                  <strong className="text-surface-300">Portabilidade</strong>{" "}
                  dos dados a outro fornecedor de serviço
                </li>
                <li>
                  <strong className="text-surface-300">Eliminação</strong> dos
                  dados pessoais tratados com base no consentimento
                </li>
                <li>
                  <strong className="text-surface-300">Revogação</strong> do
                  consentimento a qualquer momento
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-semibold text-white mb-2">
                7. Consentimento
              </h2>
              <p>
                O fornecimento dos dados pessoais e o envio do formulário
                dependem do consentimento explícito do titular, manifestado por
                meio de checkbox obrigatório. Sem o consentimento, o diagnóstico
                não pode ser realizado. O consentimento pode ser revogado a
                qualquer momento mediante solicitação ao controlador.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-white mb-2">
                8. Contato do controlador / Encarregado (DPO)
              </h2>
              <p>
                Para exercer seus direitos, esclarecer dúvidas ou enviar
                solicitações relativas aos seus dados pessoais, entre em contato
                pelos canais oficiais disponíveis em{" "}
                <a
                  href="https://grupointelsis.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-400 underline hover:text-brand-300"
                >
                  grupointelsis.com.br
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-white mb-2">
                9. Alterações nesta política
              </h2>
              <p>
                Esta política pode ser atualizada periodicamente. A data de
                última atualização será sempre exibida no topo da página.
                Recomendamos a consulta periódica deste documento.
              </p>
            </div>
          </section>

          <div className="mt-8 pt-6 border-t border-surface-800">
            <Link
              href="/"
              className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
            >
              ← Voltar ao início
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
