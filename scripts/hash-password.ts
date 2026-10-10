import { hash } from "bcryptjs";
import { createInterface } from "node:readline";

/**
 * Genera el hash bcrypt de la contraseña del administrador.
 * Uso: npm run hash-password
 * Copia el resultado en ADMIN_PASSWORD_HASH dentro de .env.local
 */

function askHidden(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    const internal = rl as unknown as {
      _writeToOutput: (value: string) => void;
      output: NodeJS.WriteStream;
    };
    const original = internal._writeToOutput.bind(rl);

    internal._writeToOutput = (value: string) => {
      if (value === prompt || value === "\r\n" || value === "\n") {
        original(value);
      }
    };

    rl.question(prompt, (answer) => {
      internal._writeToOutput = original;
      process.stdout.write("\n");
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  const username = process.argv[2] ?? process.env.ADMIN_USERNAME ?? "admin";

  const password = await askHidden("Contraseña del administrador: ");
  const confirm = await askHidden("Repite la contraseña: ");

  if (password.length < 8) {
    console.error("\nLa contraseña debe tener al menos 8 caracteres.");
    process.exit(1);
  }
  if (password !== confirm) {
    console.error("\nLas contraseñas no coinciden.");
    process.exit(1);
  }

  const digest = await hash(password, 12);
  // Next.js expande las variables de .env y los "$" del hash romperían el valor.
  // Por eso mostramos el hash con los "$" escapados (\$), ya listo para pegar.
  const escapedDigest = digest.replace(/\$/g, "\\$");

  console.log("\nCopia estas líneas en tu .env.local:\n");
  console.log(`ADMIN_USERNAME=${username}`);
  console.log(`ADMIN_PASSWORD_HASH=${escapedDigest}`);
  console.log(
    "\n(El hash va con los \"$\" escapados como \\$ para que Next no los interprete.)",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
