import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/language-context";
import LanguageToggle from "@/components/language-toggle";
import logoImage from "@assets/quranesh logo (1)_1762444380395.png";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [, setLocation] = useLocation();
  const { signIn } = useAuth();
  const { t, dir } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    memorizationLevel: "",
    nativeLanguage: "",
    learningGoal: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordsDoNotMatch'));
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      setError(t('passwordTooShort'));
      setLoading(false);
      return;
    }

    try {
      const signupData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        memorizationLevel: formData.memorizationLevel,
        nativeLanguage: formData.nativeLanguage,
        learningGoal: formData.learningGoal,
      };

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(t('accountCreatedSuccess'));
        setTimeout(() => {
          setLocation("/signin");
        }, 2000);
      } else {
        setError(data.message || t('accountCreationFailed'));
      }
    } catch (err) {
      setError(t('networkError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 flex items-center justify-center p-6" dir={dir}>
      {/* Language Toggle - Top Right Corner */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageToggle />
      </div>

      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <Link href="/" className="cursor-pointer">
            <img 
              src={logoImage} 
              alt="Quranesh Logo" 
              className="h-20 w-auto object-contain hover:opacity-90 transition-opacity"
            />
          </Link>
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{t('signUp')}</CardTitle>
            <CardDescription>
              {t('createNewAccount')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('firstName')}</Label>
                  <Input
                    id="firstName"
                    placeholder={t('firstName')}
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    required
                    className="transition-all duration-200 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('lastName')}</Label>
                  <Input
                    id="lastName"
                    placeholder={t('lastName')}
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    required
                    className="transition-all duration-200 focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('email')}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="transition-all duration-200 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t('createPassword')}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    required
                    className="pr-10 transition-all duration-200 focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t('confirmPasswordPlaceholder')}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    required
                    className="pr-10 transition-all duration-200 focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('memorizationLevel')}</Label>
                <Select
                  value={formData.memorizationLevel}
                  onValueChange={(value) =>
                    handleInputChange("memorizationLevel", value)
                  }
                >
                  <SelectTrigger className="transition-all duration-200 focus:border-primary">
                    <SelectValue placeholder={t('selectMemorizationLevel')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="para-1-3">{t('para1to3')}</SelectItem>
                    <SelectItem value="para-4-10">{t('para4to10')}</SelectItem>
                    <SelectItem value="para-11-20">{t('para11to20')}</SelectItem>
                    <SelectItem value="para-21-30">{t('para21to30')}</SelectItem>
                    <SelectItem value="complete">
                      {t('completeQuran')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('nativeLanguage')}</Label>
                <Select
                  value={formData.nativeLanguage}
                  onValueChange={(value) =>
                    handleInputChange("nativeLanguage", value)
                  }
                >
                  <SelectTrigger className="transition-all duration-200 focus:border-primary">
                    <SelectValue placeholder={t('selectNativeLanguage')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">{t('english')}</SelectItem>
                    <SelectItem value="urdu">{t('urdu')}</SelectItem>
                    <SelectItem value="hindi">{t('hindi')}</SelectItem>
                    <SelectItem value="bengali">{t('bengali')}</SelectItem>
                    <SelectItem value="indonesian">{t('indonesian')}</SelectItem>
                    <SelectItem value="malay">{t('malay')}</SelectItem>
                    <SelectItem value="turkish">{t('turkish')}</SelectItem>
                    <SelectItem value="persian">{t('persian')}</SelectItem>
                    <SelectItem value="other">{t('other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('learningGoal')}</Label>
                <Select
                  value={formData.learningGoal}
                  onValueChange={(value) =>
                    handleInputChange("learningGoal", value)
                  }
                >
                  <SelectTrigger className="transition-all duration-200 focus:border-primary">
                    <SelectValue placeholder={t('selectLearningGoal')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily-conversation">
                      {t('dailyConversation')}
                    </SelectItem>
                    <SelectItem value="understand-quran">
                      {t('understandQuran')}
                    </SelectItem>
                    <SelectItem value="islamic-studies">
                      {t('islamicStudies')}
                    </SelectItem>
                    <SelectItem value="teaching">{t('teachingDawah')}</SelectItem>
                    <SelectItem value="cultural-connection">
                      {t('culturalConnection')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center p-3 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-green-600 text-sm text-center p-3 bg-green-50 border border-green-200 rounded-md">
                  {success}
                </div>
              )}

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="rounded border-border mt-1"
                  required
                />
                <span className="text-sm text-muted-foreground">
                  {t('agreeToTerms')}{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    {t('termsOfService')}
                  </Link>{" "}
                  {t('and')}{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                  >
                    {t('privacyPolicy')}
                  </Link>
                </span>
              </div>

              <Button
                type="submit"
                variant="default"
                className="w-full"
                disabled={loading}
              >
                {loading ? `${t('createAccount')}...` : t('createAccount')}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    {t('orContinueWith')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button" className="w-full">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {t('alreadyHaveAccount')}{" "}
              <Link
                href="/signin"
                className="text-primary hover:underline font-medium"
              >
                {t('signIn')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
