import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, CreditCard, Shield } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  duration: string;
  features: string[];
}

interface PaymentFormProps {
  selectedPlan: PricingPlan;
  onPaymentSuccess: (result: any) => void;
  onPaymentError: (error: string) => void;
}

interface CustomerDetails {
  email: string;
  givenName: string;
  surname: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
}

declare global {
  interface Window {
    wpwlOptions: any;
  }
}

export function PaymentForm({ selectedPlan, onPaymentSuccess, onPaymentError }: PaymentFormProps) {
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    email: '',
    givenName: '',
    surname: '',
    street: '',
    city: '',
    state: '',
    country: 'SA',
    postcode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'MADA' | 'VISA_MASTER'>('VISA_MASTER');
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [integrity, setIntegrity] = useState<string | null>(null);
  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Configure HyperPay widget options
  useEffect(() => {
    window.wpwlOptions = {
      paymentTarget: "_top",
      brandOrder: ["MADA", "VISA", "MASTER"]
      // Note: shopperResultUrl is set in the form's action attribute
      // NOT in the backend checkout creation, as per HyperPay documentation
    };
  }, []);

  const handleInputChange = (field: keyof CustomerDetails, value: string) => {
    setCustomerDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('=== FRONTEND PAYMENT REQUEST ===');
      console.log('Payment method state:', paymentMethod);
      console.log('Plan ID:', selectedPlan.id);
      console.log('Customer details:', customerDetails);
      
      // Get authentication token
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Please sign in to continue with payment");
      }

      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          planId: selectedPlan.id,
          paymentMethod: paymentMethod,
          customerDetails
        }),
      });

      const data = await response.json();

      console.log('=== FRONTEND CHECKOUT DEBUG ===');
      console.log('Response status:', response.status);
      console.log('Response data:', data);
      console.log('Checkout ID received:', data.checkoutId);

      if (!response.ok) {
        // Provide more helpful error messages
        let errorMessage = data.message || 'Failed to create checkout';
        if (response.status === 500) {
          errorMessage = 'Payment service temporarily unavailable. Please try again later.';
        }
        throw new Error(errorMessage);
      }

      setCheckoutId(data.checkoutId);
      setIntegrity(data.integrity);
      setCallbackUrl(data.callbackUrl);

      // Load HyperPay widget script with integrity hash for security
      console.log('Loading HyperPay widget with checkoutId:', data.checkoutId);
      console.log('Widget URL:', data.widgetUrl);
      console.log('Integrity hash:', data.integrity);
      console.log('Callback URL:', data.callbackUrl);
      
      const script = document.createElement('script');
      script.src = `${data.widgetUrl}/v1/paymentWidgets.js?checkoutId=${data.checkoutId}`;
      
      // Add security attributes as per HyperPay documentation
      if (data.integrity) {
        script.integrity = data.integrity;
        script.crossOrigin = 'anonymous';
      }
      
      script.onload = () => {
        console.log('HyperPay widget script loaded successfully');
        setIsLoading(false);
      };
      script.onerror = (error) => {
        console.error('Failed to load HyperPay widget script:', error);
        setError('Failed to load payment widget');
        setIsLoading(false);
      };
      document.head.appendChild(script);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setIsLoading(false);
      setCheckoutId(null); // Reset checkout ID on error so user can retry
      setIntegrity(null);
      setCallbackUrl(null);
    }
  };

  const handlePaymentSuccess = (result: any) => {
    onPaymentSuccess(result);
  };

  const handlePaymentError = (error: string) => {
    onPaymentError(error);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plan Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg">{selectedPlan.name}</h3>
            <p className="text-2xl font-bold text-green-600">
              {selectedPlan.price} {selectedPlan.currency}
              <span className="text-sm font-normal text-gray-600">/{selectedPlan.duration}</span>
            </p>
            <ul className="mt-2 text-sm text-gray-600">
              {selectedPlan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Select Payment Method</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={paymentMethod === 'MADA' ? 'default' : 'outline'}
                onClick={() => {
                  setPaymentMethod('MADA');
                  // Reset checkout if already created with different payment method
                  if (checkoutId) {
                    setCheckoutId(null);
                    setIntegrity(null);
                    setCallbackUrl(null);
                    setError(null);
                  }
                }}
                className="flex items-center justify-center gap-2 h-12"
                disabled={isLoading}
                data-testid="button-payment-mada"
              >
                <Shield className="h-5 w-5" />
                <span className="font-semibold">MADA</span>
              </Button>
              <Button
                type="button"
                variant={paymentMethod === 'VISA_MASTER' ? 'default' : 'outline'}
                onClick={() => {
                  setPaymentMethod('VISA_MASTER');
                  // Reset checkout if already created with different payment method
                  if (checkoutId) {
                    setCheckoutId(null);
                    setIntegrity(null);
                    setCallbackUrl(null);
                    setError(null);
                  }
                }}
                className="flex items-center justify-center gap-2 h-12"
                disabled={isLoading}
                data-testid="button-payment-visa-master"
              >
                <CreditCard className="h-5 w-5" />
                <span className="font-semibold">VISA / MASTER</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Please select your card type before proceeding to payment
            </p>
          </div>

          {/* Customer Details Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={customerDetails.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="givenName">First Name *</Label>
              <Input
                id="givenName"
                type="text"
                value={customerDetails.givenName}
                onChange={(e) => handleInputChange('givenName', e.target.value)}
                placeholder="First Name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="surname">Last Name *</Label>
              <Input
                id="surname"
                type="text"
                value={customerDetails.surname}
                onChange={(e) => handleInputChange('surname', e.target.value)}
                placeholder="Last Name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                type="text"
                value={customerDetails.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
                placeholder="Street Address"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                type="text"
                value={customerDetails.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="City"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                type="text"
                value={customerDetails.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="State"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postcode">Postcode *</Label>
              <Input
                id="postcode"
                type="text"
                value={customerDetails.postcode}
                onChange={(e) => handleInputChange('postcode', e.target.value)}
                placeholder="Postcode"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                type="text"
                value={customerDetails.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="SA"
                required
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="border-red-500">
              <AlertDescription className="space-y-2">
                <p className="font-medium">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setError(null);
                    setCheckoutId(null);
                    setIntegrity(null);
                    setCallbackUrl(null);
                  }}
                  className="mt-2"
                  data-testid="button-try-again"
                >
                  Try Again
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Proceed to Payment Button */}
          {!checkoutId && (
            <Button
              onClick={handleCreateCheckout}
              disabled={isLoading || !customerDetails.email || !customerDetails.givenName || !customerDetails.surname}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${selectedPlan.price} ${selectedPlan.currency}`
              )}
            </Button>
          )}

          {/* HyperPay Payment Widget */}
          {checkoutId && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Complete Your Payment</h3>
                <p className="text-sm text-gray-600">Secure payment powered by HyperPay</p>
              </div>

              {/* HyperPay Payment Form - Single form for all payment methods */}
              {/* The form action is the shopperResultUrl - HyperPay redirects here after payment */}
              <form 
                action={callbackUrl || '/api/payment-callback'}
                className="paymentWidgets" 
                data-brands="MADA VISA MASTER"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
