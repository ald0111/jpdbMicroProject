const BaseUrl = "http://api.login2explore.com:5577";
const irl = "/api/irl";
const iml = "/api/iml";
const token = "90931986|-31949225159958977|90962562";
const dbName = "test2";
const collectionName = "shipment";
$.ajaxSetup({ async: false });

function getFormData() {
  return {
    sno: $("#sno").val(),
    description: $("#description").val(),
    source: $("#source").val(),
    destination: $("#destination").val(),
    shipping_date: $("#shipping_date").val(),
    expected_delivery_date: $("#expected_delivery_date").val(),
  };
}

function validateFormData() {
  const data = getFormData();
  console.log(data);
  const {
    sno,
    description,
    source,
    destination,
    shipping_date,
    expected_delivery_date,
  } = data;
  if (
    !sno ||
    !description ||
    !source ||
    !destination ||
    !shipping_date ||
    !expected_delivery_date
  ) {
    alert("All fields are required");
    return false;
  }
  return data;
}

function fillForm(sno) {
  const req = createGET_BY_RECORDRequest(token, dbName, collectionName, sno);
  const resp = executeCommandAtGivenBaseUrl(req, BaseUrl, irl);
  const parsedResp = JSON.parse(resp.data);
  console.log(parsedResp);
  //   $("#sno").val(parsedResp.rec_no);
  $("#description").val(parsedResp.record.description);
  $("#source").val(parsedResp.record.source);
  $("#destination").val(parsedResp.record.destination);
  $("#shipping_date").val(parsedResp.record.shipping_date);
  $("#expected_delivery_date").val(parsedResp.record.expected_delivery_date);
}

function getShipment() {
  const { sno } = getFormData();
  console.log(sno);
  if (sno) {
    const data = JSON.stringify({
      sno,
    });
    let req = createGET_BY_KEYRequest(token, dbName, collectionName, data);
    let resp = executeCommandAtGivenBaseUrl(req, BaseUrl, irl);

    // const parsedResp = JSON.parse(resp);

    if (resp.status === 400) {
      $("#sno").prop("disabled", true);
      $("#save-btn").prop("disabled", false);
      $("#reset-btn").prop("disabled", false);
      $("#change-btn").prop("disabled", true);
      $("#description").focus();
    }
    if (resp.status === 200) {
      const sno = JSON.parse(resp.data).rec_no;
      localStorage.setItem("sno", sno);
      $("#sno").prop("disabled", true);
      $("#save-btn").prop("disabled", true);
      $("#change-btn").prop("disabled", false);
      $("#reset-btn").prop("disabled", false);
      fillForm(sno);
    }
    console.log(req, resp);
    return;
  }
  return;
}

function resetForm() {
  $("#sno").prop("disabled", false);
  $("#save-btn").prop("disabled", true);
  $("#change-btn").prop("disabled", true);
  $("#reset-btn").prop("disabled", true);
  $("#sno").val("");
  $("#description").val("");
  $("#source").val("");
  $("#destination").val("");
  $("#shipping_date").val("");
  $("#expected_delivery_date").val("");
}

function addShipment() {
  const data = JSON.stringify(validateFormData());
  if (!data) return;
  const req = createPUTRequest(token, data, dbName, collectionName);
  const resp = executeCommandAtGivenBaseUrl(req, BaseUrl, iml);
  if (resp.status === 200) {
    alert("Shipment added successfully");
    $("#reset-btn").click();
  }
  console.log(resp);
}

function changeShipment() {
  const data = JSON.stringify(validateFormData());
  if (!data) return;
  const sno = localStorage.getItem("sno");
  const req = createUPDATERecordRequest(
    token,
    data,
    dbName,
    collectionName,
    sno
  );
  const resp = executeCommandAtGivenBaseUrl(req, BaseUrl, iml);
  if (resp.status === 200) {
    alert("Shipment updated successfully");
    $("#reset-btn").click();
  }
  console.log(resp);
}

console.log(getFormData());
