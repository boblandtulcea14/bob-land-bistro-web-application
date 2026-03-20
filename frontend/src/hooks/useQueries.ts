import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import {
  PreOrder,
  Review,
  UserProfile,
  PreOrderStatus,
  ReviewStatus,
  MenuItem,
  MenuCategory,
  ContactInfo,
  LocationInfo,
  GalleryImage,
  SitePublicationStatus,
} from '../backend';
import { toast } from 'sonner';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profil salvat cu succes!');
    },
    onError: (error: Error) => {
      toast.error(`Eroare: ${error.message}`);
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// Site Publication Hooks
export function useGetSitePublicationStatus() {
  const { actor, isFetching } = useActor();

  return useQuery<SitePublicationStatus>({
    queryKey: ['sitePublicationStatus'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSitePublicationStatus();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePublishSite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.publishSite();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sitePublicationStatus'] });
      toast.success('Site-ul a fost publicat cu succes!', {
        description: `Adresa publică: ${data.publicUrl}`,
        duration: 8000,
      });
    },
    onError: (error: Error) => {
      toast.error(`Eroare la publicare: ${error.message}`);
    },
  });
}

// Domain Validation Hooks
export function useGetDomainValidationContent() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['domainValidationContent'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDomainValidationContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetDomainValidationContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setDomainValidationContent(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domainValidationContent'] });
      toast.success('Conținutul de validare a domeniului a fost actualizat cu succes!');
    },
    onError: (error: Error) => {
      toast.error(`Eroare: ${error.message}`);
    },
  });
}

export function useGetICPDomainAndValidationToken() {
  const { actor, isFetching } = useActor();

  return useQuery<{ icpDomain: string; validationToken: string }>({
    queryKey: ['icpDomainAndValidationToken'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getICPDomainAndValidationToken();
    },
    enabled: !!actor && !isFetching,
  });
}

// Menu Item Hooks
export function useGetMenuItems() {
  const { actor, isFetching } = useActor();

  return useQuery<MenuItem[]>({
    queryKey: ['menuItems'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMenuItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMenuItemsByCategory() {
  const { actor, isFetching } = useActor();

  return useQuery<MenuItem[]>({
    queryKey: ['menuItemsByCategory'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMenuItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (menuItem: MenuItem) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMenuItem(menuItem);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      queryClient.invalidateQueries({ queryKey: ['menuItemsByCategory'] });
      toast.success('Produs adăugat cu succes!');
    },
    onError: (error: Error) => {
      toast.error(`Eroare: ${error.message}`);
    },
  });
}

export function useUpdateMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, menuItem }: { id: bigint; menuItem: MenuItem }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMenuItem(id, menuItem);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      queryClient.invalidateQueries({ queryKey: ['menuItemsByCategory'] });
      toast.success('Produs actualizat cu succes!');
    },
    onError: (error: Error) => {
      toast.error(`Eroare: ${error.message}`);
    },
  });
}

export function useRemoveMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeMenuItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      queryClient.invalidateQueries({ queryKey: ['menuItemsByCategory'] });
      toast.success('Produs șters cu succes!');
    },
    onError: (error: Error) => {
      toast.error(`Eroare: ${error.message}`);
    },
  });
}

export function useAddDefaultClatiteWafflesMenuItems() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.addDefaultClatiteWafflesMenuItems();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      queryClient.invalidateQueries({ queryKey: ['menuItemsByCategory'] });
      toast.success('Produsele din categoria Clătite & Waffles au fost adăugate cu succes!');
    },
    onError: (error: Error) => {
      toast.error(`Eroare: ${error.message}`);
    },
  });
}

// Pre-Order Hooks
export function usePlaceDeliveryOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (deliveryOrder: PreOrder) => {
      if (!actor) throw new Error('Actor not available');
      return actor.placeDeliveryOrder(deliveryOrder);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preOrders'] });
      toast.success('Comandă plasată cu succes!', {
        description: 'Vei fi contactat în curând pentru confirmare.',
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      toast.error(`Eroare: ${error.message}`);
    },
  });
}

export function useGetPreOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<PreOrder[]>({
    queryKey: ['preOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPreOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdatePreOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: PreOrderStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePreOrderStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preOrders'] });
      toast.success('Status precomandă actualizat!');
    },
    onError: (error: Error) => {
      toast.error(`Eroare: ${error.message}`);
    },
  });
}

// Review Hooks
export function useSubmitReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: Review) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitReview(review);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Recenzie trimisă cu succes! Va fi moderată în curând.');
    },
    onError: (error: Error) => {
      toast.error(`Eroare: ${error.message}`);
    },
  });
}

export function useGetReviews() {
  const { actor, isFetching } = useActor();

  return useQuery<Review[]>({
    queryKey: ['reviews'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReviews();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetApprovedReviews() {
  const { actor, isFetching } = useActor();

  return useQuery<Review[]>({
    queryKey: ['approvedReviews'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getApprovedReviews();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useModerateReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: ReviewStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.moderateReview(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['approvedReviews'] });
      toast.success('Recenzie moderată cu succes!');
    },
    onError: (error: Error) => {
      toast.error(`Eroare: ${error.message}`);
    },
  });
}

// Contact Info Hooks
export function useGetContactInfo() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactInfo>({
    queryKey: ['contactInfo'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getContactInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateContactInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contactInfo: ContactInfo) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateContactInfo(contactInfo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactInfo'] });
      toast.success('Informații de contact actualizate cu succes!');
    },
    onError: (error: Error) => {
      toast.error(`Eroare: ${error.message}`);
    },
  });
}

// Location Info Hooks
export function useGetLocationInfo() {
  const { actor, isFetching } = useActor();

  return useQuery<LocationInfo>({
    queryKey: ['locationInfo'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getLocationInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateLocationInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (locationInfo: LocationInfo) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateLocationInfo(locationInfo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locationInfo'] });
      toast.success('Informații despre locație actualizate cu succes!');
    },
    onError: (error: Error) => {
      toast.error(`Eroare: ${error.message}`);
    },
  });
}

// Gallery Hooks
export function useGetGalleryImages() {
  const { actor, isFetching } = useActor();

  return useQuery<GalleryImage[]>({
    queryKey: ['galleryImages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGalleryImages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCategoryGalleryImages() {
  const { actor, isFetching } = useActor();

  return useQuery<GalleryImage[]>({
    queryKey: ['categoryGalleryImages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCategoryGalleryImages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddGalleryImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (galleryImage: GalleryImage) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addGalleryImage(galleryImage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      queryClient.invalidateQueries({ queryKey: ['categoryGalleryImages'] });
      toast.success('Imagine adăugată în galerie cu succes!');
    },
    onError: (error: Error) => {
      toast.error(`Eroare: ${error.message}`);
    },
  });
}

export function useUpdateGalleryImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, galleryImage }: { id: bigint; galleryImage: GalleryImage }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateGalleryImage(id, galleryImage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      queryClient.invalidateQueries({ queryKey: ['categoryGalleryImages'] });
      toast.success('Imagine actualizată cu succes!');
    },
    onError: (error: Error) => {
      toast.error(`Eroare: ${error.message}`);
    },
  });
}

export function useRemoveGalleryImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeGalleryImage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      queryClient.invalidateQueries({ queryKey: ['categoryGalleryImages'] });
      toast.success('Imagine ștearsă cu succes!');
    },
    onError: (error: Error) => {
      toast.error(`Eroare: ${error.message}`);
    },
  });
}

export function useAddDefaultCategoryGalleryImages() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.addDefaultCategoryGalleryImages();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      queryClient.invalidateQueries({ queryKey: ['categoryGalleryImages'] });
      toast.success('Imaginile de categorie au fost adăugate cu succes!');
    },
    onError: (error: Error) => {
      toast.error(`Eroare: ${error.message}`);
    },
  });
}
