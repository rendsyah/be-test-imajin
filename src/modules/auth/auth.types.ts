export type SignSessionResponse = {
  access_token: string;
  session_id: string;
};

export type SessionResponse = {
  user_id: number;
  session: boolean;
};

export type LoginResponse = {
  access_token: string;
};
