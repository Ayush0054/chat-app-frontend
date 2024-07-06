"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import cookies from "js-cookie";

function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/local`,
        {
          identifier: email,
          password: password,
        }
      );

      const token = response.data.jwt;
      cookies.set("access-token", token);

      // localStorage.setItem("access-token", token);
      localStorage.setItem("user-data", JSON.stringify(response.data.user));
      router.push("/");
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center mt-36">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </CardContent>
        <CardFooter className=" grid justify-items-center">
          <Button className="w-full" onClick={handleLogin}>
            Sign in
          </Button>
          <span className=" text-gray-700 font-semibold">
            New user?{" "}
            <Button
              className=" text-blue-700 font-semibold text-xl font-serif"
              variant="link"
              onClick={() => router.push("/register")}
            >
              register
            </Button>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Page;
