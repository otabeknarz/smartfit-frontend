"use client";

import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, CreditCard } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface StripeCheckoutProps {
  clientSecret: string;
  amount: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

export const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  clientSecret,
  amount,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setIsProcessing(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        console.error('Payment failed:', error);
        onError(error.message || 'Payment failed');
        toast({
          title: t('payment_failed'),
          description: error.message || t('payment_error_occurred'),
          variant: 'destructive',
        });
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess();
        toast({
          title: t('payment_successful'),
          description: t('enrollment_completed'),
          variant: 'default',
        });
      }
    } catch (err) {
      console.error('Payment error:', err);
      onError('An unexpected error occurred');
      toast({
        title: t('payment_failed'),
        description: t('payment_error_occurred'),
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          {t('complete_payment')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t('card_information')}
            </label>
            <div className="p-3 border border-gray-300 rounded-md bg-white">
              <CardElement options={cardElementOptions} />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{t('total_amount')}</span>
              <span className="text-lg font-semibold">
                {new Intl.NumberFormat('uz-UZ').format(parseFloat(amount))} UZS
              </span>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('processing_payment')}
              </>
            ) : (
              t('pay_now')
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
