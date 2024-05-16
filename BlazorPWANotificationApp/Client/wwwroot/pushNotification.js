// Note: Replace with your own key pair before deploying
//const applicationServerPublicKey = 'BBZiewymg_BXvcfLF4mMmSyqt63mZyM1LjsPJ33BOiGHHhuiae2Za1mOmeItQimiNaRrslm4MIpP__1AKNovy2Q'


// PrivateKey  "Jt5ZXJRvBhzh8BkL7Pk20j7fWyHqHy-UETW3DqtZaDI"	string
// PublicKey   "BBZiewymg_BXvcfLF4mMmSyqt63mZyM1LjsPJ33BOiGHHhuiae2Za1mOmeItQimiNaRrslm4MIpP__1AKNovy2Q"   string
(function () {
    // Note: Replace with your own key pair before deploying
    //const applicationServerPublicKey = 'BCmBW2hJq5nmVNV_MmQKzVsLrWWXqlIZH2M7o6iTfAZWneBNRZ5lNRF86Su3Uii0WZ4gIIOMyJSY6cfPtARw-Qg';

    const applicationServerPublicKey = 'BBZiewymg_BXvcfLF4mMmSyqt63mZyM1LjsPJ33BOiGHHhuiae2Za1mOmeItQimiNaRrslm4MIpP__1AKNovy2Q'
    //const applicationServerPublicKey = 'BOGXFWsq7wkMCG1xQ8O6bGmIM8555D7K0KHnedcC63lqUKjCg9sieOGNYLwzH1C1aLHK264ufKpJ90yKOb0ACIY';


    window.blazorPushNotifications = {
        requestSubscription: async () => {
            const worker = await navigator.serviceWorker.getRegistration();
            const existingSubscription = await worker.pushManager.getSubscription();
            if (!existingSubscription) {
                const newSubscription = await subscribe(worker); // this call will show a dialog to accept push notiification
                if (newSubscription) {
                    return {
                        url: newSubscription.endpoint,
                        p256dh: arrayBufferToBase64(newSubscription.getKey('p256dh')),
                        auth: arrayBufferToBase64(newSubscription.getKey('auth'))
                    };
                }
            }
        },
        unSubscribe: async () => {
            const worker = await navigator.serviceWorker.getRegistration()
            const existingSubscription = await worker.pushManager.getSubscription()
            if (existingSubscription) {
                existingSubscription.unsubscribe()
                return true
            }
        },
    };

    async function subscribe(worker) {
        try {
            return await worker.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerPublicKey
            });
        } catch (error) {
            if (error.name === 'NotAllowedError') {
                return null;
            }
            throw error;
        }
    }

    function arrayBufferToBase64(buffer) {
        // https://stackoverflow.com/a/9458996
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
})();

