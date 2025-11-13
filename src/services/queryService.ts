import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { apiService, Response, Pageable, VehicleCategoryDTO, CountryMasterDTO, StateMasterDTO, CityMasterDTO, BasePricingDTO, SurgePricingDTO, PromotionsDTO, ReferralCampaignDTO, AppUserVO, UserCreateDTO, UserUpdateDTO, RoleDTO, RoleCreateDTO, RoleUpdateDTO, PermissionDTO, PermissionCreateDTO, PermissionUpdateDTO, RiderVO } from './apiService';
import { toast } from 'sonner';

// Generic query options
const defaultQueryOptions = {
  retry: 3,
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
};

// Generic mutation success/error handlers
const handleMutationSuccess = (message: string) => {
  toast.success(message);
};

const handleMutationError = (error: any) => {
  const errorMessage = error?.message || 'An error occurred';
  toast.error(errorMessage);
};

// Vehicle Category Queries
export const useVehicleCategories = (pageable?: Pageable, search?: string, options?: UseQueryOptions<Response<VehicleCategoryDTO[]>>) => {
  return useQuery({
    queryKey: ['vehicle-categories', pageable, search],
    queryFn: () => apiService.getVehicleCategories(pageable, search),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useActiveVehicleCategories = (pageable?: Pageable, search?: string, options?: UseQueryOptions<Response<VehicleCategoryDTO[]>>) => {
  return useQuery({
    queryKey: ['active-vehicle-categories', pageable, search],
    queryFn: () => apiService.getActiveVehicleCategories(pageable, search),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useVehicleCategoriesList = (options?: UseQueryOptions<Response<VehicleCategoryDTO[]>>) => {
  return useQuery({
    queryKey: ['vehicle-categories-list'],
    queryFn: () => apiService.getVehicleCategoriesList(),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useActiveVehicleCategoriesList = (options?: UseQueryOptions<Response<VehicleCategoryDTO[]>>) => {
  return useQuery({
    queryKey: ['active-vehicle-categories-list'],
    queryFn: () => apiService.getActiveVehicleCategoriesList(),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useVehicleCategory = (id: number, options?: UseQueryOptions<Response<VehicleCategoryDTO>>) => {
  return useQuery({
    queryKey: ['vehicle-category', id],
    queryFn: () => apiService.getVehicleCategory(id),
    enabled: !!id,
    ...defaultQueryOptions,
    ...options,
  });
};

// Vehicle Category Mutations
export const useCreateVehicleCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VehicleCategoryDTO) => apiService.createVehicleCategory(data),
    onSuccess: () => {
      handleMutationSuccess('Vehicle category created successfully');
      queryClient.invalidateQueries({ queryKey: ['vehicle-categories'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle-categories-list'] });
      queryClient.invalidateQueries({ queryKey: ['active-vehicle-categories'] });
      queryClient.invalidateQueries({ queryKey: ['active-vehicle-categories-list'] });
    },
    onError: handleMutationError,
  });
};

export const useUpdateVehicleCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: VehicleCategoryDTO }) =>
      apiService.updateVehicleCategory(id, data),
    onSuccess: () => {
      handleMutationSuccess('Vehicle category updated successfully');
      queryClient.invalidateQueries({ queryKey: ['vehicle-categories'] });
      queryClient.invalidateQueries({ queryKey: ['active-vehicle-categories'] });
    },
    onError: handleMutationError,
  });
};

export const useDeleteVehicleCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiService.deleteVehicleCategory(id),
    onSuccess: () => {
      handleMutationSuccess('Vehicle category deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['vehicle-categories'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle-categories-list'] });
      queryClient.invalidateQueries({ queryKey: ['active-vehicle-categories'] });
      queryClient.invalidateQueries({ queryKey: ['active-vehicle-categories-list'] });
    },
    onError: handleMutationError,
  });
};

export const useToggleVehicleCategoryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiService.toggleVehicleCategoryStatus(id),
    onSuccess: () => {
      handleMutationSuccess('Vehicle category status toggled successfully');
      queryClient.invalidateQueries({ queryKey: ['vehicle-categories'] });
      queryClient.invalidateQueries({ queryKey: ['active-vehicle-categories'] });
    },
    onError: handleMutationError,
  });
};

// Country Queries
export const useCountries = (pageable?: Pageable, search?: string, options?: UseQueryOptions<Response<CountryMasterDTO[]>>) => {
  return useQuery({
    queryKey: ['countries', pageable, search],
    queryFn: () => apiService.getCountries(pageable, search),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useCountriesList = (options?: UseQueryOptions<Response<CountryMasterDTO[]>>) => {
  return useQuery({
    queryKey: ['countries-list'],
    queryFn: () => apiService.getCountriesList(),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useCountry = (id: number, options?: UseQueryOptions<Response<CountryMasterDTO>>) => {
  return useQuery({
    queryKey: ['country', id],
    queryFn: () => apiService.getCountry(id),
    enabled: !!id,
    ...defaultQueryOptions,
    ...options,
  });
};

// Country Mutations
export const useCreateCountry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CountryMasterDTO) => apiService.createCountry(data),
    onSuccess: () => {
      handleMutationSuccess('Country created successfully');
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      queryClient.invalidateQueries({ queryKey: ['countries-list'] });
    },
    onError: handleMutationError,
  });
};

export const useUpdateCountry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CountryMasterDTO }) =>
      apiService.updateCountry(id, data),
    onSuccess: () => {
      handleMutationSuccess('Country updated successfully');
      queryClient.invalidateQueries({ queryKey: ['countries'] });
    },
    onError: handleMutationError,
  });
};

export const useDeleteCountry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiService.deleteCountry(id),
    onSuccess: () => {
      handleMutationSuccess('Country deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      queryClient.invalidateQueries({ queryKey: ['countries-list'] });
    },
    onError: handleMutationError,
  });
};

// State Queries
export const useStates = (pageable?: Pageable, search?: string, options?: UseQueryOptions<Response<StateMasterDTO[]>>) => {
  return useQuery({
    queryKey: ['states', pageable, search],
    queryFn: () => apiService.getStates(pageable, search),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useStatesList = (options?: UseQueryOptions<Response<StateMasterDTO[]>>) => {
  return useQuery({
    queryKey: ['states-list'],
    queryFn: () => apiService.getStatesList(),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useState = (id: number, options?: UseQueryOptions<Response<StateMasterDTO>>) => {
  return useQuery({
    queryKey: ['state', id],
    queryFn: () => apiService.getState(id),
    enabled: !!id,
    ...defaultQueryOptions,
    ...options,
  });
};

// State Mutations
export const useCreateState = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StateMasterDTO) => apiService.createState(data),
    onSuccess: () => {
      handleMutationSuccess('State created successfully');
      queryClient.invalidateQueries({ queryKey: ['states'] });
      queryClient.invalidateQueries({ queryKey: ['states-list'] });
    },
    onError: handleMutationError,
  });
};

export const useUpdateState = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: StateMasterDTO }) =>
      apiService.updateState(id, data),
    onSuccess: () => {
      handleMutationSuccess('State updated successfully');
      queryClient.invalidateQueries({ queryKey: ['states'] });
    },
    onError: handleMutationError,
  });
};

export const useDeleteState = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiService.deleteState(id),
    onSuccess: () => {
      handleMutationSuccess('State deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['states'] });
      queryClient.invalidateQueries({ queryKey: ['states-list'] });
    },
    onError: handleMutationError,
  });
};

// City Queries
export const useCities = (pageable?: Pageable, search?: string, options?: UseQueryOptions<Response<CityMasterDTO[]>>) => {
  return useQuery({
    queryKey: ['cities', pageable, search],
    queryFn: () => apiService.getCities(pageable, search),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useCitiesList = (options?: UseQueryOptions<Response<CityMasterDTO[]>>) => {
  return useQuery({
    queryKey: ['cities-list'],
    queryFn: () => apiService.getCitiesList(),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useCity = (id: number, options?: UseQueryOptions<Response<CityMasterDTO>>) => {
  return useQuery({
    queryKey: ['city', id],
    queryFn: () => apiService.getCity(id),
    enabled: !!id,
    ...defaultQueryOptions,
    ...options,
  });
};

// City Mutations
export const useCreateCity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CityMasterDTO) => apiService.createCity(data),
    onSuccess: () => {
      handleMutationSuccess('City created successfully');
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      queryClient.invalidateQueries({ queryKey: ['cities-list'] });
    },
    onError: handleMutationError,
  });
};

export const useUpdateCity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CityMasterDTO }) =>
      apiService.updateCity(id, data),
    onSuccess: () => {
      handleMutationSuccess('City updated successfully');
      queryClient.invalidateQueries({ queryKey: ['cities'] });
    },
    onError: handleMutationError,
  });
};

export const useDeleteCity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiService.deleteCity(id),
    onSuccess: () => {
      handleMutationSuccess('City deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      queryClient.invalidateQueries({ queryKey: ['cities-list'] });
    },
    onError: handleMutationError,
  });
};

// Base Pricing Queries
export const useBasePricingList = (pageable?: Pageable, search?: string, options?: UseQueryOptions<Response<BasePricingDTO[]>>) => {
  return useQuery({
    queryKey: ['base-pricing', pageable, search],
    queryFn: () => apiService.getBasePricingList(pageable, search),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useActiveBasePricingList = (pageable?: Pageable, search?: string, options?: UseQueryOptions<Response<BasePricingDTO[]>>) => {
  return useQuery({
    queryKey: ['active-base-pricing', pageable, search],
    queryFn: () => apiService.getActiveBasePricingList(pageable, search),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useBasePricingListOnly = (options?: UseQueryOptions<Response<BasePricingDTO[]>>) => {
  return useQuery({
    queryKey: ['base-pricing-list'],
    queryFn: () => apiService.getBasePricingListOnly(),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useActiveBasePricingListOnly = (options?: UseQueryOptions<Response<BasePricingDTO[]>>) => {
  return useQuery({
    queryKey: ['active-base-pricing-list'],
    queryFn: () => apiService.getActiveBasePricingListOnly(),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useBasePricing = (id: number, options?: UseQueryOptions<Response<BasePricingDTO>>) => {
  return useQuery({
    queryKey: ['base-pricing', id],
    queryFn: () => apiService.getBasePricing(id),
    enabled: !!id,
    ...defaultQueryOptions,
    ...options,
  });
};

// Base Pricing Mutations
export const useCreateBasePricing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BasePricingDTO) => apiService.createBasePricing(data),
    onSuccess: () => {
      handleMutationSuccess('Base pricing created successfully');
      queryClient.invalidateQueries({ queryKey: ['base-pricing'] });
      queryClient.invalidateQueries({ queryKey: ['active-base-pricing'] });
      queryClient.invalidateQueries({ queryKey: ['base-pricing-list'] });
      queryClient.invalidateQueries({ queryKey: ['active-base-pricing-list'] });
    },
    onError: handleMutationError,
  });
};

export const useUpdateBasePricing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BasePricingDTO }) =>
      apiService.updateBasePricing(id, data),
    onSuccess: () => {
      handleMutationSuccess('Base pricing updated successfully');
      queryClient.invalidateQueries({ queryKey: ['base-pricing'] });
      queryClient.invalidateQueries({ queryKey: ['active-base-pricing'] });
    },
    onError: handleMutationError,
  });
};

export const useDeleteBasePricing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiService.deleteBasePricing(id),
    onSuccess: () => {
      handleMutationSuccess('Base pricing deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['base-pricing'] });
      queryClient.invalidateQueries({ queryKey: ['base-pricing-list'] });
      queryClient.invalidateQueries({ queryKey: ['active-base-pricing'] });
      queryClient.invalidateQueries({ queryKey: ['active-base-pricing-list'] });
    },
    onError: handleMutationError,
  });
};

export const useToggleBasePricingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiService.toggleBasePricingStatus(id),
    onSuccess: () => {
      handleMutationSuccess('Base pricing status toggled successfully');
      queryClient.invalidateQueries({ queryKey: ['base-pricing'] });
      queryClient.invalidateQueries({ queryKey: ['active-base-pricing'] });
    },
    onError: handleMutationError,
  });
};

// Surge Pricing Queries
export const useSurgePricingList = (pageable?: Pageable, search?: string, options?: UseQueryOptions<Response<SurgePricingDTO[]>>) => {
  return useQuery({
    queryKey: ['surge-pricing', pageable, search],
    queryFn: () => apiService.getSurgePricingList(pageable, search),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useActiveSurgePricingList = (pageable?: Pageable, search?: string, options?: UseQueryOptions<Response<SurgePricingDTO[]>>) => {
  return useQuery({
    queryKey: ['active-surge-pricing', pageable, search],
    queryFn: () => apiService.getActiveSurgePricingList(pageable, search),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useSurgePricingListOnly = (options?: UseQueryOptions<Response<SurgePricingDTO[]>>) => {
  return useQuery({
    queryKey: ['surge-pricing-list'],
    queryFn: () => apiService.getSurgePricingListOnly(),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useActiveSurgePricingListOnly = (options?: UseQueryOptions<Response<SurgePricingDTO[]>>) => {
  return useQuery({
    queryKey: ['active-surge-pricing-list'],
    queryFn: () => apiService.getActiveSurgePricingListOnly(),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useSurgePricing = (id: number, options?: UseQueryOptions<Response<SurgePricingDTO>>) => {
  return useQuery({
    queryKey: ['surge-pricing', id],
    queryFn: () => apiService.getSurgePricing(id),
    enabled: !!id,
    ...defaultQueryOptions,
    ...options,
  });
};

// Surge Pricing Mutations
export const useCreateSurgePricing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SurgePricingDTO) => apiService.createSurgePricing(data),
    onSuccess: () => {
      handleMutationSuccess('Surge pricing created successfully');
      queryClient.invalidateQueries({ queryKey: ['surge-pricing'] });
      queryClient.invalidateQueries({ queryKey: ['active-surge-pricing'] });
      queryClient.invalidateQueries({ queryKey: ['surge-pricing-list'] });
      queryClient.invalidateQueries({ queryKey: ['active-surge-pricing-list'] });
    },
    onError: handleMutationError,
  });
};

export const useUpdateSurgePricing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SurgePricingDTO }) =>
      apiService.updateSurgePricing(id, data),
    onSuccess: () => {
      handleMutationSuccess('Surge pricing updated successfully');
      queryClient.invalidateQueries({ queryKey: ['surge-pricing'] });
      queryClient.invalidateQueries({ queryKey: ['active-surge-pricing'] });
    },
    onError: handleMutationError,
  });
};

export const useDeleteSurgePricing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiService.deleteSurgePricing(id),
    onSuccess: () => {
      handleMutationSuccess('Surge pricing deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['surge-pricing'] });
      queryClient.invalidateQueries({ queryKey: ['surge-pricing-list'] });
      queryClient.invalidateQueries({ queryKey: ['active-surge-pricing'] });
      queryClient.invalidateQueries({ queryKey: ['active-surge-pricing-list'] });
    },
    onError: handleMutationError,
  });
};

export const useToggleSurgePricingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiService.toggleSurgePricingStatus(id),
    onSuccess: () => {
      handleMutationSuccess('Surge pricing status toggled successfully');
      queryClient.invalidateQueries({ queryKey: ['surge-pricing'] });
      queryClient.invalidateQueries({ queryKey: ['active-surge-pricing'] });
    },
    onError: handleMutationError,
  });
};

// Promotions Queries
export const usePromotionsList = (pageable?: Pageable, search?: string, options?: UseQueryOptions<Response<PromotionsDTO[]>>) => {
  return useQuery({
    queryKey: ['promotions', pageable, search],
    queryFn: () => apiService.getPromotionsList(pageable, search),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useActivePromotionsList = (pageable?: Pageable, search?: string, options?: UseQueryOptions<Response<PromotionsDTO[]>>) => {
  return useQuery({
    queryKey: ['active-promotions', pageable, search],
    queryFn: () => apiService.getActivePromotionsList(pageable, search),
    ...defaultQueryOptions,
    ...options,
  });
};

export const usePromotionsListOnly = (options?: UseQueryOptions<Response<PromotionsDTO[]>>) => {
  return useQuery({
    queryKey: ['promotions-list'],
    queryFn: () => apiService.getPromotionsListOnly(),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useActivePromotionsListOnly = (options?: UseQueryOptions<Response<PromotionsDTO[]>>) => {
  return useQuery({
    queryKey: ['active-promotions-list'],
    queryFn: () => apiService.getActivePromotionsListOnly(),
    ...defaultQueryOptions,
    ...options,
  });
};

export const usePromotion = (id: number, options?: UseQueryOptions<Response<PromotionsDTO>>) => {
  return useQuery({
    queryKey: ['promotion', id],
    queryFn: () => apiService.getPromotion(id),
    enabled: !!id,
    ...defaultQueryOptions,
    ...options,
  });
};

// Promotions Mutations
export const useCreatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PromotionsDTO) => apiService.createPromotion(data),
    onSuccess: () => {
      handleMutationSuccess('Promotion created successfully');
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      queryClient.invalidateQueries({ queryKey: ['active-promotions'] });
      queryClient.invalidateQueries({ queryKey: ['promotions-list'] });
      queryClient.invalidateQueries({ queryKey: ['active-promotions-list'] });
    },
    onError: handleMutationError,
  });
};

export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PromotionsDTO }) =>
      apiService.updatePromotion(id, data),
    onSuccess: () => {
      handleMutationSuccess('Promotion updated successfully');
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      queryClient.invalidateQueries({ queryKey: ['active-promotions'] });
    },
    onError: handleMutationError,
  });
};

export const useDeletePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiService.deletePromotion(id),
    onSuccess: () => {
      handleMutationSuccess('Promotion deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      queryClient.invalidateQueries({ queryKey: ['promotions-list'] });
      queryClient.invalidateQueries({ queryKey: ['active-promotions'] });
      queryClient.invalidateQueries({ queryKey: ['active-promotions-list'] });
    },
    onError: handleMutationError,
  });
};

export const useTogglePromotionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiService.togglePromotionStatus(id),
    onSuccess: () => {
      handleMutationSuccess('Promotion status toggled successfully');
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      queryClient.invalidateQueries({ queryKey: ['active-promotions'] });
    },
    onError: handleMutationError,
  });
};

// Referral Campaign Queries
export const useReferralCampaignsList = (pageable?: Pageable, search?: string, options?: UseQueryOptions<Response<ReferralCampaignDTO[]>>) => {
  return useQuery({
    queryKey: ['referral-campaigns', pageable, search],
    queryFn: () => apiService.getReferralCampaignsList(pageable, search),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useActiveReferralCampaignsList = (pageable?: Pageable, search?: string, options?: UseQueryOptions<Response<ReferralCampaignDTO[]>>) => {
  return useQuery({
    queryKey: ['active-referral-campaigns', pageable, search],
    queryFn: () => apiService.getActiveReferralCampaignsList(pageable, search),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useReferralCampaignsListOnly = (options?: UseQueryOptions<Response<ReferralCampaignDTO[]>>) => {
  return useQuery({
    queryKey: ['referral-campaigns-list'],
    queryFn: () => apiService.getReferralCampaignsListOnly(),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useActiveReferralCampaignsListOnly = (options?: UseQueryOptions<Response<ReferralCampaignDTO[]>>) => {
  return useQuery({
    queryKey: ['active-referral-campaigns-list'],
    queryFn: () => apiService.getActiveReferralCampaignsListOnly(),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useReferralCampaign = (id: number, options?: UseQueryOptions<Response<ReferralCampaignDTO>>) => {
  return useQuery({
    queryKey: ['referral-campaign', id],
    queryFn: () => apiService.getReferralCampaign(id),
    enabled: !!id,
    ...defaultQueryOptions,
    ...options,
  });
};

// Referral Campaign Mutations
export const useCreateReferralCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReferralCampaignDTO) => apiService.createReferralCampaign(data),
    onSuccess: () => {
      handleMutationSuccess('Referral campaign created successfully');
      queryClient.invalidateQueries({ queryKey: ['referral-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['active-referral-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['referral-campaigns-list'] });
      queryClient.invalidateQueries({ queryKey: ['active-referral-campaigns-list'] });
    },
    onError: handleMutationError,
  });
};

export const useUpdateReferralCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ReferralCampaignDTO }) =>
      apiService.updateReferralCampaign(id, data),
    onSuccess: () => {
      handleMutationSuccess('Referral campaign updated successfully');
      queryClient.invalidateQueries({ queryKey: ['referral-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['active-referral-campaigns'] });
    },
    onError: handleMutationError,
  });
};

export const useDeleteReferralCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiService.deleteReferralCampaign(id),
    onSuccess: () => {
      handleMutationSuccess('Referral campaign deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['referral-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['referral-campaigns-list'] });
      queryClient.invalidateQueries({ queryKey: ['active-referral-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['active-referral-campaigns-list'] });
    },
    onError: handleMutationError,
  });
};

export const useToggleReferralCampaignStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiService.toggleReferralCampaignStatus(id),
    onSuccess: () => {
      handleMutationSuccess('Referral campaign status toggled successfully');
      queryClient.invalidateQueries({ queryKey: ['referral-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['active-referral-campaigns'] });
    },
    onError: handleMutationError,
  });
};

// Admin User Queries
export const useAdminUsers = (pageable?: Pageable, search?: string, options?: UseQueryOptions<Response<AppUserVO[]>>) => {
  return useQuery({
    queryKey: ['admin-users', pageable, search],
    queryFn: () => apiService.getAdminUsers(pageable, search),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useAdminUser = (id: number, options?: UseQueryOptions<Response<AppUserVO>>) => {
  return useQuery({
    queryKey: ['admin-user', id],
    queryFn: () => apiService.getAdminUser(id),
    enabled: !!id,
    ...defaultQueryOptions,
    ...options,
  });
};

export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserCreateDTO) => apiService.createAdminUser(data),
    onSuccess: () => {
      handleMutationSuccess('Admin user created successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: handleMutationError,
  });
};

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserUpdateDTO }) =>
      apiService.updateAdminUser(id, data),
    onSuccess: () => {
      handleMutationSuccess('Admin user updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user'] });
    },
    onError: handleMutationError,
  });
};

export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiService.deleteAdminUser(id),
    onSuccess: () => {
      handleMutationSuccess('Admin user deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: handleMutationError,
  });
};

export const useToggleAdminUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiService.toggleAdminUserStatus(id),
    onSuccess: () => {
      handleMutationSuccess('Admin user status toggled successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: handleMutationError,
  });
};

// Role Queries
export const useRoles = (pageable?: Pageable, search?: string, options?: UseQueryOptions<Response<RoleDTO[]>>) => {
  return useQuery({
    queryKey: ['roles', pageable, search],
    queryFn: () => apiService.getRoles(pageable, search),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useRole = (id: number, options?: UseQueryOptions<Response<RoleDTO>>) => {
  return useQuery({
    queryKey: ['role', id],
    queryFn: () => apiService.getRole(id),
    enabled: !!id,
    ...defaultQueryOptions,
    ...options,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RoleCreateDTO) => apiService.createRole(data),
    onSuccess: () => {
      handleMutationSuccess('Role created successfully');
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: handleMutationError,
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RoleUpdateDTO }) =>
      apiService.updateRole(id, data),
    onSuccess: () => {
      handleMutationSuccess('Role updated successfully');
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role'] });
    },
    onError: handleMutationError,
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiService.deleteRole(id),
    onSuccess: () => {
      handleMutationSuccess('Role deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: handleMutationError,
  });
};

// Permission Queries
export const usePermissions = (pageable?: Pageable, search?: string, options?: UseQueryOptions<Response<PermissionDTO[]>>) => {
  return useQuery({
    queryKey: ['permissions', pageable, search],
    queryFn: () => apiService.getPermissions(pageable, search),
    ...defaultQueryOptions,
    ...options,
  });
};

export const usePermission = (id: number, options?: UseQueryOptions<Response<PermissionDTO>>) => {
  return useQuery({
    queryKey: ['permission', id],
    queryFn: () => apiService.getPermission(id),
    enabled: !!id,
    ...defaultQueryOptions,
    ...options,
  });
};

export const useCreatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PermissionCreateDTO) => apiService.createPermission(data),
    onSuccess: () => {
      handleMutationSuccess('Permission created successfully');
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
    onError: handleMutationError,
  });
};

export const useUpdatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PermissionUpdateDTO }) =>
      apiService.updatePermission(id, data),
    onSuccess: () => {
      handleMutationSuccess('Permission updated successfully');
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      queryClient.invalidateQueries({ queryKey: ['permission'] });
    },
    onError: handleMutationError,
  });
};

export const useDeletePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiService.deletePermission(id),
    onSuccess: () => {
      handleMutationSuccess('Permission deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
    onError: handleMutationError,
  });
};

// Rider Queries
export const useRiders = (pageable?: Pageable, search?: string, options?: UseQueryOptions<Response<RiderVO[]>>) => {
  return useQuery({
    queryKey: ['riders', pageable, search],
    queryFn: () => apiService.getRiders(pageable, search),
    ...defaultQueryOptions,
    ...options,
  });
};

export const useRider = (id: number, options?: UseQueryOptions<Response<RiderVO>>) => {
  return useQuery({
    queryKey: ['rider', id],
    queryFn: () => apiService.getRider(id),
    enabled: !!id,
    ...defaultQueryOptions,
    ...options,
  });
};

export const useApproveRider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiService.approveRider(id),
    onSuccess: () => {
      handleMutationSuccess('Rider approved successfully');
      queryClient.invalidateQueries({ queryKey: ['riders'] });
      queryClient.invalidateQueries({ queryKey: ['rider'] });
    },
    onError: handleMutationError,
  });
};

export const useRejectRider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => apiService.rejectRider(id, reason),
    onSuccess: () => {
      handleMutationSuccess('Rider rejected successfully');
      queryClient.invalidateQueries({ queryKey: ['riders'] });
      queryClient.invalidateQueries({ queryKey: ['rider'] });
    },
    onError: handleMutationError,
  });
};

export const useDeactivateRider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiService.deactivateRider(id),
    onSuccess: () => {
      handleMutationSuccess('Rider deactivated successfully');
      queryClient.invalidateQueries({ queryKey: ['riders'] });
      queryClient.invalidateQueries({ queryKey: ['rider'] });
    },
    onError: handleMutationError,
  });
};

export const useActivateRider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiService.activateRider(id),
    onSuccess: () => {
      handleMutationSuccess('Rider activated successfully');
      queryClient.invalidateQueries({ queryKey: ['riders'] });
      queryClient.invalidateQueries({ queryKey: ['rider'] });
    },
    onError: handleMutationError,
  });
};

// Forgot Password Queries
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => apiService.forgotPassword(email),
    onSuccess: () => {
      handleMutationSuccess('Password reset link sent to your email');
    },
    onError: handleMutationError,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      apiService.resetPassword(token, newPassword),
    onSuccess: () => {
      handleMutationSuccess('Password reset successfully');
    },
    onError: handleMutationError,
  });
};

export const useVerifyResetToken = (token?: string) => {
  return useQuery({
    queryKey: ['verify-reset-token', token],
    queryFn: () => token ? apiService.verifyResetToken(token) : null,
    enabled: !!token,
    retry: false,
    ...defaultQueryOptions,
  });
};