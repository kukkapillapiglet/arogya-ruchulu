import { useQuery } from "@tanstack/react-query";
import type {
  CustomerOrder,
  GalleryImage,
  MenuItem,
  RestaurantInfo,
} from "../backend.d";
import { useActor } from "./useActor";

export function useRestaurantInfo() {
  const { actor, isFetching } = useActor();
  return useQuery<RestaurantInfo>({
    queryKey: ["restaurantInfo"],
    queryFn: async () => {
      if (!actor) {
        return {
          name: "Arogya Ruchulu",
          whatsapp: "919999999999",
          address: "123 Jubilee Hills, Hyderabad, Telangana 500033",
          phone: "+91 99999 99999",
          openingHours: "Mon–Sun: 7:00 AM – 10:00 PM",
        };
      }
      return actor.getRestaurantInfo();
    },
    enabled: !isFetching,
  });
}

export function useMenuItems() {
  const { actor, isFetching } = useActor();
  return useQuery<MenuItem[]>({
    queryKey: ["menuItems"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMenuItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGalleryImages() {
  const { actor, isFetching } = useActor();
  return useQuery<GalleryImage[]>({
    queryKey: ["galleryImages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGalleryImages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin(enabled = false) {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: enabled && !!actor && !isFetching,
    retry: false,
  });
}

export function useAdminOrders(enabled = false) {
  const { actor, isFetching } = useActor();
  return useQuery<CustomerOrder[]>({
    queryKey: ["adminOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAdminOrders();
    },
    enabled: enabled && !!actor && !isFetching,
  });
}
