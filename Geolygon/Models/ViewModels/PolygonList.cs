using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Geolygon.Models.ViewModels
{
    public class PolygonList
    {
        public int Id { get; set; }
        
        public int Prop_Id { get; set; }

        public string Identifier { get; set; }

        public string Lat { get; set; }

        public string Long { get; set; }
    }
}