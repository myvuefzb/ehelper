import EnvJson from './env';
import Flag from './flag';

const Env = EnvJson.ssEnv;
const DEBUG_MODE = false;

export default {
    Flag: Flag,
    DataKey: {
        // 用户登录数据
        USER_LOGIN_INFO: 'USER_LOGIN_INFO'
    },
    // 是否需要调试
    DEBUG_MODE: DEBUG_MODE,
    // 配置模块名称
    MODULE_NAME: {},
    // 环境配置
    ENV: Env,
    index_page: 'index.html',
    ESCAPE_CLAUSE: ''
};
