using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Geolygon.Models;
using Geolygon.Models.ViewModels;

namespace Geolygon.Controllers
{
    public class PropertiesController : Controller
    {
        // GET: Properties
        public ActionResult Index()
        {
            List<PropTableViewModel> lst;
            using (GeolygonEntities db = new GeolygonEntities())
            {
                 lst = (from d in db.properties
                           select new PropTableViewModel
                           {
                               Id = d.id,
                               Name = d.property_name ,
                               Address = d.property_address
                           }).ToList();
            }
            return View(lst);
        }
    }
}