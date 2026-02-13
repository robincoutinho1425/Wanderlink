import "./ImageUpload.css";
import Button from "../FormElements/Button";
import { useRef, useState } from "react";
export const ImageUpload = (props) => {
  const inputRef = useRef(null);
  const [pickedFile, setPickedFile] = useState();
  const [isValid, setIsValid] = useState(false);
  const [previewURL, setPreviewURL] = useState("");

  const handleImagePick = () => {
    inputRef.current.click();
  };

  const Pickedhandler = (e) => {
    let file;
    let fileisValid = isValid;
    if (e.target.files && e.target.files.length === 1) {
      file = e.target.files[0];
      setPickedFile(file);
      setPreviewURL(URL.createObjectURL(file));
      setIsValid(true);
      fileisValid = true;
    } else {
      setIsValid(false);
      fileisValid = false;
    }

    props.onInput(props.id, file, fileisValid);
  };
  return (
    <>
      <div className="form-control">
        <input
          id={props.id}
          type="file"
          style={{ display: "none" }}
          accept=".jpg,.jpeg,.png"
          ref={inputRef}
          onChange={Pickedhandler}
        />
        <div className={`image-upload ${props.center && "center"}`}>
          <div className="image-upload__preview ">
            {previewURL && (
              <img src={previewURL} alt="preview" className="center" />
            )}
            {!previewURL && <p>Please pick an Image</p>}
          </div>
          <Button type="button" onClick={handleImagePick}>
            Pick Image
          </Button>
        </div>
      </div>
    </>
  );
};
