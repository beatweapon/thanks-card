export interface OrganizationMember {
  id: string;
  name: string;
  picture: string;
  frame: string;
  createdAt: Date;
  permission: {
    admin: boolean;
    read: boolean;
    write: boolean;
  };
}
