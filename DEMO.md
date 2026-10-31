# Roteiro de apresentação — VITA+

## Antes de começar

Use Node.js 20.19 ou superior, npm e um celular. No Windows, abra PowerShell na pasta do projeto e execute:

```powershell
npm install
npx expo start
```

Com Expo Go compatível com SDK 54 instalado, conecte celular e computador à mesma rede e abra o QR code (câmera no iPhone; leitor do Expo Go no Android). Se necessário, tente `npx expo start --tunnel`, que requer internet e pode pedir `@expo/ngrok`. No iPhone, se solicitado, entre na mesma conta gratuita Expo no celular e no computador (`npx expo login`). Não é necessário Android Studio nem Xcode. O Expo Go precisa do Metro para carregar o projeto; um APK independente de preview, depois de gerado e instalado, não precisa do servidor Metro para a demonstração. Veja no [README](README.md) os requisitos de EAS, assinatura e iOS.

O SDK 54 é compatível com o Expo Go da App Store para iPhone físico conforme a [Expo](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/). O Expo Go para Android precisa corresponder ao SDK; consulte [expo.dev/go](https://expo.dev/go). Para um aplicativo próprio no iPhone, use distribuição assinada ad hoc ou TestFlight com os requisitos descritos no README; um IPA não instala livremente em qualquer aparelho.

## Apresentação em 3–5 minutos

1. Abra **Idoso — Dona Maria**. Explique que o resumo e os registros são fictícios. Em **Medicamentos**, marque um horário como **Tomei** e outro como **Não tomei**. Mostre os estados e o histórico; voltar a escolher a outra opção corrige a marcação.
2. Em **Início**, toque **Preciso de ajuda** e confirme. Explique que o pedido é apenas um registro local, sem ligação, notificação ou acionamento de socorro.
3. Em **Perfil → Trocar perfil**, selecione **Ana**. Mostre o resumo de medicamentos e o alerta pendente. Abra **Alertas**, selecione o pedido, toque **Iniciar atendimento**, escreva uma providência fictícia, registre-a e toque **Marcar como resolvido**.
4. Troque para **Enfermeira Camila**. Em **Pacientes**, abra Dona Maria para mostrar os mesmos dados. Em **Alertas**, abra o pedido, escreva uma observação e registre uma providência ou contato simulado; escreva outra observação e toque **Marcar como avaliado**. A avaliação não reabre nem resolve o atendimento familiar. Opcionalmente, em **Agenda**, abra uma visita e marque-a manualmente como realizada com observação fictícia.
5. Volte ao perfil **Idoso → Alertas**, abra o pedido e mostre o status resolvido e a linha do tempo com Ana e Camila. Em **Perfil → Restaurar demonstração**, confirme para apagar as alterações locais e recriar os exemplos iniciais.

Opcional: em **Início → Residência**, simule movimento, porta aberta ou ausência prolongada e veja os eventos em **Alertas**. A ausência simulada cria um alerta de verificação; ela e a abertura de porta não comprovam uma emergência. Os sensores da residência não medem sinais vitais.

## Limites da demonstração

O aplicativo registra medicamentos, medições informadas, sintomas, eventos e providências em AsyncStorage, compartilhados pelos perfis **somente na mesma instalação**. Os dados não são enviados a outro aparelho. Não há autenticação ou autorização reais, prontuário, integração clínica, sensores físicos, diagnóstico, notificações, chamadas, nem contato com serviços de emergência. O acesso supostamente autorizado é fictício. Antes de apresentar, faça o percurso no aparelho escolhido e confirme leitura, contraste, teclado e navegação.
