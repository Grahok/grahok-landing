import {
  IconBrandFacebook,
  IconBrandWhatsapp,
  IconMapPin,
} from "@tabler/icons-react";
import { Phone } from "lucide-react";

const CONTACT_INFO = {
  phone: import.meta.env.VITE_CONTACT_MOBILE_NUMBER!,
  facebook: import.meta.env.VITE_CONTACT_FACEBOOK_PAGE!,
  whatsapp: import.meta.env.VITE_CONTACT_WHATSAPP_NUMBER!,
  address: import.meta.env.VITE_CONTACT_ADDRESS!,
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 justify-between">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Grahok</h3>
            <p className="text-gray-400 max-w-md">
              Your trusted destination for quality products. We ensure the best
              shopping experience with fast delivery and excellent customer
              service.
            </p>
            {/* Address */}
            <p className="text-gray-400 max-w-md flex items-center gap-2">
              <IconMapPin className="w-5 h-5" />
              <span>{CONTACT_INFO.address}</span>
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <a
              className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
              href={`tel:${CONTACT_INFO.phone}`}
            >
              <Phone className="w-5 h-5" />
              {CONTACT_INFO.phone}
            </a>
            <a
              href={CONTACT_INFO.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
            >
              <IconBrandFacebook className="w-5 h-5" />
              <span>Facebook Page</span>
            </a>
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
            >
              <IconBrandWhatsapp className="w-5 h-5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Grahok. All rights reserved.
      </div>
    </footer>
  );
}
