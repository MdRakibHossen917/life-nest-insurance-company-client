import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { id } = useParams(); // assuming your route param is 'id'
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const { isLoading, data: application = {} } = useQuery({
    queryKey: ["applications", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/applications/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <p className="text-center mt-4">Loading application info...</p>;
  }

  // Make sure amount is a valid number
  const amount = Number(application.estimatedPremium) || 0;
  const amountInCents = Math.round(amount * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    // Step 1: Validate the card details
    const { error: cardError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card,
      });

    if (cardError) {
      setError(cardError.message);
      return;
    } else {
      setError("");
      console.log("Payment method:", paymentMethod);
    }

    try {
      // Step 2: Create payment intent on server
      const { data } = await axiosSecure.post("/create-payment-intent", {
        amountInCents,
        applicationId: id,
      });

      const clientSecret = data.clientSecret;

      // Step 3: Confirm the card payment
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user.displayName || "Anonymous",
            email: user.email || "",
          },
        },
      });

      if (paymentResult.error) {
        setError(paymentResult.error.message);
        return;
      }

      setError("");

      if (paymentResult.paymentIntent.status === "succeeded") {
        console.log("Payment succeeded!");

        // Step 4: Save payment info in DB and update application status
        const paymentData = {
          applicationId: id,
          email: user.email,
          amount,
          transactionId: paymentResult.paymentIntent.id,
          paymentMethod: paymentResult.paymentIntent.payment_method_types,
        };

        const paymentRes = await axiosSecure.post("/payments", paymentData);

        if (paymentRes.data.insertedId) {
          await Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            html: `<strong>Transaction ID:</strong> <code>${paymentResult.paymentIntent.id}</code>`,
            confirmButtonText: "Go to My Applications",
          });

          navigate("/dashboard/myApplication");
        }
      }
    } catch (err) {
      setError(err.message || "Payment failed");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto"
      >
        <CardElement className="p-2 border rounded" />
        <button
          type="submit"
          className="btn btn-primary text-black w-full"
          disabled={!stripe || amount <= 0}
        >
          Pay ${amount.toFixed(2)}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
