#!/usr/bin/env node
/**
 * Turns a password into the scrypt hash that ADMIN_PASSWORD_HASH holds.
 *
 *     npm run admin:password
 *
 * The password is read from a hidden prompt, never from an argument: anything on the
 * command line lands in shell history and is visible to `ps` while the process runs.
 *
 * Only the hash is ever printed. Put that in the Netlify environment — the password
 * itself belongs in a password manager and nowhere near this repository.
 */
import { randomBytes, scryptSync } from 'node:crypto'
import { createInterface } from 'node:readline'
import { stdin, stdout } from 'node:process'

const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 }

function prompt(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: stdin, output: stdout, terminal: true })
    // Swallow the echo so the password is not left on screen or in a scrollback buffer.
    const onData = () => { stdout.write(`\x1b[2K\r${question}`) }
    stdin.on('data', onData)
    rl.question(question, (answer) => {
      stdin.off('data', onData)
      rl.close()
      stdout.write('\n')
      resolve(answer)
    })
  })
}

const password = (await prompt('New admin password: ')).trim()
const again = (await prompt('Confirm password:    ')).trim()

if (password !== again) {
  console.error('\nThose do not match. Nothing generated.')
  process.exit(1)
}
if (password.length < 12) {
  console.error('\nUse at least 12 characters. Length is what actually protects a password.')
  process.exit(1)
}

const salt = randomBytes(16)
const key = scryptSync(password.normalize('NFKC'), salt, SCRYPT.keylen, SCRYPT)
const hash = ['scrypt', SCRYPT.N, SCRYPT.r, SCRYPT.p, salt.toString('base64'), key.toString('base64')].join('$')

console.log('\nSet this as ADMIN_PASSWORD_HASH:\n')
console.log(hash)
console.log('\nIt is a one-way hash — it cannot be turned back into the password.')
console.log('If an administrator already exists in the database, change the password from')
console.log('the dashboard instead; this variable only seeds the very first sign-in.\n')
