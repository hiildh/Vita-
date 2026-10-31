# VITA+

Protótipo acadêmico de acompanhamento de idosos: **cuidado, segurança e conexão**. Todos os dados são fictícios. Um aplicativo independente gerado pelo EAS inclui o código necessário para funcionar offline; para desenvolver com Expo Go, o servidor Metro e a conexão com ele são necessários para carregar o projeto.

## Executar

Use Node.js 20.19 ou superior e npm. Na pasta do projeto:

```sh
npm install
npx expo start
```

Instale o Expo Go compatível no celular e escaneie o QR code: no iPhone, pela câmera; no Android, pelo Expo Go. Mantenha celular e computador na mesma rede. Se a rede local bloquear a conexão, tente `npx expo start --tunnel`; o Expo poderá solicitar a instalação de `@expo/ngrok` e acesso à internet. No iPhone, se o Expo Go solicitar, entre na mesma conta gratuita Expo no celular e no computador com `npx expo login`. Não é necessário instalar Android Studio ou Xcode. O download das dependências e o carregamento inicial pelo Metro precisam de conexão; não há serviços remotos de dados.

O projeto usa **Expo SDK 54**, React Native 0.81 e React 19.1. Conforme a [documentação da Expo](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/), o Expo Go da App Store para iPhone físico suporta SDK 54; versões mais novas do SDK não são suportadas por esse app da loja. No Android, instale a versão de Expo Go correspondente ao SDK 54 em [expo.dev/go](https://expo.dev/go) caso a versão da loja seja diferente. As políticas e versões podem mudar; confira a documentação antes de atualizar. O estilo usa NativeWind 4 estável e Tailwind CSS 3, seguindo a [instalação da v4](https://www.nativewind.dev/docs/getting-started/installation).

## Demonstração

Na abertura, selecione Dona Maria, Ana ou Camila. Em **Perfil → Trocar perfil**, volte à seleção sem alterar os dados. Em **Perfil → Restaurar demonstração**, confirme a recriação dos dados iniciais. As datas dos compromissos são calculadas na criação ou restauração dos dados; dados já salvos são preservados, mesmo quando as datas passam.

No perfil idoso, registre cada horário em **Medicamentos** com “Tomei” ou “Não tomei”; escolha a outra opção para corrigir. O histórico mantém o estado e a hora da última marcação de cada ocorrência. Em **Saúde**, registre medições e relatos simulados com o responsável; a data e a hora são preenchidas ao salvar. O resumo de Início considera as ocorrências pendentes ou não tomadas de hoje e alertas pendentes.

Em **Início → Preciso de ajuda**, confirme para registrar um alerta local, visível também na lista de alertas do perfil familiar neste aparelho. Em **Residência**, use os controles para simular movimento, porta aberta ou ausência prolongada; esta última cria um alerta de verificação. A aba **Alertas** do idoso apresenta os eventos e detalhes com linha do tempo. Nenhum pedido é enviado e nenhuma pessoa é notificada ou acionada.

Na área de Ana, a visão geral resume os registros da mesma instalação. Em **Alertas**, abra um registro para iniciar o atendimento, acrescentar uma providência fictícia e resolvê-lo. As alterações aparecem no histórico do mesmo alerta no perfil idoso. Medicamentos, saúde, agenda e sensores são consultas; a indicação de acesso autorizado é fictícia e não implementa privacidade ou autenticação reais.

Na área da enfermeira Camila, consulte as três pessoas fictícias e abra uma visita na agenda para marcá-la manualmente como realizada, com observação. Em **Alertas**, registre contato ou providência simulados e marque a revisão como avaliada; o status do atendimento familiar permanece independente. Os registros constam na mesma linha do tempo dos demais perfis. Os outros dois pacientes têm dados simplificados. Tudo é demonstração local, sem prontuário, contato ou transmissão reais.

Dados salvos na versão anterior são preservados na atualização. Medições antigas sem data ou responsável são exibidas como não informadas. Para carregar também os novos exemplos iniciais de histórico e múltiplos horários, use a restauração explícita da demonstração.

O estado é compartilhado somente entre perfis da mesma instalação e persistido em AsyncStorage. Instalações em aparelhos diferentes não se comunicam. Os medicamentos, medições, agenda, alertas e sensores são simulações; não há conexão clínica, sensores físicos, autenticação, notificações ou sincronização. O conteúdo não orienta decisões de saúde. As telas são bases para etapas futuras.

Se os dados salvos não puderem ser lidos, o app informa que está usando dados temporários e não sobrescreve o armazenamento. Reabra o app para tentar novamente ou use **Restaurar demonstração**, que substitui os dados locais após confirmação.

## APK de demonstração com EAS Build

O [eas.json](eas.json) configura `preview` com distribuição interna e `android.buildType: apk`. O APK resultante é um aplicativo independente e não precisa do Metro para executar a demonstração. Ele ainda precisa ser gerado e verificado em dispositivo. EAS requer conta Expo, internet e pode ter limites ou custos conforme o plano. Em PowerShell, na raiz do projeto, quando você decidir criar o build:

```powershell
$env:EAS_NO_VCS = '1'
npx eas-cli@latest login
npx eas-cli@latest init
npx eas-cli@latest build --platform android --profile preview
```

O modo `EAS_NO_VCS` permite usar a pasta atual sem inicializar Git nem fazer commit. O `init` vincula o projeto à conta Expo e pode alterar `app.json`; o build envia o código ao EAS e pode oferecer a criação de um keystore Android. Confira as opções interativas e guarde a chave para atualizações futuras. Se o EAS CLI estiver instalado globalmente, o último comando equivale a `eas build --platform android --profile preview`. Após o build, abra no Android o link do artefato EAS, baixe o APK e instale-o, permitindo instalação dessa origem quando solicitado pelo sistema. O Expo Go não é necessário para abrir o APK. Acesso ao link de distribuição interna depende das configurações do projeto EAS; compartilhe-o apenas com pessoas autorizadas.

Os identificadores `org.vitaplusdemo.academico20261031` em `android.package` e `ios.bundleIdentifier` são **provisórios**: não foram registrados nem tiveram sua disponibilidade verificada. Substitua-os por identificadores únicos sob seu controle em `app.json` antes da distribuição definitiva e antes de configurar credenciais. A troca posterior pode criar outro aplicativo, sem acesso automático aos dados da instalação anterior. Os ícones para iOS e Android, incluindo as camadas adaptativas do Android, estão em `assets/`; a imagem da splash usa a marca sobre fundo creme. Alterações de ícone ou splash exigem um novo build do aplicativo independente para aparecerem na instalação.

## iPhone e distribuição própria

Expo Go não é um aplicativo independente. Segundo a [Expo](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/), o Expo Go da App Store suporta o SDK 54 escolhido neste projeto. A instalação de um app próprio exige assinatura e distribuição da Apple. Distribuição ad hoc via EAS normalmente exige inscrição paga no Apple Developer Program e os dispositivos previamente registrados. Com as contas e credenciais apropriadas, os comandos futuros são:

```powershell
$env:EAS_NO_VCS = '1'
npx eas-cli@latest device:create
npx eas-cli@latest build --platform ios --profile preview
```

O fluxo de `device:create` registra os dispositivos permitidos; siga os prompts de assinatura e provisionamento. Somente dispositivos incluídos no perfil podem instalar o IPA ad hoc, e no iOS 16+ pode ser necessário ativar o [Modo Desenvolvedor](https://docs.expo.dev/guides/ios-developer-mode/). Para TestFlight, é necessário um build de loja e envio ao App Store Connect, além de conta Apple Developer paga e configuração de testadores:

```powershell
npx eas-cli@latest build --platform ios --profile production
npx eas-cli@latest submit --platform ios
```

O TestFlight envolve processamento da Apple; testadores externos podem exigir revisão beta. Os comandos são instruções para execução futura: nenhum login, registro, build ou envio foi feito nesta etapa. Consulte o [roteiro de apresentação](DEMO.md).

## Estrutura

- `src/app`: rotas, seletores e layouts de cada perfil.
- `src/components`: telas e componentes visuais reutilizáveis.
- `src/context`: estado global, hidratação e restauração.
- `src/mocks`: dados fictícios e datas relativas.
- `src/services`: persistência local.
- `src/constants` e `src/utils`: paleta e formatação.
