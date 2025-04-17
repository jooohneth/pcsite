import { useCallback, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

import App from "./App.tsx";
import "./index.css";

const stripePromise = loadStripe(
  "pk_test_51RELgrRqEZQbee0Fv1fDsU6Lbm1HFIglKt80ygu0bzQHEnfSrBXsZ1tDPkBaDFutMTKVWssPUURpO6LIPWgTNnr000b3cUFA29"
);

const CheckoutForm = () => {
  const fetchClientSecret = useCallback(() => {
    const token = localStorage.getItem("auth-token");

    return fetch("http://3.238.151.248:8000/api/create-checkout-session/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  const options = { fetchClientSecret };

  return (
    <div className="bg-white h-screen flex flex-col justify-center">
      <div id="checkout">
        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </div>
  );
};

const Return = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    const token = localStorage.getItem("auth-token");

    fetch(
      `http://3.238.151.248:8000/api/session-status?session_id=${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, []);

  if (status === "open") {
    return <Navigate to="/checkout" />;
  }

  if (status === "complete") {
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to{" "}
          {customerEmail}. If you have any questions, please email{" "}
          <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
      </section>
    );
  }

  return null;
};

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/checkout" element={<CheckoutForm />} />
      <Route path="/return" element={<Return />} />
    </Routes>
  </BrowserRouter>
);
