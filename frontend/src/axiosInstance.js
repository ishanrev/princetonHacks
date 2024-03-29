// const axiosLink = "http://localhost:3001/api"
let axiosLink;
if (process.env.NODE_ENV === "production") {
    axiosLink = "https://structo-app.herokuapp.com/api"
} else {
    axiosLink = "http://localhost:3001/api"
}
export default axiosLink