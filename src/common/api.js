import envJson from './env';

const env = envJson.ssEnv;
let prefix;

switch (env) {
    case 'DEVELOPMENT':
        prefix = '';
        break;
    case 'STAGING':
        prefix = '';
        break;
    case 'TEST':
        prefix = '';
        break;
    default:
        prefix = '';
        break;
}

var api = env === 'DEVELOPMENT'
    ? {
     baseUrl:'http://10.31.1.2:93',
     baseIp:'http://10.31.1.2'
    }
    : {
    baseUrl:'http://10.31.1.2:93',
    baseIp:'http://10.31.1.2'
    };
export default function (name) {
    return env === 'DEVELOPMENT' ? api[name] : prefix + api[name];
};
