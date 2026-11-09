// Testes automatizados simples. Execute com: node test.js
const assert = require("assert");
const c = require("./calculadora.js");

let ok = 0;
function teste(nome, fn) {
  try { fn(); ok++; console.log("✅", nome); }
  catch (e) { console.error("❌", nome, "\n   ", e.message); process.exitCode = 1; }
}

teste("valida IPs corretos e incorretos", () => {
  assert.ok(c.validarIp("192.168.0.1"));
  assert.ok(!c.validarIp("256.1.1.1"));
  assert.ok(!c.validarIp("1.2.3"));
  assert.ok(!c.validarIp("a.b.c.d"));
});

teste("converte IP para número e de volta", () => {
  assert.strictEqual(c.ipParaNumero("192.168.1.1"), 3232235777);
  assert.strictEqual(c.numeroParaIp(3232235777), "192.168.1.1");
});

teste("calcula rede 192.168.1.10/24", () => {
  const r = c.calcularRede("192.168.1.10", 24);
  assert.strictEqual(r.mascara, "255.255.255.0");
  assert.strictEqual(r.rede, "192.168.1.0");
  assert.strictEqual(r.broadcast, "192.168.1.255");
  assert.strictEqual(r.primeiroHost, "192.168.1.1");
  assert.strictEqual(r.ultimoHost, "192.168.1.254");
  assert.strictEqual(r.hostsUteis, 254);
  assert.strictEqual(r.wildcard, "0.0.0.255");
});

teste("calcula rede 10.0.0.5/8", () => {
  const r = c.calcularRede("10.0.0.5", 8);
  assert.strictEqual(r.mascara, "255.0.0.0");
  assert.strictEqual(r.broadcast, "10.255.255.255");
  assert.strictEqual(r.hostsUteis, 16777214);
});

teste("calcula rede 172.16.50.20/20", () => {
  const r = c.calcularRede("172.16.50.20", 20);
  assert.strictEqual(r.rede, "172.16.48.0");
  assert.strictEqual(r.broadcast, "172.16.63.255");
  assert.strictEqual(r.mascara, "255.255.240.0");
});

teste("casos especiais /30, /31 e /32", () => {
  assert.strictEqual(c.calcularRede("192.168.1.1", 30).hostsUteis, 2);
  assert.strictEqual(c.calcularRede("192.168.1.1", 31).hostsUteis, 2);
  assert.strictEqual(c.calcularRede("192.168.1.1", 32).hostsUteis, 1);
});

teste("divide /24 em quatro /26", () => {
  const sub = c.dividirRede("192.168.10.0", 24, 26);
  assert.strictEqual(sub.length, 4);
  assert.deepStrictEqual(sub.map((s) => s.rede),
    ["192.168.10.0", "192.168.10.64", "192.168.10.128", "192.168.10.192"]);
  assert.strictEqual(sub[0].hostsUteis, 62);
});

teste("classifica endereços", () => {
  assert.strictEqual(c.classificarIp("192.168.0.1"), "Privado (RFC 1918)");
  assert.strictEqual(c.classificarIp("8.8.8.8"), "Público");
  assert.strictEqual(c.classificarIp("127.0.0.1"), "Loopback");
});

teste("rejeita entradas inválidas", () => {
  assert.throws(() => c.calcularRede("999.1.1.1", 24));
  assert.throws(() => c.calcularRede("10.0.0.1", 33));
  assert.throws(() => c.dividirRede("10.0.0.0", 24, 24));
});

console.log(`\n${ok} testes passaram.`);
