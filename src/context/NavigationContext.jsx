import React, { useState } from "react";

export const NavigationContext = React.createContext({
  open: true,
  handleDrawerToggle: () => {},
});

const NavigationContextProvider = (props) => {
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = (e) => {
    setOpen(!open);
  };

  return (
    <NavigationContext.Provider
      value={{
        open: open,
        handleDrawerToggle: handleDrawerToggle,
      }}
    >
      {props.children}
    </NavigationContext.Provider>
  );
};

export default NavigationContextProvider;
