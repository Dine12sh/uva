import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
// Derive a 32-byte key from the secret
const secret = process.env.JWT_SECRET || "super-secret-birthday-key-2026";
const KEY = crypto.createHash("sha256").update(secret).digest();
const IV = Buffer.alloc(16, 0); // Using a constant IV since it's a simple admin portal

export function encryptSession(data: any): string {
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);
  let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

export function decryptSession(token: string): any {
  try {
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, IV);
    let decrypted = decipher.update(token, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return JSON.parse(decrypted);
  } catch (e) {
    return null;
  }
}
