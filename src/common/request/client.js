/**
 * native request client
 */
import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);
import Native from '../native';
const Promise = Vue.Promise;
export default function (request) {
    return new Promise((resolve) => {
        const handler = (data, success) => {
            const response = request.respondWith(
                data, {
                    status: success ? 200 : 500,
                    statusText: data.errmsg
                }
            );

            resolve(response);
        };
        const options = {
            url: request.url,
            data: request.data,
            type: request.method.toLowerCase(),
            success: function(data) {
                handler(data, true);
            },
            error: function(data) {
                handler(data, false);
            }
        };

        Native.NNetWork.request(options);
    });
}
