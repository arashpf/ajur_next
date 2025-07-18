import React from "react";
import PropTypes from "prop-types";
import Stars from "../../others/Stars";
import Styles from "../../styles/RealStateCard.module.css";

class RealStateSmalCard extends React.Component {
  constructor(props) {
    super(props);
  }

  onClickCall() {
    console.log("call button clicked");
  }

  render() {
    return (
      <div className={` ${Styles["profile-card"]} 'pe-2' `}>
        <div className={Styles["profile-info"]}>
          <img
            className={Styles["profile-pic"]}
            src={this.props.realstate.profile_url}
            alt={this.props.realstate.name + this.props.realstate.family}
          />

          <h2 className={Styles["hvr-underline-from-center"]}>
            {this.props.realstate.name} {this.props.realstate.family}
            <span>
              <Stars amount={this.props.realstate.stars} />
            </span>
          </h2>
          <div className={Styles["profile-description"]}>
            <p className={Styles["show-on-hover"]}>
              {this.props.realstate.description}
            </p>
          </div>
          <div className={Styles["profile-contacts-wrapper"]}>
            <a
              onClick={this.onClickCall}
              className={Styles["show-on-hover"]}
              href={
                "https://api.whatsapp.com/send?phone=" +
                this.props.realstate.phone +
                "&text=سلام"
              }
            >
              <i className="fa fa-whatsapp fa-2x"></i>
            </a>
            <a
              className={Styles["show-on-hover"]}
              target="_blank"
              rel="noreferrer"
              href={"tel:" + this.props.realstate.phone}
            >
              <i className="fa fa-phone fa-2x "></i>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default RealStateSmalCard;
