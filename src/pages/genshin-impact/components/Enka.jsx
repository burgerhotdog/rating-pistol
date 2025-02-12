import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";

const Enka = () => {
  // suffix
  // gi: uid/<uid>
  // hsr: hsr/uid/<uid>
  // zzz: zzz/uid/<uid>
  const suffix = "uid/618285856/";
  const fetchPlayerData = async () => {
    try {
      const response = await fetch(`https://rating-pistol.vercel.app/api/proxy?suffix=${suffix}`);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch player data:", error);
    }
  };

  return (
    <div>
      <Button onClick={fetchPlayerData}>Refresh Data</Button>
    </div>
  );
};

export default Enka;
