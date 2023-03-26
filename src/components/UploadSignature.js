import React from "react";

const UploadSignature = (props) => {
  const uploadFileHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      props.onUpload(reader.result);
    });

    reader.readAsDataURL(file);
  };
  return (
    <div>
      <input
        type="file"
        id="myFile"
        name="filename"
        onChange={uploadFileHandler}
        required="required"
      />
    </div>
  );
};

export default UploadSignature;
