import uuid
from typing import Optional, Dict, Any
from app.services.user_service import UserService
from app.db.repositories.invitation_repository import InvitationRepository
from app.services.auth_service import validate_password_policy


class InvitationService:
    def __init__(self, conn):
        self.conn = conn
        self.repo = InvitationRepository(conn)
        self.user_service = UserService(conn)

    def create_invitation(self, tenant_id: str, email: str, invited_by: Optional[str], message: Optional[str] = None) -> Dict[str, Any]:
        """Create invitation and return data for email sending."""
        # Check for existing pending invitation (partial unique index will enforce at DB level)
        existing = self.repo.get_invitation_by_token("")  # Not used, just pattern
        result = self.repo.create_invitation(tenant_id, email, invited_by, message)
        return result

    def list_invitations(self, tenant_id: str, status: Optional[str] = None, page: int = 1, page_size: int = 50) -> Dict[str, Any]:
        return self.repo.list_invitations(tenant_id, status, page, page_size)

    def revoke_invitation(self, invitation_id: str, tenant_id: str) -> Dict[str, Any]:
        success = self.repo.revoke_invitation(invitation_id, tenant_id)
        if not success:
            return {"success": False, "error": "Invitation not found or already processed"}
        return {"success": True, "message": "Invitation revoked"}

    def resend_invitation(self, invitation_id: str, tenant_id: str, invited_by: Optional[str]) -> Dict[str, Any]:
        result = self.repo.resend_invitation(invitation_id, tenant_id, invited_by)
        if not result:
            return {"success": False, "error": "Invitation not found or not pending"}
        return {"success": True, "data": result}

    def accept_invitation(self, token: str, password: str, first_name: str, last_name: str) -> Dict[str, Any]:
        """
        Atomic: validate invitation + create user + mark invitation accepted + link invitation_id
        All operations share self.conn = same transaction.
        Caller (route) manages commit/rollback via `with get_db_connection() as db:`
        """
        # 1. Validate password policy upfront (before DB operations)
        validate_password_policy(password)

        # 2. Validate & lock invitation row
        invite = self.repo.get_pending_invitation_for_update(token)
        if not invite:
            return {"success": False, "error": "Invalid or expired invitation"}

        invitation_id = invite["invitation_id"]
        tenant_id = invite["tenant_id"]
        email = invite["email"]

        # 3. Create user via canonical UserService (shares transaction via self.conn)
        # This enforces password policy (again) and tenant user limit
        payload = type('Payload', (), {
            'email': email,
            'password': password,
            'first_name': first_name,
            'last_name': last_name,
            'display_name': f"{first_name} {last_name}",
            'phone': None,
            'department': None,
            'tenant_id': tenant_id,
        })()

        user_result = self.user_service.create_user(payload, tenant_id=tenant_id)
        if not user_result["success"]:
            return {"success": False, "error": user_result.get("error", "User creation failed")}

        user_id = user_result["data"]["id"]

        # 4. Update user with invitation_id and email_verified=FALSE
        updated = self.repo.update_user_invitation_id(user_id, invitation_id)
        if not updated:
            return {"success": False, "error": "Failed to link invitation to user"}

        # 5. Mark invitation accepted
        accepted = self.repo.accept_invitation(invitation_id)
        if not accepted:
            return {"success": False, "error": "Failed to mark invitation accepted"}

        return {"success": True, "data": {"user_id": user_id}}