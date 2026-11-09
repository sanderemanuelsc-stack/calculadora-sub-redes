// Funções puras para cálculos de redes IPv4.
// Separadas da interface para facilitar os testes (veja test.js).

function validarIp(ip) {
  const partes = String(ip).trim().split(".");
  if (partes.length !== 4) return false;
  return partes.every((p) => /^\d{1,3}$/.test(p) && Number(p) >= 0 && Number(p) <= 255);
}

function validarCidr(cidr) {
  return Number.isInteger(cidr) && cidr >= 0 && cidr <= 32;
}

// "192.168.1.10" -> número de 32 bits sem sinal
function ipParaNumero(ip) {
  return ip.split(".").reduce((acc, parte) => ((acc << 8) | Number(parte)) >>> 0, 0);
}

// número de 32 bits -> "192.168.1.10"
function numeroParaIp(numero) {
  return [24, 16, 8, 0].map((deslocamento) => (numero >>> deslocamento) & 255).join(".");
}

function cidrParaMascara(cidr) {
  return cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
}

function paraBinario(numero) {
  return numeroParaIp(numero)
    .split(".")
    .map((o) => Number(o).toString(2).padStart(8, "0"))
    .join(".");
}

function classificarIp(ip) {
  const [a, b] = ip.split(".").map(Number);
  if (a === 10) return "Privado (RFC 1918)";
  if (a === 172 && b >= 16 && b <= 31) return "Privado (RFC 1918)";
  if (a === 192 && b === 168) return "Privado (RFC 1918)";
  if (a === 127) return "Loopback";
  if (a === 169 && b === 254) return "Link-local (APIPA)";
  if (a >= 224 && a <= 239) return "Multicast";
  return "Público";
}

function calcularRede(ip, cidr) {
  if (!validarIp(ip)) throw new Error("Endereço IP inválido.");
  if (!validarCidr(cidr)) throw new Error("O prefixo CIDR deve ser um número de 0 a 32.");

  const numIp = ipParaNumero(ip);
  const mascara = cidrParaMascara(cidr);
  const rede = (numIp & mascara) >>> 0;
  const broadcast = (rede | (~mascara >>> 0)) >>> 0;
  const total = 2 ** (32 - cidr);

  let hostsUteis, primeiro, ultimo;
  if (cidr === 32) {
    hostsUteis = 1; primeiro = rede; ultimo = rede;
  } else if (cidr === 31) {
    hostsUteis = 2; primeiro = rede; ultimo = broadcast; // link ponto a ponto (RFC 3021)
  } else {
    hostsUteis = total - 2; primeiro = rede + 1; ultimo = broadcast - 1;
  }

  return {
    ip,
    cidr,
    classificacao: classificarIp(ip),
    mascara: numeroParaIp(mascara),
    mascaraBinaria: paraBinario(mascara),
    wildcard: numeroParaIp(~mascara >>> 0),
    rede: numeroParaIp(rede),
    broadcast: numeroParaIp(broadcast),
    primeiroHost: numeroParaIp(primeiro),
    ultimoHost: numeroParaIp(ultimo),
    totalEnderecos: total,
    hostsUteis,
  };
}

// Divide uma rede em sub-redes menores (ex.: /24 em /26 -> 4 sub-redes)
function dividirRede(ip, cidr, novoCidr) {
  if (!validarIp(ip)) throw new Error("Endereço IP inválido.");
  if (!validarCidr(cidr) || !validarCidr(novoCidr)) throw new Error("Prefixo CIDR inválido.");
  if (novoCidr <= cidr) throw new Error("O novo prefixo deve ser maior que o atual.");
  if (novoCidr - cidr > 10) throw new Error("Limite de 1024 sub-redes por divisão.");

  const mascara = cidrParaMascara(cidr);
  const redeBase = (ipParaNumero(ip) & mascara) >>> 0;
  const quantidade = 2 ** (novoCidr - cidr);
  const tamanho = 2 ** (32 - novoCidr);

  const subredes = [];
  for (let i = 0; i < quantidade; i++) {
    subredes.push(calcularRede(numeroParaIp(redeBase + i * tamanho), novoCidr));
  }
  return subredes;
}

// Permite usar as funções no Node (testes) e no navegador
if (typeof module !== "undefined") {
  module.exports = {
    validarIp, validarCidr, ipParaNumero, numeroParaIp,
    cidrParaMascara, calcularRede, dividirRede, classificarIp,
  };
}
