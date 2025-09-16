/**
 * RSA Encryption Learning Demo - Mathematical Utilities
 * Using native JavaScript BigInt for large number operations
 * Implements all RSA algorithms from scratch for educational transparency
 */

// Check if a number is prime using trial division
export function isPrime(n: bigint): boolean {
  if (n <= 1n) return false;
  if (n <= 3n) return true;
  if (n % 2n === 0n || n % 3n === 0n) return false;
  
  for (let i = 5n; i * i <= n; i += 6n) {
    if (n % i === 0n || n % (i + 2n) === 0n) return false;
  }
  
  return true;
}

// Generate a random prime number within a range
export function generateRandomPrime(min: bigint, max: bigint): bigint {
  let candidate: bigint;
  do {
    candidate = BigInt(Math.floor(Math.random() * Number(max - min + 1n))) + min;
  } while (!isPrime(candidate));
  
  return candidate;
}

// Greatest Common Divisor using Euclidean algorithm
export function gcd(a: bigint, b: bigint): bigint {
  while (b !== 0n) {
    [a, b] = [b, a % b];
  }
  return a;
}

// Extended Euclidean Algorithm to find modular inverse
export function extendedGcd(a: bigint, m: bigint): [bigint, bigint, bigint] {
  if (a === 0n) return [m, 0n, 1n];
  
  const [gcd, x1, y1] = extendedGcd(m % a, a);
  const x = y1 - (m / a) * x1;
  const y = x1;
  
  return [gcd, x, y];
}

// Calculate modular inverse using extended Euclidean algorithm
export function modularInverse(e: bigint, phi: bigint): bigint | null {
  const [gcd, x] = extendedGcd(e, phi);
  
  if (gcd !== 1n) return null; // No modular inverse exists
  
  return ((x % phi) + phi) % phi;
}

// Efficient modular exponentiation using binary method
export function modularExponentiation(base: bigint, exponent: bigint, modulus: bigint): bigint {
  if (modulus === 1n) return 0n;
  
  let result = 1n;
  base = base % modulus;
  
  while (exponent > 0n) {
    if (exponent % 2n === 1n) {
      result = (result * base) % modulus;
    }
    exponent = exponent >> 1n;
    base = (base * base) % modulus;
  }
  
  return result;
}

// Calculate Euler's totient function φ(n) = (p-1)(q-1)
export function eulerTotient(p: bigint, q: bigint): bigint {
  return (p - 1n) * (q - 1n);
}

// Convert string to array of BigInt values (ASCII encoding)
export function stringToBigIntArray(message: string): bigint[] {
  return Array.from(message).map(char => BigInt(char.charCodeAt(0)));
}

// Convert array of BigInt values back to string
export function bigIntArrayToString(numbers: bigint[]): string {
  return numbers.map(num => String.fromCharCode(Number(num))).join('');
}

// Encrypt a single character (as BigInt)
export function encryptCharacter(m: bigint, e: bigint, n: bigint): bigint {
  return modularExponentiation(m, e, n);
}

// Decrypt a single character (as BigInt)
export function decryptCharacter(c: bigint, d: bigint, n: bigint): bigint {
  return modularExponentiation(c, d, n);
}

// Generate RSA key pair
export interface RSAKeyPair {
  p: bigint;
  q: bigint;
  n: bigint;
  phi: bigint;
  e: bigint;
  d: bigint;
  steps: string[];
}

export function generateRSAKeys(p: bigint, q: bigint): RSAKeyPair | null {
  const steps: string[] = [];
  
  if (!isPrime(p) || !isPrime(q)) {
    steps.push("❌ Error: Both p and q must be prime numbers");
    return null;
  }
  
  steps.push(`✓ Prime validation: p = ${p}, q = ${q}`);
  
  const n = p * q;
  steps.push(`📐 Calculate n = p × q = ${p} × ${q} = ${n}`);
  
  const phi = eulerTotient(p, q);
  steps.push(`🔢 Calculate φ(n) = (p-1) × (q-1) = ${p-1n} × ${q-1n} = ${phi}`);
  
  // Choose e = 65537 (commonly used value)
  const e = 65537n;
  if (gcd(e, phi) !== 1n) {
    steps.push(`❌ Error: gcd(${e}, ${phi}) ≠ 1. Choose different primes.`);
    return null;
  }
  steps.push(`🔑 Choose e = ${e}, verify gcd(${e}, ${phi}) = 1 ✓`);
  
  const d = modularInverse(e, phi);
  if (!d) {
    steps.push(`❌ Error: Cannot compute modular inverse of ${e} mod ${phi}`);
    return null;
  }
  steps.push(`🔐 Calculate d ≡ e⁻¹ (mod φ(n)) = ${d}`);
  steps.push(`✅ Verification: ${e} × ${d} ≡ 1 (mod ${phi})`);
  
  return { p, q, n, phi, e, d, steps };
}

// Validate message can be encrypted (all characters must be < n)
export function validateMessage(message: string, n: bigint): boolean {
  const charCodes = stringToBigIntArray(message);
  return charCodes.every(code => code < n);
}

// Full RSA encryption process
export function rsaEncrypt(message: string, e: bigint, n: bigint): {
  ciphertext: bigint[];
  steps: string[];
} {
  const steps: string[] = [];
  const plainNumbers = stringToBigIntArray(message);
  
  steps.push(`📝 Convert message "${message}" to numbers:`);
  steps.push(`   ${message.split('').map((char, i) => `'${char}' → ${plainNumbers[i]}`).join(', ')}`);
  
  const ciphertext = plainNumbers.map((m, i) => {
    const c = encryptCharacter(m, e, n);
    steps.push(`🔒 Encrypt '${message[i]}': ${m}^${e} mod ${n} = ${c}`);
    return c;
  });
  
  return { ciphertext, steps };
}

// Full RSA decryption process
export function rsaDecrypt(ciphertext: bigint[], d: bigint, n: bigint): {
  decrypted: string;
  steps: string[];
} {
  const steps: string[] = [];
  
  const decryptedNumbers = ciphertext.map((c, i) => {
    const m = decryptCharacter(c, d, n);
    const char = String.fromCharCode(Number(m));
    steps.push(`🔓 Decrypt ${c}: ${c}^${d} mod ${n} = ${m} → '${char}'`);
    return m;
  });
  
  const decrypted = bigIntArrayToString(decryptedNumbers);
  steps.push(`📋 Reconstructed message: "${decrypted}"`);
  
  return { decrypted, steps };
}