import { useQuery } from "@tanstack/vue-query";
import axios from "axios";

const example = {
	example1: () => {
		return useQuery({
			queryKey: ["dog", "random"],
			queryFn: () => axios.call("get", "https://dog.ceo/api/breeds/image/random"),
			select: (response) => response.data
		})
	},
	example2: () => {
		return useQuery({
			queryKey: ["example2"],
			queryFn: () => axios.call("get", "https://api.seriesquotes.10cyrilc.me/all"),
			select: (response) => response.data
		})
	},
}

export default example;