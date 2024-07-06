"use client";

import ChatInterface from "@/components/chat";
import Navbar from "@/components/navbar";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div>
      <Navbar />
      <ChatInterface />
    </div>
  );
};

export default Home;
