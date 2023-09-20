import { MongoAbility, defineAbility } from "@casl/ability";

export type Action = "create" | "read" | "update" | "delete" | "manage";
export type Subject = "Ingredient" | "User" | "Annotator" | "all" | "Dashboard";

const ability = (role: UserRole) =>
  defineAbility<MongoAbility<[Action, Subject]>>((can, cannot) => {
    if (role === "USER") {
      cannot("manage", "all");
      return;
    }

    can("read", "Dashboard");
    if (role === "ADMIN") {
      can("manage", "all");
    }

    if (role === "ANNOTATOR") {
      cannot("manage", "Annotator");
      can("manage", "Ingredient");
      can("read", "User");
    }
  });

export default ability;
