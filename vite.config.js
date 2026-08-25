import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config();

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

const razorpayDevServerPlugin = () => ({
  name: 'razorpay-dev-server',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url === '/api/create-order' && req.method === 'POST') {
        try {
          const body = await readRequestBody(req);
          const key_id = process.env.RAZORPAY_KEY_ID;
          const key_secret = process.env.RAZORPAY_KEY_SECRET;
          
          const razorpay = new Razorpay({ key_id, key_secret });
          const order = await razorpay.orders.create({
            amount: Math.round(body.amount),
            currency: body.currency || 'INR',
            receipt: body.receipt || `receipt_${Date.now()}`
          });
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(order));
        } catch (err) {
          console.error("Vite Razorpay create-order error:", err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message || 'Failed to create order' }));
        }
      } else if (req.url === '/api/verify-payment' && req.method === 'POST') {
        try {
          const body = await readRequestBody(req);
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
          const key_secret = process.env.RAZORPAY_KEY_SECRET;
          
          const generated_signature = crypto
            .createHmac('sha256', key_secret)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');
            
          if (generated_signature === razorpay_signature) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'Verified' }));
          } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Signature mismatch' }));
          }
        } catch (err) {
          console.error("Vite Razorpay verify-payment error:", err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message || 'Verification failed' }));
        }
      } else {
        next();
      }
    });
  }
});

export default defineConfig({
  plugins: [react(), tailwindcss(), razorpayDevServerPlugin()],
  base: '/',
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
})
