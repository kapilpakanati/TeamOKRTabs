import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const DynamicTabs = () => {
  var kf = window.kf;
  const sampleData = [
    "Design",
    "Marketing",
    "Apps",
    "Sales",
    "PS",
  ];

  let url = "";
  const [teamNames, setTeamNames] = useState([]);
  
  // State to track the active tab
  const [activeTab, setActiveTab] = useState("1");

  useEffect(() => {

    fetchData();
  
  }, []);

  useEffect(() => {
    // Set the variable when the component mounts
    if (teamNames.length > 0) {
      const tabName = teamNames[0];
       kf.app.setVariable({
     
        "Team_Change_Tree_View": tabName,
        "Team_OKR_Team_Name": tabName
      });
      console.log("Initial Team_OKR_Team_Name set to: ", tabName);
    }
  }, []);

  async function fetchData() {
  
    let kf = window.kf;
    var account_id = kf.account._id;

    let team_master_data_form_id = await kf.app.getVariable("team_master_data_form_id");
    var team_master_data_form_name = "Team Master";
    var team_mapping_data_form_name = "Team - Emp Mapping";
    let team_mapping_data_form_id;
    
  
  
    if (!team_master_data_form_id) {
      await kf.api("/flow/2/" + account_id + "/form/?_application_id=" + kf.app._id).then(async (form_report) => {
        console.log('process data', form_report);
        let data_form_info = form_report.find(itm => itm.Name === team_master_data_form_name);
        team_master_data_form_id = data_form_info._id;
        console.log("dataform name", team_master_data_form_name);
        console.log("dataform id =", team_master_data_form_id);
      });
      kf.app.setVariable("team_master_data_form_id", team_master_data_form_id);
  
    }

    if (!team_mapping_data_form_id) {
      await kf.api("/flow/2/" + account_id + "/form/?_application_id=" + kf.app._id).then(async (form_report) => {
        console.log('process data', form_report);
        let data_form_info = form_report.find(itm => itm.Name === team_mapping_data_form_name);
        team_mapping_data_form_id = data_form_info._id;
        console.log("dataform name", team_mapping_data_form_name);
        console.log("dataform id =", team_mapping_data_form_id);
      });
      kf.app.setVariable("team_mapping_data_form_id", team_mapping_data_form_id);
  
    }


  

     kf = window.kf;
    var role_name = kf.user.Role.Name;
    var my_email = kf.user.Email;
    

    
    if( role_name =="Admin" || role_name =="Executive")
{
    url = "/form/2/"+account_id+"/"+team_master_data_form_id+"/list?_application_id="+kf.app._id+"&page_number=1&page_size=1000";
    console.log("url", url)

    const result = await kf.api(url);
    const names = result.Data.map(item => item.Team_Name);
    setTeamNames(names);
} 
else if( role_name =="Manager" || role_name =="Employee")
{


 
    url = "/form-report/2/"+account_id+"/"+team_mapping_data_form_id+"/Team_Mapping_A00?_application_id="+kf.app._id+"&$employee_email="+my_email;
    console.log("url", url)
    const result = await kf.api(url);
    const names = result.Data.map(item => item["Column_J-AOr9aCZ_"]);
    setTeamNames(names);

}
   
  }

  async function handleTabChange(activeKey) {

 

    kf = window.kf;
    setActiveTab(activeKey); // Update the active tab state
    const tabName = teamNames[parseInt(activeKey, 10) - 1];
    var team_name_tab =  tabName;
    
   // await kf.app.setVariable("Team_Change_Tree_View", tabName);
    await kf.app.setVariable({
     
        "Team_Change_Tree_View": tabName,
        "Team_OKR_Team_Name": tabName
      });


    console.log("Tab changed: ", tabName);
    console.log("team_name_tab", team_name_tab);

   
async function fetchMyOKRData() {

  console.log("INSIDE  fetchMyOKRData")
  
     

        let kf = window.kf;

        var account_id = kf.account._id;
        let check_logs_dataform_id = await kf.app.getVariable("check_logs_dataform_id");
        var check_in_logs_master_data_form_name = "Check-in Logs";
        var check_in_team_report_name = "Team OKR check-in logs";
      var check_in_logs_report_id;
      
        if (!check_logs_dataform_id) {
          await kf.api("/flow/2/" + account_id + "/form/?_application_id=" + kf.app._id+"&page_number=1&page_size=1000").then(async (form_report) => {
            console.log('process data', form_report);
            let data_form_info = form_report.find(itm => itm.Name === check_in_logs_master_data_form_name);
            check_logs_dataform_id = data_form_info._id;
            console.log("dataform name", check_in_logs_master_data_form_name);
            console.log("dataform id =", check_logs_dataform_id);
          });
          kf.app.setVariable("check_logs_dataform_id", check_logs_dataform_id);
      
        }


        if (!check_in_logs_report_id ) {
            await kf.api("/flow/2/" + account_id + "/form/" + check_logs_dataform_id + "/report?_application_id=" + kf.app._id+"&page_number=1&page_size=1000").then((report_list) => {
              if (!check_in_logs_report_id) {
                let report_info = report_list.find(itm => itm.Name === check_in_team_report_name);
                check_in_logs_report_id = report_info._id;
                console.log("report_info =", check_in_logs_report_id);
                kf.app.setVariable("check_in_logs_report_id", check_in_logs_report_id);
              }
        
           
            });
          }



          console.log("INSIDE before  myOkrResponse")

        

    var myOkrResponse = await kf.api(`/form-report/2/${account_id}/${check_logs_dataform_id}/${check_in_logs_report_id}?_application_id=`+kf.app._id+`&$team_name=${team_name_tab}`);
    if (myOkrResponse.Data.length > 0) {

    console.log("INSIDE after  myOkrResponse",myOkrResponse)
      var my_okr_data = myOkrResponse.Data;
    //  await kf.app.setVariable("last_check_in_date", my_okr_data[0]["Column_cDV_Xc6Lev"]);
    // await  kf.app.setVariable("difference_over_all_progress", my_okr_data[0]["Column_ytPgEgihc9"]);
      console.log("resprespresp", my_okr_data);
      console.log("my_okr_data[0][", my_okr_data[0]["Column_ytPgEgihc9"]);
      await kf.app.setVariable({
     
        "difference_over_all_progress": my_okr_data[0]["Column_ytPgEgihc9"],
        "last_check_in_date": my_okr_data[0]["Column_cDV_Xc6Lev"]
      });

    }
      // Assume you have made an API call and received a response in the variable `myOkrResponse`.

    if (myOkrResponse.Data.length == 0) {

      console.log(" INSIDE length 0  fetchMyOKRData")
      // Handle any errors that may occur during the API call.
      console.error("No data found in myOkrResponse");
    
      // Set default values for variables
      await kf.app.setVariable({
        "overall_progress_percent_company": 0,
        "difference_over_all_progress": 0,
        "last_check_in_date": ""
      });
    }
    
  }
  
  fetchMyOKRData();


  var kf = window.kf;
  var account_id = kf.account._id;
  
  var objective_data_form_id = await kf.app.getVariable("objective_data_form_id");
  var objective_data_form_name = "Objective Master";
  if (!objective_data_form_id) {
    await kf.api("/flow/2/" + account_id + "/form/?_application_id=" + kf.app._id).then(async (form_report) => {
      console.log('process data', form_report);
      var data_form_info = form_report.find(itm => itm.Name === objective_data_form_name);
      objective_data_form_id = data_form_info._id;
      console.log("dataform name", objective_data_form_name);
      console.log("dataform id =", objective_data_form_id);
    });
    kf.app.setVariable("objective_data_form_id", objective_data_form_id);

  }
// let data_form_id = "Objective_Master_A00";
  
  var kpi_data_form_id = await kf.app.getVariable("kpi_data_form_id");
  var kpi_dataform_name = "KPI Master";
  if (!kpi_data_form_id) {
    await kf.api("/flow/2/" + kf.account._id + "/form/?_application_id=" + kf.app._id).then(async (form_report) => {
      console.log('process data', form_report);
      var data_form_info = form_report.find(itm => itm.Name === kpi_dataform_name);
      kpi_data_form_id = data_form_info._id;
      console.log("dataform name", kpi_dataform_name);
      console.log("dataform id =", kpi_data_form_id);
    });
    kf.app.setVariable("kpi_data_form_id", kpi_data_form_id);

  }

  var team_okr_status_marker_id;
  let team_okr_status_marker_name = "Team OKR - Status Marker";
  
  if (!team_okr_status_marker_id ) {
    await kf.api("/flow/2/" + kf.account._id + "/form/" + objective_data_form_id + "/report?_application_id=" + kf.app._id).then((report_list) => {
      if (!team_okr_status_marker_id) {
        let report_info = report_list.find(itm => itm.Name === team_okr_status_marker_name);
        team_okr_status_marker_id = report_info._id;
        console.log("team_okr_status_marker_id", team_okr_status_marker_id);
        kf.app.setVariable("team_okr_status_marker_id", team_okr_status_marker_id);
      }

   
    });
  }


  
var role_name = kf.user.Role.Name;
var user_id = kf.user._id;
var application_id = kf.app._id;
var account_id = kf.account._id;
var current_user_email = kf.user.Email;
var company_okr_status_marker_data;
   var col_status_marker;
    var col_status_marker_count;
  
  kf.api(`/form-report/2/${account_id}/${objective_data_form_id}/${team_okr_status_marker_id}?_application_id=${application_id}&$team_name=${team_name_tab}&page_number=1&page_size=1000`)
    .then(team_okr_status_marker_data => {
   
      let col_progress;
      let col_okr_status;
      let col_approved_by;
      let col_weighted;
      let col_weighted_progress;
  
      for (let j in team_okr_status_marker_data.Rows) {
        let colval = team_okr_status_marker_data.Rows[j];
  
        if (colval.FieldId == "Status_Marker_text") {
          col_status_marker = colval.Id;
        } else if(colval.FieldId == "Is_Weightage_Needed_for_Key_Result_")
        {
          col_weighted = colval.Id;
        }
        else if  (colval.FieldId == "Weighted_Actuals_number") {
          col_weighted_progress = colval.Id;
        }  else if  (colval.FieldId == "Average_Progress") {
          col_progress = colval.Id;
        } else if (colval.FieldId == "OKR_Status") {
          col_okr_status = colval.Id;
        } else if (colval.FieldId == "Approved_By_email") {
          col_approved_by = colval.Id;
        }
      }
  
      for (let j in team_okr_status_marker_data.Values) {
        let colval = team_okr_status_marker_data.Values[j];
  
        if (colval.FieldId == "Objective_ID") {
          col_status_marker_count = colval.Id;
          break;
        }
      }
  
      var progress_data = team_okr_status_marker_data.Data;
      var avg = 0;
      var count = 0;
  
      for (var i = 0; i < progress_data.length; i++) {
        if (progress_data[i][col_status_marker] != "Completed" && progress_data[i][col_status_marker] != "Dropped") {
          // if(progress_data[i][col_weighted] == false)

          // {
                  console.log("progress_data", progress_data[i][col_progress]);
                  avg = avg + progress_data[i][col_progress];
          
          // } 
          // else {
          //         console.log("progress_data", progress_data[i][col_weighted_progress]);
          //         avg = avg + progress_data[i][col_weighted_progress];
           
          // } 
          count++;
        }
      }
  
      var overall_progress_percent_company;
      var previous_overall_progress_percent_company;
  
      async function someAsyncFunction() {
        if (isNaN(avg / count)) {
          overall_progress_percent_company = await kf.app.setVariable("overall_progress_percent_company", 0);
          console.log("overall_progress_percent_company-absent", overall_progress_percent_company);
        } else {
          const result = (avg / count).toFixed(2);
          overall_progress_percent_company = await kf.app.setVariable("overall_progress_percent_company", result);
          console.log(result);
          console.log("overall_progress_percent_company-present", overall_progress_percent_company);
        }
      }
  
      someAsyncFunction();
    })
    .catch(function (error) {
      // Handle any errors that may occur during the API call.
      console.error(error);
    });
  


  }

  return (
    <Tabs defaultActiveKey={activeTab} onChange={handleTabChange}>
      {teamNames.map((tabName, index) => (
        <TabPane tab={tabName} key={String(index + 1)}></TabPane>
      ))}
    </Tabs>
  );
};

export default DynamicTabs;
