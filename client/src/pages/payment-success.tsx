import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function PaymentSuccess() {
  const [location] = useLocation();
  const [paymentStatus, setPaymentStatus] = useState<{
    success: boolean;
    message: string;
    transactionId?: string;
    amount?: number;
    currency?: string;
    error?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Parse URL parameters manually
  const getUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      success: urlParams.get('success'),
      transactionId: urlParams.get('transactionId'),
      amount: urlParams.get('amount'),
      currency: urlParams.get('currency'),
      error: urlParams.get('error'),
      resourcePath: urlParams.get('resourcePath'),
      entityId: urlParams.get('entityId')
    };
  };

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const { success, transactionId, amount, currency, error, resourcePath, entityId } = getUrlParams();

        // If we have direct success/error parameters from server redirect
        if (success !== null) {
          setPaymentStatus({
            success: success === 'true',
            message: success === 'true' ? 'Payment successful!' : (error || 'Payment failed'),
            transactionId: transactionId || undefined,
            amount: amount ? parseFloat(amount) : undefined,
            currency: currency || undefined,
            error: success === 'false' ? (error || undefined) : undefined
          });
          setIsLoading(false);
          return;
        }

        // If we have resourcePath, verify with API
        if (resourcePath) {
          const response = await fetch(`/api/payment-status?resourcePath=${encodeURIComponent(resourcePath)}&entityId=${entityId || ''}`);
          const result = await response.json();
          setPaymentStatus(result);
        } else {
          setPaymentStatus({
            success: false,
            message: 'Invalid payment response'
          });
        }
      } catch (error) {
        setPaymentStatus({
          success: false,
          message: 'Failed to verify payment',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we verify your payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {paymentStatus?.success ? (
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          ) : (
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          )}
          <CardTitle className="text-2xl">
            {paymentStatus?.success ? 'Payment Successful!' : 'Payment Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentStatus?.success ? (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  {paymentStatus.message}
                </AlertDescription>
              </Alert>

              {paymentStatus.transactionId && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Transaction Details</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Transaction ID:</strong> {paymentStatus.transactionId}</p>
                    {paymentStatus.amount && paymentStatus.currency && (
                      <p><strong>Amount:</strong> {paymentStatus.amount} {paymentStatus.currency}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Button asChild className="w-full">
                  <a href="/dashboard">Go to Dashboard</a>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <a href="/">Back to Home</a>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertDescription>
                  {paymentStatus?.message || 'Payment could not be processed'}
                </AlertDescription>
              </Alert>

              {paymentStatus?.error && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-700">
                    <strong>Error:</strong> {paymentStatus.error}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Button asChild className="w-full">
                  <a href="/pricing">Try Again</a>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <a href="/">Back to Home</a>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
