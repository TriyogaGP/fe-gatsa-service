import { useQuery } from "@tanstack/vue-query";
import ApiService from "@/core/services/api.service";

const token = '12qwaszx@321123'

const notifikasi = {
	countingNotif: () => {
		return useQuery({
			queryKey: ["counting"],
			queryFn: () => ApiService.get(`settings/countNotifikasi`, localStorage.getItem('user_token')),
			select: (response) => response.data.result
		})
	},
}

export default notifikasi;