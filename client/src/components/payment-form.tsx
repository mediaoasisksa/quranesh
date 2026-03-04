import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, CreditCard, Info } from 'lucide-react';
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
  
  const [paymentMethod, setPaymentMethod] = useState<'mada' | 'visa_master'>('mada');

  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    email: '',
    givenName: '',
    surname: '',
    street: '',
    city: '',
    state: '',
    country: '',
    postcode: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [integrity, setIntegrity] = useState<string | null>(null);
  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Restore saved billing address and pre-fill registered email on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('quranesh_billing');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCustomerDetails(prev => ({ ...prev, ...parsed, email: user?.email || '' }));
      } else {
        setCustomerDetails(prev => ({ ...prev, email: user?.email || '' }));
      }
    } catch {
      setCustomerDetails(prev => ({ ...prev, email: user?.email || '' }));
    }
  }, [user]);

  // Configure HyperPay widget options based on selected payment method
  useEffect(() => {
    window.wpwlOptions = {
      paymentTarget: "_top",
      brandOrder: paymentMethod === 'mada' ? ["MADA"] : ["VISA", "MASTER"]
    };
  }, [paymentMethod]);

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
          customerDetails,
          userId: user?.id || '',
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || 'Failed to create checkout';
        throw new Error(errorMessage);
      }

      setCheckoutId(data.checkoutId);
      setIntegrity(data.integrity);
      setCallbackUrl(data.callbackUrl);

      // Save billing details (not email) for next time
      try {
        const { email: _e, ...billingToSave } = customerDetails;
        localStorage.setItem('quranesh_billing', JSON.stringify(billingToSave));
      } catch { /* ignore storage errors */ }

      const script = document.createElement('script');
      script.src = `${data.widgetUrl}/v1/paymentWidgets.js?checkoutId=${data.checkoutId}`;
      
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
            <Label>طريقة الدفع / Payment Method</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={!!checkoutId}
                onClick={() => setPaymentMethod('mada')}
                className={`flex flex-col items-center justify-center gap-1 p-4 rounded-lg border-2 transition-all
                  ${paymentMethod === 'mada'
                    ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary ring-offset-1'
                    : 'border-input bg-background text-muted-foreground hover:border-primary/50'}
                  ${checkoutId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="text-xl font-bold" style={{ fontFamily: 'Amiri, serif' }}>مدى</span>
                <span className="text-xs font-semibold mt-0.5">بطاقات البنوك السعودية</span>
                <span className="text-xs text-muted-foreground">Saudi Bank Cards (MADA)</span>
              </button>
              <button
                type="button"
                disabled={!!checkoutId}
                onClick={() => setPaymentMethod('visa_master')}
                className={`flex flex-col items-center justify-center gap-1 p-4 rounded-lg border-2 transition-all
                  ${paymentMethod === 'visa_master'
                    ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary ring-offset-1'
                    : 'border-input bg-background text-muted-foreground hover:border-primary/50'}
                  ${checkoutId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <CreditCard className="h-6 w-6" />
                <span className="text-xs font-semibold mt-0.5">بطاقات دولية</span>
                <span className="text-xs text-muted-foreground">International Cards (Visa / Mastercard)</span>
              </button>
            </div>

            {/* Guidance callout */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-amber-800">
                <Info className="h-3.5 w-3.5 shrink-0" />
                <span>كيف أعرف نوع بطاقتي؟</span>
              </div>
              <p className="text-amber-800 leading-relaxed" dir="rtl">
                معظم بطاقات البنوك السعودية (الراجحي، الأهلي، الرياض...) هي بطاقات <strong>مدى</strong> — حتى لو كانت عليها شعار فيزا. ابحث عن شعار <strong>مدى</strong> على بطاقتك.
              </p>
              <p className="text-amber-700 leading-relaxed">
                Most Saudi bank cards (Al Rajhi, NCB, Riyad, SNB...) are <strong>MADA</strong> cards — even if they display a Visa logo. Look for the <strong>مدى</strong> logo on your card.
              </p>
            </div>

            {checkoutId && (
              <p className="text-xs text-muted-foreground">Payment method locked for this session.</p>
            )}
          </div>

          {/* Customer Details Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                value={customerDetails.email}
                readOnly
                className="bg-muted cursor-not-allowed opacity-80"
              />
              <p className="text-xs text-muted-foreground">Using your registered email</p>
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
              <select
                id="country"
                value={customerDetails.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="" disabled>Select Country</option>
                <option value="SA">Saudi Arabia</option>
                <option value="AE">United Arab Emirates</option>
                <option value="KW">Kuwait</option>
                <option value="QA">Qatar</option>
                <option value="BH">Bahrain</option>
                <option value="OM">Oman</option>
                <option value="EG">Egypt</option>
                <option value="JO">Jordan</option>
                <option value="LB">Lebanon</option>
                <option value="IQ">Iraq</option>
                <option value="TR">Turkey</option>
                <option value="PK">Pakistan</option>
                <option value="IN">India</option>
                <option value="ID">Indonesia</option>
                <option value="MY">Malaysia</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
              </select>
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

              <form 
                action={callbackUrl || '/api/payment-callback'}
                className="paymentWidgets" 
                data-brands={paymentMethod === 'mada' ? 'MADA' : 'VISA MASTER'}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
