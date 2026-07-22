import autocannon from "autocannon";

const BASE_URL = "http://localhost:3000/api/v1/users";
const TOTAL_REQUESTS = 100_000;
const CONNECTIONS = 100;

function randomUser(i: number) {
  return JSON.stringify({
    email: `user${i}@loadtest.com`,
    password: `pass${i}word`,
  });
}

async function main() {
  // --- Registration load test ---
  // Each request uses a unique email so no duplicates
  const registerRequests = Array.from({ length: TOTAL_REQUESTS }, (_, i) => randomUser(i));

  let reqIndex = 0;
  const registerInstance = autocannon(
    {
      title: `POST /register — ${TOTAL_REQUESTS.toLocaleString()} users`,
      url: `${BASE_URL}/register`,
      method: "POST",
      headers: { "content-type": "application/json" },
      connections: CONNECTIONS,
      amount: TOTAL_REQUESTS,
      timeout: 3600,
      setupClient(client) {
        client.setBody(registerRequests[reqIndex++] ?? registerRequests[0]!);
      },
    },
    (err, result) => {
      if (err) {
        console.error("Register test error:", err);
        return;
      }
      printSummary("REGISTER", result);
      runLoginTest();
    },
  );

  autocannon.track(registerInstance, { renderProgressBar: true });
}

function runLoginTest() {
  const TOTAL = 1000;
  let reqIndex = 0;
  const loginRequests = Array.from({ length: TOTAL }, (_, i) => randomUser(i));

  console.log(`\n--- POST /login — ${TOTAL.toLocaleString()} users ---`);

  const loginInstance = autocannon(
    {
      title: `POST /login — ${TOTAL.toLocaleString()} users`,
      url: `${BASE_URL}/login`,
      method: "POST",
      headers: { "content-type": "application/json" },
      connections: CONNECTIONS,
      amount: TOTAL,
      timeout: 3600,
      setupClient(client) {
        client.setBody(loginRequests[reqIndex++] ?? loginRequests[0]!);
      },
    },
    (err, result) => {
      if (err) {
        console.error("Login test error:", err);
        return;
      }
      printSummary("LOGIN", result);
    },
  );

  autocannon.track(loginInstance, { renderProgressBar: true });
}

function printSummary(label: string, result: autocannon.Result) {
  console.log(`\n========== ${label} RESULTS ==========`);
  console.log(`Requests:    ${result.requests.total}`);
  console.log(`Throughput:  ${result.throughput.average} bytes/sec`);
  console.log(`Req/sec avg: ${result.requests.average}`);
  console.log(`Req/sec max: ${result.requests.max}`);
  console.log(`Latency avg: ${result.latency.average} ms`);
  console.log(`Latency max: ${result.latency.max} ms`);
  console.log(`Errors:      ${result.errors}`);
  console.log(`Non-2xx:     ${result.non2xx}`);
  console.log("=====================================\n");
}

main().catch(console.error);
