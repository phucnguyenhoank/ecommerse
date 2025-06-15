export class AddressDto {
  id!: number;
  street_name!: string;
  city!: string;
  region!: string;
  district!: string;
  country!: string;
  is_default?: boolean;
}

export class CreateAddressDto {
  street_name!: string;
  city!: string;
  region!: string;
  district!: string;
  country!: string;
}

export class UpdateAddressDto {
  street_name?: string;
  city?: string;
  region?: string;
  district?: string;
  country?: string;
} 

