import axios from 'axios';
axios.interceptors.response.use((response) => {
    return response;
}, (error) => {
    return Promise.reject(error);
});
//# sourceMappingURL=axios.js.map