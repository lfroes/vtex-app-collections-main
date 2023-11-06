import React, { useContext, createContext, useState } from "react";

// create a collections context
export const CollectionsContext = createContext(null);

// export the collections context

const { Provider } = CollectionsContext;

export const CollectionsProvider = ({ children } : { children: any}) => {
  const [ updateCollections, setUpdateCollections ] = useState(false);
  return (
    <Provider value={{
      updateCollections,
      setUpdateCollections
    }}>{children}</Provider>
  );
};
