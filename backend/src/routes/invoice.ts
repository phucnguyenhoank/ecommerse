import express, { Request, Response } from "express";
import puppeteer from "puppeteer";

const router = express.Router();

interface OrderData {
  customerName: string;
  orderId: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
}

async function generateInvoicePdf(order: OrderData, res: Response): Promise<void> {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  const html = generateInvoiceHTML(order);
  console.log("HTML xuất hóa đơn:\n", html); 

  await page.setContent(html, { waitUntil: "networkidle0" });
  await new Promise(resolve => setTimeout(resolve, 500)); 
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

 res.writeHead(200, {
  "Content-Type": "application/pdf",
  "Content-Disposition": `inline; filename=invoice-${order.orderId}.pdf`,
  "Content-Length": Buffer.byteLength(pdfBuffer),
});

res.end(pdfBuffer);

}

router.post("/generate-invoice", async (req: Request, res: Response) => {
  console.log("Body received:", JSON.stringify(req.body.orderData, null, 2));

  try {
    const order: OrderData = req.body.orderData;
    await generateInvoicePdf(order, res);
  } catch (err) {
    console.error("Lỗi tạo hóa đơn:", err);
    res.status(500).send("Không thể tạo hóa đơn");
  }
});

function generateInvoiceHTML(order: OrderData): string {
  const itemsHtml = order.items
    .map(
      (item, i) =>
        `<tr>
          <td>${item.name ?? `Sản phẩm ${i + 1}`}</td>
          <td>${item.quantity ?? 0}</td>
          <td>${item.price?.toLocaleString() ?? "0"} VND</td>
        </tr>`
    )
    .join("");

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h2>Hóa đơn thanh toán</h2>
        <p><strong>Khách hàng:</strong> ${order.customerName}</p>
        <p><strong>Mã đơn hàng:</strong> ${order.orderId}</p>
        <table>
          <thead>
            <tr><th>Sản phẩm</th><th>Số lượng</th><th>Giá</th></tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <h3 style="text-align: right;">Tổng cộng: ${order.total?.toLocaleString()} VND</h3>
      </body>
    </html>
  `;
}

export default router;
