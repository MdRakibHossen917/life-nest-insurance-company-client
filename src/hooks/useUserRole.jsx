import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
 

const useUserRole = () => {
  const authContext = useAuth();

  if (!authContext) return { role: "user", roleLoading: true };  

  const { user, loading: authLoading } = authContext;
  const axiosSecure = useAxiosSecure();

  const { data: role = "user", isLoading } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !authLoading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role?email=${user.email}`);
      return res.data.role || "user";
    },
  });

  return {
    role,
    roleLoading: authLoading || isLoading,
  };
};

export default useUserRole;
