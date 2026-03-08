import { useState, useEffect } from "react";
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
import { Eye, EyeOff, Heart, BookOpen, GraduationCap, ArrowLeft, Users, Clock } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/language-context";

import logoImage from "@assets/quranesh logo (1)_1762444380395.png";
import { countryCodes } from "@/data/country-codes";

type UserType = "sponsor" | "self_funded" | "sponsored_student" | null;

const SignUp = () => {
  const [step, setStep] = useState<"choose" | "form">("choose");
  const [userType, setUserType] = useState<UserType>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [, setLocation] = useLocation();
  const { signIn } = useAuth();
  const { t, language, dir } = useLanguage();
  const isArabic = language === "ar";
  const [scholarshipInfo, setScholarshipInfo] = useState<{ availableSeats: number; waitingStudents: number } | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+966:SA",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    memorizationLevel: "",
    nativeLanguage: "",
    learningGoal: "",
  });

  useEffect(() => {
    fetch("/api/scholarship/availability")
      .then(r => r.json())
      .then(data => setScholarshipInfo(data))
      .catch(() => {});
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setStep("form");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordsDoNotMatch'));
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError(t('passwordTooShort'));
      setLoading(false);
      return;
    }

    try {
      const dialCode = formData.countryCode.split(':')[0];
      const signupData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        countryCode: dialCode,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        memorizationLevel: formData.memorizationLevel,
        nativeLanguage: formData.nativeLanguage,
        learningGoal: formData.learningGoal,
        userType: userType || "self_funded",
      };

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token && data.user) {
          signIn(data.user, data.token);
        }

        let successMsg = t('accountCreatedSuccess');
        let redirectPath = "/pricing";

        if (data.scholarshipStatus === "waiting") {
          successMsg = t('signupWaitingListSuccess');
          redirectPath = "/scholarship-status";
        } else if (data.scholarshipStatus === "active") {
          successMsg = t('signupScholarshipSuccess');
          redirectPath = "/exercises";
        } else if (userType === "sponsor") {
          successMsg = t('signupSponsorCreated');
          redirectPath = "/pricing?role=sponsor";
        } else {
          successMsg = t('signupStudentCreated');
          redirectPath = "/pricing";
        }

        setSuccess(successMsg);

        setTimeout(() => {
          setLocation(redirectPath);
        }, 1500);
      } else {
        setError(data.message || (t('accountCreationFailed')));
      }
    } catch (err) {
      setError(t('networkError'));
    } finally {
      setLoading(false);
    }
  };

  const userTypeCards = [
    {
      type: "sponsor" as UserType,
      icon: Heart,
      title: t('signupSponsorTitle'),
      description: t('signupSponsorDesc'),
      detail: t('signupSponsorNote'),
      color: "border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950",
      iconColor: "text-amber-600",
      bgGradient: "from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20",
    },
    {
      type: "self_funded" as UserType,
      icon: BookOpen,
      title: t('signupSelfFundedTitle'),
      description: t('signupSelfFundedDesc'),
      detail: t('signupSelfFundedNote'),
      color: "border-primary hover:bg-primary/5",
      iconColor: "text-primary",
      bgGradient: "from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5",
    },
    {
      type: "sponsored_student" as UserType,
      icon: GraduationCap,
      title: t('signupSponsoredStudentTitle'),
      description: t('signupSponsoredStudentDesc'),
      detail: scholarshipInfo && scholarshipInfo.availableSeats > 0
        ? `${scholarshipInfo.availableSeats} ${t('signupSeatsAvailable')}`
        : t('signupWaitingListNote'),
      color: "border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950",
      iconColor: "text-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 flex items-center justify-center p-6" dir={dir}>
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-center mb-8">
          <Link href="/" className="cursor-pointer">
            <img
              src={logoImage}
              alt="Quranesh Logo"
              className="h-24 w-auto object-contain hover:opacity-90 transition-opacity"
            />
          </Link>
        </div>

        {step === "choose" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {t('signupCreateAccount')}
              </h1>
              <p className="text-muted-foreground text-lg">
                {t('signupChoosePath')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {userTypeCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Card
                    key={card.type}
                    className={`cursor-pointer border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${card.color}`}
                    onClick={() => handleUserTypeSelect(card.type)}
                  >
                    <CardHeader className={`text-center pb-3 pt-6 bg-gradient-to-b ${card.bgGradient} rounded-t-lg`}>
                      <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center ${card.iconColor}`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <CardTitle className="text-lg font-bold">{card.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 text-center space-y-3">
                      <p className="text-sm text-foreground leading-relaxed">{card.description}</p>
                      <div className="flex items-center gap-2 justify-center">
                        {card.type === "sponsored_student" && scholarshipInfo ? (
                          scholarshipInfo.availableSeats > 0 ? (
                            <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full">
                              <Users className="w-3 h-3" />
                              {card.detail}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full">
                              <Clock className="w-3 h-3" />
                              {card.detail}
                            </span>
                          )
                        ) : (
                          <p className="text-xs text-muted-foreground">{card.detail}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center text-sm text-muted-foreground mt-6">
              {t('alreadyHaveAccount')}{" "}
              <Link href="/signin" className="text-primary hover:underline font-medium">
                {t('signIn')}
              </Link>
            </div>
          </div>
        )}

        {step === "form" && (
          <Card className="border-2 shadow-lg max-w-lg mx-auto">
            <CardHeader className="text-center">
              <div className="flex items-center justify-between mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setStep("choose"); setError(""); setSuccess(""); }}
                  className="gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('signupBack')}
                </Button>
                <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                  {userTypeCards.find(c => c.type === userType)?.title}
                </span>
              </div>
              <CardTitle className="text-2xl font-bold">{t('signUp')}</CardTitle>
              <CardDescription>
                {t('signupCompleteData')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t('firstName')}</Label>
                    <Input
                      id="firstName"
                      placeholder={t('firstName')}
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t('lastName')}</Label>
                    <Input
                      id="lastName"
                      placeholder={t('lastName')}
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">{t('phoneNumber')}</Label>
                  <div className="flex gap-2" dir="ltr">
                    <Select
                      value={formData.countryCode}
                      onValueChange={(value) => handleInputChange("countryCode", value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="+966" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {countryCodes.map((country) => (
                          <SelectItem key={country.code} value={`${country.dialCode}:${country.code}`}>
                            <span className="flex items-center gap-2">
                              <span>{country.flag}</span>
                              <span>{country.dialCode}</span>
                              <span className="text-muted-foreground text-xs">{country.name}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="5XX XXX XXXX"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      required
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t('password')}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t('createPassword')}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {userType !== "sponsor" && (
                  <>
                    <div className="space-y-2">
                      <Label>{t('memorizationLevel')}</Label>
                      <Select
                        value={formData.memorizationLevel}
                        onValueChange={(value) => handleInputChange("memorizationLevel", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectMemorizationLevel')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="para-1-3">{t('para1to3')}</SelectItem>
                          <SelectItem value="para-4-10">{t('para4to10')}</SelectItem>
                          <SelectItem value="para-11-20">{t('para11to20')}</SelectItem>
                          <SelectItem value="para-21-30">{t('para21to30')}</SelectItem>
                          <SelectItem value="complete">{t('completeQuran')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>{t('nativeLanguage')}</Label>
                      <Select
                        value={formData.nativeLanguage}
                        onValueChange={(value) => handleInputChange("nativeLanguage", value)}
                      >
                        <SelectTrigger>
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
                        onValueChange={(value) => handleInputChange("learningGoal", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectLearningGoal')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily-conversation">{t('dailyConversation')}</SelectItem>
                          <SelectItem value="understand-quran">{t('understandQuran')}</SelectItem>
                          <SelectItem value="islamic-studies">{t('islamicStudies')}</SelectItem>
                          <SelectItem value="teaching">{t('teachingDawah')}</SelectItem>
                          <SelectItem value="cultural-connection">{t('culturalConnection')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {error && (
                  <div className="text-red-600 text-sm text-center p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="text-green-600 text-sm text-center p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md">
                    {success}
                  </div>
                )}

                <div className="flex items-start gap-2">
                  <input type="checkbox" className="rounded border-border mt-1" required />
                  <span className="text-sm text-muted-foreground">
                    {t('agreeToTerms')}{" "}
                    <Link href="/terms" className="text-primary hover:underline">{t('termsOfService')}</Link>{" "}
                    {t('and')}{" "}
                    <Link href="/privacy" className="text-primary hover:underline">{t('privacyPolicy')}</Link>
                  </span>
                </div>

                <Button type="submit" variant="default" className="w-full" disabled={loading}>
                  {loading ? `${t('createAccount')}...` : t('createAccount')}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                {t('alreadyHaveAccount')}{" "}
                <Link href="/signin" className="text-primary hover:underline font-medium">
                  {t('signIn')}
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SignUp;
