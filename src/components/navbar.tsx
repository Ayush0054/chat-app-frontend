import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import cookies from "js-cookie";

function Navbar() {
  const [user, setUser] = useState<any>(null);
  const removeToken = async () => {
    cookies.remove("access-token");
    localStorage.removeItem("user-data");
    window.location.reload();
  };

  const getUser = () => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user-data");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <div className=" p-2 bg-slate-100 top-0 sticky flex justify-between">
      <h1>{user?.username}</h1>
      <Button onClick={removeToken}>Log out</Button>
    </div>
  );
}

export default Navbar;
