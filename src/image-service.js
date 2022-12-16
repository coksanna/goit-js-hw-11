import axios from "axios";

export default class ImageApi {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    } 
    
    async fetchImages() {
        const api_key = '31928334-7c8a8d5fdbb3c6a1bd6729fff';
        const url = 'https://pixabay.com/api/';

        const { data } = await axios.get(`${url}?key=${api_key}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`);
        this.page += 1;        
        return data;
    }
    resetPage() {
        this.page = 1;
    }
    get query() {
        return this.searchQuery;
    }
    set query(newQuery) {
        this.searchQuery = newQuery;
    }     
}
