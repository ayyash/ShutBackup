using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using System.Text.RegularExpressions;
using System.IO;

namespace Shut
{

    public static class UiPage
    {
		public static string BrowserName;
		public static int BrowserMajor;
		public static bool isWeb = true;
		public static bool isMobile = false;
		
		public static string devLocation;
		public static string ShutLocation;
		public static string csslocation;
		public static string jslocation;
		private static long _cacheI = -1;

		
	
		public static MvcHtmlString LoadStyles(string dir = "ltr")
		{
			string cssFolder = HttpContext.Current.Server.MapPath(ShutLocation);
			string strOut = File.ReadAllText(HttpContext.Current.Server.MapPath(devLocation) + "sh.vars.less");
			strOut += File.ReadAllText(cssFolder + "sh.functions.less");
			strOut += File.ReadAllText(cssFolder + "sh.less");
			strOut +=File.ReadAllText(HttpContext.Current.Server.MapPath(devLocation) + "sh.Framework.less"); // shared styles per project
			if (SiteSettings.Instance.SiteDirection == "rtl" || dir == "rtl")
			{
				strOut += File.ReadAllText(cssFolder + "rtl.sh.less");
			}
			strOut += GenerateMedia(cssFolder);
			return MvcHtmlString.Create(strOut);
		}
		// load ui styles
		public static MvcHtmlString LoadUiStyles(string dir = "ltr")
		{
			string cssFolder = HttpContext.Current.Server.MapPath(devLocation);
			string strOut = "";
			foreach (string file in Directory.GetFiles(cssFolder, "ui.*.less", SearchOption.TopDirectoryOnly))
			{
				strOut += File.ReadAllText(file);
			}

			// generate media files in dev working
			strOut += GenerateMedia(cssFolder);

			// now load rtl files in working folder
			if (SiteSettings.Instance.SiteDirection == "rtl" || dir == "rtl")
			{
				foreach (string file in Directory.GetFiles(cssFolder, "rtl.*.less", SearchOption.TopDirectoryOnly))
				{
					strOut += File.ReadAllText(file);
				}
			}
			return MvcHtmlString.Create(strOut);
		}

		
		// function to load css files media 
		public static MvcHtmlString GenerateMedia(string fileLocation)
		{
			string mediacss = "\n@media only screen and (min-width: {0}px)"; // todo allow max
			string strOut = "";
			foreach (string file in Directory.GetFiles(fileLocation, "sh.media.*.less", SearchOption.TopDirectoryOnly))
			{
				FileInfo info = new FileInfo(file);
				int screenSize = Convert.ToInt16(info.Name.Split(new char[] { '.' })[3]);

				// if lowert than size, copy contents in major file
				if (screenSize < SiteSettings.Instance.SupportedScreenSizeMin)
				{
					strOut += File.ReadAllText(file) + "\n";
				} else if (screenSize >= SiteSettings.Instance.SupportedScreenSizeMin &&
				screenSize <= SiteSettings.Instance.SupportedScreenSizeMax)
				{ // less than and larger than
					strOut += String.Format(mediacss, screenSize) + "{\n";
					// open file 
					strOut += File.ReadAllText(file);
					strOut += "} \n"; // close media query
				
				}
				
				
			}

			strOut += "\n@media print {\n";
			//// open file
			if (File.Exists(fileLocation + "sh.print.less"))  strOut += File.ReadAllText(fileLocation + "sh.print.less");

			strOut += "} \n"; // close media query
			return MvcHtmlString.Create(strOut);
		}
		

		public static MvcHtmlString LoadImportStyles(string dir = "ltr")
		{
			// output something like: @impprt rule for css

			string strOut = "\n@import url('" + devLocation + "sh.vars.less');";
			strOut += "\n@import url('" + ShutLocation + "sh.functions.less');";
			strOut += "\n@import url('" + ShutLocation + "sh.less');";
			strOut += "\n@import url('" + devLocation + "sh.Framework.less');"; // shared styles per project
			if (SiteSettings.Instance.SiteDirection == "rtl" || dir == "rtl")
			{
				strOut += "\n@import url('" + ShutLocation + "rtl.sh.less');";
			}
			strOut += GenerateImportMedia(ShutLocation);
			return MvcHtmlString.Create(strOut);
		}
		// load ui styles
		public static MvcHtmlString LoadUiImportStyles(string dir = "ltr")
		{
			string cssFolder = HttpContext.Current.Server.MapPath(devLocation);
			string strOut = "";
			foreach (string file in Directory.GetFiles(cssFolder, "ui.*.less", SearchOption.TopDirectoryOnly))
			{
				FileInfo info = new FileInfo(file);
				strOut += "\n@import url('"+ devLocation + info.Name +"');";
			}

			// generate media files in dev working
			strOut += GenerateImportMedia(devLocation);

			// now load rtl files in working folder
			if (SiteSettings.Instance.SiteDirection == "rtl" || dir == "rtl")
			{
				foreach (string file in Directory.GetFiles(cssFolder, "rtl.*.less", SearchOption.TopDirectoryOnly))
				{
					strOut += "\n@import url('" + devLocation + file + "');";
				}
			}
			return MvcHtmlString.Create(strOut);
		}
		public static MvcHtmlString GenerateImportMedia(string fileLocation)
		{
			string cssFolder = HttpContext.Current.Server.MapPath(fileLocation);
			string mediacss = "only screen and (min-width: {0}px)"; // todo allow max
			string strOut = "";
			foreach (string file in Directory.GetFiles(cssFolder, "sh.media.*.less", SearchOption.TopDirectoryOnly))
			{
				FileInfo info = new FileInfo(file);
				int screenSize = Convert.ToInt16(info.Name.Split(new char[] { '.' })[3]);

				// if lowert than size, add import with no media
				if (screenSize < SiteSettings.Instance.SupportedScreenSizeMin)
				{
					strOut += "\n@import url('" + fileLocation + info.Name + "');";
				}
				else if (screenSize >= SiteSettings.Instance.SupportedScreenSizeMin &&
			  screenSize <= SiteSettings.Instance.SupportedScreenSizeMax)
				{ // apply media query

					strOut += "\n@import url('" + fileLocation + info.Name + "') " + String.Format(mediacss, screenSize) + ";";
				}


			}

			if (File.Exists(cssFolder + "sh.print.less")) strOut += "\n@media url('" + fileLocation  + "sh.print.less') print;";
			return MvcHtmlString.Create(strOut);
		}
		
		
		
    }

}