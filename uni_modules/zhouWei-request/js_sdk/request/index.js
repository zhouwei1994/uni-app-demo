/***************纯粹的数据请求（如果使用这种可以删除掉fileUpload.js）******************/
// import request from "./core/request.js";
// export default request;

/********数据请求同时继承了文件上传（包括七牛云上传）************/
import upload from "./upload/upload.js";
export default upload;