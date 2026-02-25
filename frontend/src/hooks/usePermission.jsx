import { useQuery } from "@tanstack/react-query";
import { getCurrentUserAPI, getProjectMembersAPI } from "../api/projectAPI";
import { useHelper } from "./useHelper";
import { useParams } from "react-router-dom";

export function usePermission() {
  const { token } = useHelper();
  const { projectId } = useParams();

  // Fetch current user
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user-data"],
    queryFn: () => getCurrentUserAPI(token),
  });

  // Fetch project members
  const { data: memberList, isLoading: memberLoading } = useQuery({
    queryKey: ["project-member", projectId],
    queryFn: () => getProjectMembersAPI(token, projectId),
    enabled: !!projectId, // only run if projectId exists
  });

  const memberListData = Array.isArray(memberList?.members)
    ? memberList.members
    : [];

  // Check roles
  const isAdmin = user && (user.is_superuser || user.is_staff);

  const isTeamLeader =
    user &&
    (user.is_superuser ||
      user.is_staff ||
      memberListData.some(
        (member) => member.user.id === user.id && member.role === "Team Leader",
      ));

  const isMember =
    user &&
    (user.is_superuser ||
      user.is_staff ||
      memberListData.some(
        (member) => member.user.id === user.id && member.role === "Member",
      ));

  return { isAdmin, isTeamLeader, isMember, loading: userLoading || memberLoading };
}
