import { test, expect } from "@playwright/test";

test.describe("Scan Flow", () => {
  test("landing page loads and has CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Business Automation Radar")).toBeVisible();
    await expect(page.getByText("Fazer diagnóstico")).toBeVisible();
  });

  test("navigates to scan page", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Fazer diagnóstico");
    await expect(page).toHaveURL("/scan");
    await expect(page.getByText("Diagnóstico Rápido")).toBeVisible();
  });

  test("scan form shows validation state", async ({ page }) => {
    await page.goto("/scan");
    const button = page.getByText("Gerar diagnóstico");
    await expect(button).toBeDisabled();
  });

  test("privacy page loads", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByText("Política de Privacidade")).toBeVisible();
  });
});
