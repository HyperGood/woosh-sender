if(!self.define){let e,s={};const a=(a,i)=>(a=new URL(a+".js",i).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(i,c)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let t={};const r=e=>a(e,n),f={module:{uri:n},exports:t,require:r};s[n]=Promise.all(i.map((e=>f[e]||r(e)))).then((e=>(c(...e),t)))}}define(["./workbox-7c2a5a06"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/FWIfDhJi3RxQJ-WHnkWfs/_buildManifest.js",revision:"3c6583549ee3adef83492943f03fe386"},{url:"/_next/static/FWIfDhJi3RxQJ-WHnkWfs/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/1.ecb98efe7903f14a.js",revision:"ecb98efe7903f14a"},{url:"/_next/static/chunks/1088.04d87f92e05f23c7.js",revision:"04d87f92e05f23c7"},{url:"/_next/static/chunks/1131.3f1b47279838d68f.js",revision:"3f1b47279838d68f"},{url:"/_next/static/chunks/1391.f2b9a0522a81bd5e.js",revision:"f2b9a0522a81bd5e"},{url:"/_next/static/chunks/1437.5e8d15b73fb638ed.js",revision:"5e8d15b73fb638ed"},{url:"/_next/static/chunks/1607.a96b606518c71292.js",revision:"a96b606518c71292"},{url:"/_next/static/chunks/1608.ec04f07937386922.js",revision:"ec04f07937386922"},{url:"/_next/static/chunks/1687.b1c0a745310937ff.js",revision:"b1c0a745310937ff"},{url:"/_next/static/chunks/1711.ae2b84d9f5645069.js",revision:"ae2b84d9f5645069"},{url:"/_next/static/chunks/1727.af62bd633f21ee69.js",revision:"af62bd633f21ee69"},{url:"/_next/static/chunks/1748.f63b451fd93f590b.js",revision:"f63b451fd93f590b"},{url:"/_next/static/chunks/1758.43cf71d023f6fa97.js",revision:"43cf71d023f6fa97"},{url:"/_next/static/chunks/1950.c8039f3dc9bb92f5.js",revision:"c8039f3dc9bb92f5"},{url:"/_next/static/chunks/2592.d428b3938103eff9.js",revision:"d428b3938103eff9"},{url:"/_next/static/chunks/2604.250be1a3b8354750.js",revision:"250be1a3b8354750"},{url:"/_next/static/chunks/2746.0a838d09eabc5b43.js",revision:"0a838d09eabc5b43"},{url:"/_next/static/chunks/2898.f370a64b5af02f0b.js",revision:"f370a64b5af02f0b"},{url:"/_next/static/chunks/29107295-24974d3aad89100b.js",revision:"24974d3aad89100b"},{url:"/_next/static/chunks/3200.6135ea7388cc6e9c.js",revision:"6135ea7388cc6e9c"},{url:"/_next/static/chunks/327.be098df73fd8e9a2.js",revision:"be098df73fd8e9a2"},{url:"/_next/static/chunks/3525.53072abba3ca74b8.js",revision:"53072abba3ca74b8"},{url:"/_next/static/chunks/3646.48057d31a5949257.js",revision:"48057d31a5949257"},{url:"/_next/static/chunks/3946.831a4ec2eaaf682f.js",revision:"831a4ec2eaaf682f"},{url:"/_next/static/chunks/3978.2172d0f7456c19e9.js",revision:"2172d0f7456c19e9"},{url:"/_next/static/chunks/4253.6be69df622e36e45.js",revision:"6be69df622e36e45"},{url:"/_next/static/chunks/4419.c4f2007bfe36ec14.js",revision:"c4f2007bfe36ec14"},{url:"/_next/static/chunks/4423.3c602a0e11984ab8.js",revision:"3c602a0e11984ab8"},{url:"/_next/static/chunks/4429.af5d52c820007d1e.js",revision:"af5d52c820007d1e"},{url:"/_next/static/chunks/4961.cc1fc5cbd481d1ee.js",revision:"cc1fc5cbd481d1ee"},{url:"/_next/static/chunks/5033.6f0da38ed522b66b.js",revision:"6f0da38ed522b66b"},{url:"/_next/static/chunks/5091.99b006c241179b08.js",revision:"99b006c241179b08"},{url:"/_next/static/chunks/5119.33e08a0525159056.js",revision:"33e08a0525159056"},{url:"/_next/static/chunks/514.d2f047fea62adf58.js",revision:"d2f047fea62adf58"},{url:"/_next/static/chunks/516-578b49a6617cf9a9.js",revision:"578b49a6617cf9a9"},{url:"/_next/static/chunks/5289.08bb964b0aaecb0d.js",revision:"08bb964b0aaecb0d"},{url:"/_next/static/chunks/5488.ea86c6ce443ba3bd.js",revision:"ea86c6ce443ba3bd"},{url:"/_next/static/chunks/5641.f2a0a195626fde46.js",revision:"f2a0a195626fde46"},{url:"/_next/static/chunks/5806.7abe5840ceba140e.js",revision:"7abe5840ceba140e"},{url:"/_next/static/chunks/5811.28d59c1aaa5d3711.js",revision:"28d59c1aaa5d3711"},{url:"/_next/static/chunks/5939.0a433dc6f963fc41.js",revision:"0a433dc6f963fc41"},{url:"/_next/static/chunks/607.fa9e7d052cf87e69.js",revision:"fa9e7d052cf87e69"},{url:"/_next/static/chunks/6209-ada7a24e78500754.js",revision:"ada7a24e78500754"},{url:"/_next/static/chunks/6237.f7b1d24c812922e4.js",revision:"f7b1d24c812922e4"},{url:"/_next/static/chunks/6253.dcdff54f0dceda1f.js",revision:"dcdff54f0dceda1f"},{url:"/_next/static/chunks/6328.ea13afa99496d818.js",revision:"ea13afa99496d818"},{url:"/_next/static/chunks/6551.432f96462db0d036.js",revision:"432f96462db0d036"},{url:"/_next/static/chunks/6598.5d92bdb59b5d5c7b.js",revision:"5d92bdb59b5d5c7b"},{url:"/_next/static/chunks/6827.b04b349f52f1ca2a.js",revision:"b04b349f52f1ca2a"},{url:"/_next/static/chunks/6847.a575059dbc72db1a.js",revision:"a575059dbc72db1a"},{url:"/_next/static/chunks/6942.c08085427c39966c.js",revision:"c08085427c39966c"},{url:"/_next/static/chunks/704.484bcd9e0a7f5626.js",revision:"484bcd9e0a7f5626"},{url:"/_next/static/chunks/710.5b06a2c72ba67042.js",revision:"5b06a2c72ba67042"},{url:"/_next/static/chunks/7682.b0a3567fac8e0052.js",revision:"b0a3567fac8e0052"},{url:"/_next/static/chunks/782.479126619f485c0b.js",revision:"479126619f485c0b"},{url:"/_next/static/chunks/794.f18da82915d63734.js",revision:"f18da82915d63734"},{url:"/_next/static/chunks/8015bd09.a1c48d5968209e0d.js",revision:"a1c48d5968209e0d"},{url:"/_next/static/chunks/8137.d6c500ddcf42e542.js",revision:"d6c500ddcf42e542"},{url:"/_next/static/chunks/8297.34a3ae40e7a39a8d.js",revision:"34a3ae40e7a39a8d"},{url:"/_next/static/chunks/833.b92ef92f6170d84e.js",revision:"b92ef92f6170d84e"},{url:"/_next/static/chunks/8627-abdb7d2247a49674.js",revision:"abdb7d2247a49674"},{url:"/_next/static/chunks/8736.675c03dd99121fe3.js",revision:"675c03dd99121fe3"},{url:"/_next/static/chunks/8829.fe7c97417e0cbcee.js",revision:"fe7c97417e0cbcee"},{url:"/_next/static/chunks/8848.dcc7f2900edf34a1.js",revision:"dcc7f2900edf34a1"},{url:"/_next/static/chunks/8881.8c985300b37d631a.js",revision:"8c985300b37d631a"},{url:"/_next/static/chunks/9041.ae29cc10e404fb3b.js",revision:"ae29cc10e404fb3b"},{url:"/_next/static/chunks/9223.882cd6b61a640a13.js",revision:"882cd6b61a640a13"},{url:"/_next/static/chunks/934.405a73de74b58e27.js",revision:"405a73de74b58e27"},{url:"/_next/static/chunks/9343.06df4c4dcf5bc217.js",revision:"06df4c4dcf5bc217"},{url:"/_next/static/chunks/9505.ad309e289db6d022.js",revision:"ad309e289db6d022"},{url:"/_next/static/chunks/9868-4f8ca66b5a37369f.js",revision:"4f8ca66b5a37369f"},{url:"/_next/static/chunks/9941.44044767831d9eb0.js",revision:"44044767831d9eb0"},{url:"/_next/static/chunks/fec483df-eb6ef59f78095abb.js",revision:"eb6ef59f78095abb"},{url:"/_next/static/chunks/framework-2645a99191cfc5e9.js",revision:"2645a99191cfc5e9"},{url:"/_next/static/chunks/main-7dee2e13c3b68fe8.js",revision:"7dee2e13c3b68fe8"},{url:"/_next/static/chunks/pages/_app-39f4a69718a00856.js",revision:"39f4a69718a00856"},{url:"/_next/static/chunks/pages/_error-82b79221b9ed784b.js",revision:"82b79221b9ed784b"},{url:"/_next/static/chunks/pages/claim/%5Bid%5D-f34f378a8f8dae2d.js",revision:"f34f378a8f8dae2d"},{url:"/_next/static/chunks/pages/index-9665aac8eca89401.js",revision:"9665aac8eca89401"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-0c98a972727df924.js",revision:"0c98a972727df924"},{url:"/_next/static/css/574ad1d258614f7a.css",revision:"574ad1d258614f7a"},{url:"/favicon.ico",revision:"01117e0f2feec20127729bbef42e4b2b"},{url:"/fonts/PolySans-Median.woff2",revision:"b4bafabda55de7ebd2b1079db1aa8fbf"},{url:"/fonts/fhoscar-medium.woff2",revision:"00ba4a9c99a554b9b3491330cfc801fc"},{url:"/icon-192x192.png",revision:"67a6824eb72823f01838626555b90678"},{url:"/icon-256x256.png",revision:"3038e6d76d1763c4edc492988149de15"},{url:"/icon-384x384.png",revision:"9d4b611aa003c89ebf23a4c04a1aa39f"},{url:"/icon-512x512.png",revision:"8f511db080bdc8e2b5b8b5476da650d4"},{url:"/images/AnimatedTyping.tsx",revision:"061e2c7829dd66d5fdae226493173893"},{url:"/images/Logo.tsx",revision:"15387d5d60e196b49aa89b61ba871cdf"},{url:"/images/avatars/1.png",revision:"57a9485cb286baf66a5fb203004e20a3"},{url:"/images/avatars/2.png",revision:"7a5c7e6416d37cd8798fef3217745488"},{url:"/images/avatars/3.png",revision:"6ce0a93c07af6f21200a1311709d68f5"},{url:"/images/avatars/4.png",revision:"879286e5d9b7a41c9917292e4a88d4ac"},{url:"/images/avatars/5.png",revision:"980dfbf2ad71c27b84ef487d48537859"},{url:"/images/icons/CloseIcon.tsx",revision:"d2bc241ad3f6644447b460d519c1a015"},{url:"/images/icons/CopyIcon.tsx",revision:"488acc40403f72fc0673fff30fa8035f"},{url:"/images/icons/EditIcon.tsx",revision:"f590686625fe9c8fdf5d36040dca21e9"},{url:"/images/icons/PlayIcon.tsx",revision:"fb494d28eb5fbc61282bf329332d4864"},{url:"/images/icons/QrIcon.tsx",revision:"49bedd45ac92f35b9a60d6b4ce3a7ace"},{url:"/images/icons/SettingsIcon.tsx",revision:"e4c1ccf7d0eb779acfac536b80867e6e"},{url:"/images/icons/UserPlaceholder.tsx",revision:"d2ccfcb79dff3d8138a11c0bdb9815c8"},{url:"/images/icons/arrow-down.svg",revision:"ac7960e807e6dd798553f3a06f811269"},{url:"/images/icons/chevron-down.tsx",revision:"f33edc74904ae45172d39ac6d24bdb5b"},{url:"/images/icons/edit.tsx",revision:"fcd27f59aa4f2bc7ef34273ffa16d84f"},{url:"/images/icons/play.tsx",revision:"b92ccfb59de873a7130e8a29932312af"},{url:"/images/networks/hardhat.svg",revision:"666c33d78e13c9344501aca482cb4044"},{url:"/images/networks/optimism.svg",revision:"0b3bfe5b17344ef450457a5b617574c9"},{url:"/images/tokens-fall.png",revision:"6c4b758e2ebc6829eb4b3ab149ab9ed6"},{url:"/images/tokens/dai.svg",revision:"a667986a6052f9ef59aa2ef6d26e1af4"},{url:"/images/tokens/eth.svg",revision:"4ea2e9e5922326f8dcdc118721032066"},{url:"/images/tokens/gho.svg",revision:"9d497bad41dae145b85cd7df8125884d"},{url:"/images/tokens/lusd.svg",revision:"4ec1fbb05a08063f93289a68806ca589"},{url:"/images/tokens/usdc.svg",revision:"d5209ce947adf7ba632bb129905bd569"},{url:"/images/tokens/usdt.svg",revision:"30c9643dafbffade163f2c91967f2df1"},{url:"/images/wallets/argent.png",revision:"0eecf68ad8dad4ce49a320cdb29f2be1"},{url:"/images/wallets/coinbase.png",revision:"f977bfec852ce2cda1a003e49198f808"},{url:"/images/wallets/family.png",revision:"12921719e1b5538e65b7bf71e4c5bb02"},{url:"/images/wallets/metamask.png",revision:"afdb5be2366568404618fa2573482a90"},{url:"/images/wallets/rainbow.png",revision:"2721aa20b88bb852eaaa710bbb5e6181"},{url:"/images/wallets/walletconnect.png",revision:"50f243a15a3388afdb28ee2a07b0a48a"},{url:"/images/woosh-logo.svg",revision:"e7c2ea8556157032004802e0a838ebfc"},{url:"/manifest.json",revision:"ac1496e7ec72b80f0eab78a3e6f0668c"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:i})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
