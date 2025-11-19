import { useQuery } from "@tanstack/vue-query";
import ApiService from "@/core/services/api.service";

const user = {
	listexamGet: (kelas) => {
		return useQuery({
			queryKey: ["list-exam"],
			queryFn: () => ApiService.get(`settings/list-exam${kelas ? `?kelas=${kelas}` : ''}`, localStorage.getItem('user_token')),
			select: (response) => response.data.result
		})
	},
}

export default user;