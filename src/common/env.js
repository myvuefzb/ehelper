import utils from './utils';

const {getParameter} = utils;

var ssEnv = getParameter('ssEnv') || sessionStorage.getItem('base_ssEnv');

if (ssEnv) {
    sessionStorage.setItem('base_ssEnv', ssEnv.toUpperCase());
}

export default {
    ssEnv: ssEnv || 'PRODUCTION',
    DEBUG: location.protocol === 'http:' && location.hostname.indexOf('192.168') !== -1
};
