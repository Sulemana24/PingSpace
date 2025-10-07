import {
  Shield,
  Star,
  Clock,
  MapPin,
  Globe,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Users,
  Award,
  CheckCircle,
} from "lucide-react";
import { BusinessProfile, VerificationLevel } from "@/stores/businessStore";

interface BusinessProfileCardProps {
  profile: BusinessProfile;
  variant?: "full" | "compact" | "minimal";
  showActions?: boolean;
  onContact?: () => void;
  onBookAppointment?: () => void;
  onRequestPayment?: () => void;
}

export default function BusinessProfileCard({
  profile,
  variant = "full",
  showActions = true,
  onContact,
  onBookAppointment,
  onRequestPayment,
}: BusinessProfileCardProps) {
  const getVerificationBadge = (
    level: VerificationLevel,
    isVerified: boolean
  ) => {
    if (!isVerified) return null;

    const badges = {
      basic: { color: "bg-blue-500", icon: CheckCircle, label: "Verified" },
      premium: { color: "bg-purple-500", icon: Shield, label: "Premium" },
      enterprise: { color: "bg-gold-500", icon: Award, label: "Enterprise" },
    };

    const badge = badges[level];
    const Icon = badge.icon;

    return (
      <div
        className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium text-white ${badge.color}`}
      >
        <Icon className="w-3 h-3" />
        <span>{badge.label}</span>
      </div>
    );
  };

  const getCurrentStatus = () => {
    const now = new Date();
    const currentDay =
      now.toLocaleString().slice(0, 3) + now.toLocaleString().slice(3);
    const currentTime = now.toTimeString().slice(0, 5);

    const todayHours = profile.businessHours.find(
      (h) => h.day === (currentDay as any)
    );

    if (!todayHours || !todayHours.isOpen) {
      return { isOpen: false, label: "Closed", color: "text-red-500" };
    }

    if (todayHours.openTime && todayHours.closeTime) {
      if (
        currentTime >= todayHours.openTime &&
        currentTime <= todayHours.closeTime
      ) {
        return { isOpen: true, label: "Open", color: "text-green-500" };
      }
    }

    return { isOpen: false, label: "Closed", color: "text-red-500" };
  };

  const status = getCurrentStatus();

  if (variant === "minimal") {
    return (
      <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <img
          src={
            profile.logo ||
            `https://ui-avatars.com/api/?name=${profile.businessName}&background=FF1744&color=fff`
          }
          alt={profile.businessName}
          className="w-10 h-10 rounded-lg"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {profile.businessName}
            </h3>
            {getVerificationBadge(
              profile.verificationLevel,
              profile.isVerified
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {profile.description}
          </p>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start space-x-3">
          <img
            src={
              profile.logo ||
              `https://ui-avatars.com/api/?name=${profile.businessName}&background=FF1744&color=fff`
            }
            alt={profile.businessName}
            className="w-12 h-12 rounded-lg"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {profile.businessName}
              </h3>
              {getVerificationBadge(
                profile.verificationLevel,
                profile.isVerified
              )}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {profile.description}
            </p>

            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-400" />
                <span>{profile.stats.averageRating.toFixed(1)}</span>
                <span>({profile.stats.totalReviews})</span>
              </div>
              <div className={`flex items-center space-x-1 ${status.color}`}>
                <Clock className="w-3 h-3" />
                <span>{status.label}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Cover Image */}
      {profile.coverImage && (
        <div className="h-32 bg-gradient-to-r from-primary to-primary/80 relative">
          <img
            src={profile.coverImage}
            alt={`${profile.businessName} cover`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start space-x-4 mb-4">
          <img
            src={
              profile.logo ||
              `https://ui-avatars.com/api/?name=${profile.businessName}&background=FF1744&color=fff`
            }
            alt={profile.businessName}
            className="w-16 h-16 rounded-lg border-4 border-white dark:border-gray-800 shadow-lg"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {profile.businessName}
              </h2>
              {getVerificationBadge(
                profile.verificationLevel,
                profile.isVerified
              )}
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {profile.description}
            </p>

            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="font-medium">
                  {profile.stats.averageRating.toFixed(1)}
                </span>
                <span className="text-gray-500">
                  ({profile.stats.totalReviews} reviews)
                </span>
              </div>
              <div className={`flex items-center space-x-1 ${status.color}`}>
                <Clock className="w-4 h-4" />
                <span className="font-medium">{status.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm">
          {profile.website && (
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Globe className="w-4 h-4" />
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
              >
                {profile.website}
              </a>
            </div>
          )}

          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <Mail className="w-4 h-4" />
            <span>{profile.email}</span>
          </div>

          {profile.phone && (
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Phone className="w-4 h-4" />
              <span>{profile.phone}</span>
            </div>
          )}

          {profile.address && (
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>
                {profile.address.city}, {profile.address.state}
              </span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {profile.stats.totalCustomers.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Customers
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {profile.stats.totalAppointments}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Appointments
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {profile.stats.responseTime}m
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Response
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex space-x-2">
            <button
              onClick={onContact}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Contact</span>
            </button>

            {profile.features.appointmentBooking && (
              <button
                onClick={onBookAppointment}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Book</span>
              </button>
            )}

            {profile.features.paymentRequests && (
              <button
                onClick={onRequestPayment}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
