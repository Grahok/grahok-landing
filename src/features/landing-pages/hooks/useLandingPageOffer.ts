import { getActiveOfferForLandingPageServer } from "@/features/offers/actions/server/getActiveOfferForLandingPageServer";
import { useLandingPage } from "../contexts/LandingPageContext";
import { useQuery } from "@tanstack/react-query";

export function useLandingPageOffer() {
  const { landingPage } = useLandingPage();
  
  const { data: offer } = useQuery({
    queryKey: ["landingPageOffer", landingPage.id],
    queryFn: () =>
      getActiveOfferForLandingPageServer({
        data: landingPage.id,
      }),
    enabled: !!landingPage.id,
  });

  const isThresholdMet = (subtotal: number) => {
    if (!offer || offer.type !== "FREE_SHIPPING" || !offer.threshold) {
      return false;
    }
    return subtotal >= offer.threshold;
  };

  return {
    offer,
    isThresholdMet,
  };
}
