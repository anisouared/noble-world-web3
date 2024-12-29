import React from "react";
import { Spinner } from "@nextui-org/spinner";

const NWLoader = () => {
  return (
    <div className="flex items-center justify-center font-bold p-20">
      <Spinner color="danger" size="lg" label="Loading ..." />
    </div>
  );
};

export default NWLoader;
