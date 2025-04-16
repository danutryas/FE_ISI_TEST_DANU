export interface User {
  id: string; // UUID for user ID
  name: string;
  email: string; // User's email (unique and not null)
  role: "lead" | "team"; // Role of the user ('lead' or 'team')
}
