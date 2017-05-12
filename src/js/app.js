import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
Vue.use(VueRouter);
Vue.use(Vuex);
import routes from './routes.js';
import actions from './vuex/actions.js';
import getters from './vuex/getters.js';
import mutations from './vuex/mutations.js';
import Forge from 'forge-sdk';
import Job from './Job';
import QueueService from './Queue';
let Queue = new QueueService();
window.forge = config ? new Forge(config.api_token) : null;

let router = new VueRouter({
    routes: routes
});

let store = new Vuex.Store({
    state: {
        servers: [],
        sites: [],
        loading: true
    },
    actions,
    getters,
    mutations
});

console.log(router);


window.appl = new Vue({
    data: {
        isOnline: true,
        isLoggedIn: false,
        connecting: false
    },
    computed: {
        loading(){
            return this.$store.state.loading;
        }
    },
    methods: {
        getData(){
            this.$store.dispatch('getServers')
        },
        checkLoggedIn(){
            this.isLoggedIn = loggedIn;
            if(this.isLoggedIn){
                this.getData();
            }
        },
        logIn(){
            let apiToken = this.$refs.token.value;
            let data = {
                api_token: apiToken
            };
            localStorage.setItem('config', JSON.stringify(data));
            window.location.reload();
        },
        logOut(){
            localStorage.removeItem('config');
            window.location.reload();
        },
        updateNetworkStatus(status = true){
            this.isOnline = status
            this.checkLoggedIn();
        },
        listen(){
            // Handle the Case that a user is Offline
            // So you don't Just see Infinate Spinner
            // We are checking net status before load
            // @TODO: Test that this actually works
            this.isOnline = window.navigator.onLine;
            window.addEventListener('online', () => this.updateNetworkStatus());
            window.addEventListener('offline', () => this.updateNetworkStatus(false));

            // Left this here to Remond me how to use my own Job Queue Manager :)
            // 
            // let job1 = new Job('http://muni-api.dev/api/test')
            //     .compareWith(r => r.indexOf('Yo') != -1)
            //     .withCallback(() => new Notification('Server "mirthful-hill" has been provisioned'))
            //     .every(5000)
            // let job2 = new Job('http://muni-api.dev/api/test2')
            //     .compareWith(r => r.indexOf('Yo') != -1)
            //     .withCallback(() => new Notification('Server "mirthful-hill" has been deployed'))
            //     .every(5000)
            // Queue.push(job1)
            // Queue.push(job2)
            // new Notification(Queue.count())
        }
    },
    mounted(){
        this.listen();
    },
    router,
    store
}).$mount('#app');