let baseUrl={
  '93': process.env.BASE_API, //port
  '85':process.env.OTHER_API,
};

function apiFunc(options){
  return (options.name?baseUrl[options.name]:baseUrl['93'])+'/api'+options.url;
}
export default apiFunc;
