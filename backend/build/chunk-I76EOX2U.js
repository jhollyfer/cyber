import {
  HTTPException
} from "./chunk-L747NW6V.js";
import {
  __name
} from "./chunk-SHUYVCID.js";

// application/middlewares/permissions.middleware.ts
function PermissionMiddleware(options) {
  const { allowedRoles } = options;
  return async function(request) {
    if (!request.user) return;
    if (!allowedRoles.includes(request.user.role)) {
      throw HTTPException.Forbidden("Insufficient permissions", "INSUFFICIENT_PERMISSIONS");
    }
  };
}
__name(PermissionMiddleware, "PermissionMiddleware");

export {
  PermissionMiddleware
};
