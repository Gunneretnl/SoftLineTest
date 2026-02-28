using Microsoft.AspNetCore.Mvc;
using SoftLineTest.Models;
using System.Diagnostics;

namespace SoftLineTest.Controllers
{
    public class HomeController : Controller
    {
   
        public IActionResult Index()
        {
            return Redirect("/FrontEnd/login.html");
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}