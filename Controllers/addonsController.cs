﻿
using System.Collections.Generic;
using MohsinFoodAdmin._Models;
using MohsinFoodAdmin.BLL._Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;

namespace MohsinFoodAdmin.Controllers
{
    [Route("api/[controller]")]

    public class addonsController : ControllerBase
    {
        addonsService _service;
        private readonly IWebHostEnvironment _env;
        public addonsController(IWebHostEnvironment env)
        {
            _service = new addonsService();
            _env = env;
        }
        [HttpGet("alladdons")]
        public List<AddonsBLL> GetAddon()
        {
            return _service.GetAddon();
        }
        [HttpGet("all/{brandid}")]
        public List<AddonsBLL> GetAll(int brandid)
        {
            return _service.GetAll(brandid);
        }


        [HttpGet("{id}/brand/{brandid}")]
        public AddonsBLL Get(int id, int brandid)
        {
            return _service.Get(id, brandid);
        }

        [HttpPost]
        [Route("insert")]
        public int Post([FromBody]AddonsBLL obj)
        {
            return _service.Insert(obj, _env);
        }

        [HttpPost]
        [Route("update")]
        public int PostUpdate([FromBody]AddonsBLL obj)
        {
            return _service.Update(obj);
        }


        [HttpPost]
        [Route("delete")]
        public int PostDelete([FromBody]AddonsBLL obj)
        {
            return _service.Delete(obj);
        }
    }
}
