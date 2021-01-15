
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Geolygon.Models;
using Geolygon.Models.ViewModels;


namespace Geolygon.Controllers
{

   
    public class HomeController : Controller
    {
        public ActionResult Index(string message = "")
        {

            ViewBag.Message = message;
            return View();
        }
        public ActionResult Properties()
        {
            List<PropTableViewModel> lst;
            using (GeolygonEntities db = new GeolygonEntities())
            {
                lst = (from d in db.properties
                       select new PropTableViewModel
                       {
                           Id = d.id,
                           Name = d.property_name,
                           Address = d.property_address
                       }).ToList();
            }
            return View(lst);
        }

        //Get Geoglygon/Create
       public ActionResult PropNuevo() {


            return View();
        }


        GeolygonEntities objdb = new GeolygonEntities();
        //POST Geolygon/Create
        [HttpPost]
        public ActionResult PropNuevo(AltaPropViewModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    properties objP = new properties();
                    objP.property_name = model.Name;
                    objP.property_address = model.Address;
                    objdb.properties.Add(objP);
                    objdb.SaveChanges();

                }
                ModelState.Clear();

                return RedirectToAction("Properties");

            }
            catch {
                return View();
            }
            


            /*var oProp = new properties();
            oProp.id = model.Id;
            oProp.property_name = model.Name;
            oProp.property_name = model.Address;

            db.properties.Add(oProp);
            db.SaveChanges();*/

            
            
        }

        public ActionResult SelectProp() {


            List<SelectProp> lst = null;

            using (Models.GeolygonEntities db = new Models.GeolygonEntities()) 
            {
                lst = (from d in db.properties
                                        select new SelectProp
                                        {

                                            Id = d.id,
                                            Nombre = d.property_name
                                        }).ToList();

            
            }

            List<SelectListItem> items = lst.ConvertAll(d =>
            {
                return new SelectListItem()
                {
                    Text = d.Nombre.ToString(),
                    Value = d.Id.ToString(),
                    Selected = false
                };
            });

            ViewBag.items = items;
                return View();
        }






        public ActionResult Polygon()
        {
            List<PolygonList> lst;
            using (GeolygonEntities db = new GeolygonEntities())
            {
                lst = (from d in db.polygons
                       select new PolygonList
                       {
                           Id = d.id,
                           Prop_Id = d.properties_id,
                           Identifier = d.identifier,
                           Lat = d.latitud,
                           Long = d.longitude
                       }).ToList();
            }
            return View(lst);
        }

        public ActionResult NewPolygon() {
                    
                


                

            return View();
        }
    }
}