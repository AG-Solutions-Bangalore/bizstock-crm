import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import usetoken from "@/api/usetoken";
import { masterService } from "../services/masterService";

export const useTeam = (teamId = null) => {
  const token = usetoken();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditMode = !!teamId;

  const useTeamsQuery = () => useQuery({
    queryKey: ["teams"],
    queryFn: () => masterService.getTeams(token),
    enabled: !!token,
  });

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    branch_id: "",
    user_type: "",
    status: "Active",
  });

  useEffect(() => {
    if (isEditMode && open) {
      const fetchTeam = async () => {
        setIsFetching(true);
        try {
          const team = await masterService.getTeamById(teamId, token);
          setFormData({
            name: team.name || "",
            username: team.username || "",
            password: "", // Don't fetch password
            branch_id: team.branch_id || "",
            user_type: team.user_type || "",
            status: team.status || "Active",
          });
        } catch (err) {
          toast({ title: "Error", description: "Failed to fetch team details", variant: "destructive" });
          setOpen(false);
        } finally {
          setIsFetching(false);
        }
      };
      fetchTeam();
    }
  }, [open, teamId, isEditMode, token, toast]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = isEditMode
        ? await masterService.updateTeam(teamId, formData, token)
        : await masterService.createTeam(formData, token);

      if (response?.data.code === 200) {
        toast({ title: "Success", description: response.data.msg });
        queryClient.invalidateQueries(["teams"]);
        setOpen(false);
      } else {
        toast({ title: "Error", description: response.data.msg, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Operation failed", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    useTeamsQuery,
    open,
    setOpen,
    isLoading,
    isFetching,
    formData,
    handleInputChange,
    handleSubmit,
    isEditMode,
  };
};
