export type UserRole = "owner" | "member";

export type AuthenticatedUserContract = {
  id: string;
  email: string | null;
};

export type AuthSessionResponseContract = {
  authenticated: true;
  user: AuthenticatedUserContract;
  account: {
    id: string;
  };
};
