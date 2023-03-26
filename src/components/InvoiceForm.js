import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import InvoiceItem from "./InvoiceItem";
import InvoiceModal from "./InvoiceModal";
import InputGroup from "react-bootstrap/InputGroup";
import SignaturePad from "./SignaturePad";
import UploadSignature from "./UploadSignature";

function InvoiceForm(props) {
  const [invoiceLabels, setInvoiceLabels] = useState({
    isOpen: false,
    currency: "$",
    currentDate: "",
    invoiceNumber: 1,
    dateOfIssue: "",
    billTo: "",
    billToEmail: "",
    billToAddress: "",
    billFrom: "",
    billFromEmail: "",
    billFromAddress: "",
    notes: "",
    total: "0.00",
    subTotal: "0.00",
    taxRate: "",
    taxAmount: "0.00",
    discountRate: "",
    discountAmount: "0.00",
    signature: null,
  });

  const [invoiceItems, setInvoiceItems] = useState([
    {
      id: "abcd",
      name: "",
      description: "",
      price: "1.00",
      quantity: 1,
    },
  ]);

  const [signatureType, setSignatureType] = useState("Upload Signature");

  const changeSignatureType = (e) => {
    setSignatureType(e.target.value);
  };

  useEffect(() => {
    handleCalculateTotal(invoiceItems, invoiceLabels);
  }, []);

  const saveSignature = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 150;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.onload = () => {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setInvoiceLabels((prevInvoiceLabels) => ({
        ...prevInvoiceLabels,
        signature: dataUrl,
      }));
    };
    image.src = document.querySelector("canvas").toDataURL();
  };

  const handleRowDel = (id) => {
    const updatedInvoiceItems = invoiceItems.filter(
      (invoiceItem) => invoiceItem.id !== id
    );
    setInvoiceItems(updatedInvoiceItems);

    handleCalculateTotal(updatedInvoiceItems, invoiceLabels);
  };
  const handleAddEvent = (evt) => {
    const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const newInvoiceItem = {
      id: id,
      name: "",
      price: "1.00",
      description: "",
      quantity: 1,
    };
    const updatedInvoiceItems = [...invoiceItems, newInvoiceItem];
    setInvoiceItems(updatedInvoiceItems);
    handleCalculateTotal(updatedInvoiceItems, invoiceLabels);
  };
  const handleCalculateTotal = (currentInvoiceItems, currentInvoiceLabels) => {
    console.log(currentInvoiceItems);
    let subTotal = 0;

    currentInvoiceItems.forEach((invoiceItem) => {
      console.log(subTotal);

      subTotal = parseFloat(
        parseFloat(subTotal) +
          parseFloat(invoiceItem.price).toFixed(2) *
            parseInt(invoiceItem.quantity)
      ).toFixed(2);
      console.log(subTotal);
    });
    const taxAmount = parseFloat(
      parseFloat(subTotal) * (currentInvoiceLabels.taxRate / 100)
    ).toFixed(2);
    const discountAmount = parseFloat(
      parseFloat(subTotal) * (currentInvoiceLabels.discountRate / 100)
    ).toFixed(2);
    const total =
      subTotal -
      currentInvoiceLabels.discountAmount +
      parseFloat(currentInvoiceLabels.taxAmount);
    setInvoiceLabels((prevInvoiceLabels) => ({
      ...prevInvoiceLabels,
      subTotal,
      total,
      taxAmount,
      discountAmount,
    }));
  };
  const onItemizedItemEdit = (evt) => {
    const updateInvoiceItems = invoiceItems.map((invoiceItem) => {
      console.log(evt);
      console.log(invoiceItem);
      if (invoiceItem.id !== evt.target.id) {
        return invoiceItem;
      }
      return { ...invoiceItem, [evt.target.name]: evt.target.value };
    });
    setInvoiceItems(updateInvoiceItems);
    handleCalculateTotal(updateInvoiceItems, invoiceLabels);
  };
  const editField = (event) => {
    const updatedInvoiceLabels = {
      ...invoiceLabels,
      [event.target.name]: event.target.value,
    };
    setInvoiceLabels(updatedInvoiceLabels);
    handleCalculateTotal(invoiceItems, updatedInvoiceLabels);
  };
  const onCurrencyChange = (newCurrencyValue) => {
    setInvoiceLabels((prevInvoiceLabels) => ({
      ...prevInvoiceLabels,
      currency: newCurrencyValue,
    }));
  };
  const openModal = (event) => {
    event.preventDefault();
    handleCalculateTotal(invoiceItems, invoiceLabels);
    setInvoiceLabels((prevInvoiceLabels) => ({
      ...prevInvoiceLabels,
      isOpen: true,
    }));
  };
  const closeModal = (event) => {
    setInvoiceLabels((prevInvoiceLabels) => ({
      ...prevInvoiceLabels,
      isOpen: false,
    }));
  };
  return (
    <Form onSubmit={openModal}>
      <Row>
        <Col md={8} lg={9}>
          <Card className="p-4 p-xl-5 my-3 my-xl-4">
            <div className="d-flex flex-row align-items-start justify-content-between mb-3">
              <div class="d-flex flex-column">
                <div className="d-flex flex-column">
                  <div class="mb-2">
                    <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                    <span className="current-date">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center">
                  <span className="fw-bold d-block me-2">Due&nbsp;Date:</span>
                  <Form.Control
                    type="date"
                    value={invoiceLabels.dateOfIssue}
                    name={"dateOfIssue"}
                    onChange={(event) => editField(event)}
                    style={{
                      maxWidth: "150px",
                    }}
                    required="required"
                  />
                </div>
              </div>
              <div className="d-flex flex-row align-items-center">
                <span className="fw-bold me-2">Invoice&nbsp;Number:&nbsp;</span>
                <Form.Control
                  type="number"
                  value={invoiceLabels.invoiceNumber}
                  name={"invoiceNumber"}
                  onChange={(event) => editField(event)}
                  min="1"
                  style={{
                    maxWidth: "70px",
                  }}
                  required="required"
                />
              </div>
            </div>
            <hr className="my-4" />
            <Row className="mb-5">
              <Col>
                <Form.Label className="fw-bold">Bill to:</Form.Label>
                <Form.Control
                  placeholder={"Who is this invoice to?"}
                  rows={3}
                  value={invoiceLabels.billTo}
                  type="text"
                  name="billTo"
                  className="my-2"
                  onChange={(event) => editField(event)}
                  autoComplete="name"
                  required="required"
                />
                <Form.Control
                  placeholder={"Email address"}
                  value={invoiceLabels.billToEmail}
                  type="email"
                  name="billToEmail"
                  className="my-2"
                  onChange={(event) => editField(event)}
                  autoComplete="email"
                  required="required"
                />
                <Form.Control
                  placeholder={"Billing address"}
                  value={invoiceLabels.billToAddress}
                  type="text"
                  name="billToAddress"
                  className="my-2"
                  autoComplete="address"
                  onChange={(event) => editField(event)}
                  required="required"
                />
              </Col>
              <Col>
                <Form.Label className="fw-bold">Bill from:</Form.Label>
                <Form.Control
                  placeholder={"Who is this invoice from?"}
                  rows={3}
                  value={invoiceLabels.billFrom}
                  type="text"
                  name="billFrom"
                  className="my-2"
                  onChange={(event) => editField(event)}
                  autoComplete="name"
                  required="required"
                />
                <Form.Control
                  placeholder={"Email address"}
                  value={invoiceLabels.billFromEmail}
                  type="email"
                  name="billFromEmail"
                  className="my-2"
                  onChange={(event) => editField(event)}
                  autoComplete="email"
                  required="required"
                />
                <Form.Control
                  placeholder={"Billing address"}
                  value={invoiceLabels.billFromAddress}
                  type="text"
                  name="billFromAddress"
                  className="my-2"
                  autoComplete="address"
                  onChange={(event) => editField(event)}
                  required="required"
                />
              </Col>
            </Row>
            <InvoiceItem
              onItemizedItemEdit={onItemizedItemEdit}
              onRowAdd={handleAddEvent}
              onRowDel={handleRowDel}
              currency={invoiceLabels.currency}
              items={invoiceItems}
            />
            <Row className="mt-4 justify-content-end">
              <Col lg={6}>
                <div className="d-flex flex-row align-items-start justify-content-between">
                  <span className="fw-bold">Subtotal:</span>
                  <span>
                    {invoiceLabels.currency}
                    {invoiceLabels.subTotal}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Discount:</span>
                  <span>
                    <span className="small ">
                      ({invoiceLabels.discountRate || 0}%)
                    </span>
                    {invoiceLabels.currency}
                    {invoiceLabels.discountAmount || 0}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Tax:</span>
                  <span>
                    <span className="small ">
                      ({invoiceLabels.taxRate || 0}%)
                    </span>
                    {invoiceLabels.currency}
                    {invoiceLabels.taxAmount || 0}
                  </span>
                </div>
                <hr />
                <div
                  className="d-flex flex-row align-items-start justify-content-between"
                  style={{
                    fontSize: "1.125rem",
                  }}
                >
                  <span className="fw-bold">Total:</span>
                  <span className="fw-bold">
                    {invoiceLabels.currency}
                    {invoiceLabels.total || 0}
                  </span>
                </div>
              </Col>
            </Row>
            <hr className="my-4" />
            <Form.Label className="fw-bold">Notes:</Form.Label>
            <Form.Control
              placeholder="Thanks for your business!"
              name="notes"
              value={invoiceLabels.notes}
              onChange={(event) => editField(event)}
              as="textarea"
              className="my-2"
              rows={1}
            />
          </Card>
        </Col>
        <Col md={4} lg={3}>
          <div className="sticky-top pt-md-3 pt-xl-4">
            <Button variant="primary" type="submit" className="d-block w-100">
              Review Invoice
            </Button>
            <InvoiceModal
              showModal={invoiceLabels.isOpen}
              closeModal={closeModal}
              info={invoiceLabels}
              items={invoiceItems}
              currency={invoiceLabels.currency}
              subTotal={invoiceLabels.subTotal}
              taxAmount={invoiceLabels.taxAmount}
              discountAmount={invoiceLabels.discountAmount}
              total={invoiceLabels.total}
            />
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Currency:</Form.Label>
              <Form.Select
                onChange={(event) => onCurrencyChange(event.target.value)}
                className="btn btn-light my-1"
                aria-label="Change Currency"
              >
                <option value="$">USD (United States Dollar)</option>
                <option value="£">GBP (British Pound Sterling)</option>
                <option value="₹">INR (Indian Rupee)</option>
                <option value="¥">JPY (Japanese Yen)</option>
                <option value="$">CAD (Canadian Dollar)</option>
                <option value="$">AUD (Australian Dollar)</option>
                <option value="$">SGD (Signapore Dollar)</option>
                <option value="¥">CNY (Chinese Renminbi)</option>
                <option value="₿">BTC (Bitcoin)</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Tax rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control
                  name="taxRate"
                  type="number"
                  value={invoiceLabels.taxRate}
                  onChange={(event) => editField(event)}
                  className="bg-white border"
                  placeholder="0.0"
                  min="0.00"
                  step="0.01"
                  max="100.00"
                />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Discount rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control
                  name="discountRate"
                  type="number"
                  value={invoiceLabels.discountRate}
                  onChange={(event) => editField(event)}
                  className="bg-white border"
                  placeholder="0.0"
                  min="0.00"
                  step="0.01"
                  max="100.00"
                />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Signature</Form.Label>
              <Form.Check
                type="radio"
                name="Signature"
                checked={"Upload Signature" === signatureType}
                value={"Upload Signature"}
                label={`Upload Signature`}
                onChange={changeSignatureType}
                id={`uploadSignature`}
              />
              <Form.Check
                type="radio"
                name="Signature"
                checked={"Draw Signature" === signatureType}
                value={"Draw Signature"}
                label={`Draw Signature`}
                onChange={changeSignatureType}
                id={`drawSignature`}
              />
            </Form.Group>
            {"Draw Signature" === signatureType && (
              <Form.Group className="my-3">
                <Form.Label className="fw-bold">
                  Signature: Draw the signature
                </Form.Label>
                <SignaturePad />
                <Button variant="primary" type="button" className="d-block w-100" onClick={saveSignature}>
                  Save signature
                </Button>
              </Form.Group>
            )}
            {"Upload Signature" === signatureType && (
              <Form.Group className="my-3" >
                <Form.Label className="fw-bold">
                  {" "}
                  Upload the signature
                </Form.Label>
                <UploadSignature
                  onUpload={(src) =>
                    setInvoiceLabels((prevInvoiceLabels) => ({
                      ...prevInvoiceLabels,
                      signature: src,
                    }))
                  }
                />
              </Form.Group>
            )}
          </div>
        </Col>
      </Row>
    </Form>
  );
}

export default InvoiceForm;
