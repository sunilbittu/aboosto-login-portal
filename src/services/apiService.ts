import { buildConfigApiUrl, buildAdminApiUrl } from "@/lib/api";

// Types based on the OpenAPI specification
export interface Response<T = any> {
  status: string;
  httpStatus: string;
  message: string;
  data: T;
}

export interface Pageable {
  page: number;
  size: number;
  sort: string[];
}

export interface VehicleCategoryDTO {
  vehicleCategoryId?: number;
  vehicleCategoryName: string;
  vehicleDescription?: string;
  maxPassengerCount?: number;
  maxLuggageVolume?: number;
  baseFare?: number;
  ratePerKm?: number;
  ratePerMinute?: number;
  cancellationFee?: number;
  waitTimeLimit?: number;
  vehicleIcon?: string;
  isActive?: boolean;
  createdBy?: string;
  createdDate?: string;
  isDeletedValue?: boolean;
  modifiedBy?: string;
  modifiedDate?: string;
}

export interface CountryMaster {
  countryId?: number;
  code: string;
  countryName: string;
  createdBy?: string;
  createdDate?: string;
  createdSystemIp?: string;
  isDeletedValue?: boolean;
  modifiedBy?: string;
  modifiedDate?: string;
  modifiedSystemIp?: string;
  remarks?: string;
  status?: string;
}

export interface CountryMasterDTO extends CountryMaster {}

export interface StateMaster {
  stateId?: number;
  code: string;
  stateName: string;
  country?: CountryMaster;
  createdBy?: string;
  createdDate?: string;
  createdSystemIp?: string;
  isDeletedValue?: boolean;
  modifiedBy?: string;
  modifiedDate?: string;
  modifiedSystemIp?: string;
  remarks?: string;
  status?: string;
}

export interface StateMasterDTO extends StateMaster {}

export interface CityMaster {
  cityId?: number;
  code: string;
  cityName: string;
  state?: StateMaster;
  createdBy?: string;
  createdDate?: string;
  createdSystemIp?: string;
  isDeletedValue?: boolean;
  modifiedBy?: string;
  modifiedDate?: string;
  modifiedSystemIp?: string;
  remarks?: string;
  status?: string;
}

export interface CityMasterDTO extends CityMaster {}

export interface BasePricingDTO {
  pricingId?: number;
  vehicleCategoryId?: number;
  city?: CityMaster;
  baseFare: number;
  ratePerKm: number;
  ratePerMinute: number;
  minimumFare?: number;
  nightCharges?: number;
  tollFeeApplicable?: boolean;
  isActive?: boolean;
  createdBy?: string;
  createdDate?: string;
  isDeletedValue?: boolean;
  modifiedBy?: string;
  modifiedDate?: string;
}

export interface LocalTime {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

// Admin API Types
export interface AppUserVO {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  contactName: string;
  email: string;
  contactNumber: string;
  roles: string[];
  lastLoginDate: string;
  isGoogleAccount: boolean;
  activated: boolean;
}

export interface UserCreateDTO {
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  roles: string[];
}

export interface UserUpdateDTO {
  id: number;
  userName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  contactNumber?: string;
  roles?: string[];
  activated?: boolean;
}

export interface RoleDTO {
  id: number;
  name: string;
  permissions?: PermissionDTO[];
}

export interface RoleCreateDTO {
  name: string;
  permissions: number[];
}

export interface RoleUpdateDTO {
  id: number;
  name?: string;
  permissions?: number[];
}

export interface PermissionDTO {
  id: number;
  name: string;
  description?: string;
}

export interface PermissionCreateDTO {
  name: string;
  description?: string;
}

export interface PermissionUpdateDTO {
  id: number;
  name?: string;
  description?: string;
}

export interface RiderVO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  vehicleCategory?: string;
  isOnline: boolean;
  isApproved: boolean;
  registeredAt: string;
  lastActiveAt?: string;
}

export interface SurgePricingDTO {
  surgeRuleId?: number;
  vehicleCategoryId?: number;
  city?: CityMaster;
  startTime?: LocalTime;
  endTime?: LocalTime;
  surgeMultiplier: number;
  dayOfWeek?: string;
  maxSurgeCap?: number;
  isActive?: boolean;
  createdBy?: string;
  createdDate?: string;
  isDeletedValue?: boolean;
  modifiedBy?: string;
  modifiedDate?: string;
}

export interface PromotionsDTO {
  promoCodeId?: number;
  vehicleCategoryId?: number;
  city?: CityMaster;
  promoCode: string;
  description?: string;
  discountType: string;
  discountValue: number;
  maxDiscountAmount?: number;
  validFrom?: string;
  validTo?: string;
  applicableUserType?: string;
  maxUsesPerUser?: number;
  totalRedemptions?: number;
  isActive?: boolean;
  createdBy?: string;
  createdDate?: string;
  isDeletedValue?: boolean;
  modifiedBy?: string;
  modifiedDate?: string;
}

export interface ReferralCampaignDTO {
  referralCampaignId?: number;
  referrerRewardType?: string;
  referrerRewardValue?: number;
  referredRewardType?: string;
  referredRewardValue?: number;
  validityDays?: number;
  maxUsesPerReferrer?: number;
  isActive?: boolean;
  createdBy?: string;
  createdDate?: string;
  isDeletedValue?: boolean;
  modifiedBy?: string;
  modifiedDate?: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<Response<T>> {
    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Generic HTTP methods for Config APIs (port 8081)
  private async getConfig<T>(endpoint: string): Promise<Response<T>> {
    const response = await fetch(buildConfigApiUrl(endpoint), {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  private async postConfig<T>(endpoint: string, data: any): Promise<Response<T>> {
    const response = await fetch(buildConfigApiUrl(endpoint), {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  private async putConfig<T>(endpoint: string, data: any): Promise<Response<T>> {
    const response = await fetch(buildConfigApiUrl(endpoint), {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  private async deleteConfig<T>(endpoint: string): Promise<Response<T>> {
    const response = await fetch(buildConfigApiUrl(endpoint), {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  // Generic HTTP methods for Admin APIs (port 8082)
  private async getAdmin<T>(endpoint: string): Promise<Response<T>> {
    const response = await fetch(buildAdminApiUrl(endpoint), {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  private async postAdmin<T>(endpoint: string, data: any): Promise<Response<T>> {
    const response = await fetch(buildAdminApiUrl(endpoint), {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  private async putAdmin<T>(endpoint: string, data: any): Promise<Response<T>> {
    const response = await fetch(buildAdminApiUrl(endpoint), {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  private async deleteAdmin<T>(endpoint: string): Promise<Response<T>> {
    const response = await fetch(buildAdminApiUrl(endpoint), {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  // Vehicle Category APIs
  async getVehicleCategories(pageable?: Pageable, search?: string): Promise<Response<VehicleCategoryDTO[]>> {
    let endpoint = '/vehicle-category/list';
    if (pageable) {
      const params = new URLSearchParams();
      params.append('page', pageable.page.toString());
      params.append('size', pageable.size.toString());
      if (pageable.sort?.length) {
        params.append('sort', pageable.sort.join(','));
      }
      if (search) {
        params.append('search', search);
      }
      endpoint += `?${params.toString()}`;
    }
    return this.getConfig<VehicleCategoryDTO[]>(endpoint);
  }

  async getActiveVehicleCategories(pageable?: Pageable, search?: string): Promise<Response<VehicleCategoryDTO[]>> {
    let endpoint = '/vehicle-category/active-list';
    if (pageable) {
      const params = new URLSearchParams();
      params.append('page', pageable.page.toString());
      params.append('size', pageable.size.toString());
      if (pageable.sort?.length) {
        params.append('sort', pageable.sort.join(','));
      }
      if (search) {
        params.append('search', search);
      }
      endpoint += `?${params.toString()}`;
    }
    return this.getConfig<VehicleCategoryDTO[]>(endpoint);
  }

  async getVehicleCategoriesList(): Promise<Response<VehicleCategoryDTO[]>> {
    return this.getConfig<VehicleCategoryDTO[]>('/vehicle-category/list-only');
  }

  async getActiveVehicleCategoriesList(): Promise<Response<VehicleCategoryDTO[]>> {
    return this.getConfig<VehicleCategoryDTO[]>('/vehicle-category/active-list-only');
  }

  async getVehicleCategory(id: number): Promise<Response<VehicleCategoryDTO>> {
    return this.getConfig<VehicleCategoryDTO>(`/vehicle-category/${id}`);
  }

  async createVehicleCategory(data: VehicleCategoryDTO): Promise<Response<VehicleCategoryDTO>> {
    return this.postConfig<VehicleCategoryDTO>('/vehicle-category', data);
  }

  async updateVehicleCategory(id: number, data: VehicleCategoryDTO): Promise<Response<VehicleCategoryDTO>> {
    return this.putConfig<VehicleCategoryDTO>(`/vehicle-category/${id}`, data);
  }

  async deleteVehicleCategory(id: number): Promise<Response<void>> {
    return this.deleteConfig<void>(`/vehicle-category/${id}`);
  }

  async toggleVehicleCategoryStatus(id: number): Promise<Response<void>> {
    return this.getConfig<void>(`/vehicle-category/toggle-active-status/${id}`);
  }

  // Country APIs
  async getCountries(pageable?: Pageable, search?: string): Promise<Response<CountryMasterDTO[]>> {
    let endpoint = '/country/list';
    if (pageable) {
      const params = new URLSearchParams();
      params.append('page', pageable.page.toString());
      params.append('size', pageable.size.toString());
      if (pageable.sort?.length) {
        params.append('sort', pageable.sort.join(','));
      }
      if (search) {
        params.append('search', search);
      }
      endpoint += `?${params.toString()}`;
    }
    return this.getConfig<CountryMasterDTO[]>(endpoint);
  }

  async getCountriesList(): Promise<Response<CountryMasterDTO[]>> {
    return this.getConfig<CountryMasterDTO[]>('/country/list-only');
  }

  async getCountry(id: number): Promise<Response<CountryMasterDTO>> {
    return this.getConfig<CountryMasterDTO>(`/country/${id}`);
  }

  async createCountry(data: CountryMasterDTO): Promise<Response<CountryMasterDTO>> {
    return this.postConfig<CountryMasterDTO>('/country', data);
  }

  async updateCountry(id: number, data: CountryMasterDTO): Promise<Response<CountryMasterDTO>> {
    return this.putConfig<CountryMasterDTO>(`/country/${id}`, data);
  }

  async deleteCountry(id: number): Promise<Response<void>> {
    return this.deleteConfig<void>(`/country/${id}`);
  }

  // State APIs
  async getStates(pageable?: Pageable, search?: string): Promise<Response<StateMasterDTO[]>> {
    let endpoint = '/state/list';
    if (pageable) {
      const params = new URLSearchParams();
      params.append('page', pageable.page.toString());
      params.append('size', pageable.size.toString());
      if (pageable.sort?.length) {
        params.append('sort', pageable.sort.join(','));
      }
      if (search) {
        params.append('search', search);
      }
      endpoint += `?${params.toString()}`;
    }
    return this.getConfig<StateMasterDTO[]>(endpoint);
  }

  async getStatesList(): Promise<Response<StateMasterDTO[]>> {
    return this.getConfig<StateMasterDTO[]>('/state/list-only');
  }

  async getState(id: number): Promise<Response<StateMasterDTO>> {
    return this.getConfig<StateMasterDTO>(`/state/${id}`);
  }

  async createState(data: StateMasterDTO): Promise<Response<StateMasterDTO>> {
    return this.postConfig<StateMasterDTO>('/state', data);
  }

  async updateState(id: number, data: StateMasterDTO): Promise<Response<StateMasterDTO>> {
    return this.putConfig<StateMasterDTO>(`/state/${id}`, data);
  }

  async deleteState(id: number): Promise<Response<void>> {
    return this.deleteConfig<void>(`/state/${id}`);
  }

  // City APIs
  async getCities(pageable?: Pageable, search?: string): Promise<Response<CityMasterDTO[]>> {
    let endpoint = '/city/list';
    if (pageable) {
      const params = new URLSearchParams();
      params.append('page', pageable.page.toString());
      params.append('size', pageable.size.toString());
      if (pageable.sort?.length) {
        params.append('sort', pageable.sort.join(','));
      }
      if (search) {
        params.append('search', search);
      }
      endpoint += `?${params.toString()}`;
    }
    return this.getConfig<CityMasterDTO[]>(endpoint);
  }

  async getCitiesList(): Promise<Response<CityMasterDTO[]>> {
    return this.getConfig<CityMasterDTO[]>('/city/list-only');
  }

  async getCity(id: number): Promise<Response<CityMasterDTO>> {
    return this.getConfig<CityMasterDTO>(`/city/${id}`);
  }

  async createCity(data: CityMasterDTO): Promise<Response<CityMasterDTO>> {
    return this.postConfig<CityMasterDTO>('/city', data);
  }

  async updateCity(id: number, data: CityMasterDTO): Promise<Response<CityMasterDTO>> {
    return this.putConfig<CityMasterDTO>(`/city/${id}`, data);
  }

  async deleteCity(id: number): Promise<Response<void>> {
    return this.deleteConfig<void>(`/city/${id}`);
  }

  // Base Pricing APIs
  async getBasePricingList(pageable?: Pageable, search?: string): Promise<Response<BasePricingDTO[]>> {
    let endpoint = '/base-pricing/list';
    if (pageable) {
      const params = new URLSearchParams();
      params.append('page', pageable.page.toString());
      params.append('size', pageable.size.toString());
      if (pageable.sort?.length) {
        params.append('sort', pageable.sort.join(','));
      }
      if (search) {
        params.append('search', search);
      }
      endpoint += `?${params.toString()}`;
    }
    return this.getConfig<BasePricingDTO[]>(endpoint);
  }

  async getActiveBasePricingList(pageable?: Pageable, search?: string): Promise<Response<BasePricingDTO[]>> {
    let endpoint = '/base-pricing/active-list';
    if (pageable) {
      const params = new URLSearchParams();
      params.append('page', pageable.page.toString());
      params.append('size', pageable.size.toString());
      if (pageable.sort?.length) {
        params.append('sort', pageable.sort.join(','));
      }
      if (search) {
        params.append('search', search);
      }
      endpoint += `?${params.toString()}`;
    }
    return this.getConfig<BasePricingDTO[]>(endpoint);
  }

  async getBasePricingListOnly(): Promise<Response<BasePricingDTO[]>> {
    return this.getConfig<BasePricingDTO[]>('/base-pricing/list-only');
  }

  async getActiveBasePricingListOnly(): Promise<Response<BasePricingDTO[]>> {
    return this.getConfig<BasePricingDTO[]>('/base-pricing/active-list-only');
  }

  async getBasePricing(id: number): Promise<Response<BasePricingDTO>> {
    return this.getConfig<BasePricingDTO>(`/base-pricing/${id}`);
  }

  async createBasePricing(data: BasePricingDTO): Promise<Response<BasePricingDTO>> {
    return this.postConfig<BasePricingDTO>('/base-pricing', data);
  }

  async updateBasePricing(id: number, data: BasePricingDTO): Promise<Response<BasePricingDTO>> {
    return this.putConfig<BasePricingDTO>(`/base-pricing/${id}`, data);
  }

  async deleteBasePricing(id: number): Promise<Response<void>> {
    return this.deleteConfig<void>(`/base-pricing/${id}`);
  }

  async toggleBasePricingStatus(id: number): Promise<Response<void>> {
    return this.getConfig<void>(`/base-pricing/toggle-active-status/${id}`);
  }

  // Surge Pricing APIs
  async getSurgePricingList(pageable?: Pageable, search?: string): Promise<Response<SurgePricingDTO[]>> {
    let endpoint = '/surge-pricing/list';
    if (pageable) {
      const params = new URLSearchParams();
      params.append('page', pageable.page.toString());
      params.append('size', pageable.size.toString());
      if (pageable.sort?.length) {
        params.append('sort', pageable.sort.join(','));
      }
      if (search) {
        params.append('search', search);
      }
      endpoint += `?${params.toString()}`;
    }
    return this.getConfig<SurgePricingDTO[]>(endpoint);
  }

  async getActiveSurgePricingList(pageable?: Pageable, search?: string): Promise<Response<SurgePricingDTO[]>> {
    let endpoint = '/surge-pricing/active-list';
    if (pageable) {
      const params = new URLSearchParams();
      params.append('page', pageable.page.toString());
      params.append('size', pageable.size.toString());
      if (pageable.sort?.length) {
        params.append('sort', pageable.sort.join(','));
      }
      if (search) {
        params.append('search', search);
      }
      endpoint += `?${params.toString()}`;
    }
    return this.getConfig<SurgePricingDTO[]>(endpoint);
  }

  async getSurgePricingListOnly(): Promise<Response<SurgePricingDTO[]>> {
    return this.getConfig<SurgePricingDTO[]>('/surge-pricing/list-only');
  }

  async getActiveSurgePricingListOnly(): Promise<Response<SurgePricingDTO[]>> {
    return this.getConfig<SurgePricingDTO[]>('/surge-pricing/active-list-only');
  }

  async getSurgePricing(id: number): Promise<Response<SurgePricingDTO>> {
    return this.getConfig<SurgePricingDTO>(`/surge-pricing/${id}`);
  }

  async createSurgePricing(data: SurgePricingDTO): Promise<Response<SurgePricingDTO>> {
    return this.postConfig<SurgePricingDTO>('/surge-pricing', data);
  }

  async updateSurgePricing(id: number, data: SurgePricingDTO): Promise<Response<SurgePricingDTO>> {
    return this.putConfig<SurgePricingDTO>(`/surge-pricing/${id}`, data);
  }

  async deleteSurgePricing(id: number): Promise<Response<void>> {
    return this.deleteConfig<void>(`/surge-pricing/${id}`);
  }

  async toggleSurgePricingStatus(id: number): Promise<Response<void>> {
    return this.getConfig<void>(`/surge-pricing/toggle-active-status/${id}`);
  }

  // Promotions APIs
  async getPromotionsList(pageable?: Pageable, search?: string): Promise<Response<PromotionsDTO[]>> {
    let endpoint = '/promotions/list';
    if (pageable) {
      const params = new URLSearchParams();
      params.append('page', pageable.page.toString());
      params.append('size', pageable.size.toString());
      if (pageable.sort?.length) {
        params.append('sort', pageable.sort.join(','));
      }
      if (search) {
        params.append('search', search);
      }
      endpoint += `?${params.toString()}`;
    }
    return this.getConfig<PromotionsDTO[]>(endpoint);
  }

  async getActivePromotionsList(pageable?: Pageable, search?: string): Promise<Response<PromotionsDTO[]>> {
    let endpoint = '/promotions/active-list';
    if (pageable) {
      const params = new URLSearchParams();
      params.append('page', pageable.page.toString());
      params.append('size', pageable.size.toString());
      if (pageable.sort?.length) {
        params.append('sort', pageable.sort.join(','));
      }
      if (search) {
        params.append('search', search);
      }
      endpoint += `?${params.toString()}`;
    }
    return this.getConfig<PromotionsDTO[]>(endpoint);
  }

  async getPromotionsListOnly(): Promise<Response<PromotionsDTO[]>> {
    return this.getConfig<PromotionsDTO[]>('/promotions/list-only');
  }

  async getActivePromotionsListOnly(): Promise<Response<PromotionsDTO[]>> {
    return this.getConfig<PromotionsDTO[]>('/promotions/active-list-only');
  }

  async getPromotion(id: number): Promise<Response<PromotionsDTO>> {
    return this.getConfig<PromotionsDTO>(`/promotions/${id}`);
  }

  async createPromotion(data: PromotionsDTO): Promise<Response<PromotionsDTO>> {
    return this.postConfig<PromotionsDTO>('/promotions', data);
  }

  async updatePromotion(id: number, data: PromotionsDTO): Promise<Response<PromotionsDTO>> {
    return this.putConfig<PromotionsDTO>(`/promotions/${id}`, data);
  }

  async deletePromotion(id: number): Promise<Response<void>> {
    return this.deleteConfig<void>(`/promotions/${id}`);
  }

  async togglePromotionStatus(id: number): Promise<Response<void>> {
    return this.getConfig<void>(`/promotions/toggle-active-status/${id}`);
  }

  // Referral Campaign APIs
  async getReferralCampaignsList(pageable?: Pageable, search?: string): Promise<Response<ReferralCampaignDTO[]>> {
    let endpoint = '/referral-campaign/list';
    if (pageable) {
      const params = new URLSearchParams();
      params.append('page', pageable.page.toString());
      params.append('size', pageable.size.toString());
      if (pageable.sort?.length) {
        params.append('sort', pageable.sort.join(','));
      }
      if (search) {
        params.append('search', search);
      }
      endpoint += `?${params.toString()}`;
    }
    return this.getConfig<ReferralCampaignDTO[]>(endpoint);
  }

  async getActiveReferralCampaignsList(pageable?: Pageable, search?: string): Promise<Response<ReferralCampaignDTO[]>> {
    let endpoint = '/referral-campaign/active-list';
    if (pageable) {
      const params = new URLSearchParams();
      params.append('page', pageable.page.toString());
      params.append('size', pageable.size.toString());
      if (pageable.sort?.length) {
        params.append('sort', pageable.sort.join(','));
      }
      if (search) {
        params.append('search', search);
      }
      endpoint += `?${params.toString()}`;
    }
    return this.getConfig<ReferralCampaignDTO[]>(endpoint);
  }

  async getReferralCampaignsListOnly(): Promise<Response<ReferralCampaignDTO[]>> {
    return this.getConfig<ReferralCampaignDTO[]>('/referral-campaign/list-only');
  }

  async getActiveReferralCampaignsListOnly(): Promise<Response<ReferralCampaignDTO[]>> {
    return this.getConfig<ReferralCampaignDTO[]>('/referral-campaign/active-list-only');
  }

  async getReferralCampaign(id: number): Promise<Response<ReferralCampaignDTO>> {
    return this.getConfig<ReferralCampaignDTO>(`/referral-campaign/${id}`);
  }

  async createReferralCampaign(data: ReferralCampaignDTO): Promise<Response<ReferralCampaignDTO>> {
    return this.postConfig<ReferralCampaignDTO>('/referral-campaign', data);
  }

  async updateReferralCampaign(id: number, data: ReferralCampaignDTO): Promise<Response<ReferralCampaignDTO>> {
    return this.putConfig<ReferralCampaignDTO>(`/referral-campaign/${id}`, data);
  }

  async deleteReferralCampaign(id: number): Promise<Response<void>> {
    return this.deleteConfig<void>(`/referral-campaign/${id}`);
  }

  async toggleReferralCampaignStatus(id: number): Promise<Response<void>> {
    return this.getConfig<void>(`/referral-campaign/toggle-active-status/${id}`);
  }

  // Admin Management APIs
  async getAdminUsers(pageable?: Pageable, search?: string): Promise<Response<AppUserVO[]>> {
    let endpoint = '/api/admin/list';
    if (pageable) {
      const params = new URLSearchParams();
      params.append('page', pageable.page.toString());
      params.append('size', pageable.size.toString());
      if (pageable.sort?.length) {
        params.append('sort', pageable.sort.join(','));
      }
      if (search) {
        params.append('search', search);
      }
      endpoint += `?${params.toString()}`;
    }
    return this.getAdmin<AppUserVO[]>(endpoint);
  }

  async getAdminUser(id: number): Promise<Response<AppUserVO>> {
    return this.getAdmin<AppUserVO>(`/api/admin/users/${id}`);
  }

  async createAdminUser(data: UserCreateDTO): Promise<Response<AppUserVO>> {
    return this.postAdmin<AppUserVO>('/api/admin/users', data);
  }

  async updateAdminUser(id: number, data: UserUpdateDTO): Promise<Response<AppUserVO>> {
    return this.putAdmin<AppUserVO>(`/api/admin/users/${id}`, data);
  }

  async deleteAdminUser(id: number): Promise<Response<void>> {
    return this.deleteAdmin<void>(`/api/admin/users/${id}`);
  }

  async toggleAdminUserStatus(id: number): Promise<Response<void>> {
    return this.getAdmin<void>(`/api/admin/users/${id}/toggle-status`);
  }

  // Role Management APIs
  async getRoles(pageable?: Pageable, search?: string): Promise<Response<RoleDTO[]>> {
    let endpoint = '/api/admin/roles';
    if (pageable) {
      const params = new URLSearchParams();
      params.append('page', pageable.page.toString());
      params.append('size', pageable.size.toString());
      if (pageable.sort?.length) {
        params.append('sort', pageable.sort.join(','));
      }
      if (search) {
        params.append('search', search);
      }
      endpoint += `?${params.toString()}`;
    }
    return this.getAdmin<RoleDTO[]>(endpoint);
  }

  async getRole(id: number): Promise<Response<RoleDTO>> {
    return this.getAdmin<RoleDTO>(`/api/admin/roles/${id}`);
  }

  async createRole(data: RoleCreateDTO): Promise<Response<RoleDTO>> {
    return this.postAdmin<RoleDTO>('/api/admin/roles', data);
  }

  async updateRole(id: number, data: RoleUpdateDTO): Promise<Response<RoleDTO>> {
    return this.putAdmin<RoleDTO>(`/api/admin/roles/${id}`, data);
  }

  async deleteRole(id: number): Promise<Response<void>> {
    return this.deleteAdmin<void>(`/api/admin/roles/${id}`);
  }

  // Permission Management APIs
  async getPermissions(pageable?: Pageable, search?: string): Promise<Response<PermissionDTO[]>> {
    let endpoint = '/api/admin/permissions';
    if (pageable) {
      const params = new URLSearchParams();
      params.append('page', pageable.page.toString());
      params.append('size', pageable.size.toString());
      if (pageable.sort?.length) {
        params.append('sort', pageable.sort.join(','));
      }
      if (search) {
        params.append('search', search);
      }
      endpoint += `?${params.toString()}`;
    }
    return this.getAdmin<PermissionDTO[]>(endpoint);
  }

  async getPermission(id: number): Promise<Response<PermissionDTO>> {
    return this.getAdmin<PermissionDTO>(`/api/admin/permissions/${id}`);
  }

  async createPermission(data: PermissionCreateDTO): Promise<Response<PermissionDTO>> {
    return this.postAdmin<PermissionDTO>('/api/admin/permissions', data);
  }

  async updatePermission(id: number, data: PermissionUpdateDTO): Promise<Response<PermissionDTO>> {
    return this.putAdmin<PermissionDTO>(`/api/admin/permissions/${id}`, data);
  }

  async deletePermission(id: number): Promise<Response<void>> {
    return this.deleteAdmin<void>(`/api/admin/permissions/${id}`);
  }

  // Rider Management APIs
  async getRiders(pageable?: Pageable, search?: string): Promise<Response<RiderVO[]>> {
    let endpoint = '/api/admin/riders';
    if (pageable) {
      const params = new URLSearchParams();
      params.append('page', pageable.page.toString());
      params.append('size', pageable.size.toString());
      if (pageable.sort?.length) {
        params.append('sort', pageable.sort.join(','));
      }
      if (search) {
        params.append('search', search);
      }
      endpoint += `?${params.toString()}`;
    }
    return this.getAdmin<RiderVO[]>(endpoint);
  }

  async getRider(id: number): Promise<Response<RiderVO>> {
    return this.getAdmin<RiderVO>(`/api/admin/riders/${id}`);
  }

  async approveRider(id: number): Promise<Response<void>> {
    return this.postAdmin<void>(`/api/admin/riders/${id}/approve`, {});
  }

  async rejectRider(id: number, reason?: string): Promise<Response<void>> {
    return this.postAdmin<void>(`/api/admin/riders/${id}/reject`, { reason });
  }

  async deactivateRider(id: number): Promise<Response<void>> {
    return this.postAdmin<void>(`/api/admin/riders/${id}/deactivate`, {});
  }

  async activateRider(id: number): Promise<Response<void>> {
    return this.postAdmin<void>(`/api/admin/riders/${id}/activate`, {});
  }

  // Forgot Password API
  async forgotPassword(email: string): Promise<Response<void>> {
    return this.postConfig<void>('/api/auth/forgot-password', { email });
  }

  // Reset Password API
  async resetPassword(token: string, newPassword: string): Promise<Response<void>> {
    return this.postConfig<void>('/api/auth/reset-password', { token, newPassword });
  }

  // Verify Reset Token API
  async verifyResetToken(token: string): Promise<Response<{ valid: boolean; email?: string }>> {
    return this.postConfig<{ valid: boolean; email?: string }>('/api/auth/verify-reset-token', { token });
  }
}

export const apiService = new ApiService();