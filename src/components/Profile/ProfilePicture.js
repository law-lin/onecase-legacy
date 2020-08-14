import React, { useState, Fragment, useRef, useCallback } from "react";
import { ButtonBase, Typography } from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import Cropper from "react-easy-crop";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { getOrientation } from "get-orientation/browser";
import { getCroppedImg, getRotatedImage } from "../canvasUtils";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import { v4 as uuidv4 } from "uuid";

import DefaultProfilePic from "../../images/default-profile-pic.png";
import { withFirebase } from "../Firebase";
import ImageUploader from "react-images-upload";
import Avatar from "react-avatar";
import { IconButton } from "@material-ui/core";
import CameraAltIcon from "@material-ui/icons/CameraAlt";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
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
    height: "80px",
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
  slider: {
    padding: "22px 0px",
    marginLeft: 16,
    flexDirection: "row",
    alignItems: "center",
    margin: "0 16px",
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
});

function ProfilePicture(props) {
  const classes = useStyles();

  const [oldProfilePicture, setOldProfilePicture] = useState(
    props.oldProfilePicture
  );
  const [profilePicture, setProfilePicture] = useState(props.profilePicture);
  const [imagePreview, setImagePreview] = useState(props.profilePicture);
  const [open, setOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [imageSrc, setImageSrc] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onChange = (crop) => {
    setCrop(crop);
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
      console.log(file);
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
      setProfilePicture(croppedImage);

      setOpen(false);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels, rotation]);

  const fileUpload = useRef(null);
  return (
    <React.Fragment>
      {!props.editable && (
        <Avatar
          style={{ margin: "0 auto" }}
          size="110"
          round="50px"
          src={oldProfilePicture}
        />
      )}
      {props.editable && (
        <div className={classes.profilePic}>
          <Avatar
            size="110"
            round="50px"
            style={{ position: "relative", opacity: 0.5 }}
            src={profilePicture}
          />
          <input
            type="file"
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
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div className={classes.controls}>
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
                    classes={{ container: classes.slider }}
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
                    classes={{ container: classes.slider }}
                    onChange={(e, rotation) => setRotation(rotation)}
                  />
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleSave} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </React.Fragment>
  );
}
export default withFirebase(ProfilePicture);
