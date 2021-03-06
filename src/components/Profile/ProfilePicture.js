import React, { useState, useRef, useCallback } from "react";

import { Typography } from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import Cropper from "react-easy-crop";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Avatar from "@material-ui/core/Avatar";
import { IconButton } from "@material-ui/core";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import { makeStyles } from "@material-ui/core/styles";

import { getOrientation } from "get-orientation/browser";
import { getCroppedImg, getRotatedImage } from "../canvasUtils";
import MediaQuery from "react-responsive";
import { v4 as uuidv4 } from "uuid";

import { withFirebase } from "../Firebase";

const useStyles = makeStyles((props) => ({
  root: {
    "&:hover": {
      outline: "none",
    },
    "&:focus": {
      outline: "none",
    },
    borderRadius: "50px",
  },
  profilePic: {
    display: "inline-flex",
    position: "relative",
    verticalAlign: "middle",
    alignItems: "center",
    justifyContent: "center",
    "&:hover $change": {
      display: "block",
    },
  },
  change: {
    "&:hover": {
      outline: "none",
      backgroundColor: "#2D2C2C",
    },
    "&:focus": {
      outline: "none",
    },
    display: "none",
    textTransform: "none",
    width: "100px",
    height: "50px",
    fontFamily: ["Montserrat", "sans-serif"],
    color: "#FFFFFF",
    fontSize: "6px",
    position: "absolute",
    bottom: 0,
    background: "#000000",

    opacity: 0.65,
    boxSizing: "border-box",
    borderBottomLeftRadius: "50px",
    borderBottomRightRadius: "50px",
  },
  crop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: "80px",
  },
  controls: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    width: "50%",
    transform: "translateX(-50%)",
    height: "60px",
    display: "flex",
    alignItems: "center",
  },
  sliderContainer: {
    display: "flex",
    flex: "1",
    alignItems: "center",
  },
  sliderLabel: {
    margin: "0 20px 0 20px",
  },
  dialogPaper: {
    minHeight: "80vh",
    maxHeight: "80vh",
  },
  imageUpload: {
    "&:hover": {
      outline: "none",
    },
    "&:focus": {
      outline: "none",
    },
    position: "absolute",
    top: 0,
    bottom: 0,
  },
  avatar: {
    marginLeft: "auto",
    marginRight: "auto",
    height: (props) =>
      props.size === "small"
        ? "40px"
        : props.size === "medium"
        ? "70px"
        : "110px",
    width: (props) =>
      props.size === "small"
        ? "40px"
        : props.size === "medium"
        ? "70px"
        : "110px",
  },
  save: {
    "&:hover": {
      outline: "none",
      backgroundColor: "#52bf75",
    },
    "&:focus": {
      outline: "none",
    },
    fontFamily: ["Montserrat", "sans-serif"],
    alignSelf: "center",
    textTransform: "none",
    fontSize: "20px",
    backgroundColor: "#05872e",
    color: "#FFFFFF",
    borderRadius: "15px",
    height: "25%",
    marginRight: "1.5%",
  },
  cancel: {
    "&:hover": {
      outline: "none",
      backgroundColor: "#f07171",
    },
    "&:focus": {
      outline: "none",
    },
    fontFamily: ["Montserrat", "sans-serif"],
    alignSelf: "center",
    textTransform: "none",
    fontSize: "20px",
    backgroundColor: "#f03737",
    color: "#FFFFFF",
    borderRadius: "15px",
    height: "25%",
  },
}));

function ProfilePicture(props) {
  const classes = useStyles(props);

  const [profilePicture] = useState(props.profilePicture);
  const [newProfilePicture, setNewProfilePicture] = useState(
    props.newProfilePicture
  );
  const [open, setOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [imageSrc, setImageSrc] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  function readFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  }
  const ORIENTATION_TO_ANGLE = {
    "3": 180,
    "6": 90,
    "8": -90,
  };
  const handleChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readFile(file);

      // apply rotation if needed
      const orientation = await getOrientation(file);
      const rotation = ORIENTATION_TO_ANGLE[orientation];
      if (rotation) {
        imageDataUrl = await getRotatedImage(imageDataUrl, rotation);
      }
      setImageSrc(imageDataUrl);
      setOpen(true);
    }
  };

  const handleSave = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      let blob = await fetch(croppedImage).then((r) => r.blob());
      let uuid = uuidv4();
      let file = new File([blob], uuid);

      props.onChange(file);
      setNewProfilePicture(croppedImage);

      setOpen(false);
    } catch (e) {
      console.error(e);
    }
  }, [props, imageSrc, croppedAreaPixels, rotation]);

  const fileUpload = useRef(null);

  return (
    <React.Fragment>
      {!props.editable && (
        <Avatar className={classes.avatar} src={profilePicture} />
      )}
      {props.editable && (
        <div className={classes.profilePic}>
          <Avatar
            className={classes.avatar}
            style={{ position: "relative", opacity: 0.5 }}
            src={newProfilePicture}
          />
          <input
            type="file"
            accept="image/jpg, image/jpeg, image/png, .heic"
            ref={fileUpload}
            style={{ display: "none" }}
            onChange={handleChange}
          />
          <IconButton
            className={classes.imageUpload}
            onClick={() => fileUpload.current.click()}
          >
            <CameraAltIcon />
          </IconButton>
          <Dialog
            open={open}
            onClose={handleClose}
            fullWidth={true}
            maxWidth={"lg"}
            height
            classes={{ paper: classes.dialogPaper }}
            PaperProps={{
              style: { backgroundColor: "#E4E4E4" },
            }}
          >
            <DialogContent>
              <div className={classes.crop}>
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  rotation={rotation}
                  zoom={zoom}
                  aspect={3 / 3}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <div className={classes.controls} style={{ left: "25%" }}>
                <MediaQuery maxDeviceWidth={1114}>
                  <div className={classes.sliderContainer}>
                    <Typography
                      variant="overline"
                      classes={{ root: classes.sliderLabel }}
                    >
                      Rotation
                    </Typography>
                    <Slider
                      value={rotation}
                      min={0}
                      max={360}
                      step={1}
                      aria-labelledby="Rotation"
                      onChange={(e, rotation) => setRotation(rotation)}
                    />
                  </div>
                </MediaQuery>
                <MediaQuery minDeviceWidth={1115}>
                  <div className={classes.sliderContainer}>
                    <Typography
                      variant="overline"
                      classes={{ root: classes.sliderLabel }}
                    >
                      Zoom
                    </Typography>
                    <Slider
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      aria-labelledby="Zoom"
                      onChange={(e, zoom) => setZoom(zoom)}
                    />
                  </div>
                  <div className={classes.sliderContainer}>
                    <Typography
                      variant="overline"
                      classes={{ root: classes.sliderLabel }}
                    >
                      Rotation
                    </Typography>
                    <Slider
                      value={rotation}
                      min={0}
                      max={360}
                      step={1}
                      aria-labelledby="Rotation"
                      onChange={(e, rotation) => setRotation(rotation)}
                    />
                  </div>
                </MediaQuery>
              </div>
              <MediaQuery maxWidth={1114}>
                <Button
                  className={classes.cancel}
                  style={{ fontSize: "14px" }}
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  className={classes.save}
                  style={{ fontSize: "14px" }}
                  onClick={handleSave}
                >
                  Save
                </Button>
              </MediaQuery>
              <MediaQuery minWidth={1115}>
                <Button className={classes.cancel} onClick={handleClose}>
                  Cancel
                </Button>
                <Button className={classes.save} onClick={handleSave}>
                  Save
                </Button>
              </MediaQuery>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </React.Fragment>
  );
}
export default withFirebase(ProfilePicture);
