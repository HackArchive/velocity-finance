"use client";
import { useState } from "react";
import * as React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useAccount,
  useBalance,
  useConnect,
  useConnectors,
  useDisconnect,
  useConnectUI,
  useIsConnected,
} from "@fuels/react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [connector, setConnector] = useState("");
  const { connectors } = useConnectors();
  // const { connect } = useConnect();
  const { connect } = useConnectUI();

  const { disconnect } = useDisconnect();
  const { isConnected } = useIsConnected();
  const { account } = useAccount();
  const { balance } = useBalance({
    address: account as string,
  });

  console.log("Wallet info:", { isConnected, connectors, account, balance });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [formData, setFormData] = React.useState({
    authType: "USER_SIGNUP",
    stellarAccountId:
      "0x9815bfb637f535f441e958d1ea2d0017803ea7935df87a849c0da5f0d3231988",
    email: "user@gmail.com",
    name: "John Doe",
    avatar: "x",
    x: "x",
    y: "y",
  });
  console.log("Form data:", formData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleKeyChange = (key: string) => {
    setFormData((prevState) => ({
      ...prevState,
      stellarAccountId: key,
    }));
  };
  console.log("Wallet address");

  async function signup(data: any) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/auth/user/signup`,
        data
      );
      console.log("Signup response:", response);

      localStorage.setItem("token", response.data.access_token);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Signup error:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      throw error;
    }
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    try {
      console.log("Form data:", formData);
      const response = await signup(formData);
      console.log("Signup successful:", response);
      navigate("/user-dashboard");
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-6">
          <div className="grid gap-4">
            <Label className="text-black" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Enter your Name"
              type="text"
              required
              disabled={isLoading}
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-4">
            <Label className="text-black" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              required
              disabled={isLoading}
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-4">
            <Label className="text-black" htmlFor="avatar">
              Avatar
            </Label>
            <Input
              id="avatar"
              placeholder="Enter link to Avatar"
              type="text"
              required
              disabled={isLoading}
              value={formData.avatar}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col items-start">
              <Label className="text-gray-700 mb-2" htmlFor="wallet">
                Wallet Address
              </Label>
              <div className=" rounded-lg p-4 w-full">
                {isConnected ? (
                  <div>
                    <p
                      className="text-black-600 font-bold"
                      // value={formData.stellarAccountId}
                      // onChange={handleChange}
                    >
                      Connected
                    </p>
                    <p className="text-sm">Account Address: {account}</p>
                    {balance && (
                      <p className="text-sm"> Balance: {balance.toString()}</p>
                    )}
                    <Button className="mt-4" onClick={() => disconnect()}>
                      Disconnect Wallet
                    </Button>
                  </div>
                ) : (
                  <Button className="mt-4" onClick={() => connect()}>
                    Connect Wallet
                  </Button>
                )}
              </div>
            </div>
          </div>
          <a
            href="/user-signin"
            className="text-sm text-muted-foreground hover:text-sky-600"
          >
            Sign in instead?
          </a>
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign Up
          </Button>
        </div>
      </form>
    </div>
  );
}