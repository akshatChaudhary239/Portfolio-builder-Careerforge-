const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: 'rzp_test_SuKiwNIEvShtpX',
  key_secret: 'WPIjgDVLEb5xZv1Iiz0lj6ti',
});

async function test() {
  try {
    const order = await razorpay.orders.create({
      amount: 19900,
      currency: "INR",
      receipt: "receipt_test_1"
    });
    console.log("Success:", order);
  } catch(e) {
    console.error("Error:", e);
  }
}
test();
