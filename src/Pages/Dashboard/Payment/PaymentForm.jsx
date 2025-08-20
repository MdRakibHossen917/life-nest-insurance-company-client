import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { id } = useParams(); // applicationId
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const amount = 50; // Example: fetch from your application or props
  const amountInCents = Math.round(amount * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error: cardError } = await stripe.createPaymentMethod({
      type: "card",
      card,
      billing_details: {
        name: user.displayName || "Anonymous",
        email: user.email,
      },
    });

    if (cardError) {
      setError(cardError.message);
      return;
    }

    try {
      const { data } = await axiosSecure.post("/create-payment-intent", {
        amountInCents,
      });
      const paymentResult = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card },
      });

      if (paymentResult.error) {
        setError(paymentResult.error.message);
        return;
      }

      if (paymentResult.paymentIntent.status === "succeeded") {
        await axiosSecure.post("/payments/save", {
          applicationId: id,
          amount,
          transactionId: paymentResult.paymentIntent.id,
        });

        await Swal.fire({
          icon: "success",
          title: "Payment Successful!",
          html: `<strong>Transaction ID:</strong> <code>${paymentResult.paymentIntent.id}</code>`,
        });

        navigate("/dashboard/myApplication");
      }
    } catch (err) {
      setError(err.message || "Payment failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 max-w-md mx-auto bg-white rounded shadow"
    >
      <CardElement className="p-2 border rounded" />
      <button
        type="submit"
        disabled={!stripe || amount <= 0}
        className="btn bg-[#3f9b95] w-full"
      >
        Pay Now
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default PaymentForm;
