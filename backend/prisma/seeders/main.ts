import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
config();

import { PrismaClient } from '../../generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const ADMINISTRATOR_PHONE = process.env.ADMINISTRATOR_PHONE!;
const ADMINISTRATOR_PASSWORD = process.env.ADMINISTRATOR_PASSWORD!;
const ADMINISTRATOR_NAME = process.env.ADMINISTRATOR_NAME!;

async function main(): Promise<void> {
  console.log('Seeding database...');

  // --- Admin User ---
  const hashedPassword = await bcrypt.hash(ADMINISTRATOR_PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where: { phone: ADMINISTRATOR_PHONE },
    update: {
      name: ADMINISTRATOR_NAME,
      password: hashedPassword,
      role: 'ADMINISTRATOR',
    },
    create: {
      name: ADMINISTRATOR_NAME,
      phone: ADMINISTRATOR_PHONE,
      password: hashedPassword,
      role: 'ADMINISTRATOR',
    },
  });

  console.log(`Admin user upserted: ${admin.name} (${admin.id})`);

  // --- Clean existing modules and questions (cascade deletes questions) ---
  await prisma.question.deleteMany();
  await prisma.module.deleteMany();

  console.log('Cleared existing modules and questions.');

  // --- Module 1: Pilares CID ---
  const module1 = await prisma.module.create({
    data: {
      title: 'Pilares CID',
      label: 'FASE 01 — AULA 01',
      description:
        'Domine os fundamentos: Confidencialidade, Integridade e Disponibilidade. Identifique qual pilar é comprometido em cada cenário.',
      icon: '\u{1F6E1}\uFE0F',
      gradient: 'gradient-purple',
      category_color: 'bg-purple/10 text-purple',
      time_per_question: 60,
      order: 1,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        module_id: module1.id,
        question:
          'Um funcionário acessa o prontuário médico de um colega sem autorização. Qual pilar foi violado?',
        options: [
          'Confidencialidade',
          'Integridade',
          'Disponibilidade',
          'Legalidade',
        ],
        correct: 0,
        explanation:
          'A Confidencialidade garante que apenas pessoas autorizadas acessem as informações. Acessar prontuário sem permissão viola esse pilar.',
        category: 'Confidencialidade',
        context: '\u{1F4CB} Cenário hospitalar',
        order: 1,
      },
      {
        module_id: module1.id,
        question:
          'Um hacker altera o valor de um boleto bancário de R$ 500 para R$ 5.000 antes da vítima pagar. Qual pilar foi comprometido?',
        options: [
          'Confidencialidade',
          'Integridade',
          'Disponibilidade',
          'Autenticidade',
        ],
        correct: 1,
        explanation:
          'A Integridade assegura que a informação não seja alterada indevidamente. Adulterar o valor de um boleto compromete a integridade dos dados.',
        category: 'Integridade',
        context: '\u{1F4B0} Golpe financeiro',
        order: 2,
      },
      {
        module_id: module1.id,
        question:
          'O site do SUS fica fora do ar por 3 dias após um ataque cibernético. Qual pilar foi afetado?',
        options: [
          'Confidencialidade',
          'Integridade',
          'Disponibilidade',
          'Não-repúdio',
        ],
        correct: 2,
        explanation:
          'A Disponibilidade garante que a informação esteja acessível quando necessário. O sistema fora do ar impede o acesso de milhões de brasileiros.',
        category: 'Disponibilidade',
        context: '\u{1F3E5} Sistema público de saúde',
        order: 3,
      },
      {
        module_id: module1.id,
        question:
          'Fotos íntimas de uma pessoa são vazadas na internet sem seu consentimento. Qual pilar principal foi violado?',
        options: [
          'Integridade',
          'Disponibilidade',
          'Confidencialidade',
          'Legalidade',
        ],
        correct: 2,
        explanation:
          'A Confidencialidade impede que informações sejam acessadas por pessoas não autorizadas. Vazamento de fotos íntimas é uma violação grave desse pilar.',
        category: 'Confidencialidade',
        context: '\u{1F4F1} Crime digital',
        order: 4,
      },
      {
        module_id: module1.id,
        question:
          'Um aluno invade o sistema da escola e muda sua nota de 3,0 para 9,0. Qual pilar foi comprometido?',
        options: [
          'Disponibilidade',
          'Integridade',
          'Confidencialidade',
          'Autenticidade',
        ],
        correct: 1,
        explanation:
          'A Integridade garante que os dados não sejam modificados sem autorização. Alterar notas compromete a veracidade das informações acadêmicas.',
        category: 'Integridade',
        context: '\u{1F3EB} Sistema acadêmico',
        order: 5,
      },
      {
        module_id: module1.id,
        question:
          'O servidor de e-mails de uma empresa é derrubado por um ataque DDoS. Qual pilar foi afetado?',
        options: [
          'Confidencialidade',
          'Integridade',
          'Disponibilidade',
          'Não-repúdio',
        ],
        correct: 2,
        explanation:
          'Ataques DDoS sobrecarregam servidores, tirando sistemas do ar. Isso afeta diretamente a Disponibilidade das informações e serviços.',
        category: 'Disponibilidade',
        context: '\u{1F310} Ataque cibernético',
        order: 6,
      },
      {
        module_id: module1.id,
        question:
          'Qual conceito garante que o remetente de uma mensagem não possa negar tê-la enviado?',
        options: [
          'Confidencialidade',
          'Autenticidade',
          'Não-repúdio',
          'Disponibilidade',
        ],
        correct: 2,
        explanation:
          'O Não-repúdio (ou irretratabilidade) garante que uma pessoa não possa negar ter realizado uma ação, como enviar um e-mail ou assinar um documento.',
        category: 'Não-repúdio',
        context: null,
        order: 7,
      },
      {
        module_id: module1.id,
        question:
          'A tríade CID representa os três pilares fundamentais da Segurança da Informação. O que significa CID?',
        options: [
          'Criptografia, Internet, Dados',
          'Confidencialidade, Integridade, Disponibilidade',
          'Controle, Identificação, Defesa',
          'Certificação, Investigação, Detecção',
        ],
        correct: 1,
        explanation:
          'CID = Confidencialidade (sigilo), Integridade (não alteração) e Disponibilidade (acesso quando necessário). São a base de toda a segurança da informação.',
        category: 'Fundamentos',
        context: null,
        order: 8,
      },
      {
        module_id: module1.id,
        question:
          'Uma fake news viraliza afirmando que um candidato foi preso, mas a informação é falsa. Qual pilar é mais diretamente afetado?',
        options: [
          'Disponibilidade',
          'Confidencialidade',
          'Integridade',
          'Legalidade',
        ],
        correct: 2,
        explanation:
          'Fake news distorcem a realidade, comprometendo a Integridade da informação — o conteúdo foi adulterado ou inventado.',
        category: 'Integridade',
        context: '\u{1F4F0} Fascículo Boatos — CERT.br',
        order: 9,
      },
      {
        module_id: module1.id,
        question:
          'A LGPD (Lei Geral de Proteção de Dados) está relacionada a qual princípio da segurança da informação?',
        options: [
          'Apenas Disponibilidade',
          'Apenas Integridade',
          'Legalidade',
          'Apenas Confidencialidade',
        ],
        correct: 2,
        explanation:
          'A Legalidade garante que as ações estejam conforme as leis vigentes. A LGPD regula o tratamento de dados pessoais no Brasil.',
        category: 'Legalidade',
        context: null,
        order: 10,
      },
    ],
  });

  console.log(`Module "${module1.title}" created with 10 questions.`);

  // --- Module 2: Ameaças e Vulnerabilidades ---
  const module2 = await prisma.module.create({
    data: {
      title: 'Ameaças e Vulnerabilidades',
      label: 'FASE 02 — AULA 02',
      description:
        'Identifique malwares, golpes de phishing, engenharia social e classifique vulnerabilidades. Sobreviva ao mundo das ameaças digitais!',
      icon: '\u{1F41B}',
      gradient: 'gradient-pink',
      category_color: 'bg-pink/10 text-pink',
      time_per_question: 60,
      order: 2,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        module_id: module2.id,
        question:
          'Você recebe um SMS: "Clique aqui para rastrear sua encomenda dos Correios". Você não comprou nada. O que é isso?',
        options: ['Ransomware', 'Phishing', 'Worm', 'Adware'],
        correct: 1,
        explanation:
          'Phishing usa mensagens falsas para enganar vítimas e roubar dados. Esse tipo de SMS é um dos golpes mais comuns no Brasil.',
        category: 'Phishing',
        context: '\u{1F4F1} Golpe por SMS',
        order: 1,
      },
      {
        module_id: module2.id,
        question:
          'Um malware criptografa todos os arquivos do computador e exige pagamento em Bitcoin para devolvê-los. Que tipo de malware é esse?',
        options: ['Trojan', 'Spyware', 'Ransomware', 'Adware'],
        correct: 2,
        explanation:
          'Ransomware "sequestra" dados criptografando-os e exige resgate (ransom). WannaCry e Colonial Pipeline são casos famosos.',
        category: 'Ransomware',
        context: '\u{1F480} Sequestro digital',
        order: 2,
      },
      {
        module_id: module2.id,
        question: 'Qual é a diferença entre um vírus e um worm?',
        options: [
          'O vírus é mais perigoso que o worm',
          'O vírus precisa de hospedeiro; o worm se propaga sozinho',
          'O worm precisa de hospedeiro; o vírus se propaga sozinho',
          'Não há diferença, são sinônimos',
        ],
        correct: 1,
        explanation:
          'O vírus se anexa a arquivos e precisa de ação humana para se espalhar. O worm se propaga automaticamente pela rede, sem precisar de hospedeiro.',
        category: 'Malware',
        context: null,
        order: 3,
      },
      {
        module_id: module2.id,
        question:
          'Um golpista liga se passando por técnico da operadora e pede para instalar um "app de suporte". Que técnica é essa?',
        options: ['Phishing', 'Engenharia Social', 'DDoS', 'Brute Force'],
        correct: 1,
        explanation:
          'Engenharia Social manipula pessoas psicologicamente para obter informações ou acessos. A vítima é enganada pela confiança, não por código.',
        category: 'Engenharia Social',
        context: '\u{1F4DE} Golpe por telefone',
        order: 4,
      },
      {
        module_id: module2.id,
        question:
          'Milhares de computadores enviam requisições simultâneas a um site, derrubando-o. Qual ataque é esse?',
        options: ['Phishing', 'Man-in-the-Middle', 'DDoS', 'SQL Injection'],
        correct: 2,
        explanation:
          'DDoS (Distributed Denial of Service) sobrecarrega o servidor com tráfego massivo, tornando o serviço indisponível.',
        category: 'DDoS',
        context: '\u{1F310} Ataque em massa',
        order: 5,
      },
      {
        module_id: module2.id,
        question:
          'Um programa se disfarça de jogo grátis, mas ao ser instalado, rouba senhas em segundo plano. Que malware é esse?',
        options: ['Worm', 'Trojan (Cavalo de Troia)', 'Adware', 'Rootkit'],
        correct: 1,
        explanation:
          'Trojan se disfarça de programa legítimo mas carrega código malicioso. O nome vem do Cavalo de Troia da mitologia grega.',
        category: 'Malware',
        context: '\u{1F3AE} Download perigoso',
        order: 6,
      },
      {
        module_id: module2.id,
        question: 'Qual destas é uma vulnerabilidade HUMANA?',
        options: [
          'Software sem atualização',
          'Servidor sem firewall',
          'Funcionário que clica em links suspeitos',
          'Disco rígido defeituoso',
        ],
        correct: 2,
        explanation:
          'Vulnerabilidades humanas envolvem comportamento: clicar em links suspeitos, usar senhas fracas, compartilhar informações. É o elo mais fraco da segurança.',
        category: 'Vulnerabilidades',
        context: null,
        order: 7,
      },
      {
        module_id: module2.id,
        question:
          'Na equação de risco, o que representa: Risco = Ameaça × Vulnerabilidade?',
        options: [
          'O risco só existe se houver ameaça E vulnerabilidade',
          'O risco depende apenas da ameaça',
          'Vulnerabilidade e ameaça são a mesma coisa',
          'O risco é sempre igual em todos os cenários',
        ],
        correct: 0,
        explanation:
          'Se há ameaça (ladrão) mas não vulnerabilidade (porta trancada), o risco é baixo. Se há ambos, o risco é alto. São fatores que se multiplicam.',
        category: 'Conceitos',
        context: '\u{1F3E0} Analogia: casa sem tranca',
        order: 8,
      },
      {
        module_id: module2.id,
        question:
          'Um pop-up aparece: "Seu celular está infectado! Baixe nosso antivírus agora!". O que você deve fazer?',
        options: [
          'Baixar imediatamente para se proteger',
          'Fechar o pop-up — provavelmente é scareware/golpe',
          'Compartilhar com amigos para alertá-los',
          'Informar seus dados para receber suporte',
        ],
        correct: 1,
        explanation:
          'Scareware usa medo para enganar. Pop-ups alarmistas são quase sempre golpe. Nunca baixe nada de fontes desconhecidas.',
        category: 'Golpes',
        context: '\u26A0\uFE0F Fascículo Phishing/Golpes — CERT.br',
        order: 9,
      },
      {
        module_id: module2.id,
        question: 'Qual destas NÃO é uma boa prática contra phishing?',
        options: [
          'Verificar o remetente do e-mail',
          'Desconfiar de urgência exagerada',
          'Clicar no link para verificar se é falso',
          'Acessar o site oficial digitando o endereço',
        ],
        correct: 2,
        explanation:
          'NUNCA clique em links suspeitos para "testar". Isso pode instalar malware ou roubar dados. Sempre acesse sites digitando o endereço oficial.',
        category: 'Phishing',
        context: '\u2709\uFE0F Fascículo Phishing/Golpes — CERT.br',
        order: 10,
      },
    ],
  });

  console.log(`Module "${module2.title}" created with 10 questions.`);

  // --- Module 3: Mecanismos de Proteção ---
  const module3 = await prisma.module.create({
    data: {
      title: 'Mecanismos de Proteção',
      label: 'FASE 03 — AULA 03',
      description:
        'Monte seu arsenal de defesa: criptografia, firewall, backup, MFA e muito mais. Proteja a organização contra todas as ameaças!',
      icon: '\u{1F510}',
      gradient: 'gradient-cyan',
      category_color: 'bg-cyan/10 text-cyan',
      time_per_question: 60,
      order: 3,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        module_id: module3.id,
        question: 'A estratégia de "defesa em profundidade" significa:',
        options: [
          'Usar apenas um mecanismo muito forte',
          'Usar múltiplas camadas de proteção',
          'Proteger apenas o mais importante',
          'Confiar totalmente no antivírus',
        ],
        correct: 1,
        explanation:
          'Defesa em profundidade usa várias camadas (como um castelo: fosso + muralha + guardas). Se uma falha, as outras protegem.',
        category: 'Fundamentos',
        context: '\u{1F3F0} Analogia do castelo medieval',
        order: 1,
      },
      {
        module_id: module3.id,
        question:
          'Na criptografia, qual a diferença entre simétrica e assimétrica?',
        options: [
          'Simétrica usa uma chave; assimétrica usa duas chaves (pública e privada)',
          'Assimétrica é mais rápida que a simétrica',
          'Simétrica usa duas chaves; assimétrica usa uma chave',
          'Não há diferença prática',
        ],
        correct: 0,
        explanation:
          'Simétrica: mesma chave para cifrar e decifrar (mais rápida). Assimétrica: chave pública para cifrar, privada para decifrar (mais segura para troca).',
        category: 'Criptografia',
        context: null,
        order: 2,
      },
      {
        module_id: module3.id,
        question: 'O que é um firewall?',
        options: [
          'Um antivírus mais potente',
          'Um filtro que controla o tráfego de rede, permitindo ou bloqueando conexões',
          'Um sistema de backup automático',
          'Um programa para criar senhas fortes',
        ],
        correct: 1,
        explanation:
          'O firewall é como o porteiro de um prédio: analisa quem pode entrar e sair da rede, bloqueando acessos não autorizados.',
        category: 'Firewall',
        context: '\u{1F6AA} Analogia: porteiro do prédio',
        order: 3,
      },
      {
        module_id: module3.id,
        question: 'A regra 3-2-1 de backup recomenda:',
        options: [
          '3 cópias, 2 mídias diferentes, 1 cópia offsite',
          '3 senhas, 2 backups, 1 antivírus',
          '3 firewalls, 2 antivírus, 1 criptografia',
          '3 dias, 2 semanas, 1 mês entre backups',
        ],
        correct: 0,
        explanation:
          'Regra 3-2-1: 3 cópias dos dados, em 2 tipos de mídia diferentes, com 1 cópia em local externo (nuvem ou offsite).',
        category: 'Backup',
        context: '\u{1F4BE} Fascículo Backup — CERT.br',
        order: 4,
      },
      {
        module_id: module3.id,
        question:
          'MFA (Autenticação Multifator) combina fatores de quais categorias?',
        options: [
          'E-mail + telefone + endereço',
          'Algo que você sabe + algo que você tem + algo que você é',
          'Login + senha + nome de usuário',
          'Firewall + antivírus + backup',
        ],
        correct: 1,
        explanation:
          'MFA combina: algo que sabe (senha), algo que tem (celular/token), algo que é (biometria). Usar 2+ fatores dificulta muito invasões.',
        category: 'Autenticação',
        context: '\u{1F511} Fascículo Autenticação — CERT.br',
        order: 5,
      },
      {
        module_id: module3.id,
        question:
          'Qual tipo de backup copia APENAS os arquivos alterados desde o último backup completo?',
        options: [
          'Backup completo',
          'Backup incremental',
          'Backup diferencial',
          'Backup parcial',
        ],
        correct: 2,
        explanation:
          'Diferencial: copia tudo que mudou desde o último backup completo. Incremental: copia apenas o que mudou desde o último backup (qualquer tipo).',
        category: 'Backup',
        context: '\u{1F4BE} Fascículo Backup — CERT.br',
        order: 6,
      },
      {
        module_id: module3.id,
        question: 'Uma senha forte deve ter no mínimo:',
        options: [
          '6 caracteres com letras',
          '8 caracteres com números',
          '12+ caracteres misturando letras, números e símbolos',
          'Apenas números longos como 123456789',
        ],
        correct: 2,
        explanation:
          'Senhas fortes devem ter 12+ caracteres misturando maiúsculas, minúsculas, números e símbolos. Evite dados pessoais e sequências.',
        category: 'Autenticação',
        context: '\u{1F511} Fascículo Autenticação — CERT.br',
        order: 7,
      },
      {
        module_id: module3.id,
        question:
          'Qual mecanismo protege os dados em trânsito quando você acessa um site seguro (https)?',
        options: ['Firewall', 'Antivírus', 'Criptografia (TLS/SSL)', 'Backup'],
        correct: 2,
        explanation:
          'O HTTPS usa criptografia TLS/SSL para proteger os dados entre seu navegador e o servidor. O cadeado na barra indica que a conexão é criptografada.',
        category: 'Criptografia',
        context: '\u{1F512} Navegação segura',
        order: 8,
      },
      {
        module_id: module3.id,
        question: 'A Cifra de César é um exemplo histórico de:',
        options: [
          'Firewall antigo',
          'Criptografia por substituição',
          'Engenharia social',
          'Autenticação biométrica',
        ],
        correct: 1,
        explanation:
          'A Cifra de César desloca cada letra do alfabeto por N posições. Ex: com deslocamento 3, A vira D, B vira E. Foi usada por Júlio César em Roma.',
        category: 'Criptografia',
        context: '\u{1F4DC} Criptografia na história',
        order: 9,
      },
      {
        module_id: module3.id,
        question:
          'Uma empresa sofre um ataque ransomware. Qual é a MELHOR proteção que ela deveria ter?',
        options: [
          'Um antivírus premium',
          'Backup atualizado e testado (regra 3-2-1)',
          'Apenas um firewall forte',
          'Trocar todas as senhas depois do ataque',
        ],
        correct: 1,
        explanation:
          'Com backup 3-2-1 atualizado e testado, a empresa pode restaurar os dados sem pagar resgate. É a defesa mais eficaz contra ransomware.',
        category: 'Backup',
        context: '\u{1F6E1}\uFE0F Defesa contra ransomware',
        order: 10,
      },
    ],
  });

  console.log(`Module "${module3.title}" created with 10 questions.`);

  // --- Module 4: Gestão de Riscos e COBIT ---
  const module4 = await prisma.module.create({
    data: {
      title: 'Gestão de Riscos e COBIT',
      label: 'FASE 04 — AULA 04',
      description:
        'Domine gestão de riscos, matriz de risco e princípios do COBIT. Aprenda a proteger organizações com estratégia e governança!',
      icon: '\u{1F4CA}',
      gradient: 'gradient-green',
      category_color: 'bg-green/20 text-green',
      time_per_question: 60,
      order: 4,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        module_id: module4.id,
        question:
          'Ameaça = carro, vulnerabilidade = distração ao atravessar a rua. O RISCO é:',
        options: [
          'O carro existir',
          'Estar distraído',
          'Ser atropelado',
          'A rua existir',
        ],
        correct: 2,
        explanation:
          'Risco é o resultado: ameaça × vulnerabilidade = ser atropelado.',
        category: 'Conceito de Risco',
        context: '\u{1F6B6} Analogia',
        order: 1,
      },
      {
        module_id: module4.id,
        question: 'Quais são as 4 formas de tratamento de risco?',
        options: [
          'Mitigar, aceitar, transferir, evitar',
          'Bloquear, permitir, ignorar, deletar',
          'Criptografar, proteger, backup, firewall',
          'Identificar, analisar, avaliar, tratar',
        ],
        correct: 0,
        explanation:
          'Mitigar (reduzir), Aceitar (conviver), Transferir (seguro), Evitar (eliminar a causa).',
        category: 'Tratamento de Riscos',
        context: null,
        order: 2,
      },
      {
        module_id: module4.id,
        question:
          'Empresa contrata seguro contra ciberataques. Que tratamento é?',
        options: ['Mitigar', 'Aceitar', 'Transferir', 'Evitar'],
        correct: 2,
        explanation:
          'Transferir = passar o impacto financeiro para terceiros (seguradora).',
        category: 'Tratamento de Riscos',
        context: '\u{1F3E2} Cenário empresarial',
        order: 3,
      },
      {
        module_id: module4.id,
        question: 'Na Matriz de Risco, os eixos são:',
        options: [
          'Custo × Benefício',
          'Probabilidade × Impacto',
          'Ameaça × Defesa',
          'Tempo × Recurso',
        ],
        correct: 1,
        explanation:
          'Probabilidade (chance) × Impacto (dano) = nível do risco.',
        category: 'Matriz de Risco',
        context: null,
        order: 4,
      },
      {
        module_id: module4.id,
        question:
          'Risco com alta probabilidade e alto impacto é classificado como:',
        options: ['Baixo', 'Médio', 'Alto', 'Crítico'],
        correct: 3,
        explanation:
          'Alta probabilidade + alto impacto = CRÍTICO. Ação imediata.',
        category: 'Matriz de Risco',
        context: '\u{1F534} Nível máximo',
        order: 5,
      },
      {
        module_id: module4.id,
        question:
          'Empresa decide NÃO usar nuvem por risco de vazamento. Que tratamento é?',
        options: ['Mitigar', 'Aceitar', 'Transferir', 'Evitar'],
        correct: 3,
        explanation: 'Evitar = eliminar a atividade que gera o risco.',
        category: 'Tratamento de Riscos',
        context: '\u2601\uFE0F Decisão estratégica',
        order: 6,
      },
      {
        module_id: module4.id,
        question: 'O que é COBIT?',
        options: [
          'Um malware',
          'Um framework de governança de TI',
          'Uma linguagem de programação',
          'Um sistema operacional',
        ],
        correct: 1,
        explanation:
          'COBIT ajuda organizações a governar e gerenciar sua TI de forma estruturada.',
        category: 'COBIT',
        context: null,
        order: 7,
      },
      {
        module_id: module4.id,
        question: 'Principal objetivo do COBIT:',
        options: [
          'Criar websites seguros',
          'Alinhar TI aos objetivos do negócio',
          'Substituir firewalls',
          'Treinar programadores',
        ],
        correct: 1,
        explanation: 'COBIT conecta necessidades do negócio à gestão de TI.',
        category: 'COBIT',
        context: '\u{1F3DB}\uFE0F Governança',
        order: 8,
      },
      {
        module_id: module4.id,
        question: 'Etapas da gestão de riscos na ordem:',
        options: [
          'Planejar, executar, verificar, agir',
          'Identificar, analisar, avaliar, tratar',
          'Criar, ler, atualizar, deletar',
          'Prevenir, detectar, corrigir, melhorar',
        ],
        correct: 1,
        explanation: 'Identificar → Analisar → Avaliar → Tratar.',
        category: 'Gestão de Riscos',
        context: null,
        order: 9,
      },
      {
        module_id: module4.id,
        question: 'Por que empresas adotam o COBIT?',
        options: [
          'Ter mais computadores',
          'Gerar valor com TI, gerenciar riscos e cumprir regulamentações',
          'Substituir funcionários por IA',
          'Reduzir salários',
        ],
        correct: 1,
        explanation:
          'COBIT: gerar valor, gerenciar riscos, conformidade regulatória.',
        category: 'COBIT',
        context: '\u{1F4CB} Benefícios',
        order: 10,
      },
    ],
  });

  console.log(`Module "${module4.title}" created with 10 questions.`);

  // ═══════════════════════════════════════════════════════════════════════════
  // Module 5: Organização de Dados + Políticas de Segurança (AULA 06)
  // ═══════════════════════════════════════════════════════════════════════════
  const module5 = await prisma.module.create({
    data: {
      title: 'Dados e Políticas de Segurança',
      label: 'FASE 05 — AULA 06',
      description:
        'Classifique informações, domine o ciclo de vida dos dados e construa políticas de segurança. Organize a defesa da organização!',
      icon: '\u{1F4C2}',
      gradient: 'gradient-purple',
      category_color: 'bg-purple/10 text-purple',
      time_per_question: 60,
      order: 5,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        module_id: module5.id,
        question:
          'O CPF de um cidadão brasileiro deve ser classificado como qual nível de informação?',
        options: ['Pública', 'Interna', 'Confidencial', 'Secreta'],
        correct: 2,
        explanation:
          'O CPF é um dado pessoal que identifica um indivíduo. Deve ser tratado como Confidencial, pois seu acesso indevido pode causar fraudes e danos ao titular.',
        category: 'Classificação da Informação',
        context: '\u{1F4CB} Dado pessoal brasileiro',
        order: 1,
      },
      {
        module_id: module5.id,
        question:
          'Um edital de concurso público publicado no Diário Oficial se classifica como informação:',
        options: ['Secreta', 'Confidencial', 'Interna', 'Pública'],
        correct: 3,
        explanation:
          'Editais de concurso são documentos oficiais de acesso livre. Informação Pública pode ser acessada por qualquer pessoa sem restrição.',
        category: 'Classificação da Informação',
        context: '\u{1F4F0} Documento governamental',
        order: 2,
      },
      {
        module_id: module5.id,
        question:
          'Qual é a ordem correta das etapas do ciclo de vida da informação?',
        options: [
          'Uso → Criação → Descarte → Armazenamento',
          'Criação → Armazenamento → Uso → Compartilhamento → Arquivamento → Descarte',
          'Descarte → Criação → Uso → Armazenamento',
          'Armazenamento → Criação → Compartilhamento → Uso',
        ],
        correct: 1,
        explanation:
          'O ciclo de vida segue a sequência lógica: a informação é criada, armazenada, utilizada, compartilhada, arquivada e, por fim, descartada de forma segura.',
        category: 'Ciclo de Vida',
        context: '\u{1F504} Gestão da informação',
        order: 3,
      },
      {
        module_id: module5.id,
        question:
          'Uma empresa joga HDs antigos com dados de clientes no lixo comum. Qual o problema?',
        options: [
          'Nenhum, os dados já são antigos',
          'Falta de descarte seguro — dados podem ser recuperados e vazados',
          'O único problema é ambiental',
          'HDs antigos não armazenam dados legíveis',
        ],
        correct: 1,
        explanation:
          'Dados em HDs descartados podem ser recuperados com ferramentas especiais. O descarte seguro exige destruição física ou formatação completa com sobrescrita.',
        category: 'Descarte Seguro',
        context: '\u{1F5D1}\uFE0F Descarte de mídia',
        order: 4,
      },
      {
        module_id: module5.id,
        question:
          'Os três componentes principais de uma política de segurança são:',
        options: [
          'Firewall, antivírus e backup',
          'Normas, diretrizes e procedimentos',
          'Senha, criptografia e VPN',
          'Hardware, software e pessoas',
        ],
        correct: 1,
        explanation:
          'Uma política de segurança é composta por: Normas (regras obrigatórias), Diretrizes (orientações gerais) e Procedimentos (passo a passo operacional).',
        category: 'Política de Segurança',
        context: '\u{1F4DC} Estrutura documental',
        order: 5,
      },
      {
        module_id: module5.id,
        question: 'A política de uso aceitável define:',
        options: [
          'Quais softwares a empresa deve comprar',
          'O que funcionários podem e não podem fazer com os recursos de TI da organização',
          'Apenas as senhas permitidas',
          'O horário de funcionamento do setor de TI',
        ],
        correct: 1,
        explanation:
          'A política de uso aceitável (AUP) estabelece regras claras sobre o uso de computadores, internet, e-mail e outros recursos de TI no ambiente corporativo.',
        category: 'Política de Segurança',
        context: '\u{1F4DD} Controle ISO 5.10 — Uso aceitável de ativos',
        order: 6,
      },
      {
        module_id: module5.id,
        question:
          'O código-fonte de um sistema proprietário da empresa deve ser classificado como:',
        options: ['Público', 'Interno', 'Confidencial', 'Secreto'],
        correct: 3,
        explanation:
          'Código-fonte proprietário é o ativo intelectual mais valioso de uma empresa de software. Seu vazamento pode causar danos irreparáveis — classificação Secreta.',
        category: 'Classificação da Informação',
        context: '\u{1F4BB} Propriedade intelectual',
        order: 7,
      },
      {
        module_id: module5.id,
        question: 'Uma política de senhas eficaz deve exigir, no mínimo:',
        options: [
          'Apenas letras minúsculas',
          'Comprimento mínimo, complexidade (maiúsculas, números, símbolos) e troca periódica',
          'Apenas que a senha não seja "123456"',
          'Que todos usem a mesma senha para facilitar o suporte',
        ],
        correct: 1,
        explanation:
          'Políticas de senhas robustas definem comprimento mínimo, requisitos de complexidade, proibição de reuso e periodicidade de troca. Referência: Fascículo Autenticação — CERT.br.',
        category: 'Política de Senhas',
        context: '\u{1F511} Fascículo Autenticação — CERT.br',
        order: 8,
      },
      {
        module_id: module5.id,
        question:
          'O cardápio do restaurante da empresa é informação classificada como:',
        options: ['Secreta', 'Confidencial', 'Interna', 'Pública'],
        correct: 2,
        explanation:
          'O cardápio é de interesse apenas dos funcionários — informação Interna. Não causa danos se vazar, mas não precisa ser divulgada externamente.',
        category: 'Classificação da Informação',
        context: '\u{1F372} Cenário corporativo',
        order: 9,
      },
      {
        module_id: module5.id,
        question:
          'Segundo a ISO 27001, a classificação das informações deve considerar:',
        options: [
          'Apenas o custo de armazenamento',
          'Confidencialidade, integridade, disponibilidade e requisitos das partes interessadas',
          'Apenas a data de criação do documento',
          'Apenas o departamento que criou a informação',
        ],
        correct: 1,
        explanation:
          'O controle 5.12 da ISO 27001 determina que a classificação deve considerar os requisitos de CID e as necessidades das partes interessadas relevantes.',
        category: 'Normas',
        context: '\u{1F4C4} ISO/IEC 27001 — Controle 5.12',
        order: 10,
      },
    ],
  });

  console.log(`Module "${module5.title}" created with 10 questions.`);

  // ═══════════════════════════════════════════════════════════════════════════
  // Module 6: Segurança Física/Tecnológica + LGPD (AULA 07)
  // ═══════════════════════════════════════════════════════════════════════════
  const module6 = await prisma.module.create({
    data: {
      title: 'Segurança Física, Tecnológica e LGPD',
      label: 'FASE 06 — AULA 07',
      description:
        'Proteja data centers, domine firewalls e IDS/IPS, e conheça a LGPD. Da segurança física à conformidade legal!',
      icon: '\u{2696}\uFE0F',
      gradient: 'gradient-cyan',
      category_color: 'bg-cyan/10 text-black',
      time_per_question: 60,
      order: 6,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        module_id: module6.id,
        question:
          'Biometria, crachás magnéticos e catracas eletrônicas são exemplos de:',
        options: [
          'Segurança de rede',
          'Controle de acesso físico',
          'Criptografia avançada',
          'Política de senhas',
        ],
        correct: 1,
        explanation:
          'Controle de acesso físico usa mecanismos como biometria, crachás, catracas e portarias para restringir a entrada de pessoas a áreas protegidas.',
        category: 'Segurança Física',
        context: '\u{1F3E2} Controle de acesso',
        order: 1,
      },
      {
        module_id: module6.id,
        question: 'Um data center profissional precisa de climatização porque:',
        options: [
          'Deixa o ambiente mais confortável para os técnicos',
          'Servidores geram muito calor e podem danificar sem controle de temperatura',
          'É exigência estética das normas ISO',
          'Facilita a instalação de câmeras CFTV',
        ],
        correct: 1,
        explanation:
          'Servidores geram calor intenso. Sem climatização adequada (18-27°C), equipamentos superaquecem, causando falhas, perda de dados e indisponibilidade.',
        category: 'Segurança Física',
        context: '\u{1F321}\uFE0F Data center',
        order: 2,
      },
      {
        module_id: module6.id,
        question: 'Qual a diferença entre IDS e IPS?',
        options: [
          'IDS bloqueia; IPS só detecta',
          'IDS detecta intrusões e alerta; IPS detecta E bloqueia automaticamente',
          'São a mesma coisa com nomes diferentes',
          'IDS é hardware; IPS é software',
        ],
        correct: 1,
        explanation:
          'IDS (Intrusion Detection System) apenas detecta e notifica. IPS (Intrusion Prevention System) detecta e age automaticamente para bloquear a ameaça.',
        category: 'Segurança Tecnológica',
        context: '\u{1F6A8} Detecção e prevenção',
        order: 3,
      },
      {
        module_id: module6.id,
        question: 'Uma VPN (Virtual Private Network) serve para:',
        options: [
          'Aumentar a velocidade da internet',
          'Criar um túnel criptografado para comunicação segura em redes públicas',
          'Substituir o firewall',
          'Bloquear vírus automaticamente',
        ],
        correct: 1,
        explanation:
          'VPN cria um "túnel" criptografado entre o dispositivo e a rede, protegendo dados mesmo em Wi-Fi público. Essencial para trabalho remoto.',
        category: 'Segurança Tecnológica',
        context: '\u{1F310} Rede privada virtual',
        order: 4,
      },
      {
        module_id: module6.id,
        question: 'Segundo a LGPD, "dado pessoal" é:',
        options: [
          'Qualquer informação armazenada em computador',
          'Informação relacionada a pessoa natural identificada ou identificável',
          'Apenas CPF e RG',
          'Somente dados bancários',
        ],
        correct: 1,
        explanation:
          'A LGPD define dado pessoal de forma ampla: qualquer informação que identifique ou possa identificar uma pessoa natural — nome, e-mail, IP, localização, etc.',
        category: 'LGPD',
        context: '\u{1F4DC} Lei n\u00BA 13.709/2018',
        order: 5,
      },
      {
        module_id: module6.id,
        question: 'Na LGPD, qual a diferença entre "Controlador" e "Operador"?',
        options: [
          'Controlador é o dono dos dados; Operador é o titular',
          'Controlador decide como tratar os dados; Operador executa o tratamento em nome do Controlador',
          'São sinônimos na lei',
          'Controlador é pessoa física; Operador é pessoa jurídica',
        ],
        correct: 1,
        explanation:
          'O Controlador toma as decisões sobre o tratamento de dados pessoais. O Operador realiza o tratamento seguindo as instruções do Controlador.',
        category: 'LGPD',
        context: '\u{1F465} Agentes de tratamento',
        order: 6,
      },
      {
        module_id: module6.id,
        question: 'Dado sensível na LGPD inclui informações sobre:',
        options: [
          'Nome e endereço',
          'Origem racial, convicção religiosa, opinião política, dado de saúde ou biometria',
          'Apenas dados bancários',
          'Qualquer dado em formato digital',
        ],
        correct: 1,
        explanation:
          'Dados sensíveis têm proteção reforçada na LGPD: origem racial/étnica, convicção religiosa, opinião política, saúde, vida sexual, genético e biométrico.',
        category: 'LGPD',
        context: '\u26A0\uFE0F Proteção reforçada',
        order: 7,
      },
      {
        module_id: module6.id,
        question: 'Qual sanção a ANPD pode aplicar por violação à LGPD?',
        options: [
          'Apenas advertência verbal',
          'Multa de até R$ 50 milhões por infração, bloqueio de dados e publicização da infração',
          'Apenas suspensão do CNPJ',
          'Não há sanções previstas',
        ],
        correct: 1,
        explanation:
          'A ANPD pode aplicar: advertência, multa de até 2% do faturamento (limitada a R$ 50 milhões por infração), bloqueio e eliminação dos dados, e publicização.',
        category: 'LGPD',
        context: '\u{1F4B0} Penalidades — ANPD',
        order: 8,
      },
      {
        module_id: module6.id,
        question:
          'O titular dos dados tem direito a solicitar, segundo a LGPD:',
        options: [
          'Apenas ver seus dados',
          'Acesso, correção, exclusão, portabilidade e revogação do consentimento',
          'Apenas a exclusão dos dados',
          'Nenhum direito se já consentiu',
        ],
        correct: 1,
        explanation:
          'A LGPD garante ao titular amplos direitos: confirmação de tratamento, acesso, correção, anonimização, portabilidade, exclusão e revogação do consentimento.',
        category: 'LGPD',
        context: '\u{1F464} Direitos do titular',
        order: 9,
      },
      {
        module_id: module6.id,
        question:
          'CFTV (Circuito Fechado de TV) é um mecanismo de segurança que atua na:',
        options: [
          'Criptografia de dados em trânsito',
          'Monitoramento e vigilância de ambientes físicos',
          'Filtragem de tráfego de rede',
          'Autenticação de usuários em sistemas',
        ],
        correct: 1,
        explanation:
          'CFTV monitora e grava imagens de ambientes físicos, funcionando como controle preventivo (inibe ações) e detectivo (registra evidências de incidentes).',
        category: 'Segurança Física',
        context: '\u{1F4F9} Vigilância',
        order: 10,
      },
    ],
  });

  console.log(`Module "${module6.title}" created with 10 questions.`);

  console.log('Seeding completed successfully! 6 modules, 60 questions total.');
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
