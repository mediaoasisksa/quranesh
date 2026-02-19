import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, CreditCard, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/hooks/use-auth';

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
  const { t } = useLanguage();
  const { user } = useAuth();
  
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
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: selectedPlan.id,
          paymentMethod: paymentMethod,
          customerDetails,
          userId: user?.id || '',
        }),
      });

      const data = await response.json();

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

      const script = document.createElement('script');
      script.src = `${data.widgetUrl}/v1/paymentWidgets.js?checkoutId=${data.checkoutId}`;
      
      // Add security attributes as per HyperPay documentation
      if (data.integrity) {
        script.integrity = data.integrity;
        script.crossOrigin = 'anonymous';
      }
      
      script.onload = () => {
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
            <Label className="text-base font-medium">{t('selectPaymentMethod')}</Label>
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
                <span className="font-semibold">{t('mada')}</span>
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
                <span className="font-semibold">{t('visaMaster')}</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('selectCardType')}
            </p>
          </div>

          {/* Customer Details Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')} *</Label>
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
              <Label htmlFor="givenName">{t('firstName')} *</Label>
              <Input
                id="givenName"
                type="text"
                value={customerDetails.givenName}
                onChange={(e) => handleInputChange('givenName', e.target.value)}
                placeholder={t('firstName')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="surname">{t('lastName')} *</Label>
              <Input
                id="surname"
                type="text"
                value={customerDetails.surname}
                onChange={(e) => handleInputChange('surname', e.target.value)}
                placeholder={t('lastName')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">{t('streetAddress')} *</Label>
              <Input
                id="street"
                type="text"
                value={customerDetails.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
                placeholder={t('streetAddress')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">{t('city')} *</Label>
              <Input
                id="city"
                type="text"
                value={customerDetails.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder={t('city')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">{t('state')} *</Label>
              <Input
                id="state"
                type="text"
                value={customerDetails.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder={t('state')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postcode">{t('postalCode')} *</Label>
              <Input
                id="postcode"
                type="text"
                value={customerDetails.postcode}
                onChange={(e) => handleInputChange('postcode', e.target.value)}
                placeholder={t('postalCode')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">{t('country')} *</Label>
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
                  {t('tryAgain')}
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
                  {t('processingPayment')}
                </>
              ) : (
                `${t('pay')} ${selectedPlan.price} ${selectedPlan.currency}`
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
