export interface LogsetLogin {
  timestamp: Date;
  metadata: LogsetLoginMetadata;
  detail: ShuliancloudV4;
  user_agent: string;
}

export interface LogsetLoginMetadata {
  client_ip: string;
  source: string;
  user_id: string;
  version: string;
}

export interface ShuliancloudV4 {
  continent: string;
  country: string;
  prov: string;
  city: string;
  owner: string;
  isp: string;
  areacode: string;
  asnumber: string;
  adcode: string;
  zipcode: string;
  timezone: string;
  accuracy: string;
  lat: string;
  lng: string;
  radius: string;
  source: string;
}
