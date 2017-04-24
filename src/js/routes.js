export default [
    { path: '/', redirect: '/servers' },
    { path: '/servers', component: require('./pages/servers') },
    { path: '/servers/:server_id', component: require('./pages/server-details') },
]