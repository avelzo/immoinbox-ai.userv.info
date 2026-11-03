/** Recette sur MongoDB éphémère uniquement : aucun compte ou mail réel. */
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { spawn, type ChildProcess } from "node:child_process";
import { setTimeout as pause } from "node:timers/promises";

async function main() {
  const target = new URL(process.env.DATABASE_URL || "http://invalid");
  if (
    target.hostname !== "127.0.0.1" ||
    !target.port ||
    target.port === "27017" ||
    !target.pathname.startsWith("/immoinbox_auth_test_")
  )
    throw new Error("Base de recette locale isolée obligatoire");
  const base = "http://127.0.0.1:8795";
  assert.equal(process.env.BETTER_AUTH_URL, base);
  const { auth } = await import("../lib/auth");
  const { prisma } = await import("../lib/prisma");
  const password = randomBytes(24).toString("hex");
  const email = "legacy@example.test";
  let server: ChildProcess | undefined;
  let browser: { close(): Promise<void> } | undefined;

  try {
    const created = await auth.api.signUpEmail({
      body: { name: "Utilisateur de recette", email, password },
      asResponse: true,
    });
    assert.equal(
      created.status,
      200,
      "inscription Better Auth acceptée avec son schéma complet",
    );
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    assert.ok(user.organizationId, "rattachement démo existant conservé");

    // Reproduire un ancien document MongoDB dépourvu de la propriété optionnelle.
    await prisma.$runCommandRaw({
      update: "User",
      updates: [
        { q: { _id: user.id }, u: { $unset: { image: "" } }, multi: false },
      ],
    });
    const legacy = await prisma.user.findUniqueOrThrow({
      where: { id: user.id },
    });
    assert.equal(
      legacy.image,
      null,
      "ancien utilisateur sans image compatible",
    );
    const rejected = await auth.api.signInEmail({
      body: { email, password: "wrong-password-fixture" },
      asResponse: true,
    });
    assert.equal(rejected.status, 401, "mauvais mot de passe refusé");
    const login = await auth.api.signInEmail({
      body: { email, password },
      asResponse: true,
    });
    assert.equal(
      login.status,
      200,
      "connexion de l’ancien utilisateur acceptée",
    );
    const cookie = login.headers
      .getSetCookie()
      .map((value) => value.split(";", 1)[0])
      .join("; ");
    assert.ok(cookie, "cookie de session créé");
    const headers = new Headers({ cookie });
    const session = await auth.api.getSession({ headers });
    assert.equal(
      session?.user.id,
      user.id,
      "session reliée au bon utilisateur",
    );
    assert.equal(session?.user.image, null);
    await auth.api.signOut({ headers });
    assert.equal(
      await auth.api.getSession({ headers }),
      null,
      "session révoquée à la déconnexion",
    );

    if (process.env.IMMOINBOX_HTTP_SMOKE === "1") {
      const { chromium } = await import(process.env.IMMOINBOX_PLAYWRIGHT_PATH!);
      server = spawn(
        process.execPath,
        [
          "node_modules/next/dist/bin/next",
          "start",
          "--hostname",
          "127.0.0.1",
          "--port",
          "8795",
        ],
        { env: process.env, stdio: "ignore" },
      );
      let ready = false;
      for (let attempt = 0; attempt < 60; attempt++) {
        try {
          if ((await fetch(base + "/login")).status === 200) {
            ready = true;
            break;
          }
        } catch {}
        await pause(250);
      }
      assert.ok(ready, "serveur de recette prêt");
      const startedBrowser = await chromium.launch({ headless: true });
      browser = startedBrowser;
      const context = await startedBrowser.newContext();
      await context.route(
        "**/*",
        async (route: {
          request(): { url(): string };
          continue(): Promise<void>;
          abort(): Promise<void>;
        }) => {
          if (new URL(route.request().url()).origin === base)
            await route.continue();
          else await route.abort();
        },
      );
      const page = await context.newPage();
      await page.goto(base + "/dashboard/emails");
      assert.equal(
        new URL(page.url()).pathname,
        "/login",
        "espace privé inaccessible sans session",
      );
      await page.getByLabel("Adresse email", { exact: true }).fill(email);
      await page.getByLabel("Mot de passe", { exact: true }).fill(password);
      await page
        .getByRole("button", { name: "Se connecter", exact: true })
        .click();
      await page.waitForURL(base + "/dashboard/emails");
      assert.equal(
        (await context.request.get(base + "/api/auth/get-session")).status(),
        200,
      );
      await context.request.post(base + "/api/auth/sign-out", {
        headers: { Origin: base },
        data: {},
      });
      await page.goto(base + "/register");
      await page
        .getByLabel("Nom complet", { exact: true })
        .fill("Nouveau compte de recette");
      await page
        .getByLabel("Adresse email", { exact: true })
        .fill("new-user@example.test");
      await page.getByLabel("Mot de passe", { exact: true }).fill(password);
      await page
        .getByRole("button", { name: "Créer le compte", exact: true })
        .click();
      await page.waitForURL(base + "/dashboard/emails");
      const newUser = await prisma.user.findUniqueOrThrow({
        where: { email: "new-user@example.test" },
      });
      assert.equal(
        newUser.organizationId,
        user.organizationId,
        "parcours agence démo existant inchangé",
      );
      assert.notEqual(newUser.id, user.id);
      console.info(
        "Recette navigateur : connexion d’un ancien compte, inscription, session et redirection protégée validées.",
      );
      await context.close();
    }
    console.info(
      "Recette auth isolée réussie : schéma, ancien compte sans image, mots de passe et révocation de session. Aucun email réel.",
    );
  } finally {
    await browser?.close();
    if (server) {
      const stopped = new Promise<void>((resolve) =>
        server!.once("exit", () => resolve()),
      );
      server.kill("SIGTERM");
      await Promise.race([stopped, pause(3000)]);
      if (server.exitCode === null) server.kill("SIGKILL");
    }
    await prisma.$runCommandRaw({ dropDatabase: 1 });
    await prisma.$disconnect();
  }
}

void main().catch((error: unknown) => {
  console.error(
    "Recette auth échouée :",
    error instanceof Error ? error.name : "Erreur",
  );
  process.exitCode = 1;
});
