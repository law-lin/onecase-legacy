import React, { useState, Fragment, useRef, useCallback } from "react";

// MUI Stuff
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import CardActionArea from "@material-ui/core/CardActionArea";
import IconButton from "@material-ui/core/IconButton";
import Slider from "@material-ui/core/Slider";
import PencilIcon from "@material-ui/icons/Create";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { withFirebase } from "../Firebase";
import { v4 as uuidv4 } from "uuid";
import Cropper from "react-easy-crop";
import { getOrientation } from "get-orientation/browser";
import { getCroppedImg, getRotatedImage } from "../canvasUtils";
// Icons

const useStyles = makeStyles({
  root: {
    fontFamily: ["Mukta Mahee", "sans-serif"],
    fontWeight: 700,
    fontSize: "100px",
  },
  input: {
    fontSize: "36px",
    backgroundColor: "#FFFFFF",
  },
  description: {
    fontFamily: ["Mukta Mahee", "sans-serif"],
    color: "#000000",
    backgroundColor: "#FFFFFF",
    fontSize: "24px",
  },
  button: {
    "&:hover": {
      outline: "none",
      backgroundColor: "#C4C4C4",
    },
    "&:focus": {
      outline: "none",
    },
    width: "30px",
    height: "30px",
    fontFamily: ["Montserrat", "sans-serif"],
    alignSelf: "center",
    textTransform: "none",
    fontSize: "20px",
    backgroundColor: "grey",
    color: "white",
    borderRadius: "15px",
  },
  imageUpload: {
    "&:hover": {
      outline: "none",
    },
    "&:focus": {
      outline: "none",
    },
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
    color: "white",
    borderRadius: "15px",
    width: "10%",
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
    color: "white",
    borderRadius: "15px",
    width: "10%",
    height: "25%",
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
    fontSize: "12px",
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
  card: {
    "&:hover": {
      outline: "none",
    },
    "&:focus": {
      outline: "none",
    },
    color: "#000000",
    backgroundColor: "#FFFFFF",
    minHeight: "200px",
    width: "200px",
  },
});

function EditBridgeCard(props) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [coverImageOpen, setCoverImageOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [coverImageSrc, setCoverImageSrc] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [alert, setAlert] = useState(false);
  const [cardImage, setCardImage] = useState(null);
  const [bridgeCardTitle, setBridgeCardTitle] = useState(props.bridgeCardTitle);
  const [description, setDescription] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  // state = {
  //   name: "",
  //   open: false,
  //   cardNumber: null,
  //   cardImage: null,
  //   bridgeCardNumber: null,
  //   bridgeCardTitle: null,
  //   description: "",
  //   imageLoading: true,
  //   imagePreviewURL: null,
  // };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setAlert(false);
  };

  const handleImageSave = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      setImagePreview(croppedImage);
      setImageOpen(false);
    } catch (e) {
      console.error(e);
      setImageOpen(false);
    }
  }, [imageSrc, croppedAreaPixels, rotation]);

  const handleCoverImageSave = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        coverImageSrc,
        croppedAreaPixels,
        rotation
      );
      setCoverImagePreview(croppedImage);
      setCoverImageOpen(false);
    } catch (e) {
      console.error(e);
      setCoverImageOpen(false);
    }
  }, [imageSrc, croppedAreaPixels, rotation]);

  const handleImageClose = () => {
    setImageOpen(false);
  };

  const handleCoverImageClose = () => {
    setCoverImageOpen(false);
  };
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

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

  const handleImageChange = async (e) => {
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
      setImageOpen(true);
    }
  };

  const handleCoverImageChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      let imageDataUrl = await readFile(file);

      // apply rotation if needed
      const orientation = await getOrientation(file);
      const rotation = ORIENTATION_TO_ANGLE[orientation];
      if (rotation) {
        imageDataUrl = await getRotatedImage(imageDataUrl, rotation);
      }
      setCoverImageSrc(imageDataUrl);
      setCoverImageOpen(true);
    }
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert(false);
  };
  const handleSubmit = useCallback(async () => {
    if (bridgeCardTitle === "" || bridgeCardTitle === null) {
      setAlert(true);
    } else {
      props.firebase.editBridgeCard(
        props.cardNumber,
        props.bridgeCardNumber,
        bridgeCardTitle,
        description
      );

      if (imagePreview != null) {
        let blob = await fetch(imagePreview).then((r) => r.blob());
        let uuid = uuidv4();
        let file = new File([blob], uuid);

        props.firebase.uploadCardImage(file).on(
          "state_changed",
          (snapshot) => {
            // progress function ...
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
          },
          (error) => {
            console.log(error);
          },
          () => {
            props.firebase.uploadCardImageURL(
              props.cardNumber,
              props.bridgeCardNumber,
              file
            );
            handleClose();
          }
        );
      }

      if (coverImagePreview != null) {
        let blob = await fetch(coverImagePreview).then((r) => r.blob());
        let uuid = uuidv4();
        let file = new File([blob], uuid);

        props.firebase.uploadCardCoverImage(file).on(
          "state_changed",
          (snapshot) => {
            // progress function ...
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
          },
          (error) => {
            console.log(error);
          },
          () => {
            props.firebase.uploadCardCoverImageURL(
              props.cardNumber,
              props.bridgeCardNumber,
              file
            );
            handleClose();
          }
        );
      }
    }
  });

  const CHARACTER_LIMIT = 600;
  const fileUpload = useRef(null);
  const coverImageUpload = useRef(null);
  console.log(props.display);
  return (
    <div>
      {props.editable && (
        <React.Fragment>
          {props.display === "none" && (
            <CardActionArea
              className={classes.card}
              style={{ padding: "16px 16px 0 0", height: "0px" }}
              onClick={handleOpen}
            />
          )}
          {!props.display && (
            <IconButton
              className={classes.button}
              tip="Edit Card"
              onClick={handleOpen}
            >
              <PencilIcon />
            </IconButton>
          )}

          <Dialog
            open={open}
            onClose={handleClose}
            fullWidth={true}
            maxWidth={"lg"}
            PaperProps={{
              style: { backgroundColor: "#E4E4E4" },
            }}
          >
            <DialogTitle>
              <TextField
                name="bridgeCardTitle"
                type="text"
                placeholder="Ex: Amazing Art, Vivid Views"
                InputProps={{
                  className: classes.input,
                  disableUnderline: true,
                }}
                multiline
                rows={1}
                rowsMax={2}
                styles={{ height: 500 }}
                defaultValue={props.bridgeCardTitle}
                onChange={(e) => setBridgeCardTitle(e.target.value)}
                fullWidth
              />
              <Snackbar
                open={alert}
                autoHideDuration={6000}
                onClose={handleAlertClose}
              >
                <MuiAlert onClose={handleAlertClose} severity="error">
                  The bridge card title cannot be empty!
                </MuiAlert>
              </Snackbar>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <input
                    type="file"
                    ref={coverImageUpload}
                    style={{ display: "none" }}
                    onChange={handleCoverImageChange}
                  />
                  {coverImagePreview && (
                    <IconButton
                      className={classes.imageUpload}
                      onClick={() => coverImageUpload.current.click()}
                    >
                      <img
                        style={{ height: "100%", width: "100%" }}
                        src={coverImagePreview}
                        alt="preview bridge card img"
                      />
                    </IconButton>
                  )}
                  {!coverImagePreview && (
                    <IconButton
                      className={classes.imageUpload}
                      onClick={() => coverImageUpload.current.click()}
                    >
                      Select Cover Image
                    </IconButton>
                  )}

                  <Dialog
                    open={coverImageOpen}
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
                          image={coverImageSrc}
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
                      <Button onClick={handleCoverImageClose} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={handleCoverImageSave} color="primary">
                        Save
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Grid>
                <Grid item xs={6}>
                  <React.Fragment>
                    {!imagePreview && (
                      <Grid
                        container
                        justify="center"
                        alignItems="center"
                        style={{
                          backgroundColor: "#C4C4C4",
                          minHeight: "350px",
                          width: "100%",
                        }}
                      >
                        <input
                          type="file"
                          ref={fileUpload}
                          style={{ display: "none" }}
                          onChange={handleImageChange}
                        />
                        <IconButton
                          className={classes.imageUpload}
                          onClick={() => fileUpload.current.click()}
                        >
                          <CameraAltIcon />
                        </IconButton>
                      </Grid>
                    )}

                    {imagePreview && (
                      <Grid
                        container
                        justify="center"
                        alignItems="center"
                        style={{
                          height: "100%",
                          width: "100%",
                        }}
                      >
                        <input
                          type="file"
                          ref={fileUpload}
                          style={{ display: "none" }}
                          onChange={handleImageChange}
                        />
                        <IconButton
                          className={classes.imageUpload}
                          onClick={() => fileUpload.current.click()}
                        >
                          <img
                            style={{ height: "100%", width: "100%" }}
                            src={imagePreview}
                            alt="preview bridge card img"
                          />
                        </IconButton>
                      </Grid>
                    )}
                    <Dialog
                      open={imageOpen}
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
                        <Button onClick={handleImageClose} color="primary">
                          Cancel
                        </Button>
                        <Button onClick={handleImageSave} color="primary">
                          Save
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </React.Fragment>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="description"
                    type="text"
                    placeholder="Ex: Describe what you did"
                    rows={12}
                    multiline
                    InputProps={{
                      className: classes.description,
                      disableUnderline: true,
                    }}
                    inputProps={{
                      maxLength: CHARACTER_LIMIT,
                    }}
                    defaultValue={props.description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button className={classes.cancel} onClick={handleClose}>
                Cancel
              </Button>
              <Button className={classes.save} onClick={handleSubmit}>
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      )}
    </div>
  );
}

export default withFirebase(EditBridgeCard);
