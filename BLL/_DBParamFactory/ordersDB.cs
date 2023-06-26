

using MohsinFoodAdmin._Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using WebAPICode.Helpers;

namespace BAL.Repositories
{

    public class ordersDB : baseDB
    {
        public static OrdersBLL repo;
        public static DataTable _dt;
        public static DataSet _ds;
        public ordersDB()
           : base()
        {
            repo = new OrdersBLL();
            _dt = new DataTable();
            _ds = new DataSet();
        }

        public List<OrdersBLL> GetAll(int brandID,string locationID, DateTime FromDate, DateTime ToDate)
        {
            try
            {
                var lst = new List<OrdersBLL>();
                SqlParameter[] p = new SqlParameter[4];
                p[0] = new SqlParameter("@brandid", brandID);
                p[1] = new SqlParameter("@locationid", locationID);
                p[2] = new SqlParameter("@fromdate", FromDate.Date);
                p[3] = new SqlParameter("@todate", ToDate.Date);

                _dt = (new DBHelper().GetTableFromSP)("sp_rptSalesOrdersV2", p);
                if (_dt != null)
                {
                    if (_dt.Rows.Count > 0)
                    {
                        lst = JArray.Parse(Newtonsoft.Json.JsonConvert.SerializeObject(_dt)).ToObject<List<OrdersBLL>>();
                    }
                }
           
                return lst;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public DataSet Get(int id, int brandID)
        {
            try
            {
                var _obj = new OrdersBLL();
                SqlParameter[] p = new SqlParameter[1];
                p[0] = new SqlParameter("@OrderID", id);
                //p[1] = new SqlParameter("@brandid", brandID);

                _ds = (new DBHelper().GetDatasetFromSP)("sp_GetOrdersbyID_Admin", p);
              
                return _ds;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
       
       
        public int Update(OrdersBLL data)
        {
            try
            {
                int rtn = 0;
                SqlParameter[] p = new SqlParameter[3];

                p[0] = new SqlParameter("@date", data.LastUpdatedDate);
                p[1] = new SqlParameter("@statusID", data.StatusID);
                p[2] = new SqlParameter("@orderid", data.OrderID);
                rtn = (new DBHelper().ExecuteNonQueryReturn)("sp_updateOrderstatus_Admin", p);

                return rtn;
            }
            catch (Exception ex)
            {
                return 0;
            }
        }
        public int Edit(OrdersEditBLL data)
        {
            try
            {
                int rtn = 0;
                int rtn1 = 0;
                double? value = 0;
                SqlParameter[] p = new SqlParameter[5];

                p[0] = new SqlParameter("@CustomerName", data.Name);
                p[1] = new SqlParameter("@ContactNo", data.Mobile);
                p[2] = new SqlParameter("@Email", data.Email);
                p[3] = new SqlParameter("@Address", data.Address);              
                p[4] = new SqlParameter("@OrderID", data.OrderID);
                rtn = (new DBHelper().ExecuteNonQueryReturn)("sp_editorder_Admin", p);

                foreach (var item in data.OrderDetails)
                {
                    SqlParameter[] para = new SqlParameter[8];
                    para[0] = new SqlParameter("@OrderID", data.OrderID);//Hard Coded Value Pass
                    para[1] = new SqlParameter("@ItemID", item.ItemID);                   
                    para[2] = new SqlParameter("@Quantity", item.Quantity);
                    para[3] = new SqlParameter("@Price", item.Price);
                    para[4] = new SqlParameter("@Cost", item.Cost);
                    para[5] = new SqlParameter("@OrderMode", item.OrderMode);                    
                    para[6] = new SqlParameter("@LastUpdateDT", DateTime.UtcNow.AddMinutes(300));
                    para[7] = new SqlParameter("@LastUpdateBy", 0);
                    
                    rtn1 = int.Parse(new DBHelper().GetTableFromSP("sp_OrderDetails", para).Rows[0]["ID"].ToString());

                     
                }

                foreach (var item in data.OrderDetails)
                {
                    value += item.Price * item.Quantity;
                }
                //decimal? DC = data.order.DeliveryAmount;
                //var GT = Convert.ToDecimal(value) + DC;
                SqlParameter[] par = new SqlParameter[3];
                par[0] = new SqlParameter("@AmountTotal", value);
                par[1] = new SqlParameter("@GrandTotal", value);
                par[2] = new SqlParameter("@OrderID", data.OrderID);


                (new DBHelper().ExecuteNonQueryReturn)("sp_UpdateOrderValue_Admin", par);
                return 1;
            }
            catch (Exception ex)
            {
                return 0;
            }
        }
        public int UpdatePay(OrdersBLL data)
        {
            try
            {
                int rtn = 0;
                SqlParameter[] p = new SqlParameter[1];
 
                p[0] = new SqlParameter("@orderid", data.OrderID);
                rtn = (new DBHelper().ExecuteNonQueryReturn)("sp_RecalculatePayment_MohsinAdmin", p);

                return rtn;
            }
            catch (Exception ex)
            {
                return 0;
            }
        }
        public int Delete(OrdersBLL data)
        {
            try
            {
                int _obj = 0;
                SqlParameter[] p = new SqlParameter[2];
                p[0] = new SqlParameter("@id", data.OrderID);
                p[1] = new SqlParameter("@LastUpdatedDate", data.LastUpdatedDate);

                _obj = (new DBHelper().ExecuteNonQueryReturn)("sp_DeleteOrders", p);

                return _obj;
            }
            catch (Exception ex)
            {
                return 0;
            }
        }
    }
}
