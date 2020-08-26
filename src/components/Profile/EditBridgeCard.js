import React, { useState, Fragment, useRef, useCallback } from "react";

import { IoMdArrowDropleft } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";
// MUI Stuff
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import DeleteIcon from "@material-ui/icons/Delete";
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
import { useParams } from "react-router-dom";
// Icons

const useStyles = makeStyles({
  root: {
    fontFamily: ["Mukta Mahee", "sans-serif"],
    fontWeight: 700,
    fontSize: "100px",
  },
  content: {
    overflow: "hidden hidden",
  },
  title: {
    backgroundColor: "#FFFFFF",
    fontFamily: ["Montserrat", "sans-serif"],
    fontWeight: 700,
    fontSize: "25px",
    marginTop: "8px",
    padding: "0 28px",
    borderRadius: "8px",
    textAlign: "center",
    width: "350px",
  },
  upload: {
    color: "#FFFFFF",
    fontFamily: ["Montserrat", "sans-serif"],
    fontWeight: 800,
    fontSize: "32px",
  },
  input: {
    fontSize: "30px",
    borderRadius: "5px",
    fontFamily: ["Montserrat", "sans-serif"],
    fontWeight: 700,
  },
  textField: {
    borderRadius: "5px",
    padding: "5px",
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
    color: "#FFFFFF",
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
  caption: {
    padding: "50px 20px 20px 20px",
    width: "420px",
    fontFamily: ["Mukta Mahee", "sans-serif"],
    color: "#FFFFFF",
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      backgroundColor: "white",
      width: "100%",
      height: "3px",
      bottom: 0,
      left: 0,
    },
  },
  icon: {
    width: "50px",
    height: "50px",
  },
  arrow: {
    "&:hover": {
      outline: "none",
    },
    "&:focus": {
      outline: "none",
    },
    fontSize: "20px",
    color: "#FFFFFF",
  },
});

function EditBridgeCard(props) {
  const [open, setOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [coverImageOpen, setCoverImageOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [coverImageSrc, setCoverImageSrc] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [imageInputKey, setImageInputKey] = useState(null);
  const [coverImageInputKey, setCoverImageInputKey] = useState(null);
  const [alert, setAlert] = useState(false);
  const [imageAlert, setImageAlert] = useState(false);
  const [cardImage, setCardImage] = useState(null);
  const [bridgeCardTitle, setBridgeCardTitle] = useState(props.bridgeCardTitle);
  const [caption, setCaption] = useState(props.caption);
  const [description, setDescription] = useState(props.description);

  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [index, setIndex] = useState(0);
  let { cardTitle } = useParams();

  const classes = useStyles();
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setAlert(false);
    setCoverImagePreview(null);
    setBridgeCardTitle(props.bridgeCardTitle);
    setImagePreview(null);
    setCaption(props.caption);
    setDescription(props.description);
    setIndex(0);
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
      setIndex(index + 1);
    } catch (e) {
      console.error(e);
      setCoverImageOpen(false);
    }
  }, [croppedAreaPixels, rotation, coverImageSrc]);

  const handleImageClose = () => {
    setImageOpen(false);
    setImageInputKey(Date.now());
  };

  const handleCoverImageClose = () => {
    setCoverImageOpen(false);
    setCoverImageInputKey(Date.now());
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

  const handleImageAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert(false);
  };

  const handleSubmit = useCallback(async () => {
    if (props.bridgeCardTitle) {
      props.firebase.editBridgeCard(props.cardID, caption, description);
    } else {
      if (imagePreview === null) {
        setImageAlert(true);
      } else {
        setImageAlert(false);
        props.firebase.createBridgeCard(
          props.name,
          props.username,
          props.profilePicture,
          props.cardNumber,
          props.bridgeCardNumber,
          bridgeCardTitle,
          cardTitle,
          caption,
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
            }
          );
        }
        handleClose();
      }
    }
  });

  const handleDelete = () => {
    props.firebase.deleteBridgeCard(
      props.cardID,
      cardTitle,
      props.userID,
      props.cardNumber,
      props.bridgeCardNumber
    );
    handleClose();
  };

  const CHARACTER_LIMIT = 600;
  const fileUpload = useRef(null);
  const coverImageUpload = useRef(null);

  const onArrowClick = (direction) => {
    if (direction === "right" && index === 1 && bridgeCardTitle === "") {
      setAlert(true);
    } else {
      setAlert(false);
      const increment = direction === "left" ? -1 : 1;
      const newIndex = index + increment;
      setIndex(newIndex);
    }
  };

  function Arrow(props) {
    const { direction, clickFunction } = props;
    const icon =
      direction === "left" ? (
        <IoMdArrowDropleft className={classes.icon} />
      ) : (
        <IoMdArrowDropright className={classes.icon} />
      );

    return (
      <IconButton className={classes.arrow} onClick={clickFunction}>
        {icon}
      </IconButton>
    );
  }

  return (
    <div>
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
      {!props.bridgeCardTitle && (
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth={true}
          PaperProps={{
            style: {
              backgroundColor: "#232323",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "450px",
              minWidth: index === 0 || index === 1 ? "500px" : "900px",
            },
          }}
        >
          <Box display="flex" justifyContent="center" alignItems="center">
            <Box flex={1}>
              {index !== 0 && (
                <Arrow
                  direction="left"
                  clickFunction={() => onArrowClick("left")}
                />
              )}
            </Box>
            <Box flex={1}>
              {index === 0 && (
                <React.Fragment>
                  <DialogTitle>
                    <Typography className={classes.upload}>
                      Upload a cover photo
                    </Typography>
                  </DialogTitle>
                  <DialogContent
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <input
                      type="file"
                      key={coverImageInputKey}
                      ref={coverImageUpload}
                      style={{ display: "none" }}
                      onChange={handleCoverImageChange}
                    />
                    <React.Fragment>
                      {!coverImagePreview && (
                        <Container
                          style={{
                            backgroundColor: "#C4C4C4",
                            height: "200px",
                            width: "200px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <IconButton
                            className={classes.imageUpload}
                            onClick={() => coverImageUpload.current.click()}
                          >
                            <CameraAltIcon />
                          </IconButton>
                        </Container>
                      )}
                      {coverImagePreview && (
                        <IconButton
                          className={classes.imageUpload}
                          onClick={() => coverImageUpload.current.click()}
                        >
                          <img
                            style={{ height: "200px", width: "200px" }}
                            src={coverImagePreview}
                            alt="preview bridge card img"
                          />
                        </IconButton>
                      )}
                    </React.Fragment>
                  </DialogContent>
                  <Dialog
                    open={coverImageOpen}
                    onClose={handleCoverImageClose}
                    fullWidth={true}
                    maxWidth={"lg"}
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
                      <Button
                        className={classes.cancel}
                        onClick={handleCoverImageClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        className={classes.save}
                        onClick={handleCoverImageSave}
                      >
                        Save
                      </Button>
                    </DialogActions>
                  </Dialog>
                </React.Fragment>
              )}
              {index === 1 && (
                <DialogContent
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "200px",
                      height: "200px",
                      background: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${coverImagePreview}) 0 0/250px 250px no-repeat`,
                    }}
                  >
                    <TextField
                      name="bridgeCardTitle"
                      type="text"
                      placeholder="Enter a title!"
                      InputProps={{
                        className: classes.input,
                        disableUnderline: true,
                      }}
                      inputProps={{
                        maxLength: 30,
                        style: { padding: "5px", textAlign: "center" },
                      }}
                      multiline
                      rows={3}
                      defaultValue={bridgeCardTitle}
                      onChange={(e) => setBridgeCardTitle(e.target.value)}
                      fullWidth
                    />
                    <Snackbar
                      open={alert}
                      autoHideDuration={6000}
                      onClose={handleAlertClose}
                    >
                      <MuiAlert onClose={handleAlertClose} severity="error">
                        The card title cannot be empty!
                      </MuiAlert>
                    </Snackbar>
                  </div>
                </DialogContent>
              )}
              {index === 2 && (
                <React.Fragment>
                  <DialogTitle>
                    <Typography className={classes.title}>
                      {bridgeCardTitle}
                    </Typography>
                  </DialogTitle>
                  <DialogContent className={classes.content}>
                    <Box display="flex">
                      <Box display="flex" flexDirection="column">
                        <Box>
                          <React.Fragment>
                            {props.bridgeCardTitle && props.cardImageURL && (
                              <img
                                style={{ height: "350px", width: "350px" }}
                                src={props.cardImageURL}
                                alt="preview bridge card img"
                              />
                            )}
                            {!props.bridgeCardTitle && (
                              <React.Fragment>
                                {!imagePreview && (
                                  <Grid
                                    container
                                    justify="center"
                                    alignItems="center"
                                    style={{
                                      backgroundColor: "#C4C4C4",
                                      height: "350px",
                                      width: "350px",
                                    }}
                                  >
                                    <input
                                      type="file"
                                      key={imageInputKey}
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
                                      height: "350px",
                                      width: "350px",
                                    }}
                                  >
                                    <input
                                      type="file"
                                      key={imageInputKey}
                                      ref={fileUpload}
                                      style={{ display: "none" }}
                                      onChange={handleImageChange}
                                    />
                                    <IconButton
                                      className={classes.imageUpload}
                                      onClick={() => fileUpload.current.click()}
                                    >
                                      <img
                                        style={{
                                          height: "350px",
                                          width: "350px",
                                        }}
                                        src={imagePreview}
                                        alt="preview bridge card img"
                                      />
                                    </IconButton>
                                  </Grid>
                                )}
                              </React.Fragment>
                            )}

                            <Dialog
                              open={imageOpen}
                              onClose={handleImageClose}
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
                                      onChange={(e, rotation) =>
                                        setRotation(rotation)
                                      }
                                    />
                                  </div>
                                </div>
                              </DialogContent>
                              <DialogActions>
                                <Button
                                  onClick={handleImageClose}
                                  color="primary"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleImageSave}
                                  color="primary"
                                >
                                  Save
                                </Button>
                              </DialogActions>
                            </Dialog>
                          </React.Fragment>
                        </Box>
                      </Box>
                      <Box>
                        <TextField
                          className={classes.caption}
                          name="caption"
                          type="text"
                          placeholder="Insert a caption here"
                          InputProps={{
                            className: classes.textField,
                            disableUnderline: true,
                          }}
                          defaultValue={props.caption}
                          onChange={(e) => setCaption(e.target.value)}
                          fullWidth
                        />
                        <TextField
                          name="description"
                          type="text"
                          placeholder="Ex: Describe what you did"
                          rows={7}
                          multiline
                          style={{ padding: "20px" }}
                          InputProps={{
                            className: classes.textField,
                            disableUnderline: true,
                          }}
                          inputProps={{
                            maxLength: CHARACTER_LIMIT,
                          }}
                          defaultValue={props.description}
                          onChange={(e) => setDescription(e.target.value)}
                          fullWidth
                        />
                      </Box>
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    <Button className={classes.cancel} onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button className={classes.save} onClick={handleSubmit}>
                      Save
                    </Button>
                  </DialogActions>
                  <Snackbar
                    open={imageAlert}
                    autoHideDuration={6000}
                    onClose={handleImageAlertClose}
                  >
                    <MuiAlert onClose={handleImageAlertClose} severity="error">
                      Please attach an image to this card!
                    </MuiAlert>
                  </Snackbar>
                </React.Fragment>
              )}
            </Box>
            <Box flex={1}>
              {index !== 2 && coverImagePreview && (
                <Arrow
                  direction="right"
                  clickFunction={() => onArrowClick("right")}
                />
              )}
            </Box>
          </Box>
        </Dialog>
      )}
      {props.bridgeCardTitle && (
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth={true}
          PaperProps={{
            style: {
              backgroundColor: "#232323",
              minHeight: "450px",
              minWidth: "800px",
            },
          }}
        >
          <DialogTitle>
            <Typography className={classes.title}>
              {props.bridgeCardTitle}
            </Typography>
            <IconButton onClick={handleDelete}>
              <DeleteIcon style={{ color: "white" }} />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box display="flex">
              <Box>
                {props.cardImageURL && (
                  <img
                    style={{ height: "350px", width: "350px" }}
                    src={props.cardImageURL}
                    alt="preview bridge card img"
                  />
                )}
              </Box>
              <Box>
                <TextField
                  className={classes.caption}
                  name="caption"
                  type="text"
                  placeholder="Insert a caption here"
                  InputProps={{
                    className: classes.textField,
                    disableUnderline: true,
                  }}
                  defaultValue={props.caption}
                  onChange={(e) => setCaption(e.target.value)}
                  fullWidth
                />
                <TextField
                  name="description"
                  type="text"
                  placeholder="Ex: Describe what you did"
                  rows={7}
                  multiline
                  style={{ padding: "20px" }}
                  InputProps={{
                    className: classes.textField,
                    disableUnderline: true,
                  }}
                  inputProps={{
                    maxLength: CHARACTER_LIMIT,
                  }}
                  defaultValue={props.description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                />
              </Box>
            </Box>
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
      )}
    </div>
  );
}

export default withFirebase(EditBridgeCard);
