// Interface da calculadora (usa as funções de calculadora.js)
const form = document.getElementById("form");
const campoIp = document.getElementById("ip");
const campoCidr = document.getElementById("cidr");
const campoNovo = document.getElementById("novo-cidr");
const erro = document.getElementById("erro");
const secResultado = document.getElementById("resultado");
const secSubredes = document.getElementById("subredes");

const formatar = (n) => n.toLocaleString("pt-BR");

function linha(rotulo, valor) {
  const tr = document.createElement("tr");
  const th = document.createElement("th");
  const td = document.createElement("td");
  th.textContent = rotulo;
  td.textContent = valor;
  tr.append(th, td);
  return tr;
}

function mostrarResultado(r) {
  secResultado.innerHTML = "";
  const titulo = document.createElement("h2");
  titulo.textContent = `Rede ${r.rede}/${r.cidr}`;

  const tabela = document.createElement("table");
  [
    ["Classificação", r.classificacao],
    ["Máscara de sub-rede", r.mascara],
    ["Máscara (binário)", r.mascaraBinaria],
    ["Wildcard", r.wildcard],
    ["Endereço de rede", r.rede],
    ["Primeiro host", r.primeiroHost],
    ["Último host", r.ultimoHost],
    ["Broadcast", r.broadcast],
    ["Total de endereços", formatar(r.totalEnderecos)],
    ["Hosts utilizáveis", formatar(r.hostsUteis)],
  ].forEach(([rotulo, valor]) => tabela.appendChild(linha(rotulo, valor)));

  secResultado.append(titulo, tabela);
  secResultado.hidden = false;
}

function mostrarSubredes(lista) {
  secSubredes.innerHTML = "";
  const titulo = document.createElement("h2");
  titulo.textContent = `${lista.length} sub-redes /${lista[0].cidr}`;

  const tabela = document.createElement("table");
  tabela.className = "grade";
  const cab = document.createElement("tr");
  ["#", "Rede", "Primeiro host", "Último host", "Broadcast", "Hosts"].forEach((t) => {
    const th = document.createElement("th");
    th.textContent = t;
    cab.appendChild(th);
  });
  tabela.appendChild(cab);

  lista.forEach((s, i) => {
    const tr = document.createElement("tr");
    [i + 1, `${s.rede}/${s.cidr}`, s.primeiroHost, s.ultimoHost, s.broadcast, formatar(s.hostsUteis)]
      .forEach((valor) => {
        const td = document.createElement("td");
        td.textContent = valor;
        tr.appendChild(td);
      });
    tabela.appendChild(tr);
  });

  const contêiner = document.createElement("div");
  contêiner.className = "rolagem";
  contêiner.appendChild(tabela);
  secSubredes.append(titulo, contêiner);
  secSubredes.hidden = false;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  erro.textContent = "";
  secResultado.hidden = true;
  secSubredes.hidden = true;

  const ip = campoIp.value.trim();
  const cidr = parseInt(campoCidr.value, 10);

  try {
    mostrarResultado(calcularRede(ip, cidr));
    if (campoNovo.value !== "") {
      mostrarSubredes(dividirRede(ip, cidr, parseInt(campoNovo.value, 10)));
    }
  } catch (err) {
    erro.textContent = "⚠️ " + err.message;
  }
});
