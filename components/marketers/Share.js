import React from 'react'
import PropTypes from 'prop-types'
import Styles from '../styles/WorkerShare.module.css';
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

const Share = (props) => {
  
 
  const shareUrl = props.link;
  console.log('the shareUrl in workershare is :');
  console.log(shareUrl);
  const title = 'title is here ';
  return (
    <div  className={Styles['share-buttons-wrapper']} >
        <div  className={Styles['share-icons']}>



        <WhatsappShareButton
          url={shareUrl}
          quote={title}
          className={Styles['share-icon']}
        >
          <WhatsappIcon size={32}  />
        </WhatsappShareButton>

        <FacebookShareButton
          url={shareUrl}
          quote={title}
          className={Styles['share-icon']}
        >
          <FacebookIcon size={32}  />
        </FacebookShareButton>

       

        <TelegramShareButton
          url={shareUrl}
          quote={title}
          className={Styles['share-icon']}
        >
          <TelegramIcon size={32}  />
        </TelegramShareButton>

        <PinterestShareButton
          url={shareUrl}
          quote={title}
          className={Styles['share-icon']}
        >
          <PinterestIcon size={32}  />
        </PinterestShareButton>




           
        </div>
    </div>
  )
}

export default Share
