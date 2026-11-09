# 🌐 Calculadora de Sub-redes IPv4

Ferramenta web que calcula informações de uma rede IPv4 a partir de um endereço IP e um prefixo CIDR. Projeto de estudo ligado aos conteúdos de **redes de computadores** (Cisco Networking Academy).

## Funcionalidades
- Máscara de sub-rede (decimal e binária) e wildcard
- Endereço de rede, broadcast, primeiro e último host
- Quantidade de endereços e de hosts utilizáveis
- Classificação do endereço (privado, público, loopback, multicast, APIPA)
- Divisão de uma rede em sub-redes menores (ex.: um `/24` em quatro `/26`)
- Tratamento dos casos especiais `/31` e `/32`
- Validação de entradas com mensagens de erro

## O que pratiquei
- Operações bit a bit em JavaScript (`&`, `|`, `~`, `<<`, `>>>`)
- Conversão entre decimal, binário e formato de IP
- Separação entre lógica (`calculadora.js`) e interface (`app.js`)
- **Testes automatizados** com o módulo `assert` do Node.js
- Tratamento de erros com `try/catch`

## Como usar
Abra o `index.html` no navegador ou acesse a versão online:
`https://SEU-USUARIO.github.io/calculadora-sub-redes/`

## Como rodar os testes
Com o [Node.js](https://nodejs.org/) instalado:
```bash
node test.js
```

## Exemplo
Entrada: `192.168.1.10/24`

| Campo | Valor |
|---|---|
| Máscara | 255.255.255.0 |
| Rede | 192.168.1.0 |
| Broadcast | 192.168.1.255 |
| Hosts utilizáveis | 254 |

## Estrutura
```
├── index.html
├── style.css
├── app.js          # interface
├── calculadora.js  # lógica de redes
└── test.js         # testes
```

## Próximas melhorias
- [ ] Suporte a VLSM (sub-redes de tamanhos diferentes)
- [ ] Suporte a IPv6
- [ ] Copiar resultado para a área de transferência
