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

  const [paymentMethod, setPaymentMethod] = useState<'MADA' | 'VISA_MASTER'>('MADA');
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Configure HyperPay widget options
  useEffect(() => {
    window.wpwlOptions = {
      paymentTarget: "_top",
      brandOrder: ["MADA", "VISA", "MASTER"],
      shopperResultUrl: "http://localhost:5000/payment-success"
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
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        throw new Error(data.message || 'Failed to create checkout');
      }

      setCheckoutId(data.checkoutId);

      // Load HyperPay widget script
      console.log('Loading HyperPay widget with checkoutId:', data.checkoutId);
      const script = document.createElement('script');
      script.src = `https://eu-test.oppwa.com/v1/paymentWidgets.js?checkoutId=${data.checkoutId}`;
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
            <Label className="text-base font-medium">Payment Method</Label>
            <div className="flex gap-4">
              <Button
                variant={paymentMethod === 'MADA' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('MADA')}
                className="flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                MADA
              </Button>
              <Button
                variant={paymentMethod === 'VISA_MASTER' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('VISA_MASTER')}
                className="flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                VISA/MASTER
              </Button>
            </div>
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
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
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
              <form 
                action="/payment-success"
                className="paymentWidgets" 
                data-brands="MADA VISA MASTER"
                onSubmit={(e) => {
                  e.preventDefault();
                  // Payment form submission handled by HyperPay widget
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
