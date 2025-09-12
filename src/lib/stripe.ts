import { loadStripe, Stripe } from '@stripe/stripe-js';
import { axiosInstance } from './apiService';

// Get Stripe publishable key from environment variables
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!STRIPE_PUBLISHABLE_KEY) {
  console.error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable');
}

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    if (!STRIPE_PUBLISHABLE_KEY) {
      throw new Error('Stripe publishable key is not configured. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your .env.local file');
    }
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

/**
 * Create checkout session for a course
 * @param courseId - The ID of the course to enroll in
 */
export const createCheckoutSession = async (courseId: string) => {
  const response = await axiosInstance.post(`/payments/payments/`, {
    course_id: courseId,
  });
  return response.data;
};

/**
 * Redirect to Stripe checkout page using Stripe.js
 * @param checkoutSessionId - The checkout session ID from Stripe
 */
export const redirectToCheckout = async (
  checkoutSessionId: string
): Promise<void> => {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error("Stripe failed to load - check your publishable key");
    }

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionId,
    });

    if (error) {
      console.error("Stripe checkout error:", error);
      throw new Error(error.message || "Checkout failed");
    }
  } catch (error) {
    console.error("Error redirecting to checkout:", error);
    throw error;
  }
};

/**
 * Complete payment flow - create session and redirect
 * @param courseId - The ID of the course to enroll in
 */
export const initiatePayment = async (courseId: string): Promise<void> => {
  try {
    const { checkout_session_id } = await createCheckoutSession(courseId);
    await redirectToCheckout(checkout_session_id);
  } catch (error) {
    console.error("Payment initiation failed:", error);
    throw error;
  }
};
