export interface Coordinates {
  lat: number;
  lng: number;
}

export const calculateDistance = (point1: Coordinates, point2: Coordinates): number => {
  const R = 6371;
  const dLat = toRad(point2.lat - point1.lat);
  const dLng = toRad(point2.lng - point1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10;
};

const toRad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

export const formatDistance = (km: number): string => {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  } else {
    return `${km.toFixed(1)}km`;
  }
};

export const getDistanceFromUser = (point: Coordinates, userLocation?: Coordinates): string => {
  const defaultLocation: Coordinates = { lat: 31.2304, lng: 121.4737 };
  const location = userLocation || defaultLocation;
  const distance = calculateDistance(point, location);
  return formatDistance(distance);
};
