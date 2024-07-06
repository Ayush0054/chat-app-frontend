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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        //@ts-ignore
        `${process.env.NEXT_PUBLIC_API_URL}/auth/local/register`,
        {
          email: email,
          username: username,
          password: password,
        }
      );
      console.log(response.data);

      const token = response.data.jwt;
      cookies.set("access-token", token);

      // localStorage.setItem("access-token", token);
      localStorage.setItem("user-data", JSON.stringify(response.data.user));
      router.push("/");
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center mt-36">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Enter your details below to create an account.
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
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="your name"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          <Button className="w-full" onClick={handleRegister}>
            Register
          </Button>
          <span className=" text-gray-700 font-semibold">
            already registered?{" "}
            <Button
              className=" text-blue-700 font-semibold text-xl font-serif"
              variant="link"
              onClick={() => router.push("/login")}
            >
              login
            </Button>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Page;
