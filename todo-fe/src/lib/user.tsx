"use client";
import { JwtPayload } from "jwt";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

export function getUserRole(): string | null {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setRole(decoded.role);
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, []);

  return role;
}
