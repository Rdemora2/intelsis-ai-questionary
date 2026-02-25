import QRCode from "qrcode";
import path from "path";

async function main() {
  const url = process.env.PUBLIC_URL || "http://localhost:3000";
  const outputPath = path.resolve(process.cwd(), "qrcode.png");

  await QRCode.toFile(outputPath, url, {
    type: "png",
    width: 512,
    margin: 2,
    color: {
      dark: "#1e3a5f",
      light: "#ffffff",
    },
  });

  console.log(`QR Code gerado: ${outputPath}`);
  console.log(`URL: ${url}`);
}

main().catch((err) => {
  console.error("Erro ao gerar QR Code:", err);
  process.exit(1);
});
