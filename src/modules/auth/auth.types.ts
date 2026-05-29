export type RegisterInput = {
  email: string;
  password: string;
  role: "CREATOR" | "EVENTEE";
};

export type LoginInput = {
  email: string;
  password: string;
};