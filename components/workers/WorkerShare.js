import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Styles from "../styles/WorkerShare.module.css";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import {
  FacebookShareCount,
  PinterestShareCount,
  VKShareCount,
  OKShareCount,
  RedditShareCount,
  TumblrShareCount,
  HatenaShareCount,
  FacebookShareButton,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  LinkedinShareButton,
  TwitterShareButton,
  PinterestShareButton,
  VKShareButton,
  OKShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  RedditShareButton,
  EmailShareButton,
  TumblrShareButton,
  LivejournalShareButton,
  MailruShareButton,
  ViberShareButton,
  WorkplaceShareButton,
  LineShareButton,
  WeiboShareButton,
  PocketShareButton,
  InstapaperShareButton,
  HatenaShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  PinterestIcon,
  VKIcon,
  OKIcon,
  TelegramIcon,
  WhatsappIcon,
  RedditIcon,
  TumblrIcon,
  MailruIcon,
  EmailIcon,
  LivejournalIcon,
  ViberIcon,
  WorkplaceIcon,
  LineIcon,
  PocketIcon,
  InstapaperIcon,
  WeiboIcon,
  HatenaIcon,
} from "react-share";

import QrCodeGenerator from "../others/QrCodeGenerator.jsx";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const WorkerShare = (props) => {
  let details = props.details;
  let slug = props.slug;
  console.log("the details in workerShare is :");
  console.log(details);

  const [copySuccess, setCopySuccess] = useState("");
  const [problem, setProblem] = useState("test");
  const [open_snak, set_open_snak] = useState(false);

  const shareUrl = "http://ajur.app/worker/" + details.id ;
  console.log("the shareUrl in workershare is :");
  console.log(shareUrl);
  const title = details.name;

  const handleCloseSnak = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    set_open_snak(false);
  };
  
  const WorkerShareLinkCopyClick = () => {
    console.log("realestateMarketingLinkClick toched");
    copyToClipBoard(
      "https://ajur.app/worker/" +
        details.id 
    );
  };

  const copyToClipBoard = async (copyMe) => {

   
    const permissions = await navigator.permissions.query({
      name: "clipboard-write",
    });
    if (permissions.state === "granted" || permissions.state === "prompt") {
      try {
        await navigator.clipboard.writeText(copyMe);
        setCopySuccess("Copied!");
        console.log("copied fine");
        setProblem("لینک  ملک با موفقیت کپی شد");
        set_open_snak(true);
      } catch (err) {
        alert("SOMETHING WRONG" + copyMe);
        setCopySuccess("Failed to copy!");
        console.log("have some copy problem");
      }
    } else {
      alert(
        "مرورگر شما اجازه دسترسی به کلیپ بورد را نمیدهد" +
          "\n" +
          "لطفا متن لینک را به صورت دستی انتخاب و کپی کنید"
      );
    }
  };

  
  return (
    <div className={Styles["share-buttons-wrapper"]}>
      <div className={Styles["share-icons"]}>
        <WhatsappShareButton
          url={shareUrl}
          quote={title}
          className={Styles["share-icon"]}
        >
          <WhatsappIcon size={32} />
        </WhatsappShareButton>

        <FacebookShareButton
          url={shareUrl}
          quote={title}
          className={Styles["share-icon"]}
        >
          <FacebookIcon size={32} />
        </FacebookShareButton>

        <TwitterShareButton
          url={shareUrl}
          quote={title}
          className={Styles["share-icon"]}
        >
          <TwitterIcon size={32} />
        </TwitterShareButton>

        <TelegramShareButton
          url={shareUrl}
          quote={title}
          className={Styles["share-icon"]}
        >
          <TelegramIcon size={32} />
        </TelegramShareButton>

        <PinterestShareButton
          url={shareUrl}
          quote={title}
          className={Styles["share-icon"]}
        >
          <PinterestIcon size={32} />
        </PinterestShareButton>

        <EmailShareButton
          url={shareUrl}
          quote={title}
          className={Styles["share-icon"]}
        >
          <EmailIcon size={32} />
        </EmailShareButton>

        <p className={Styles["share-title"]}>ارسال این ملک به دیگران</p>

        <QrCodeGenerator
          url={"http://ajur.app/worker/" + details.id + "?slug=" + slug}
          title="اسکن کنید"
        />
        
        <FormControl sx={{ m: 1, width: "100%",padding:'20px 20px' }} variant="outlined">
          
        <p>کپی لینک این ملک </p>
          
          <OutlinedInput
            value={
              "https://ajur.app/worker/" +
              details.id 
            }
            readOnly
            style={{ fontSize: 14 }}
            id="outlined-adornment-weight"
            endAdornment={
              <InputAdornment position="end">
                <ContentCopyIcon onClick={WorkerShareLinkCopyClick} style={{cursor:'pointer'}} />
              </InputAdornment>
            }
          />
        </FormControl>

        <Snackbar
            open={open_snak}
            autoHideDuration={6000}
            onClose={handleCloseSnak}
          >
            <Alert
              onClose={handleCloseSnak}
              severity="success"
              sx={{ width: "100%" }}
            >
              {problem}
            </Alert>
          </Snackbar>
      </div>
    </div>
  );
};

export default WorkerShare;
