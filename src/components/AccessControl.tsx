import { createContext } from "react";
import { createContextualCan } from "@casl/react";
import ability, { Subject } from "../util/ability";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Navigate, Outlet } from "react-router";

export const AbilityContext = createContext(ability("USER"));
export const Can = createContextualCan(AbilityContext.Consumer);

export const CanAccessModule = ({ module }: { module: Subject }) => {
  return (
    <Can I="read" a={module} passThrough>
      {(allowed) =>
        allowed ? <Outlet /> : <Navigate to="/unauthorized" replace />
      }
    </Can>
  );
};

const AccessControl = ({ children }: { children: JSX.Element }) => {
  const auth = useSelector((state: RootState) => state.auth);
  const userAbility = ability(auth.user.role);

  return (
    <AbilityContext.Provider value={userAbility}>
      {children}
    </AbilityContext.Provider>
  );
};

export default AccessControl;
