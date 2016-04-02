<?php
header("Access-Control-Allow-Origin: *");
	$mysql_host = "localhost";
	$mysql_database = "Multas2";
	$mysql_database2 = "Test";
	$mysql_user = "root";
	$mysql_password = "Cerca@PR";
	// Create connection
	$mysqli = new mysqli($mysql_host, $mysql_user, $mysql_password,$mysql_database);	
	$mysqli2 = new mysqli($mysql_host, $mysql_user, $mysql_password,$mysql_database2);
	class JsonData{
  public $vehicles = "";
  public $users = "";
  public $zones = "";
}
$data = new JsonData();
$sql = "SELECT permiso, year, tablilla, make, multas  FROM vehiculos";
$result = mysqli_query($mysqli, $sql);
      $arr = array();
      if($result->num_rows > 0) 
      {
           while($row = $result->fetch_assoc()) 
           		{
                        $arr[] = $row;  
          		}
      //end while
      }
      $data->vehicles = $arr;
///////////////////////////////////////////////////////////////

$sql = "SELECT username, pin FROM Username";
$result = mysqli_query($mysqli2, $sql);
      $arr = array();
      if($result->num_rows > 0) 
      {
           while($row = $result->fetch_assoc()) 
           		{
                        $arr[] = $row;  
          		}
      //end while
      }
      $data->users = $arr;

///////////////////////////////////////////////////////////////

$sql = "SELECT new_code, caption_en  FROM multas_areas_def WHERE new_code IS NOT NULL";
$result = mysqli_query($mysqli, $sql);
      $arr = array();
      if($result->num_rows > 0) 
      {
           while($row = $result->fetch_assoc()) 
              {
                        $arr[] = $row;  
              }
      //end while
      }
      $data->zones = $arr;
      echo $json_response = json_encode($data);

?>