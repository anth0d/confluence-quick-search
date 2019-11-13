
const TRACKING_ID = 'UA-152084023-1';
// (function() {

// })();
var ga = document.createElement('script');
ga.type = 'text/javascript';
ga.async = true;
ga.src = 'https://ssl.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(ga, s);

export const _gaq = {
  push: (args: string[]) => {
    window._gaq = window._gaq || [] as GoogleAnalyticsCode;
    window._gaq.push(args);
  }
}

_gaq.push(['_setAccount', TRACKING_ID]);
_gaq.push(['_trackPageview']);
