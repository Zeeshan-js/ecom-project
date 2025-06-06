import nodemailer from "nodemailer"

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const generateOrderEmailHTML = (orderData) => {
  const { orderNumber, products, customerInfo } = orderData;
  
  const productsList = products.map(product => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${product.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${product.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">$${product.price.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">$${(product.price * product.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Order Confirmation - #${orderNumber}</h2>
      <p style="color: #27ae60; font-size: 18px;">Your order has been placed successfully!</p>
      
      <h3 style="color: #2c3e50;">Order Details:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 10px; text-align: left;">Product</th>
            <th style="padding: 10px; text-align: left;">Quantity</th>
            <th style="padding: 10px; text-align: left;">Price</th>
            <th style="padding: 10px; text-align: left;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${productsList}
        </tbody>
      </table>

      <div style="margin-top: 20px;">
        <h3 style="color: #2c3e50;">Shipping Information:</h3>
        <p>Name: ${customerInfo.name}</p>
        <p>Email: ${customerInfo.email}</p>
        <p>Address: ${customerInfo.shippingAddress}</p>
      </div>

      <div style="margin-top: 20px; padding: 20px; background-color: #f8f9fa;">
        <p>Thank you for shopping with us! If you have any questions, please don't hesitate to contact our support team.</p>
      </div>
    </div>
  `;
};

const generateFailureEmailHTML = (customerName) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #c0392b;">Transaction Failed</h2>
      <p style="font-size: 16px;">Dear ${customerName},</p>
      <p style="font-size: 16px;">We regret to inform you that your transaction could not be completed.</p>
      <div style="margin: 20px 0; padding: 20px; background-color: #f8f9fa;">
        <p>Please try again or contact our support team for assistance.</p>
        <p>Our support team is available 24/7 to help you resolve any issues.</p>
      </div>
      <p style="color: #7f8c8d;">If you continue to experience issues, please reach out to us at support@example.com</p>
    </div>
  `;
};

const sendSuccessEmail = async (orderData) => {
  try {
    const html = generateOrderEmailHTML(orderData);
    await transport.sendMail({
      from: '"Your Store" <store@example.com>',
      to: orderData.customerInfo.email,
      subject: `Order Confirmation - #${orderData.orderNumber}`,
      html,
    });
    console.log('Success email sent to:', orderData.customerInfo.email);
    return true;
  } catch (error) {
    console.error('Failed to send success email:', error);
    return false;
  }
};

const sendFailureEmail = async (customerEmail, customerName) => {
  try {
    const html = generateFailureEmailHTML(customerName);
    await transport.sendMail({
      from: '"Your Store" <store@example.com>',
      to: customerEmail,
      subject: 'Transaction Failed',
      html,
    });
    console.log('Failure email sent to:', customerEmail);
    return true;
  } catch (error) {
    console.error('Failed to send failure email:', error);
    return false;
  }
};

export { sendSuccessEmail, sendFailureEmail };