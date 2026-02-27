import { test, expect } from "@playwright/test";

test.describe("Lead Capture Flow", () => {
  test("landing page loads and has CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Grupo Intelsis")).toBeVisible();
    await expect(page.getByText("Preencher cadastro")).toBeVisible();
  });

  test("navigates to lead form page", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Preencher cadastro");
    await expect(page).toHaveURL("/scan");
    await expect(page.getByText("Cadastro — Grupo Intelsis")).toBeVisible();
  });

  test("lead form shows required fields", async ({ page }) => {
    await page.goto("/scan");
    await expect(page.getByText("Nome Completo")).toBeVisible();
    await expect(page.getByText("Empresa", { exact: false })).toBeVisible();
    await expect(page.getByText("Módulos SAP de Interesse")).toBeVisible();
  });

  test("privacy page loads", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByText("Política de Privacidade")).toBeVisible();
  });

  test("thank you page loads", async ({ page }) => {
    await page.goto("/thank-you");
    await expect(
      page.getByText("Cadastro realizado com sucesso"),
    ).toBeVisible();
    await expect(page.getByText("Conheça-nos")).toBeVisible();
  });
});
