import Razorpay from 'razorpay';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({ error: 'Minimum amount must be 100 paise (₹1)' });
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    const razorpay = new Razorpay({
      key_id,
      key_secret
    });

    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency,
      receipt: receipt || `receipt_${Date.now()}`
    });

    return res.status(200).json(order);
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create Razorpay order' });
  }
}
