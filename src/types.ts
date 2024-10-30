export interface Staff {
  id: string;
  name: string;
  role: string;
  image?: string;
  email: string;
  phone: string;
}

export interface Room {
  id: string;
  number: string;
  floor: string;
  type: string;
  assignedStaff: Staff[];
}