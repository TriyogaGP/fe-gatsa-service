import { useQuery } from "@tanstack/vue-query";
import ApiService from "@/core/services/api.service";

const user = {
	userGet: (data) => {
		return useQuery({
			queryKey: ["siswa-siswi"],
			queryFn: () => ApiService.get(`user/siswasiswi?page=${data.page}&limit=${data.limit}${data.keyword ? `&keyword=${data.keyword}` : ''}${typeof data.kelas !== 'undefined' || data.kelas ? `&kelas=${data.kelas}` : ''}`, localStorage.getItem('user_token')),
			select: (response) => response.data.result
		})
	},
}

export default user;