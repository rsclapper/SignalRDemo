using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
namespace FastDemo.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendToAll(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
