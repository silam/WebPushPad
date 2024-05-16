using BlazorPWANotificationApp.Shared;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using WebPush;

namespace BlazorPWANotificationApp.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NotificationController : ControllerBase
    {
        private static List<NotificationSubscription> _subscriptions = new();

        [HttpPost]
        [Route("subscribe")]
        public int Post(NotificationSubscription notificationSubscription)
        {
            _subscriptions.Add(notificationSubscription);
            return _subscriptions.Count();
        }

        [HttpGet]
        [Route("sendall")]
        public async Task<int> Get()
        {
            //Replace with your generated public/private key
            var publicKey = "BBZiewymg_BXvcfLF4mMmSyqt63mZyM1LjsPJ33BOiGHHhuiae2Za1mOmeItQimiNaRrslm4MIpP__1AKNovy2Q";
            var privateKey = "Jt5ZXJRvBhzh8BkL7Pk20j7fWyHqHy-UETW3DqtZaDI";

            // PrivateKey  "Jt5ZXJRvBhzh8BkL7Pk20j7fWyHqHy-UETW3DqtZaDI"	string
            // PublicKey   "BBZiewymg_BXvcfLF4mMmSyqt63mZyM1LjsPJ33BOiGHHhuiae2Za1mOmeItQimiNaRrslm4MIpP__1AKNovy2Q"   string


            //give a website URL or mailto:your-mail-id
            var vapidDetails = new VapidDetails("http://serverlessdeveloper.net", publicKey, privateKey);
            var webPushClient = new WebPushClient();

            foreach (var subscription in _subscriptions)
            {
                var pushSubscription = new PushSubscription(subscription.Url, subscription.P256dh, subscription.Auth);

                try
                {
                    var payload = JsonSerializer.Serialize(new
                    {
                        message = "Your items are ready to pick up",
                        url = "open this URL when user clicks on notification http://serverlessdeveloper.com"
                    });
                    await webPushClient.SendNotificationAsync(pushSubscription, payload, vapidDetails);
                }
                catch (WebPushException ex)
                {

                    if (ex.Message == "Subscription no longer valid")
                    {
                        Console.Error.WriteLine("Error sending push notification: " + ex.Message);

                    }
                    else
                    {
                        Console.Error.WriteLine("Error sending push notification: " + ex.Message);

                    }
                }
                catch (Exception ex)
                {
                    Console.Error.WriteLine("Error sending push notification: " + ex.Message);
                    //return -1;
                }
            }

            return _subscriptions.Count();
        }
    }
}
