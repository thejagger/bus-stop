import { ZetManager } from "@tranzithr/zet-api";
import { randomBytes } from "crypto";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

/**
 * Generate a secure random password
 */
function generateSecurePassword(length = 16) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  const randomValues = randomBytes(length);
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length];
  }
  return password;
}

/**
 * Read existing .env.local file
 */
function readEnvFile() {
  const envPath = join(process.cwd(), ".env.local");
  if (existsSync(envPath)) {
    return readFileSync(envPath, "utf-8");
  }
  return "";
}

/**
 * Write to .env.local file
 */
function writeEnvFile(content) {
  const envPath = join(process.cwd(), ".env.local");
  writeFileSync(envPath, content, "utf-8");
}

/**
 * Add or update environment variable in .env.local
 */
function setEnvVariable(key, value, existingContent) {
  const lines = existingContent.split("\n");
  let found = false;
  
  const newLines = lines.map((line) => {
    if (line.startsWith(`${key}=`)) {
      found = true;
      return `${key}=${value}`;
    }
    return line;
  });
  
  if (!found) {
    // Add new line if not found
    if (existingContent && !existingContent.endsWith("\n")) {
      newLines.push("");
    }
    newLines.push(`${key}=${value}`);
  }
  
  return newLines.join("\n");
}

async function main() {
  const email = "jackpot.auer@gmail.com";
  const password = generateSecurePassword(20);
  
  console.log("🚀 Registering user with ZET API...");
  console.log(`📧 Email: ${email}`);
  
  try {
    const zet = new ZetManager();
    
    // Register the user
    console.log("⏳ Registering account...");
    try {
      await zet.authManager.register({
        email: email,
        password: password,
        confirmPassword: password,
      });
    } catch (registerError) {
      // Log full error details
      console.error("Registration error details:", {
        message: registerError.message,
        stack: registerError.stack,
        ...registerError
      });
      throw registerError;
    }
    
    console.log("✅ Registration successful! Check your email to confirm.");
    
    // Save credentials to .env.local
    console.log("💾 Saving credentials to .env.local...");
    const existingEnv = readEnvFile();
    let updatedEnv = setEnvVariable("VITE_ZET_API_EMAIL", email, existingEnv);
    updatedEnv = setEnvVariable("VITE_ZET_API_PASSWORD", password, updatedEnv);
    writeEnvFile(updatedEnv);
    
    console.log("✅ Credentials saved to .env.local");
    console.log("\n📝 Note: Please check your email to confirm the registration.");
    console.log("   After confirmation, you can use these credentials to login.");
    
  } catch (error) {
    console.error("❌ Error registering user:", error.message);
    if (error.response) {
      console.error("Response:", error.response.data);
    }
    if (error.cause) {
      console.error("Cause:", error.cause);
    }
    console.error("\n⚠️  Registration may not be available via API.");
    console.error("   You may need to register manually through the ZET website.");
    console.error("   However, I've generated a secure password for you.");
    
    // Still save the password even if registration fails
    console.log("\n💾 Saving generated password to .env.local...");
    const existingEnv = readEnvFile();
    let updatedEnv = setEnvVariable("VITE_ZET_API_EMAIL", email, existingEnv);
    updatedEnv = setEnvVariable("VITE_ZET_API_PASSWORD", password, updatedEnv);
    writeEnvFile(updatedEnv);
    
    console.log("✅ Password saved to .env.local");
    console.log(`\n📝 Email: ${email}`);
    console.log(`📝 Password: ${password}`);
    console.log("\nPlease register manually at the ZET website and use these credentials.");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
