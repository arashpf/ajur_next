import React from "react";
<<<<<<< HEAD
import PropTypes from "prop-types";
import Stars from "../../others/Stars";
import Styles from "../../styles/RealStateCard.module.css";
=======
import Stars from "../../others/Stars";
import Styles from "../../styles/SmallCard.module.css";
import SmallCard from "../SmallCard"
>>>>>>> a6b1c29616623faba10577384ad1bca1dcbff403

class RealStateSmalCard extends React.Component {
  constructor(props) {
    super(props);
  }

<<<<<<< HEAD
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
=======
  onClickCall = () => {
    if (this.props.realstate.phone) {
      window.location.href = `tel:${this.props.realstate.phone}`;
    } else {
      alert('شماره تماس موجود نیست');
    }
  }

  render() {
    return <SmallCard realEstate={this.props.realstate} />
>>>>>>> a6b1c29616623faba10577384ad1bca1dcbff403
  }
}

export default RealStateSmalCard;
<<<<<<< HEAD
=======
/*return (
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
}*/

>>>>>>> a6b1c29616623faba10577384ad1bca1dcbff403
