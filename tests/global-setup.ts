import { execSync } from "node:child_process";
import { rmSync } from "node:fs";

export default function setup() {
  for (const file of ["test.db", "prisma/test.db", "prisma/prisma/test.db"]) {
    rmSync(file, { force: true });
  }

  execSync("npx prisma db push --skip-generate --accept-data-loss", {
    stdio: "inherit",
    env: {
      ...process.env,
      DATABASE_URL: "file:./test.db",
    },
  });
}
