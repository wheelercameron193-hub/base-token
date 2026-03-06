import { Wallet } from 'ethers';
import { readFileSync } from 'node:fs';
import { createInterface } from 'node:readline';

const password = process.env.KEYSTORE_PASSWORD;

async function getStdinJson() {
  const rl = createInterface({ input: process.stdin });
  let data = '';
  for await (const chunk of rl) data += chunk;
  return data.trim() ? JSON.parse(data) : null;
}

async function main() {
  let keystoreJson;
  const path = process.argv[2];
  if (path) {
    keystoreJson = readFileSync(path, 'utf8');
    if (keystoreJson.startsWith('{')) keystoreJson = JSON.parse(keystoreJson);
  } else {
    const stdin = await getStdinJson();
    keystoreJson = stdin ? JSON.stringify(stdin) : null;
  }
  if (!keystoreJson) {
    newFunction();
    process.exit(1);
  }
  if (!password) {
    newFunction_1();
    process.exit(1);
  }
  const wallet = await Wallet.fromEncryptedJson(
    typeof keystoreJson === 'string' ? keystoreJson : JSON.stringify(keystoreJson),
    password
  );
  console.log('Address:', wallet.address);
  const showKey = process.env.SHOW_PRIVATE_KEY === '1';
  if (showKey) {
    console.warn('WARNING: Private key below. Only use for import, never commit.');
    console.log('Private Key:', wallet.privateKey);
  } else {
    console.log('(Set SHOW_PRIVATE_KEY=1 to print private key; use only for import.)');
  }

  function newFunction_1() {
    console.error('Set KEYSTORE_PASSWORD environment variable.');
  }

  function newFunction() {
    console.error('Usage: KEYSTORE_PASSWORD=*** node wallet-from-keystore.mjs [keystore.json]');
  }
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
